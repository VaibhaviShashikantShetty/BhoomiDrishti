# 🇮🇳 BhoomiDrishti (भूमिदृष्टि)
### National Digital Platform for Research, Policy Innovation, and Evidence-Based Land Governance
**Smart India Hackathon 2026 — Interactive Working MVP Prototype**  
**Developed by: Team ThunderBolt**

---

## 1. Executive Summary & Core Philosophy

India possesses extensive land, geospatial, hydrological, and demographic records. When a high-stakes infrastructure or land-use decision must be made, **the challenge is rarely finding data**.

The true challenge is:
> **Connecting the right evidence, understanding real trade-offs, simulating policy actions, and making transparent, defensible decisions.**

**BhoomiDrishti** serves as the **evidence and decision-support layer** connecting researchers, policymakers, and citizens. Designed with a calming GovTech palette (soft sage green, warm beige, subtle lemon, ivory) and fully responsive across mobile, tablet, and desktop screens.

$$\text{Evidence} \longrightarrow \text{Spatial Simulation} \longrightarrow \text{Multi-Parameter Trade-Offs} \longrightarrow \text{Certified Decision Record}$$

---

## 2. Luxury Slow Reveal Opening
On loading the web application, a gentle opening screen transitions smoothly:
- Official Emblem & Brand
- **BhoomiDrishti**
- **Team ThunderBolt**
- Subtitle: *National Digital Platform for Land Governance*
- Clean progress bar that transitions directly into the active workspace at 2.0 seconds.

---

## 3. Dedicated User Experiences

All three user roles operate concurrently on a shared backend and SQLite data layer:

### 🏛️ 1. Policymaker (`Policy Decision Studio`)
- **Interactive Action Simulation (Range Sliders):**
  - **Right-of-Way Buffer Width (30m – 120m):** Directly expands corridor polygon in metric UTM Zone 43N to model land acquisition impact.
  - **Elevated Viaduct / Bridge Ratio (0% – 50%):** Replaces solid earth embankments with elevated bridge spans, preserving canal flows and reducing flood retention.
  - **River Floodplain Setback (0m – 600m):** Simulates lateral alignment clearance from the CWC 25-year flood inundation basin.
  - **RFCTLARR Land Compensation Multiplier (1.0x – 3.0x circle rate):** Models statutory financial outlay vs. land dispute mitigation.
- **Dynamic Decision Metrics HUD:** Real-time feedback on Farmland touched (ha), Flood plain crossed (ha), Displaced homes, and Total Outlay (₹ Cr).
- **Policy Consequence Passport:** Official statutory brief signed with an immutable **SHA-256 cryptographic hash**, decision notes, and lineage snapshot.
- **Evidence Lineage:** "Why this number?" provenance inspection showing primary satellite layers, geometric intersection formulas, and empirical confidence scores.

### 🔬 2. Researcher (`Research Intelligence Lab`)
- **Evidence Explorer:** Natural-language search across peer-reviewed studies (e.g., IISc Bengaluru hydrodynamic models, UAS Dharwad agricultural yield elasticity).
- **Spatial Cross-Dataset Correlation Tool:** Select any two authoritative layers (e.g. ISRO Bhuvan Agriculture and CWC Flood Hazard) to compute:
  - Exact coincident intersection area in hectares (EPSG:32643)
  - Jaccard Spatial Overlap Index
  - Intersecting feature pairs count
  - Grounded empirical policy implications
- **Publish Finding:** 4-field research submission form. Once submitted, findings are instantly indexed and discoverable by government officers.

### 🌾 3. Citizen & Farmer (`Community Portal`)
- **My Land Records & Parcel Profile:** Select any registered survey number or click anywhere on the satellite map to inspect cadastral records:
  - Survey number, Khata holder name, Village & Hobli
  - Total land extent (Acres / Hectares), Soil classification, Crops grown
  - Canal and borewell irrigation sources, Annual crop income
  - Bhoomi RTC verification status and statutory RFCTLARR compensation entitlement
- **Official Hardcopy Document Retrieval Directory:** Addresses fragmented revenue records by providing an authoritative directory of where to collect physical stamped copies:
  - *RTC / Pahani (Bhoomi)*: Atalji Janasnehi / Nemmadi Kendra (Window 3), Fee: ₹15
  - *Tippan & Form 11E Survey Sketch (Mojini)*: ADLR Taluk Survey Office (Room 14, Mini Vidhana Soudha), Fee: ₹35
  - *Mutation Extract (Form 21 / Vamshavruksha)*: Village Administrative Officer (VAO) & Revenue Inspector Circle, Fee: ₹20
  - *Encumbrance Certificate (EC Form 15) & Sale Deed*: Senior Sub-Registrar Office (Kaveri 2.0), Fee: ₹100
  - Complete with physical addresses, timings, fees, required ID documents, and helplines.
- **Submit Ground Concern:** Register unverified ground-level observations regarding canal severance or seasonal flooding directly with the highway committee.
- **Community Feed:** Public ledger of local farmer feedback and panchayat representations.

---

## 4. Case Study: NH-753G Malaprabha Agro-Economic Freight Corridor

| Dimension | Route A (Direct Route) | Route B (Northern Bypass) | Trade-Off Differential |
| :--- | :--- | :--- | :--- |
| **Alignment Length** | 34.8 km | 38.6 km | +3.8 km (+11% civil work) |
| **Agricultural Land Touched** | 138.4 ha | 27.4 ha | **-111.0 ha Farmland Saved** |
| **Prime Irrigated Crops (Cane/Paddy)** | 110.4 ha | 0.0 ha | **100% Prime Farmland Spared** |
| **Flood Inundation Exposure** | 95.2 ha (High Risk) | 0.0 ha (Safe) | **Zero flood basin crossing** |
| **Displaced Households** | ~42 Families | ~8 Families | **81% reduction in displacement** |
| **Total Estimated Outlay** | ₹ 628.4 Cr | ₹ 596.2 Cr | **₹ 32.2 Cr Net Savings** |

---

## 5. Technology Stack

- **Backend:** Python 3.11, FastAPI, Uvicorn, SQLite3, Shapely (planar metric geometry in UTM 43N), PyProj (EPSG:32643 / EPSG:4326 projections).
- **Frontend:** Semantic HTML5, Modular JavaScript (ES6+), Leaflet.js with ESRI World Satellite Imagery and Carto Voyager base maps.
- **Design System:** Custom GovTech theme with fluid media query engine supporting mobile, tablet, and desktop viewports.
- **Architecture:** Zero external cloud runtime dependencies; deterministic spatial intersection engine.

---

## 6. How to Run Locally

### Prerequisites
Python 3.11+ installed.

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Launch the Platform
```bash
python run.py
```

Open **`http://127.0.0.1:8000`** in your browser.  
*(Experience the 2-second luxury opening screen: BhoomiDrishti — Team ThunderBolt).*
