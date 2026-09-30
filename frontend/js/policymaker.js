/**
 * BhoomiDrishti - Policymaker Simulation & Impact Studio Controller
 * Team ThunderBolt
 */

window.currentRoute = 'A';
window.simBufferLayer = null;

// Baseline simulation state
window.currentSimState = {
  buffer_meters: 60,
  viaduct_percentage: 0,
  floodplain_setback_meters: 0,
  compensation_multiplier: 2.0
};

function selectRoute(routeId) {
  window.currentRoute = routeId;

  const btnA = document.getElementById('btn-route-a');
  const btnB = document.getElementById('btn-route-b');
  const badge = document.getElementById('hud-scenario-badge');

  if (routeId === 'A') {
    if (btnA) btnA.className = 'route-pill active-a';
    if (btnB) btnB.className = 'route-pill';
    if (badge) {
      badge.innerText = 'Analyzing Route A (Direct)';
      badge.style.color = '#b91c1c';
      badge.style.background = '#fef2f2';
    }
    showToast('Switched to Route A: Direct Valley Alignment');
  } else {
    if (btnA) btnA.className = 'route-pill';
    if (btnB) btnB.className = 'route-pill active-b';
    if (badge) {
      badge.innerText = 'Analyzing Route B (Northern Bypass)';
      badge.style.color = '#15803d';
      badge.style.background = '#f0fdf4';
    }
    showToast('Switched to Route B: Northern Eco-Bypass Alignment');
  }

  // Trigger live simulation calculation with current slider values
  onSimParamChange();

  // Focus map view on selected route
  if (window.pmMap) {
    if (routeId === 'A') {
      window.pmMap.flyTo([15.655, 74.985], 12, { duration: 0.8 });
    } else {
      window.pmMap.flyTo([15.695, 74.995], 12, { duration: 0.8 });
    }
  }
}

let simDebounceTimer = null;

function onSimParamChange() {
  const bufElem = document.getElementById('sim-buffer');
  const viaElem = document.getElementById('sim-viaduct');
  const setElem = document.getElementById('sim-setback');
  const compElem = document.getElementById('sim-comp');

  if (!bufElem) return;

  const buffer_meters = parseFloat(bufElem.value);
  const viaduct_percentage = parseFloat(viaElem.value);
  const floodplain_setback_meters = parseFloat(setElem.value);
  const compensation_multiplier = parseFloat(compElem.value);

  // Update visual slider tags
  document.getElementById('disp-buffer-val').innerText = `${buffer_meters} m`;
  document.getElementById('disp-viaduct-val').innerText = `${viaduct_percentage} %`;
  document.getElementById('disp-setback-val').innerText = `${floodplain_setback_meters} m`;
  document.getElementById('disp-comp-val').innerText = `${compensation_multiplier.toFixed(1)} x Circle Rate`;

  window.currentSimState = {
    buffer_meters,
    viaduct_percentage,
    floodplain_setback_meters,
    compensation_multiplier
  };

  // Debounce API call for smooth slider dragging
  clearTimeout(simDebounceTimer);
  simDebounceTimer = setTimeout(() => {
    executeSimulationApi();
  }, 80);
}

async function executeSimulationApi() {
  const payload = {
    scenario_id: window.currentRoute,
    buffer_meters: window.currentSimState.buffer_meters,
    viaduct_percentage: window.currentSimState.viaduct_percentage,
    floodplain_setback_meters: window.currentSimState.floodplain_setback_meters,
    compensation_multiplier: window.currentSimState.compensation_multiplier
  };

  try {
    const res = await fetch('/api/spatial/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error('Simulation failed');
    const data = await res.json();

    // Store in global window for Decision Passport integration
    window.lastSimulatedAnalysis = data;

    // 1. Update Farmland indicator
    const agriTotal = data.agricultural_area_affected_ha;
    const agriPrime = data.agri_breakdown ? data.agri_breakdown.prime_irrigated_ha : 0;
    const agriVal = document.getElementById('val-agri');
    const agriSub = document.getElementById('diff-agri');
    if (agriVal) agriVal.innerText = `${agriTotal.toFixed(1)} ha`;
    if (agriSub) {
      if (agriTotal < 40) {
        agriSub.innerText = `✓ Spares fertile soil (${agriPrime} ha prime)`;
        agriSub.className = 'hud-sub text-success';
      } else {
        agriSub.innerText = `Severe loss (${agriPrime} ha prime)`;
        agriSub.className = 'hud-sub text-alert';
      }
    }

    // 2. Update Flood Hazard indicator
    const floodTotal = data.flood_sensitive_area_ha;
    const floodVal = document.getElementById('val-flood');
    const floodSub = document.getElementById('diff-flood');
    if (floodVal) {
      floodVal.innerText = `${floodTotal.toFixed(1)} ha`;
      floodVal.className = floodTotal === 0 ? 'hud-val text-success' : 'hud-val text-alert';
    }
    if (floodSub) {
      if (floodTotal === 0) {
        floodSub.innerText = '✓ Zero Inundation Exposure';
        floodSub.className = 'hud-sub text-success';
      } else {
        floodSub.innerText = `${data.flood_risk_level || 'Moderate'} Hazard`;
        floodSub.className = 'hud-sub text-alert';
      }
    }

    // 3. Update Displaced Families
    const homesVal = document.getElementById('val-homes');
    const homesSub = document.getElementById('diff-homes');
    if (homesVal) homesVal.innerText = `~${data.projected_households_displaced} Families`;
    if (homesSub) homesSub.innerText = `${data.settlements_affected_count} Settlements Influenced`;

    // 4. Update Financial Outlay
    const fin = data.financial_estimates || {};
    const costVal = document.getElementById('val-total-cost');
    const costSub = document.getElementById('diff-cost');
    if (costVal) costVal.innerText = `₹ ${fin.total_estimated_cost_cr} Cr`;
    if (costSub) costSub.innerText = `Land: ₹${fin.land_acquisition_cr}Cr | Civil: ₹${fin.base_civil_construction_cr}Cr`;

    // 5. Update Composite Risk Score
    const riskVal = document.getElementById('val-risk-score');
    const riskSub = document.getElementById('diff-risk');
    if (riskVal) riskVal.innerText = `${data.composite_risk_score} / 100`;
    if (riskSub) {
      if (data.composite_risk_score < 40) {
        riskSub.innerText = '✓ Low Ecological Disruption';
        riskSub.className = 'hud-sub text-success';
      } else if (data.composite_risk_score < 70) {
        riskSub.innerText = 'Moderate Risk';
        riskSub.className = 'hud-sub';
      } else {
        riskSub.innerText = 'High Risk';
        riskSub.className = 'hud-sub text-alert';
      }
    }

    // 6. Dynamic Decision Trade-off Narrative
    const tradeNarrative = document.getElementById('decision-tradeoff-text');
    if (tradeNarrative) {
      if (window.currentRoute === 'A') {
        let msg = `Route A (Direct 34.8 km): Requires ${data.total_acquisition_ha} ha corridor. `;
        if (window.currentSimState.viaduct_percentage > 0) {
          msg += `Integrating ${window.currentSimState.viaduct_percentage}% viaduct spans maintains canal connectivity below pillars (+₹${fin.flood_mitigation_cr} Cr mitigation). `;
        }
        if (window.currentSimState.floodplain_setback_meters > 0) {
          msg += `A ${window.currentSimState.floodplain_setback_meters}m setback reduces flood inundation to ${floodTotal} ha. `;
        } else {
          msg += `Without setback, 95 ha of active Malaprabha floodplain is traversed. `;
        }
        tradeNarrative.innerText = msg;
      } else {
        tradeNarrative.innerText = 
          `Route B (Northern Bypass 38.6 km): Traverses dry plateau scrubland, acquiring ${agriTotal} ha agricultural land and 0 ha flood zone. Total outlay: ₹${fin.total_estimated_cost_cr} Cr.`;
      }
    }

    // 7. Redraw dynamic corridor buffer on Leaflet Map
    if (window.pmMap && data.buffered_geometry_geojson) {
      if (window.simBufferLayer) {
        window.pmMap.removeLayer(window.simBufferLayer);
      }

      window.simBufferLayer = L.geoJSON(data.buffered_geometry_geojson, {
        style: {
          color: window.currentRoute === 'A' ? '#ef4444' : '#22c55e',
          weight: 1.5,
          opacity: 0.8,
          fillColor: window.currentRoute === 'A' ? '#f87171' : '#4ade80',
          fillOpacity: 0.25,
          dashArray: '3, 3'
        }
      }).addTo(window.pmMap);
    }

    // Update passport preview if open
    if (typeof renderPassportContent === 'function') {
      renderPassportContent();
    }

  } catch (err) {
    console.error('Error during simulation calculation:', err);
  }
}

function resetSimulationParameters() {
  const bufElem = document.getElementById('sim-buffer');
  const viaElem = document.getElementById('sim-viaduct');
  const setElem = document.getElementById('sim-setback');
  const compElem = document.getElementById('sim-comp');

  if (bufElem) bufElem.value = 60;
  if (viaElem) viaElem.value = 0;
  if (setElem) setElem.value = 0;
  if (compElem) compElem.value = 2.0;

  onSimParamChange();
  showToast('Simulation parameters reset to baseline statutory defaults.');
}
