"""
BhoomiDrishti - Shared SQLite Data Layer
Maintains unified system state for:
- Projects & Scenarios
- Research Findings (Published by Researchers, Discovered by Policymakers)
- Citizen Observations (Submitted by Citizens, Audited by Policymakers)
- Policy Consequence Passports (Decision Records & Provenance Audit Logs)
"""

import sqlite3
import json
import os
from datetime import datetime
from typing import Dict, Any, List, Optional

DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data", "bhoomidrishti.db"))

def get_db_connection():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Projects Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        corridor_code TEXT NOT NULL,
        state TEXT NOT NULL,
        districts TEXT NOT NULL,
        project_type TEXT NOT NULL,
        status TEXT NOT NULL,
        public_visibility BOOLEAN NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        description TEXT,
        lead_agency TEXT NOT NULL
    )
    """)

    # 2. Research Findings Table (Shared Ecosystem: Researcher -> Policymaker)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS research_findings (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        finding_statement TEXT NOT NULL,
        author TEXT NOT NULL,
        institution TEXT NOT NULL,
        geography TEXT NOT NULL,
        methodology TEXT NOT NULL,
        dataset_used TEXT NOT NULL,
        publication_year INTEGER NOT NULL,
        limitations TEXT,
        policy_implications TEXT,
        tags TEXT, -- JSON array
        peer_reviewed BOOLEAN DEFAULT 1,
        relevance_score REAL DEFAULT 0.95,
        created_at TEXT NOT NULL
    )
    """)

    # 3. Citizen Observations Table (Citizen -> Policymaker)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS citizen_observations (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL,
        citizen_name TEXT NOT NULL,
        village TEXT NOT NULL,
        survey_number TEXT,
        category TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        verification_status TEXT NOT NULL DEFAULT 'Reported by Citizen - Unverified Ground Observation',
        officer_notes TEXT,
        verified_by_officer BOOLEAN NOT NULL DEFAULT 0,
        affected_families_claim INTEGER DEFAULT 1,
        created_at TEXT NOT NULL
    )
    """)

    # 4. Policy Consequence Passports (Decision Records & Digital Brevity Brief)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS policy_passports (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL,
        selected_scenario TEXT NOT NULL,
        policymaker_name TEXT NOT NULL,
        officer_designation TEXT NOT NULL,
        decision_notes TEXT NOT NULL,
        metrics_snapshot TEXT NOT NULL, -- JSON
        trade_off_snapshot TEXT NOT NULL, -- JSON
        linked_research_ids TEXT NOT NULL, -- JSON
        digital_signature_hash TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Approved & Recorded',
        created_at TEXT NOT NULL
    )
    """)

    conn.commit()
    conn.close()

def seed_database():
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if already seeded
    cursor.execute("SELECT COUNT(*) FROM projects")
    if cursor.fetchone()[0] > 0:
        conn.close()
        return

    # Seed Project
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cursor.execute("""
    INSERT INTO projects (id, name, corridor_code, state, districts, project_type, status, public_visibility, created_at, description, lead_agency)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        "PRJ-KA-2026-08",
        "NH-753G Malaprabha Agro-Economic Freight Corridor",
        "NH-753G-EXP",
        "Karnataka",
        "Belagavi, Dharwad",
        "4-Lane Greenfield Agro-Logistics Expressway",
        "Under Active Alternatives Evaluation",
        1,
        now_str,
        "Strategic corridor connecting agricultural produce centers of Bailhongal & Kittur with Dharwad Industrial Cluster and Hubballi Logistics Junction.",
        "National Highways Authority of India (NHAI) & Karnataka PWD"
    ))

    # Seed Research Findings (Evidence directly usable by Policymakers)
    findings = [
        (
            "RES-2024-001",
            "Downstream Hydrological Disruption & Embankment Severance in Krishna River Basin",
            "Linear infrastructure embankments lacking wide hydrological viaducts in the Malaprabha flood plains compound backwater retention duration by 340%, creating artificial upstream damming during monsoon discharge peaks.",
            "Dr. Ananth Murthy & Dr. Sunita Rao",
            "Indian Institute of Science (IISc) - Centre for Sustainable Technologies",
            "Malaprabha River Basin, Belagavi-Bagalkot",
            "2D Hydrodynamic Modeling (HEC-RAS 6.3) coupled with 30-year Sentinel-1 SAR flood extent time-series",
            "CWC Discharge gauge data (2012-2024) & Copernicus DEM 30m",
            2024,
            "Sedimentation dynamics during flash floods not fully parameterized in 1D culvert approximations.",
            "Mandate elevated viaduct structures (min 4.2m clearance) across riverine flood contours, or shift alignment northward to dry pediments to prevent rural crop inundation.",
            json.dumps(["hydrology", "flood_hazard", "embankment", "malaprabha", "infrastructure"]),
            1,
            0.98,
            "2024-11-12 10:00:00"
        ),
        (
            "RES-2025-014",
            "Paddy & Sugarcane Yield Elasticity under Linear Right-of-Way Land Severance",
            "Acquisition of prime double-cropped black cotton soils in northern Karnataka induces multi-generational farmer household income declines averaging 41% due to fragment splitting of gravity canal feeds, compared to minimal disruption when aligning along stony pediments.",
            "Prof. Rajeshwar Kulkarni & Dr. Geeta Hiremath",
            "University of Agricultural Sciences (UAS), Dharwad",
            "Bailhongal, Kittur, and Saundatti Taluks",
            "Socio-economic panel survey of 640 farm households (2018-2024) across NH-4A and SH-34 corridors",
            "Bhuvan Multi-spectral LULC + Karnataka Bhoomi Land Record Cadastre",
            2025,
            "Sample restricted to sugarcane and paddy belts; rainfed millet tracts show lower economic disruption elasticity.",
            "Recommend routing alignments through low-arability pediment wasteland polygons (Bhuvan Class 3.2) even if corridor length increases by up to 12%, achieving net positive economic benefit-cost ratio.",
            json.dumps(["agriculture", "land_severance", "sugarcane", "paddy", "livelihoods", "compensation"]),
            1,
            0.96,
            "2025-03-18 14:30:00"
        ),
        (
            "RES-2023-042",
            "Community Commons and Livestock Transhumance Corridors in the Deccan Pediments",
            "Fragmenting community tamarind and grazing commons with fenced expressways leads to severe localized livestock attrition unless underpasses are spaced at intervals under 1.8 kilometers.",
            "Dr. P. Venkatesh",
            "National Institute of Rural Development & Panchayati Raj (NIRDPR)",
            "Belagavi Upland Plateaus",
            "GPS collar tracking of 18 pastoral herds combined with Gram Sabha participatory GIS mapping",
            "Survey of India Toposheets 1:25,000 & Forest Survey of India FSI 2021",
            2023,
            "Seasonal dry period tracking only; winter pastoralist movements vary.",
            "Include cattle/tractor underpasses at every panchayat boundary intersection to maintain local agro-pastoral connectivity.",
            json.dumps(["commons", "pastoral", "livestock", "connectivity", "panchayat"]),
            1,
            0.89,
            "2023-08-05 11:20:00"
        )
    ]

    for f in findings:
        cursor.execute("""
        INSERT INTO research_findings (
            id, title, finding_statement, author, institution, geography, methodology,
            dataset_used, publication_year, limitations, policy_implications, tags,
            peer_reviewed, relevance_score, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, f)

    # Seed Citizen Observations (Ground Feedback)
    obs = [
        (
            "OBS-101",
            "PRJ-KA-2026-08",
            "Basappa Patil (Farmer, MK Hubballi)",
            "Mugatkhan Hubballi",
            "Sy. No. 142/2A",
            "Flooding Observed",
            "Severe backwater flooding during 2023 monsoon submerged existing culvert",
            "The proposed low alignment crosses our main lift irrigation canal. In 2019 and 2023, water stood 6 feet deep here for 18 days. Any solid road embankment without 800m viaducts will flood 400 acres of cane.",
            15.645,
            74.975,
            "Reported by Citizen - Unverified Ground Observation",
            "Flagged for technical inspection by Executive Engineer, NHAI Dharwad Division.",
            0,
            42,
            "2026-08-14 09:30:00"
        ),
        (
            "OBS-102",
            "PRJ-KA-2026-08",
            "Gram Panchayat Bailhongal (Ramesh Talwar, Member)",
            "Deshnur",
            "Sy. No. 88/B",
            "Agricultural Severance",
            "Corridor bisects centuries-old gravity water channel to Deshnur irrigation tank",
            "If Scenario A is selected, farmers on the southern flank will lose direct tractor access to their sugarcane weighing centers and the Kittur APMC yard. Please adopt the northern ridge alternative.",
            15.670,
            75.008,
            "Reported by Citizen - Unverified Ground Observation",
            "Under review against Scenario B realignment buffer.",
            0,
            65,
            "2026-08-20 16:15:00"
        )
    ]

    for o in obs:
        cursor.execute("""
        INSERT INTO citizen_observations (
            id, project_id, citizen_name, village, survey_number, category, title,
            description, latitude, longitude, verification_status, officer_notes,
            verified_by_officer, affected_families_claim, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, o)

    conn.commit()
    conn.close()
    print("Database initialized and seeded successfully.")

if __name__ == "__main__":
    seed_database()
