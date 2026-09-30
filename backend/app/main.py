"""
BhoomiDrishti - FastAPI Application & Endpoints
National Digital Platform for Research, Policy Innovation, and Evidence-Based Land Governance
"""

import os
import json
import hashlib
from datetime import datetime
from typing import List, Dict, Any, Optional

from fastapi import FastAPI, HTTPException, Query, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse

from .database import get_db_connection, init_db, seed_database
from .spatial import spatial_engine, load_geojson_layer
from .ai_service import ai_engine
from .schemas import (
    SpatialAnalysisRequest,
    CrossDatasetAnalysisRequest,
    ResearchFindingCreate,
    CitizenObservationCreate,
    CitizenObservationVerify,
    PolicyPassportCreate
)

app = FastAPI(
    title="BhoomiDrishti API",
    description="Evidence and Decision-Support Layer for Land Governance & Infrastructure Policy",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend"))

@app.on_event("startup")
def on_startup():
    seed_database()

# ----------------- LAYER ENDPOINTS (GEOSPATIAL) -----------------
@app.get("/api/layers/{layer_name}")
def get_geojson_layer(layer_name: str):
    """
    Returns live GeoJSON for map display.
    Supports: corridor_scenario_a, corridor_scenario_b, land_use, flood_hazard, settlements, citizen_observations
    """
    filename_map = {
        "corridor_scenario_a": "corridor_scenario_a.geojson",
        "corridor_scenario_b": "corridor_scenario_b.geojson",
        "land_use": "land_use.geojson",
        "flood_hazard": "flood_hazard.geojson",
        "settlements": "settlements.geojson",
        "citizen_observations": "citizen_observations.geojson"
    }
    
    # If citizen observations, fetch live from database to include newly submitted ones!
    if layer_name == "citizen_observations":
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM citizen_observations ORDER BY created_at DESC")
        rows = cursor.fetchall()
        conn.close()

        features = []
        for r in rows:
            features.append({
                "type": "Feature",
                "properties": {
                    "obs_id": r["id"],
                    "project_id": r["project_id"],
                    "citizen_name": r["citizen_name"],
                    "village": r["village"],
                    "survey_number": r["survey_number"],
                    "category": r["category"],
                    "title": r["title"],
                    "description": r["description"],
                    "verification_status": r["verification_status"],
                    "verified_by_officer": bool(r["verified_by_officer"]),
                    "officer_notes": r["officer_notes"],
                    "affected_families_claim": r["affected_families_claim"],
                    "timestamp": r["created_at"]
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [r["longitude"], r["latitude"]]
                }
            })
        return {
            "type": "FeatureCollection",
            "name": "Live_Citizen_Ground_Observations",
            "features": features
        }

    if layer_name not in filename_map:
        raise HTTPException(status_code=404, detail=f"Layer '{layer_name}' not found.")

    try:
        data = load_geojson_layer(filename_map[layer_name])
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ----------------- SPATIAL IMPACT ANALYSIS -----------------
@app.post("/api/spatial/analyze")
def analyze_spatial_impact(req: SpatialAnalysisRequest):
    """
    Executes live deterministic geospatial intersection using Shapely & PyProj.
    Calculates agricultural area, flood plain intersection, settlements influenced,
    and supports interactive policy simulation (RoW width, viaduct ratio, setback, compensation).
    """
    try:
        result = spatial_engine.analyze_corridor(
            scenario_id=req.scenario_id,
            buffer_meters=req.buffer_meters,
            viaduct_percentage=req.viaduct_percentage,
            floodplain_setback_meters=req.floodplain_setback_meters,
            compensation_multiplier=req.compensation_multiplier,
            custom_geometry_geojson=req.custom_geojson
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Spatial calculation error: {str(e)}")

@app.post("/api/research/cross-analysis")
def compute_cross_dataset_analysis(req: CrossDatasetAnalysisRequest):
    """
    Computes spatial co-occurrence, intersection area, and Jaccard overlap index
    between two authoritative datasets for empirical research.
    """
    try:
        return spatial_engine.compute_cross_dataset_correlation(req.layer_a, req.layer_b)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cross-dataset analysis error: {str(e)}")

@app.get("/api/citizen/document-offices")
def get_citizen_document_offices():
    """
    Returns official directory of physical offices for retrieving original land record hardcopies.
    Addresses information fragmentation for rural landowners.
    """
    return [
        {
            "document_name": "RTC / Pahani (Record of Rights, Tenancy and Crops)",
            "description": "Statutory legal proof of land ownership, cultivator name, survey number, soil classification, water source, and current standing crops.",
            "office_name": "Atalji Janasnehi / Nemmadi Kendra (MK Hubballi)",
            "address": "Opposite Gram Panchayat Office, Market Road, Mugatkhan Hubballi - 591153",
            "counter": "Counter No. 3 (Bhoomi Revenue Services)",
            "timings": "Monday - Saturday: 10:00 AM - 5:30 PM (Closed 2nd/4th Saturdays & Sundays)",
            "statutory_fee": "₹15 per digitally signed copy",
            "required_documents": ["Aadhaar Card", "Survey Number or Previous RTC / Khata Extract"],
            "helpline": "+91 8288-223410 / Toll-Free 1902"
        },
        {
            "document_name": "Tippan & Form 11E Survey Sketch",
            "description": "Original cadastral field measurement sketch (FMB) showing exact physical boundaries, guntas, and neighbor demarcations.",
            "office_name": "Assistant Director of Land Records (ADLR) Taluk Survey Office",
            "address": "Room 14, 1st Floor, Mini Vidhana Soudha, Court Road, Bailhongal - 591102",
            "counter": "Mojini 3.0 Citizen Service Counter",
            "timings": "Monday - Saturday: 10:30 AM - 4:30 PM",
            "statutory_fee": "₹35 per certified certified A3 sketch copy",
            "required_documents": ["RTC of current year", "Aadhaar Card", "Application Form 11E"],
            "helpline": "+91 8288-232145"
        },
        {
            "document_name": "Mutation Extract (Form 21 / Vamshavruksha)",
            "description": "Complete chronological history of ownership transfer, inheritance partitions, court orders, or sale transactions.",
            "office_name": "Village Administrative Officer (VAO) & Revenue Inspector Circle",
            "address": "Deshnur Nada Kacheri / Gram Panchayat Office, Deshnur - 591147",
            "counter": "Revenue Inspector Section",
            "timings": "Tuesday & Friday (Field Camp Days): 11:00 AM - 4:00 PM",
            "statutory_fee": "₹20 per certified register copy",
            "required_documents": ["Death Certificate (if inheritance)", "Genealogical Tree / Vamshavruksha Certificate", "Original Sale Deed"],
            "helpline": "+91 8288-245678"
        },
        {
            "document_name": "Encumbrance Certificate (EC Form 15 / Form 16) & Registered Sale Deed",
            "description": "Certified record of any registered mortgages, bank liens, legal attachments, or encumbrances over a 30-year search period.",
            "office_name": "Senior Sub-Registrar Office (Kaveri 2.0 Registration Center)",
            "address": "Taluk Administrative Complex, Near Civil Court, Bailhongal - 591102",
            "counter": "Kaveri 2.0 Delivery Window 2",
            "timings": "Monday - Saturday: 10:00 AM - 5:00 PM",
            "statutory_fee": "₹100 for 15-year search / ₹180 for 30-year search",
            "required_documents": ["Property Khata / Assessment Number", "Valid Photo ID", "Previous Registration Document Number (if known)"],
            "helpline": "+91 8288-231189"
        }
    ]

@app.get("/api/spatial/compare")
def compare_scenarios(buffer_meters: float = 60.0):
    """
    FLAGSHIP: Side-by-side comparison of Scenario A vs Scenario B with trade-off delta.
    Does NOT declare one as 'best' - presents objective trade-offs for human decision-makers.
    """
    try:
        return spatial_engine.compare_scenarios(buffer_meters=buffer_meters)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ----------------- EVIDENCE LINEAGE -----------------
@app.get("/api/evidence/lineage/{metric_key}")
def get_metric_lineage(metric_key: str, scenario_id: str = "A"):
    """
    Answers: 'Why this number?'
    Returns exact provenance, dataset date, formula, and empirical limitations.
    """
    analysis = spatial_engine.analyze_corridor(scenario_id=scenario_id)
    lineage = analysis.get("evidence_lineage", {})
    if metric_key in lineage:
        return lineage[metric_key]
    raise HTTPException(status_code=404, detail=f"Lineage for '{metric_key}' not found.")

# ----------------- PROJECTS -----------------
@app.get("/api/projects")
def list_projects():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM projects")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

# ----------------- RESEARCH INTELLIGENCE LAB -----------------
@app.get("/api/research/findings")
def list_research_findings(query: Optional[str] = None):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM research_findings ORDER BY publication_year DESC, created_at DESC")
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()

    for r in rows:
        if r.get("tags"):
            try:
                r["tags"] = json.loads(r["tags"])
            except:
                pass

    if query:
        return ai_engine.search_evidence(query, rows)
    return rows

@app.post("/api/research/findings")
def publish_research_finding(req: ResearchFindingCreate):
    """
    FLAGSHIP: Researcher publishes a structured finding.
    Immediately becomes available as discovered evidence inside the Policy Decision Studio!
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    finding_id = f"RES-{datetime.now().strftime('%Y')}-{int(datetime.now().timestamp()) % 1000:03d}"
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    cursor.execute("""
    INSERT INTO research_findings (
        id, title, finding_statement, author, institution, geography, methodology,
        dataset_used, publication_year, limitations, policy_implications, tags,
        peer_reviewed, relevance_score, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        finding_id,
        req.title,
        req.finding_statement,
        req.author,
        req.institution,
        req.geography,
        req.methodology,
        req.dataset_used,
        req.publication_year,
        req.limitations,
        req.policy_implications,
        json.dumps(req.tags),
        1,
        0.97,
        now_str
    ))

    conn.commit()
    conn.close()

    return {
        "status": "success",
        "message": "Research finding successfully indexed in National Evidence Repository.",
        "finding_id": finding_id
    }

@app.post("/api/research/search")
def search_research_findings(payload: Dict[str, str]):
    q = payload.get("query", "")
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM research_findings")
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()

    for r in rows:
        if r.get("tags"):
            try:
                r["tags"] = json.loads(r["tags"])
            except:
                pass

    return ai_engine.search_evidence(q, rows)

@app.post("/api/research/summarize/{finding_id}")
def summarize_finding(finding_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM research_findings WHERE id = ?", (finding_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Finding not found")
    data = dict(row)
    return ai_engine.summarize_finding(data)

# ----------------- CITIZEN / FARMER EXPERIENCE -----------------
@app.get("/api/citizen/observations")
def list_citizen_observations(project_id: Optional[str] = None):
    conn = get_db_connection()
    cursor = conn.cursor()
    if project_id:
        cursor.execute("SELECT * FROM citizen_observations WHERE project_id = ? ORDER BY created_at DESC", (project_id,))
    else:
        cursor.execute("SELECT * FROM citizen_observations ORDER BY created_at DESC")
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return rows

@app.post("/api/citizen/observations")
def submit_citizen_observation(obs: CitizenObservationCreate):
    """
    Submits a new ground-level observation by a farmer/citizen.
    Stored with strict tag: 'Reported by Citizen - Unverified Ground Observation'.
    """
    obs_id = f"OBS-{int(datetime.now().timestamp()) % 10000:04d}"
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO citizen_observations (
        id, project_id, citizen_name, village, survey_number, category, title,
        description, latitude, longitude, verification_status, officer_notes,
        verified_by_officer, affected_families_claim, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        obs_id,
        obs.project_id,
        obs.citizen_name,
        obs.village,
        obs.survey_number,
        obs.category,
        obs.title,
        obs.description,
        obs.latitude,
        obs.longitude,
        "Reported by Citizen - Unverified Ground Observation",
        "Submitted via My Land / My Community portal. Awaiting officer ground review.",
        0,
        obs.affected_families_claim,
        now_str
    ))
    conn.commit()
    conn.close()

    return {
        "status": "success",
        "obs_id": obs_id,
        "message": "Your ground observation has been logged and shared with the Policy Decision Committee.",
        "verification_status": "Reported by Citizen - Unverified Ground Observation"
    }

@app.patch("/api/citizen/observations/{obs_id}/verify")
def verify_citizen_observation(obs_id: str, payload: CitizenObservationVerify):
    """
    Allows a policymaker/officer to review and verify or annotate a citizen observation.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE citizen_observations
    SET verified_by_officer = ?,
        officer_notes = ?,
        verification_status = ?
    WHERE id = ?
    """, (
        1 if payload.verified_by_officer else 0,
        payload.officer_notes,
        payload.status or "Verified Ground Feedback (Incorporated into Review)",
        obs_id
    ))
    conn.commit()
    conn.close()
    return {"status": "success", "message": "Observation verification updated."}

@app.get("/api/citizen/explain")
def get_plain_language_explanation(scenario_id: str = "A"):
    """
    Converts complex technical spatial indicators into simple plain-language guidance for citizens.
    """
    analysis = spatial_engine.analyze_corridor(scenario_id=scenario_id)
    scenario_label = "Scenario B (Northern Bypass)" if scenario_id == "B" else "Scenario A (Direct Alignment)"
    return ai_engine.generate_citizen_explanation(
        project_name="NH-753G Malaprabha Agro-Economic Freight Corridor",
        scenario_data=analysis,
        scenario_name=scenario_label
    )

# ----------------- POLICY CONSEQUENCE PASSPORT -----------------
@app.post("/api/passport/generate")
def generate_policy_passport(req: PolicyPassportCreate):
    """
    FLAGSHIP: Generates an official, immutable Policy Consequence Passport.
    Includes decision notes, digital SHA-256 integrity hash, scenario metrics, and provenance.
    """
    passport_id = f"PCP-2026-{int(datetime.now().timestamp()) % 100000:05d}"
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Generate cryptographic integrity hash
    hash_payload = f"{passport_id}:{req.project_id}:{req.selected_scenario}:{req.policymaker_name}:{now_str}"
    digital_signature_hash = hashlib.sha256(hash_payload.encode()).hexdigest()

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO policy_passports (
        id, project_id, selected_scenario, policymaker_name, officer_designation,
        decision_notes, metrics_snapshot, trade_off_snapshot, linked_research_ids,
        digital_signature_hash, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        passport_id,
        req.project_id,
        req.selected_scenario,
        req.policymaker_name,
        req.officer_designation,
        req.decision_notes,
        json.dumps(req.metrics_snapshot),
        json.dumps(req.trade_off_snapshot or {}),
        json.dumps(req.linked_research_ids),
        digital_signature_hash,
        "Approved & Recorded (Decision Replay Ready)",
        now_str
    ))
    conn.commit()
    conn.close()

    return {
        "status": "success",
        "passport_id": passport_id,
        "digital_signature_hash": digital_signature_hash,
        "created_at": now_str,
        "message": "Policy Consequence Passport recorded in National Land Governance Registry."
    }

@app.get("/api/passport/records")
def list_passport_records():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM policy_passports ORDER BY created_at DESC")
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()

    for r in rows:
        try:
            r["metrics_snapshot"] = json.loads(r["metrics_snapshot"])
            r["trade_off_snapshot"] = json.loads(r["trade_off_snapshot"])
            r["linked_research_ids"] = json.loads(r["linked_research_ids"])
        except:
            pass
    return rows

@app.get("/api/passport/{passport_id}")
def get_passport_record(passport_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM policy_passports WHERE id = ?", (passport_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Passport not found.")
    res = dict(row)
    try:
        res["metrics_snapshot"] = json.loads(res["metrics_snapshot"])
        res["trade_off_snapshot"] = json.loads(res["trade_off_snapshot"])
        res["linked_research_ids"] = json.loads(res["linked_research_ids"])
    except:
        pass
    return res

# ----------------- STATIC FRONTEND HOSTING -----------------
app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

@app.get("/")
def serve_index():
    return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))

@app.get("/{full_path:path}")
def serve_spa(full_path: str):
    target = os.path.join(FRONTEND_DIR, full_path)
    if os.path.exists(target) and os.path.isfile(target):
        return FileResponse(target)
    return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))
