/**
 * BhoomiDrishti - GIS Map Controller with High-Resolution Satellite Imagery
 * Team ThunderBolt
 */

window.pmMap = null;
window.citMap = null;

let pmSatelliteLayer = null;
let pmStreetLayer = null;
let pmLabelsLayer = null;

let citSatelliteLayer = null;
let citStreetLayer = null;
let citLabelsLayer = null;

async function initMaps() {
  // 1. Policymaker GIS Map
  const pmElem = document.getElementById('map-policymaker');
  if (pmElem && !window.pmMap) {
    window.pmMap = L.map('map-policymaker', {
      center: [15.665, 75.000],
      zoom: 12,
      zoomControl: true
    });

    // ESRI High-Resolution World Satellite Imagery
    pmSatelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri, Maxar, Earthstar Geographics',
      maxZoom: 19
    }).addTo(window.pmMap);

    pmLabelsLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19
    }).addTo(window.pmMap);

    pmStreetLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; Carto, OpenStreetMap',
      maxZoom: 18
    });

    await loadGISVectors(window.pmMap);
  }

  // 2. Citizen GIS Map
  const citElem = document.getElementById('map-citizen');
  if (citElem && !window.citMap) {
    window.citMap = L.map('map-citizen', {
      center: [15.645, 74.980],
      zoom: 13,
      zoomControl: true
    });

    citSatelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri, Maxar',
      maxZoom: 19
    }).addTo(window.citMap);

    citLabelsLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19
    }).addTo(window.citMap);

    citStreetLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; Carto, OpenStreetMap',
      maxZoom: 18
    });

    await loadGISVectors(window.citMap);

    // Citizen click on map: updates the right-hand panel with that spot's details!
    window.citMap.on('click', (e) => {
      if (typeof handleCitizenMapClick === 'function') {
        handleCitizenMapClick(e.latlng.lat, e.latlng.lng);
      }
    });
  }
}

function setBasemap(style, mapKey) {
  const isPm = mapKey === 'pm';
  const targetMap = isPm ? window.pmMap : window.citMap;
  const satLayer = isPm ? pmSatelliteLayer : citSatelliteLayer;
  const streetLayer = isPm ? pmStreetLayer : citStreetLayer;
  const labelLayer = isPm ? pmLabelsLayer : citLabelsLayer;

  const btnSat = document.getElementById(`btn-satellite-${mapKey}`);
  const btnStreet = document.getElementById(`btn-street-${mapKey}`);

  if (style === 'satellite') {
    if (targetMap.hasLayer(streetLayer)) targetMap.removeLayer(streetLayer);
    if (!targetMap.hasLayer(satLayer)) targetMap.addLayer(satLayer);
    if (!targetMap.hasLayer(labelLayer)) targetMap.addLayer(labelLayer);
    if (btnSat) btnSat.classList.add('active');
    if (btnStreet) btnStreet.classList.remove('active');
    showToast('Switched to High-Resolution Satellite GIS Imagery');
  } else {
    if (targetMap.hasLayer(satLayer)) targetMap.removeLayer(satLayer);
    if (targetMap.hasLayer(labelLayer)) targetMap.removeLayer(labelLayer);
    if (!targetMap.hasLayer(streetLayer)) targetMap.addLayer(streetLayer);
    if (btnSat) btnSat.classList.remove('active');
    if (btnStreet) btnStreet.classList.add('active');
    showToast('Switched to Topographic Street Map');
  }
}

async function loadGISVectors(mapInstance) {
  try {
    // 1. ISRO Bhuvan Land Use Polygons (Green tinted parcels on satellite)
    const resL = await fetch('/api/layers/land_use');
    const geoL = await resL.json();
    L.geoJSON(geoL, {
      style: (feat) => {
        const cat = feat.properties.category || '';
        const isPrime = cat.includes('Prime');
        return {
          color: isPrime ? '#16a34a' : '#eab308',
          weight: 1.5,
          opacity: 0.85,
          fillColor: isPrime ? '#22c55e' : '#facc15',
          fillOpacity: 0.3
        };
      },
      onEachFeature: (feature, layer) => {
        layer.on('click', (e) => {
          if (mapInstance === window.citMap && typeof handleCitizenMapClick === 'function') {
            handleCitizenMapClick(e.latlng.lat, e.latlng.lng);
          }
        });
      }
    }).bindPopup(layer => `<strong>${layer.feature.properties.category}</strong><br>Crop: ${layer.feature.properties.crop_type}<br>Soil: ${layer.feature.properties.soil_type}`).addTo(mapInstance);

    // 2. CWC Flood Inundation Hazard Polygon
    const resF = await fetch('/api/layers/flood_hazard');
    const geoF = await resF.json();
    L.geoJSON(geoF, {
      style: {
        color: '#0284c7',
        weight: 2,
        fillColor: '#38bdf8',
        fillOpacity: 0.35,
        dashArray: '4, 4'
      }
    }).bindPopup(layer => `<strong>⚠️ ${layer.feature.properties.zone_name}</strong><br>Flood Risk: ${layer.feature.properties.risk_level}`).addTo(mapInstance);

    // 3. Route A (Red Direct Line)
    const resA = await fetch('/api/layers/corridor_scenario_a');
    const geoA = await resA.json();
    L.geoJSON(geoA, {
      style: { color: '#ef4444', weight: 5, opacity: 0.95 }
    }).bindPopup("<strong>Route A: Direct Alignment (34.8 km)</strong><br>Cuts through river flood basin and 110 ha of sugarcane fields.").addTo(mapInstance);

    // 4. Route B (Green Shifted Bypass)
    const resB = await fetch('/api/layers/corridor_scenario_b');
    const geoB = await resB.json();
    L.geoJSON(geoB, {
      style: { color: '#22c55e', weight: 5, dashArray: '6, 6', opacity: 0.95 }
    }).bindPopup("<strong>Route B: Shifted Bypass (38.6 km)</strong><br>Runs along dry pediment plateau, sparing agricultural fields and flood plains.").addTo(mapInstance);

    // 5. Settlements (Habitations) - clicking updates citizen right panel!
    const resS = await fetch('/api/layers/settlements');
    const geoS = await resS.json();
    L.geoJSON(geoS, {
      pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
        radius: 8,
        fillColor: '#f59e0b',
        color: '#ffffff',
        weight: 2,
        fillOpacity: 0.95
      }),
      onEachFeature: (feature, layer) => {
        layer.on('click', () => {
          if (mapInstance === window.citMap && typeof onSelectParcel === 'function') {
            const idMap = {
              'VIL-01': 'PARCEL-101',
              'VIL-02': 'PARCEL-102',
              'VIL-03': 'PARCEL-103',
              'VIL-04': 'PARCEL-104',
              'VIL-05': 'PARCEL-105'
            };
            const pId = idMap[feature.properties.settlement_id] || 'PARCEL-101';
            onSelectParcel(pId, false);
          }
        });
      }
    }).bindPopup(layer => `<strong>🏛️ ${layer.feature.properties.name}</strong><br>Population: ${layer.feature.properties.population.toLocaleString()}<br><span style="color:#2e7d32; font-size:11px;">Click to inspect village farm parcels</span>`).addTo(mapInstance);

  } catch (err) {
    console.error('Error loading GIS vectors:', err);
  }
}
