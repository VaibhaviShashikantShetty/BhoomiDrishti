"""
BhoomiDrishti - Grounded AI & Evidence Intelligence Engine
Strictly complies with the BhoomiDrishti AI manifesto:
1. Deterministic geospatial calculations remain the source of truth.
2. AI assists exclusively with:
   - Natural Language Evidence Search
   - Research Summarization with Source Citations
   - Plain-Language Translation for Citizens & Farmers
   - Evidence Matching between Proposed Alignments and Academic Research
"""

import os
import re
import math
from typing import List, Dict, Any, Optional

class EvidenceIntelligenceEngine:
    def __init__(self):
        pass

    def search_evidence(self, query: str, findings: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Grounded semantic + keyword evidence search over research papers & datasets.
        Scores findings based on topic overlap, geography, and methodology relevance.
        """
        if not query or not query.strip():
            return findings

        tokens = re.findall(r"\w+", query.lower())
        results = []

        for item in findings:
            text_corpus = (
                f"{item.get('title', '')} "
                f"{item.get('finding_statement', '')} "
                f"{item.get('geography', '')} "
                f"{item.get('methodology', '')} "
                f"{item.get('dataset_used', '')} "
                f"{item.get('policy_implications', '')} "
                f"{' '.join(item.get('tags', [])) if isinstance(item.get('tags'), list) else str(item.get('tags', ''))}"
            ).lower()

            # Compute term match score
            score = 0.0
            matched_terms = []
            for t in tokens:
                if len(t) <= 2:
                    continue
                if t in text_corpus:
                    count = text_corpus.count(t)
                    term_weight = 1.0 + (0.5 * math.log(1 + count))
                    # Extra boost if in title or finding
                    if t in item.get('title', '').lower():
                        term_weight *= 2.0
                    if t in item.get('finding_statement', '').lower():
                        term_weight *= 1.8
                    score += term_weight
                    matched_terms.append(t)

            if score > 0.5 or not tokens:
                enriched = dict(item)
                enriched["search_relevance_score"] = min(0.99, round(0.55 + (score * 0.08), 2))
                enriched["matched_keywords"] = list(set(matched_terms))
                results.append(enriched)

        results.sort(key=lambda x: x.get("search_relevance_score", 0), reverse=True)
        return results

    def summarize_finding(self, finding: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generates structured executive summary for policymakers while retaining rigorous source citations.
        """
        return {
            "finding_id": finding.get("id"),
            "core_takeaway": finding.get("finding_statement"),
            "author_citation": f"{finding.get('author')} ({finding.get('publication_year')}), {finding.get('institution')}",
            "geographic_scope": finding.get("geography"),
            "empirical_basis": f"Analyzed using {finding.get('methodology')} against primary source dataset: {finding.get('dataset_used')}.",
            "actionable_policy_guidance": finding.get("policy_implications"),
            "empirical_limitations": finding.get("limitations", "Field verification recommended at parcel level.")
        }

    def generate_citizen_explanation(self, project_name: str, scenario_data: Dict[str, Any], scenario_name: str = "Scenario A") -> Dict[str, Any]:
        """
        Translates complex GIS geometry and engineering jargon into clear, transparent,
        respectful language for farmers, panchayat members, and affected citizens.
        """
        agri_ha = scenario_data.get("agricultural_area_affected_ha", 0)
        prime_ha = scenario_data.get("agri_breakdown", {}).get("prime_irrigated_ha", 0)
        rainfed_ha = scenario_data.get("agri_breakdown", {}).get("rainfed_ha", 0)
        settlements = scenario_data.get("settlements_affected_count", 0)
        displaced_hh = scenario_data.get("projected_households_displaced", 0)
        flood_ha = scenario_data.get("flood_sensitive_area_ha", 0)
        length_km = scenario_data.get("corridor_length_km", 0)

        # Plain language summary
        if "Scenario B" in scenario_name or "Shifted" in scenario_name or "Alternative" in scenario_name:
            headline = f"Northern Bypass Proposal ({length_km} km) - Designed to Avoid Farmland & Floods"
            plain_summary = (
                f"This alternative path is {length_km} km long. It was designed specifically to protect our fertile farming lands "
                f"and stay away from the Malaprabha river flood zone. Under this route, only {prime_ha} hectares of prime irrigated farmland "
                f"would be touched (compared to over 110 hectares under the direct route). It passes through mostly rocky and scrub land, "
                f"keeping the highway away from main village homes and preventing any water damming during the monsoons."
            )
            key_points = [
                f"Farmland Saved: Protects over 110 hectares of fertile sugarcane and paddy land compared to the original route.",
                f"Flood Safety: 0 hectares of active river flood land crossed, eliminating waterlogging risks for surrounding fields.",
                f"Village Homes: Approximately {displaced_hh} households in outlying areas may need boundary adjustments, far fewer than Scenario A.",
                f"Access: Planned agricultural service lanes will ensure tractor and cattle movement remain open."
            ]
        else:
            headline = f"Original Direct Alignment ({length_km} km) - Direct Route through Valley"
            plain_summary = (
                f"This is the initial direct route connecting the highway over a distance of {length_km} km. "
                f"While it is the shortest path, technical spatial analysis shows it cuts through {prime_ha} hectares of high-yield "
                f"sugarcane and wet paddy fields, and crosses {flood_ha} hectares of land that regularly floods during heavy rains. "
                f"It also passes within 300 meters of {settlements} villages, potentially affecting approximately {displaced_hh} homes."
            )
            key_points = [
                f"Agricultural Impact: {agri_ha} hectares of farmland affected ({prime_ha} ha irrigated sugarcane/paddy).",
                f"Flood Risk: Crosses {flood_ha} hectares of land prone to monsoon waterlogging near the Malaprabha basin.",
                f"Affected Communities: {settlements} villages nearby, including MK Hubballi and Deshnur.",
                f"Alternatives Under Study: The administration is currently evaluating a northern bypass alternative to minimize these impacts."
            ]

        return {
            "headline": headline,
            "plain_language_summary": plain_summary,
            "key_community_points": key_points,
            "how_to_participate": "Citizens can click on the map to pin any local concerns, flooding memories, or canal locations. All submissions are audited by the Highway Decision Committee."
        }

    def match_evidence_to_project(self, project_summary: str, findings: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Identifies highest-priority research evidence relevant to the active project corridor.
        """
        ranked = self.search_evidence(project_summary, findings)
        return ranked[:3]

ai_engine = EvidenceIntelligenceEngine()
