"""
BhoomiDrishti - Pydantic Data Schemas
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class SpatialAnalysisRequest(BaseModel):
    scenario_id: str = "A"
    buffer_meters: float = 60.0
    viaduct_percentage: float = 0.0
    floodplain_setback_meters: float = 0.0
    compensation_multiplier: float = 2.0
    custom_geojson: Optional[Dict[str, Any]] = None

class CrossDatasetAnalysisRequest(BaseModel):
    layer_a: str = "land_use"
    layer_b: str = "flood_hazard"

class ResearchFindingCreate(BaseModel):
    title: str
    finding_statement: str
    author: str
    institution: str
    geography: str
    methodology: str
    dataset_used: str
    publication_year: int
    limitations: Optional[str] = "Cadastral field boundaries subject to joint survey verification."
    policy_implications: str
    tags: List[str] = []

class CitizenObservationCreate(BaseModel):
    project_id: str = "PRJ-KA-2026-08"
    citizen_name: str
    village: str
    survey_number: Optional[str] = None
    category: str
    title: str
    description: str
    latitude: float
    longitude: float
    affected_families_claim: Optional[int] = 1

class CitizenObservationVerify(BaseModel):
    verified_by_officer: bool
    officer_notes: str
    status: Optional[str] = "Verified Ground Feedback (Incorporated into Review)"

class PolicyPassportCreate(BaseModel):
    project_id: str
    selected_scenario: str
    policymaker_name: str
    officer_designation: str
    decision_notes: str
    metrics_snapshot: Dict[str, Any]
    trade_off_snapshot: Optional[Dict[str, Any]] = None
    linked_research_ids: List[str] = []
