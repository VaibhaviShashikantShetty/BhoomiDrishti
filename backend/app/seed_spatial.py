"""
BhoomiDrishti - Synthetic Realistic Geospatial Seed Data Generator
Generates realistic GeoJSON layers for the Belagavi-Dharwad Malaprabha Basin Agro-Corridor:
- corridor_scenario_a.geojson (Original Route)
- corridor_scenario_b.geojson (Alternative Shifted Route)
- land_use.geojson (Multi-category Land Use Land Cover)
- settlements.geojson (Villages & Gram Panchayats with demographics)
- flood_hazard.geojson (Flood Inundation & Hydrological Risk Zones)
- citizen_observations.geojson (Initial crowd-sourced ground observations)
"""

import json
import os
import math

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "geojson")
os.makedirs(DATA_DIR, exist_ok=True)

# Scenario A: Original Direct Alignment (Crosses river basin & prime agricultural land)
# Coordinates approx: 74.88 to 75.12 Longitude, 15.58 to 15.75 Latitude
scenario_a_coords = [
    [74.885, 15.582],
    [74.920, 15.610],
    [74.955, 15.635],
    [74.990, 15.660],
    [75.035, 15.690],
    [75.075, 15.715],
    [75.115, 15.748]
]

scenario_a_geojson = {
    "type": "FeatureCollection",
    "name": "Corridor_Alignment_Scenario_A_Original",
    "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}},
    "features": [
        {
            "type": "Feature",
            "properties": {
                "id": "SCN-A",
                "name": "Scenario A: Original Direct Alignment",
                "corridor_code": "NH-753G-EXP-A",
                "design_speed_kmph": 100,
                "length_km": 34.8,
                "planned_lanes": 4,
                "right_of_way_m": 60,
                "description": "Shortest geometric alignment connecting Western Agrologistics Hub to Dharwad Ring Road.",
                "alignment_type": "Direct Lowland Transect"
            },
            "geometry": {
                "type": "LineString",
                "coordinates": scenario_a_coords
            }
        }
    ]
}

# Scenario B: Shifted Northern Ridgeline Route (Avoids prime irrigated paddy & Malaprabha flood plains)
scenario_b_coords = [
    [74.885, 15.582],
    [74.910, 15.625],
    [74.945, 15.668],
    [74.985, 15.702],
    [75.030, 15.725],
    [75.078, 15.735],
    [75.115, 15.748]
]

scenario_b_geojson = {
    "type": "FeatureCollection",
    "name": "Corridor_Alignment_Scenario_B_Shifted_Ridge",
    "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}},
    "features": [
        {
            "type": "Feature",
            "properties": {
                "id": "SCN-B",
                "name": "Scenario B: Northern Agro-Ecological Bypass",
                "corridor_code": "NH-753G-EXP-B",
                "design_speed_kmph": 100,
                "length_km": 38.6,
                "planned_lanes": 4,
                "right_of_way_m": 60,
                "description": "Shifted along the arid pediment plateau. Circumvents Malaprabha flood retention basin and high-yield sugarcane tracts.",
                "alignment_type": "Agro-Ecological Bypass"
            },
            "geometry": {
                "type": "LineString",
                "coordinates": scenario_b_coords
            }
        }
    ]
}

# Land Use / Land Cover Polygons
land_use_features = [
    # Prime Agricultural Lowland (Paddy / Sugarcane - Irrigated by Malaprabha canal)
    {
        "type": "Feature",
        "properties": {
            "lulc_id": "LULC-01",
            "category": "Prime Agricultural Land (Double Crop)",
            "classification": "Agriculture",
            "crop_type": "Sugarcane & Wet Paddy",
            "soil_type": "Deep Black Alluvial Clay",
            "economic_yield_inr_ha_yr": 285000,
            "color": "#16a34a",
            "density": "High Intensity"
        },
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [74.910, 15.590],
                [74.980, 15.610],
                [75.020, 15.650],
                [75.060, 15.680],
                [75.050, 15.710],
                [74.990, 15.670],
                [74.930, 15.640],
                [74.910, 15.590]
            ]]
        }
    },
    # Rainfed Dryland Cropland (Sorghum / Groundnut / Pulses)
    {
        "type": "Feature",
        "properties": {
            "lulc_id": "LULC-02",
            "category": "Rainfed Cropland (Single Crop)",
            "classification": "Agriculture",
            "crop_type": "Sorghum & Groundnut",
            "soil_type": "Medium Black / Red Loam",
            "economic_yield_inr_ha_yr": 85000,
            "color": "#84cc16",
            "density": "Moderate"
        },
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [74.870, 15.570],
                [74.920, 15.565],
                [74.940, 15.605],
                [74.900, 15.620],
                [74.870, 15.570]
            ]]
        }
    },
    # Secondary Scrubland / Wasteland / Arid Pediment (Low agricultural value)
    {
        "type": "Feature",
        "properties": {
            "lulc_id": "LULC-03",
            "category": "Scrubland & Stony Pediment",
            "classification": "Wasteland / Non-Arable",
            "crop_type": "None (Sparse thorny scrub)",
            "soil_type": "Shallow Gravelly Lithosol",
            "economic_yield_inr_ha_yr": 12000,
            "color": "#eab308",
            "density": "Sparse"
        },
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [74.905, 15.630],
                [74.960, 15.680],
                [75.010, 15.730],
                [75.060, 15.745],
                [75.080, 15.730],
                [75.020, 15.710],
                [74.950, 15.660],
                [74.905, 15.630]
            ]]
        }
    },
    # Community Agro-Forestry & Commons
    {
        "type": "Feature",
        "properties": {
            "lulc_id": "LULC-04",
            "category": "Community Agro-Forestry / Grove",
            "classification": "Ecology & Commons",
            "crop_type": "Tamarind, Neem & Bamboo Groves",
            "soil_type": "Red Sandy Loam",
            "economic_yield_inr_ha_yr": 45000,
            "color": "#059669",
            "density": "Medium Tree Cover"
        },
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [75.060, 15.700],
                [75.100, 15.710],
                [75.120, 15.740],
                [75.090, 15.750],
                [75.060, 15.700]
            ]]
        }
    }
]

land_use_geojson = {
    "type": "FeatureCollection",
    "name": "NRSC_Bhuvan_LULC_Malaprabha_Basin_2024",
    "features": land_use_features
}

# Flood Risk / Inundation Zone (Malaprabha River 25-Year Inundation Belt)
flood_hazard_features = [
    {
        "type": "Feature",
        "properties": {
            "hazard_id": "FLD-01",
            "zone_name": "Malaprabha River Core Inundation Zone (25-Yr Return)",
            "risk_level": "High Flood Sensitivity",
            "recurrence_years": 25,
            "typical_depth_m": 2.4,
            "drainage_basin": "Krishna Sub-Basin / Malaprabha",
            "color": "#0284c7"
        },
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [74.960, 15.620],
                [75.010, 15.650],
                [75.050, 15.685],
                [75.045, 15.700],
                [74.995, 15.665],
                [74.950, 15.635],
                [74.960, 15.620]
            ]]
        }
    },
    {
        "type": "Feature",
        "properties": {
            "hazard_id": "FLD-02",
            "zone_name": "Tributary Flash Drainage Depression",
            "risk_level": "Moderate Seasonal Waterlogging",
            "recurrence_years": 10,
            "typical_depth_m": 0.9,
            "drainage_basin": "Bennihalla Stream Confluence",
            "color": "#38bdf8"
        },
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [74.920, 15.595],
                [74.945, 15.615],
                [74.935, 15.625],
                [74.910, 15.605],
                [74.920, 15.595]
            ]]
        }
    }
]

flood_hazard_geojson = {
    "type": "FeatureCollection",
    "name": "CWC_Flood_Hazard_Atlas_Malaprabha",
    "features": flood_hazard_features
}

# Settlements & Gram Panchayats
settlements_features = [
    {
        "type": "Feature",
        "properties": {
            "settlement_id": "VIL-01",
            "name": "Mugatkhan Hubballi (MK Hubballi)",
            "tier": "Large Gram Panchayat",
            "population": 7820,
            "households": 1540,
            "predominant_livelihood": "Sugarcane farming & jaggery units",
            "district": "Belagavi",
            "taluk": "Bailhongal",
            "primary_school_count": 3,
            "health_subcentre": True,
            "buffer_radius_m": 800
        },
        "geometry": {
            "type": "Point",
            "coordinates": [74.960, 15.638]
        }
    },
    {
        "type": "Feature",
        "properties": {
            "settlement_id": "VIL-02",
            "name": "Deshnur Village",
            "tier": "Medium Agricultural Village",
            "population": 3410,
            "households": 680,
            "predominant_livelihood": "Paddy & dairy cooperative",
            "district": "Belagavi",
            "taluk": "Bailhongal",
            "primary_school_count": 2,
            "health_subcentre": False,
            "buffer_radius_m": 600
        },
        "geometry": {
            "type": "Point",
            "coordinates": [75.012, 15.675]
        }
    },
    {
        "type": "Feature",
        "properties": {
            "settlement_id": "VIL-03",
            "name": "Kittur Outskirts (Doddavad Cross)",
            "tier": "Peri-urban Settlement",
            "population": 5260,
            "households": 1120,
            "predominant_livelihood": "Horticulture & small business",
            "district": "Belagavi",
            "taluk": "Kittur",
            "primary_school_count": 2,
            "health_subcentre": True,
            "buffer_radius_m": 700
        },
        "geometry": {
            "type": "Point",
            "coordinates": [74.902, 15.598]
        }
    },
    {
        "type": "Feature",
        "properties": {
            "settlement_id": "VIL-04",
            "name": "Sampgaon Rural Cluster",
            "tier": "Hamlets & Farmsteads",
            "population": 2180,
            "households": 420,
            "predominant_livelihood": "Rainfed pulse farming",
            "district": "Belagavi",
            "taluk": "Bailhongal",
            "primary_school_count": 1,
            "health_subcentre": False,
            "buffer_radius_m": 500
        },
        "geometry": {
            "type": "Point",
            "coordinates": [75.055, 15.722]
        }
    },
    {
        "type": "Feature",
        "properties": {
            "settlement_id": "VIL-05",
            "name": "Kalloli Plateau Hamlet",
            "tier": "Upland Agro-Pastoral Hamlet",
            "population": 1150,
            "households": 230,
            "predominant_livelihood": "Goat rearing & dryland millet",
            "district": "Belagavi",
            "taluk": "Bailhongal",
            "primary_school_count": 1,
            "health_subcentre": False,
            "buffer_radius_m": 450
        },
        "geometry": {
            "type": "Point",
            "coordinates": [74.940, 15.680]
        }
    }
]

settlements_geojson = {
    "type": "FeatureCollection",
    "name": "Census_Settlements_Belagavi_2021_Projected",
    "features": settlements_features
}

# Citizen Observations (Ground feedback submitted by local farmers/residents)
citizen_observations_features = [
    {
        "type": "Feature",
        "properties": {
            "obs_id": "OBS-101",
            "citizen_name": "Basappa Patil (Farmer, MK Hubballi)",
            "category": "Flooding Observed",
            "title": "Severe backwater flooding during 2023 monsoon submerged existing culvert",
            "description": "The proposed low alignment crosses our main lift irrigation canal. In 2019 and 2023, water stood 6 feet deep here for 18 days. Any embankment without wide viaducts will create an artificial dam and flood 400 acres of cane.",
            "survey_number": "Sy. No. 142/2A",
            "village": "Mugatkhan Hubballi",
            "verification_status": "Reported by Citizen - Unverified Ground Observation",
            "verified_by_officer": False,
            "timestamp": "2026-08-14 09:30:00",
            "affected_families_claim": 42
        },
        "geometry": {
            "type": "Point",
            "coordinates": [74.975, 15.645]
        }
    },
    {
        "type": "Feature",
        "properties": {
            "obs_id": "OBS-102",
            "citizen_name": "Gram Panchayat Bailhongal (Ramesh Talwar, Member)",
            "category": "Agricultural Severance",
            "title": "Corridor bisects centuries-old gravity water channel to Deshnur tank",
            "description": "If Scenario A is selected, farmers on the southern flank will lose direct tractor access to their sugarcane weighing centers and the Kittur APMC yard. Please evaluate the northern ridge alternative.",
            "survey_number": "Sy. No. 88/B",
            "village": "Deshnur",
            "verification_status": "Reported by Citizen - Unverified Ground Observation",
            "verified_by_officer": False,
            "timestamp": "2026-08-20 16:15:00",
            "affected_families_claim": 65
        },
        "geometry": {
            "type": "Point",
            "coordinates": [75.008, 15.670]
        }
    }
]

citizen_observations_geojson = {
    "type": "FeatureCollection",
    "name": "Citizen_Ground_Observations_Public_Feed",
    "features": citizen_observations_features
}

# Write files
files = {
    "corridor_scenario_a.geojson": scenario_a_geojson,
    "corridor_scenario_b.geojson": scenario_b_geojson,
    "land_use.geojson": land_use_geojson,
    "flood_hazard.geojson": flood_hazard_geojson,
    "settlements.geojson": settlements_geojson,
    "citizen_observations.geojson": citizen_observations_geojson
}

for filename, data in files.items():
    filepath = os.path.join(DATA_DIR, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    print(f"Generated {filepath} successfully.")

print("All GeoJSON files generated successfully.")
