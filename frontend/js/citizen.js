/**
 * BhoomiDrishti - Cadastral Land Parcel & Citizen Experience Controller
 * Team ThunderBolt
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
    route_a_impact: {
      status: 'CRITICAL SEVERANCE',
      acquired_acres: '1.15 Acres (27% of parcel)',
      canal_severance: 'Severed (Canal feeder bisected by embankment)',
      flood_exposure: 'High (Parcel lies in 25-Yr backwater inundation contour)',
      projected_compensation: '₹ 46,00,000 (Market Guidance × 2.0 Rural RFCTLARR + 100% Solatium)'
    },
    route_b_impact: {
      status: 'COMPLETELY SPARED',
      acquired_acres: '0.00 Acres (0% acquired)',
      canal_severance: 'Zero Impact (Corridor passes 1.85 km north on stony ridge)',
      flood_exposure: 'Zero Flood Risk',
      projected_compensation: '₹ 0 (Farm intact and operating normally)'
    }
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
    route_a_impact: {
      status: 'HIGH SEVERANCE',
      acquired_acres: '0.90 Acres (29% of parcel)',
      canal_severance: 'Bisects centuries-old gravity water channel to Deshnur tank',
      flood_exposure: 'Moderate seasonal waterlogging',
      projected_compensation: '₹ 36,00,000'
    },
    route_b_impact: {
      status: 'COMPLETELY SPARED',
      acquired_acres: '0.00 Acres (0% acquired)',
      canal_severance: 'Zero Impact (Passes 950m north onto scrub plateau)',
      flood_exposure: 'Zero Risk',
      projected_compensation: '₹ 0 (Farm intact)'
    }
  },
  'PARCEL-103': {
    survey_no: 'Sy. No. 45/1',
    owner: 'Shivanandappa Mahadev Gowda',
    khata_no: 'KHT-9012',
    village: 'Kittur Outskirts (Doddavad Cross)',
    taluk: 'Kittur, Belagavi District',
    coords: [15.598, 74.902],
    extent_acres: '5.60 Acres (2.26 Hectares)',
    soil_type: 'Red Sandy Loam',
    crops: 'Horticulture (Mango & Guava) + Rainfed Groundnut',
    irrigation_source: '2 Deep Borewells with Drip Irrigation',
    annual_crop_income: '₹ 5,20,000 / year',
    route_a_impact: {
      status: 'PARTIAL PERIPHERAL',
      acquired_acres: '0.40 Acres (7% of parcel)',
      canal_severance: 'Edge acquisition for Kittur interchange',
      flood_exposure: 'Low flood risk',
      projected_compensation: '₹ 18,00,000'
    },
    route_b_impact: {
      status: 'SAFE BYPASS',
      acquired_acres: '0.20 Acres (Common junction buffer)',
      canal_severance: 'Service road and tractor underpass provided',
      flood_exposure: 'Zero Risk',
      projected_compensation: '₹ 9,00,000'
    }
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
    crops: 'Sorghum, Green Gram & Dairy Fodder',
    irrigation_source: 'Rainfed + Shared Check Dam',
    annual_crop_income: '₹ 2,10,000 / year',
    route_a_impact: {
      status: 'SAFE DISTANCE',
      acquired_acres: '0.00 Acres (820m away)',
      canal_severance: 'None',
      flood_exposure: 'Low',
      projected_compensation: '₹ 0'
    },
    route_b_impact: {
      status: 'NEARBY ACCESS',
      acquired_acres: '0.00 Acres (310m on plateau edge)',
      canal_severance: 'Direct access to new expressway service lane',
      flood_exposure: 'Zero Risk',
      projected_compensation: '₹ 0'
    }
  },
  'PARCEL-105': {
    survey_no: 'Sy. No. 71/C',
    owner: 'Mallikarjunappa Veerabhadrappa',
    khata_no: 'KHT-2810',
    village: 'Kalloli Plateau Hamlet',
    taluk: 'Bailhongal, Belagavi District',
    coords: [15.680, 74.940],
    extent_acres: '6.40 Acres (2.59 Hectares)',
    soil_type: 'Shallow Gravelly Lithosol (Uncultivated Pediment)',
    crops: 'Rainfed Pearl Millet (Bajra) & Goat Grazing Commons',
    irrigation_source: 'Seasonal Rainfed Only',
    annual_crop_income: '₹ 85,000 / year',
    route_a_impact: {
      status: 'UNAFFECTED',
      acquired_acres: '0.00 Acres (1.4 km south)',
      canal_severance: 'None',
      flood_exposure: 'Zero Risk',
      projected_compensation: '₹ 0'
    },
    route_b_impact: {
      status: 'SCRUBLAND ACQUISITION',
      acquired_acres: '0.85 Acres (Low-yield non-arable scrubland acquired)',
      canal_severance: 'Cattle & tractor underpass provided for pastoral herds',
      flood_exposure: 'Zero Flood Risk',
      projected_compensation: '₹ 8,50,000 (Low circle rate wasteland)'
    }
  }
};

let currentSelectedParcel = 'PARCEL-101';
let citizenHighlightMarker = null;

function initCitizenParcelInspector() {
  onSelectParcel(currentSelectedParcel, false);
}

function onSelectParcel(parcelId, panToMap = true) {
  currentSelectedParcel = parcelId;
  const p = parcelDatabase[parcelId];
  if (!p) return;

  // Update select dropdown value if not matching
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
      <span class="parcel-k">Khata Holder / Owner:</span>
      <span class="parcel-v">${p.owner} (${p.khata_no})</span>
    </div>
    <div class="parcel-row">
      <span class="parcel-k">Village & Taluk:</span>
      <span class="parcel-v">${p.village}</span>
    </div>
    <div class="parcel-row">
      <span class="parcel-k">Total Land Extent:</span>
      <span class="parcel-v">${p.extent_acres}</span>
    </div>
    <div class="parcel-row">
      <span class="parcel-k">Soil & Crop Types:</span>
      <span class="parcel-v">${p.crops}</span>
    </div>
    <div class="parcel-row">
      <span class="parcel-k">Irrigation Source:</span>
      <span class="parcel-v">${p.irrigation_source}</span>
    </div>
    <div class="parcel-row">
      <span class="parcel-k">Annual Crop Income:</span>
      <span class="parcel-v">${p.annual_crop_income}</span>
    </div>

    <!-- Route A Impact Box -->
    <div class="parcel-impact-alert">
      <strong>⚠️ Route A (Direct Route) Consequence:</strong><br>
      • Acquired Land: <strong>${p.route_a_impact.acquired_acres}</strong><br>
      • Canal Impact: ${p.route_a_impact.canal_severance}<br>
      • Flood Vulnerability: ${p.route_a_impact.flood_exposure}<br>
      • Entitled Compensation: <strong>${p.route_a_impact.projected_compensation}</strong>
    </div>

    <!-- Route B Impact Box -->
    <div class="parcel-impact-safe">
      <strong>✓ Route B (Northern Bypass) Consequence:</strong><br>
      • Acquired Land: <strong>${p.route_b_impact.acquired_acres}</strong><br>
      • Canal Impact: ${p.route_b_impact.canal_severance}<br>
      • Flood Vulnerability: ${p.route_b_impact.flood_exposure}<br>
      • Status: <strong>${p.route_b_impact.status}</strong>
    </div>
  `;

  // Pan and highlight marker on citizen satellite map
  if (panToMap && window.citMap && p.coords) {
    window.citMap.flyTo(p.coords, 14, { duration: 1.0 });

    if (citizenHighlightMarker) {
      window.citMap.removeLayer(citizenHighlightMarker);
    }

    citizenHighlightMarker = L.circleMarker(p.coords, {
      radius: 14,
      fillColor: '#22c55e',
      color: '#ffffff',
      weight: 3,
      fillOpacity: 0.85
    }).addTo(window.citMap).bindPopup(`<strong>${p.survey_no}</strong><br>${p.owner}<br>${p.village}`).openPopup();
  }

  showToast(`Loaded Cadastral Record: ${p.survey_no}`);
}

// Function to handle clicking custom coordinates on map
function handleCitizenMapClick(lat, lng) {
  // Find closest surveyed parcel
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

  // If clicked close to a known parcel (< 1.5 km in degrees approx 0.015), select that parcel
  if (minDistance < 0.02) {
    onSelectParcel(closestId, false);
    return;
  }

  // Otherwise, render a custom location on the right panel
  const display = document.getElementById('parcel-details-display');
  if (!display) return;

  const latF = lat.toFixed(4);
  const lngF = lng.toFixed(4);

  // Approximate distance to Route A (~15.66 N) and Route B (~15.70 N)
  const distKmA = (Math.abs(lat - 15.66) * 111).toFixed(2);
  const distKmB = (Math.abs(lat - 15.70) * 111).toFixed(2);

  display.innerHTML = `
    <div class="parcel-row">
      <span class="parcel-k">Selected Map Location:</span>
      <span class="parcel-v" style="color:#0284c7; font-size:13px;">Lat: ${latF}, Lng: ${lngF}</span>
    </div>
    <div class="parcel-row">
      <span class="parcel-k">Nearest Habitation:</span>
      <span class="parcel-v">MK Hubballi - Bailhongal Sector</span>
    </div>
    <div class="parcel-row">
      <span class="parcel-k">Distance to Route A:</span>
      <span class="parcel-v">${distKmA} km</span>
    </div>
    <div class="parcel-row">
      <span class="parcel-k">Distance to Route B:</span>
      <span class="parcel-v">${distKmB} km</span>
    </div>

    <div class="parcel-impact-safe" style="margin-top:8px;">
      <strong>📍 Custom Ground Point Selected</strong><br>
      You can report a local canal, flood point, or school at these exact coordinates by clicking below.
    </div>
  `;

  if (citizenHighlightMarker && window.citMap) {
    window.citMap.removeLayer(citizenHighlightMarker);
  }

  citizenHighlightMarker = L.circleMarker([lat, lng], {
    radius: 10,
    fillColor: '#0284c7',
    color: '#ffffff',
    weight: 2,
    fillOpacity: 0.9
  }).addTo(window.citMap).bindPopup(`<strong>Custom Pinned Point</strong><br>Lat: ${latF}, Lng: ${lngF}`).openPopup();

  showToast(`Inspecting location: ${latF}, ${lngF}`);
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
  if (descInput) descInput.value = `Regarding ${p.survey_no}: Route A bisects our irrigation canal and puts ${p.crops} at flood risk. We request the highway committee to approve the Route B bypass.`;
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
