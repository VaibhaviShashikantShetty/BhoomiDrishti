# 🇮🇳 BhoomiDrishti (भूमिदृष्टि)
### National Digital Platform for Research, Policy Innovation, and Evidence-Based Land Governance
**Smart India Hackathon 2026 — Interactive Working MVP Prototype**  
**Developed by: team ThunderBolt**

---

## 1. Executive Summary & Core Philosophy

India possesses immense land, geospatial, hydrological, and demographic records. When a high-stakes infrastructure or land-use decision must be made, **the challenge is rarely finding data**.

The true challenge is:
> **Connecting the right evidence, understanding real trade-offs, comparing route alternatives, and making a transparent, defensible decision.**

**BhoomiDrishti** serves as that **evidence and decision-support layer**. To make the platform immediately understandable by anyone without feeling overwhelmed by dense walls of text, the interface uses a **soothing light theme (soft sage green, warm beige, subtle lemon)** and focuses on **exactly 2 primary features per user role**:

$$\text{Evidence} \longrightarrow \text{Spatial Analysis} \longrightarrow \text{Route Comparison} \longrightarrow \text{Decision Record} \longrightarrow \text{Public Transparency}$$

---

## 2. 2-Second Premium Reveal Splash Screen

When launching the web application, a gentle **2-second loading screen** provides a rich, cinematic slow reveal:
- Official Emblem
- **BhoomiDrishti**
- **team ThunderBolt**
- Subtitle: *National Digital Platform for Land Governance*
- Smooth progress indicator that gracefully fades into the main workspace at 2.0s.

---

## 3. The 3 User Experiences (Just 2 Core Features Each)

All three user roles operate on the **same shared backend and SQLite data layer**:

### 🏛️ 1. Policymaker / Government Officer (`Policy Decision Studio`)
- **Feature 1: Interactive Route Comparison (Route A vs Route B)**
  - Toggle between **Route A** (Direct 34.8 km across river fields) and **Route B** (Northern Bypass 38.6 km across rocky pediment).
  - Clear visual indicator cards: **111 ha Farmland Saved**, **0 ha Flood Risk**, **Saves 34 Village Homes**.
  - **"Why this number?" (Evidence Lineage):** Instant drill-down showing ISRO Bhuvan satellite source, 2024-25 Sentinel-2 data, and 93% empirical confidence rating.
- **Feature 2: Policy Consequence Passport**
  - Generates an official, 1-page digital decision brief certified with an immutable **SHA-256 digital cryptographic hash**, officer sign-off, and print/PDF export.

### 🔬 2. Researcher (`Research Intelligence Lab`)
- **Feature 1: Search Evidence & Case Studies**
  - Clean, natural-language search across peer-reviewed papers and datasets (e.g. IISc Bengaluru and UAS Dharwad studies on river basin flooding and agricultural severance).
  - Clean cards showing the key empirical finding and actionable policy advice.
- **Feature 2: Publish a Finding (Research → Policy Closed Loop)**
  - Simple 4-field form allowing researchers to publish empirical findings.
  - When published, the finding is **instantly discoverable by policymakers** evaluating overlapping corridors!

### 🌾 3. Citizen & Farmer (`My Land / My Community`)
- **Feature 1: Village Impact Checker**
  - Friendly dropdown allowing farmers to pick their village (e.g. *Mugatkhan Hubballi, Deshnur, Kittur, Sampgaon, Kalloli*).
  - Shows in simple, plain language exactly how the planned highway affects their homes, irrigation canals, and fields.
- **Feature 2: Share a Ground Concern**
  - Click on the interactive map or open the simple form to report local observations (e.g. *Severe Monsoon Flooding Observed*, *Irrigation Canal Severance*).
  - Labeled transparently as `Reported by Citizen - Unverified Ground Observation` and submitted directly to the highway decision committee.

---

## 4. Case Study: NH-753G Malaprabha Agro-Economic Freight Corridor

| Dimension | Route A (Direct Route) | Route B (Northern Bypass) | Trade-Off Differential |
| :--- | :--- | :--- | :--- |
| **Alignment Length** | 34.8 km | 38.6 km | +3.8 km (+11% civil work) |
| **Agricultural Land Touched** | 138.4 ha | 27.4 ha | **-111.0 ha Farmland Saved!** |
| **Prime Irrigated Crops (Cane/Paddy)** | 110.4 ha | 0.0 ha | **-110.4 ha (100% Prime Saved)** |
| **Flood Inundation Exposure** | 95.2 ha (High Risk) | 0.0 ha (Safe) | **Zero flood basin crossing** |
| **Displaced Households** | ~42 Families | ~8 Families | **81% reduction in displacement** |
| **Total Estimated Outlay** | ₹ 628.4 Cr | ₹ 596.2 Cr | **₹ 32.2 Cr Net Savings** |

---

## 5. Technology Stack

- **Backend:** Python 3.11, FastAPI, Uvicorn, SQLite3, Shapely (metric planar geometry), PyProj (UTM Zone 43N), ReportLab (PDF generator).
- **Frontend:** Semantic HTML5, CSS3 GovTech Design System (Soft Sage, Warm Beige, Subtle Lemon), Leaflet.js 1.9.4 with Carto Voyager tiles.
- **Architecture:** Lightweight single-process server with shared data layer.

---

## 6. How to Run Locally

### Prerequisites
Ensure Python 3.11+ is installed.

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Launch the Platform
```bash
python run.py
```
Open **`http://127.0.0.1:8000`** in your browser.  
*(Notice the 2-second slow reveal splash screen: BhoomiDrishti — team ThunderBolt).*

### 3. Generate Project Report PDF
```bash
python generate_pdf_report.py
```
Outputs: `BhoomiDrishti_Project_Report.pdf` (multi-page comprehensive project report).

### 4. Run Automated Verification Tests
```bash
python test_api.py
```
*(Runs 21-point automated test suite covering all APIs, calculations, and features).*

---

## 7. SIH 2026 Presentation Demonstration Script

1. **Launch:** Open `http://127.0.0.1:8000`. Watch the 2-second slow reveal of **BhoomiDrishti — team ThunderBolt**.
2. **Policymaker View:**
   - **Feature 1:** Switch between **Route A** and **Route B**. Note the 3 clean cards: **111 ha farmland saved**, **0 ha flood risk**, **homes saved**. Click *"Why this number?"* to show ISRO Bhuvan satellite provenance.
   - **Feature 2:** Click *"Generate Decision Passport"*. View the clean 1-page digital brief and click *"Digitally Sign & Record"*.
3. **Researcher View:**
   - **Feature 1:** Search `flooding risk` to inspect IISc hydrological research.
   - **Feature 2:** Fill out the 4-field form to publish a new finding. It is immediately indexed in the national repository.
4. **Citizen View:**
   - **Feature 1:** Select *Deshnur Village* in the Village Impact Checker to read how the bypass protects their irrigation canal.
   - **Feature 2:** Click *"Share a Concern"* to pin an observation, tagged as `Reported by Citizen - Unverified Ground Observation`.

---

**Developed for Smart India Hackathon 2026 by team ThunderBolt**
