/**
 * BhoomiDrishti - Cadastral Land Parcel & Citizen Experience Controller
 * Team ThunderBolt
 * Focuses strictly on citizen's own land records and the physical document retrieval directory.
 */

const parcelDatabase = {
  'PARCEL-101': {
    survey_no: 'Sy. No. 142/2A',
    owner: 'Basappa Ningappa Patil',
    khata_no: 'KHT-7842',
    village: 'Mugatkhan Hubballi (MK Hubballi)',
    taluk: 'Bailhongal, Belagavi District',
    coords: [15.638, 74.960],
    extent_acres: '4.25 Acres (1.72 Hectares)',
    soil_type: 'Deep Black Alluvial Clay (A-Grade Arable)',
    crops: 'Sugarcane (Co-86032) & Wet Sona Masuri Paddy',
    irrigation_source: 'Malaprabha Left Bank Canal (Distributary D-4) + 1 Open Dug Well',
    annual_crop_income: '₹ 4,85,000 / year',
    rtc_status: 'Active (Digitally Signed by Tahsildar Bailhongal)',
    mutation_status: 'Form 21 Verified (Inheritance Partition 2018)',
    ec_status: 'Nil Encumbrance (Search: 2010 - 2026)',
    rfctlarr_entitlement: 'Eligible for 2.0x Rural Market Value Multiplier + 100% Solatium in event of statutory infrastructure acquisition.'
  },
  'PARCEL-102': {
    survey_no: 'Sy. No. 88/B',
    owner: 'Ramesh Chennappa Talwar',
    khata_no: 'KHT-4319',
    village: 'Deshnur Village',
    taluk: 'Bailhongal, Belagavi District',
    coords: [15.675, 75.012],
    extent_acres: '3.10 Acres (1.25 Hectares)',
    soil_type: 'Medium Black Loam Soil',
    crops: 'Double-Crop Wet Paddy & Sunflower',
    irrigation_source: 'Deshnur Irrigation Tank Feeder Channel',
    annual_crop_income: '₹ 3,40,000 / year',
    rtc_status: 'Active (Bhoomi Kendra Bailhongal)',
    mutation_status: 'Form 21 Verified (Joint Family Title)',
    ec_status: 'Nil Encumbrance (Search: 2012 - 2026)',
    rfctlarr_entitlement: 'Standard rural category; entitled to rehabilitation grant for irrigation feeder reinstatement.'
  },
  'PARCEL-103': {
    survey_no: 'Sy. No. 45/1',
    owner: 'Shivanandappa Mahadev Gowda',
    khata_no: 'KHT-9012',
    village: 'Kittur Outskirts (Doddavad Cross)',
    taluk: 'Kittur, Belagavi District',
    coords: [15.598, 74.902],
    extent_acres: '5.60 Acres (2.26 Hectares)',
    soil_type: 'Red Sandy Loam Soil',
    crops: 'Horticulture (Mango & Guava) + Rainfed Groundnut',
    irrigation_source: '2 Deep Borewells with Solar Drip Irrigation',
    annual_crop_income: '₹ 5,20,000 / year',
    rtc_status: 'Active (Tahsildar Kittur)',
    mutation_status: 'Registered Sale Deed (Kaveri 2.0 Kaveri ID: KVR-2016-89)',
    ec_status: 'Canara Bank Agricultural Crop Lien (Discharged 2024)',
    rfctlarr_entitlement: 'Horticulture fruit-bearing tree valuation extra under State Forest & Horticulture department guidelines.'
  },
  'PARCEL-104': {
    survey_no: 'Sy. No. 112/3',
    owner: 'Parvati Bai Kallappa Patil',
    khata_no: 'KHT-6120',
    village: 'Sampgaon Rural Cluster',
    taluk: 'Bailhongal, Belagavi District',
    coords: [15.722, 75.055],
    extent_acres: '2.80 Acres (1.13 Hectares)',
    soil_type: 'Medium Black Soil',
    crops: 'Sorghum (Jowar), Green Gram & Dairy Fodder',
    irrigation_source: 'Seasonal Rainfed + Shared Check Dam',
    annual_crop_income: '₹ 2,10,000 / year',
    rtc_status: 'Active (Bhoomi Registry)',
    mutation_status: 'Mutation Form 21 Certified (Succession 2021)',
    ec_status: 'Nil Encumbrance',
    rfctlarr_entitlement: 'Rainfed dryland compensation slab; eligible for alternative fodder commons access.'
  },
  'PARCEL-105': {
    survey_no: 'Sy. No. 71/C',
    owner: 'Mallikarjunappa Veerabhadrappa',
    khata_no: 'KHT-2810',
    village: 'Kalloli Plateau Hamlet',
    taluk: 'Bailhongal, Belagavi District',
    coords: [15.680, 74.940],
    extent_acres: '6.40 Acres (2.59 Hectares)',
    soil_type: 'Shallow Gravelly Lithosol (Pediment Ridge)',
    crops: 'Rainfed Pearl Millet (Bajra) & Pastoral Grazing',
    irrigation_source: 'Seasonal Rainfed Only',
    annual_crop_income: '₹ 85,000 / year',
    rtc_status: 'Active',
    mutation_status: 'Ancestral Title Record',
    ec_status: 'Nil Encumbrance',
    rfctlarr_entitlement: 'Low-density pediment rate; pastoral transit easement protected under Gram Panchayat norms.'
  }
};

let currentSelectedParcel = 'PARCEL-101';
let citizenHighlightMarker = null;

function initCitizenParcelInspector() {
  onSelectParcel(currentSelectedParcel, false);
  loadCitizenDocumentOffices();
}

function onSelectParcel(parcelId, panToMap = true) {
  currentSelectedParcel = parcelId;
  const p = parcelDatabase[parcelId];
  if (!p) return;

  const selectElem = document.getElementById('citizen-parcel-select');
  if (selectElem && selectElem.value !== parcelId) {
    selectElem.value = parcelId;
  }

  const display = document.getElementById('parcel-details-display');
  if (!display) return;

  display.innerHTML = `
    <div class="parcel-row">
      <span class="parcel-k">Survey Number:</span>
      <span class="parcel-v" style="color:#2e7d32; font-size:14px;">${p.survey_no}</span>
    </div>
    <div class="parcel-row">
      <span class="parcel-k">Khata Holder:</span>
      <span class="parcel-v">${p.owner} (${p.khata_no})</span>
    </div>
    <div class="parcel-row">
      <span class="parcel-k">Village & Taluk:</span>
      <span class="parcel-v">${p.village}, ${p.taluk}</span>
    </div>
    <div class="parcel-row">
      <span class="parcel-k">Total Land Extent:</span>
      <span class="parcel-v">${p.extent_acres}</span>
    </div>
    <div class="parcel-row">
      <span class="parcel-k">Soil Classification:</span>
      <span class="parcel-v">${p.soil_type}</span>
    </div>
    <div class="parcel-row">
      <span class="parcel-k">Cultivated Crops:</span>
      <span class="parcel-v">${p.crops}</span>
    </div>
    <div class="parcel-row">
      <span class="parcel-k">Irrigation Source:</span>
      <span class="parcel-v">${p.irrigation_source}</span>
    </div>
    <div class="parcel-row">
      <span class="parcel-k">Annual Crop Value:</span>
      <span class="parcel-v">${p.annual_crop_income}</span>
    </div>
    <div class="parcel-row">
      <span class="parcel-k">RTC Record Status:</span>
      <span class="parcel-v" style="color:#15803d;">✓ ${p.rtc_status}</span>
    </div>
    <div class="parcel-row">
      <span class="parcel-k">Mutation Register:</span>
      <span class="parcel-v">${p.mutation_status}</span>
    </div>
    <div class="parcel-row">
      <span class="parcel-k">Encumbrance (EC):</span>
      <span class="parcel-v">${p.ec_status}</span>
    </div>

    <!-- Official Statutory Entitlement Box -->
    <div class="parcel-entitlement-box">
      <strong>⚖️ Statutory Rights & Compensation Entitlement:</strong><br>
      ${p.rfctlarr_entitlement}
    </div>
  `;

  // Move marker on map
  if (panToMap && window.citMap && p.coords) {
    window.citMap.flyTo(p.coords, 14, { duration: 0.8 });

    if (citizenHighlightMarker) {
      window.citMap.removeLayer(citizenHighlightMarker);
    }

    citizenHighlightMarker = L.circleMarker(p.coords, {
      radius: 12,
      fillColor: '#22c55e',
      color: '#ffffff',
      weight: 3,
      fillOpacity: 0.9
    }).addTo(window.citMap).bindPopup(`<strong>${p.survey_no}</strong><br>${p.owner}<br>${p.village}`).openPopup();
  }

  showToast(`Loaded Land Record: ${p.survey_no}`);
}

// Map Click Handler: Updates right-side details dynamically when clicking ANY point on map!
function handleCitizenMapClick(lat, lng) {
  let closestId = 'PARCEL-101';
  let minDistance = 999999;

  for (const [id, data] of Object.entries(parcelDatabase)) {
    const dLat = data.coords[0] - lat;
    const dLng = data.coords[1] - lng;
    const dist = Math.sqrt(dLat * dLat + dLng * dLng);
    if (dist < minDistance) {
      minDistance = dist;
      closestId = id;
    }
  }

  // If close to a registered parcel (< 1.5 km), select that parcel
  if (minDistance < 0.02) {
    onSelectParcel(closestId, false);
    return;
  }

  // Otherwise inspect exact field coordinates
  const display = document.getElementById('parcel-details-display');
  if (!display) return;

  const latF = lat.toFixed(4);
  const lngF = lng.toFixed(4);

  display.innerHTML = `
    <div class="parcel-row">
      <span class="parcel-k">Selected Coordinates:</span>
      <span class="parcel-v" style="color:#0284c7; font-size:13px;">${latF}° N, ${lngF}° E</span>
    </div>
    <div class="parcel-row">
      <span class="parcel-k">Cadastral Revenue Circle:</span>
      <span class="parcel-v">MK Hubballi - Bailhongal Rural Circle</span>
    </div>
    <div class="parcel-row">
      <span class="parcel-k">Field Soil Type:</span>
      <span class="parcel-v">Black Cotton Agricultural Soil</span>
    </div>
    <div class="parcel-row">
      <span class="parcel-k">Irrigation Catchment:</span>
      <span class="parcel-v">Malaprabha River Sub-Basin</span>
    </div>
    <div class="parcel-row">
      <span class="parcel-k">Nearest Land Record Office:</span>
      <span class="parcel-v">Nemmadi Kendra, MK Hubballi</span>
    </div>

    <div class="parcel-entitlement-box" style="background:#eff6ff; border-color:#bfdbfe; border-left-color:#2563eb; color:#1e40af;">
      <strong>📍 Pinned Field Location</strong><br>
      To link your official Bhoomi Pahani or report ground canal severance for this location, click below.
    </div>
  `;

  if (citizenHighlightMarker && window.citMap) {
    window.citMap.removeLayer(citizenHighlightMarker);
  }

  citizenHighlightMarker = L.circleMarker([lat, lng], {
    radius: 11,
    fillColor: '#0284c7',
    color: '#ffffff',
    weight: 2,
    fillOpacity: 0.95
  }).addTo(window.citMap).bindPopup(`<strong>Field Location</strong><br>${latF}, ${lngF}`).openPopup();

  showToast(`Inspecting field point: ${latF}, ${lngF}`);
}

// ----------------- CITIZEN DOCUMENT OFFICES DIRECTORY -----------------
async function loadCitizenDocumentOffices() {
  const container = document.getElementById('doc-directory-container');
  if (!container) return;

  try {
    const res = await fetch('/api/citizen/document-offices');
    const offices = await res.json();

    container.innerHTML = offices.map(off => `
      <div class="doc-office-card">
        <div class="doc-header">
          <div class="doc-name">📄 ${off.document_name}</div>
          <span class="doc-fee-badge">${off.statutory_fee}</span>
        </div>
        <p class="doc-desc">${off.description}</p>
        
        <div class="doc-office-info">
          <div class="doc-info-row">
            <strong>Office:</strong>
            <span>${off.office_name}</span>
          </div>
          <div class="doc-info-row">
            <strong>Address:</strong>
            <span>${off.address}</span>
          </div>
          <div class="doc-info-row">
            <strong>Window:</strong>
            <span>${off.counter}</span>
          </div>
          <div class="doc-info-row">
            <strong>Timings:</strong>
            <span>${off.timings}</span>
          </div>
          <div class="doc-info-row">
            <strong>Helpline:</strong>
            <span style="color:#2e7d32; font-weight:700;">${off.helpline}</span>
          </div>
        </div>

        <div class="doc-reqs">
          <strong>Required Documents:</strong> ${off.required_documents.join(' • ')}
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Failed to load document offices:', err);
  }
}

function flagParcelConcern() {
  const p = parcelDatabase[currentSelectedParcel];
  if (!p) return;

  if (typeof switchSubTab === 'function') {
    switchSubTab('citizen', 'cit-tab-feedback');
  }

  const nameInput = document.getElementById('c-name');
  const vilInput = document.getElementById('c-village');
  const descInput = document.getElementById('c-desc');

  if (nameInput) nameInput.value = p.owner;
  if (vilInput) vilInput.value = `${p.village} (${p.survey_no})`;
  if (descInput) descInput.value = `Regarding ${p.survey_no} in ${p.village}: We request protection of our ${p.crops} fields and ${p.irrigation_source} canal flow from highway severance.`;
}

async function submitCitizenConcern(e) {
  e.preventDefault();

  const payload = {
    project_id: "PRJ-KA-2026-08",
    citizen_name: document.getElementById('c-name').value.trim(),
    village: document.getElementById('c-village').value.trim(),
    category: document.getElementById('c-category').value,
    title: document.getElementById('c-category').value,
    description: document.getElementById('c-desc').value.trim(),
    latitude: 15.645,
    longitude: 74.975
  };

  try {
    const res = await fetch('/api/citizen/observations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      showToast('✓ Ground observation submitted and registered in national feedback feed.');
      document.getElementById('c-desc').value = '';
      loadCitizenMiniFeed();
      if (typeof switchSubTab === 'function') {
        switchSubTab('citizen', 'cit-tab-feed');
      }
    }
  } catch (err) {
    showToast('Failed to submit: ' + err.message);
  }
}

async function loadCitizenMiniFeed() {
  const container = document.getElementById('citizen-mini-feed');
  if (!container) return;

  try {
    const res = await fetch('/api/citizen/observations');
    const obs = await res.json();

    container.innerHTML = obs.map(o => `
      <div class="mini-feed-card">
        <div class="mini-feed-title">📍 ${o.village}: ${o.title}</div>
        <p style="font-size:12px; color:#4b5563; margin:4px 0;">"${o.description}"</p>
        <div class="mini-feed-meta">Reported by: ${o.citizen_name} • <em>${o.verification_status}</em></div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Failed to load citizen feed:', err);
  }
}
