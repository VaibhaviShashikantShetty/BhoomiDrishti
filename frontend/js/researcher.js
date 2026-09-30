/**
 * BhoomiDrishti - Researcher Evidence & Cross-Dataset Analytics Controller
 * Team ThunderBolt
 */

async function loadResearcherCards(query = '') {
  const container = document.getElementById('research-card-container');
  if (!container) return;

  try {
    const url = query ? `/api/research/findings?query=${encodeURIComponent(query)}` : '/api/research/findings';
    const res = await fetch(url);
    const list = await res.json();

    if (list.length === 0) {
      container.innerHTML = '<p style="color:#6b7280; font-size:12px; padding:10px;">No matching research papers found. Try another search term.</p>';
      return;
    }

    container.innerHTML = list.slice(0, 4).map(item => `
      <div class="clean-res-card">
        <div class="clean-res-title">📄 ${item.title}</div>
        <div class="clean-res-author">By ${item.author} (${item.publication_year}) • ${item.institution}</div>
        <div class="clean-res-finding">
          <strong>Key Evidence:</strong> "${item.finding_statement}"
        </div>
        <div style="font-size:11px; color:#4b5563; margin-top:2px;">
          <strong>Actionable Policy Takeaway:</strong> ${item.policy_implications}
        </div>
        <div style="font-size:10px; color:#6b7280; margin-top:2px;">
          <em>Dataset Used: ${item.dataset_used} • Geography: ${item.geography}</em>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Failed to load research papers:', err);
  }
}

function doSearchResearch() {
  const q = document.getElementById('research-search-box').value.trim();
  showToast(q ? `Searching evidence for: "${q}"...` : 'Showing all evidence...');
  loadResearcherCards(q);
}

// ----------------- CROSS-DATASET CORRELATION TOOL -----------------
async function runDatasetCorrelation() {
  const layerA = document.getElementById('corr-layer-a').value;
  const layerB = document.getElementById('corr-layer-b').value;
  const container = document.getElementById('corr-results-container');
  if (!container) return;

  container.innerHTML = '<p style="color:#6b7280; font-size:12px;">Computing spatial co-occurrence, intersection polygons, and Jaccard similarity index...</p>';

  try {
    const res = await fetch('/api/research/cross-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ layer_a: layerA, layer_b: layerB })
    });

    if (!res.ok) throw new Error('Analysis calculation failed');
    const data = await res.json();

    const layerLabels = {
      'land_use': 'Agricultural LULC Parcels',
      'flood_hazard': 'CWC Flood Hazard Contour',
      'settlements': 'Habitations & Settlements',
      'scenario_a': 'Route A Corridor Alignment',
      'scenario_b': 'Route B Corridor Alignment'
    };

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e6e2d8; padding-bottom:8px;">
        <span style="font-size:12px; font-weight:700; color:#1f2937;">
          Spatial Correlation: ${layerLabels[data.layer_a] || data.layer_a} ∩ ${layerLabels[data.layer_b] || data.layer_b}
        </span>
        <span class="tag-emerald">EPSG:32643 Metric Intersection</span>
      </div>

      <div class="corr-metrics-row">
        <div class="corr-metric-chip">
          <span class="corr-metric-label">Jaccard Overlap Index</span>
          <span class="corr-metric-val">${data.jaccard_spatial_index}</span>
        </div>
        <div class="corr-metric-chip">
          <span class="corr-metric-label">Coincident Area</span>
          <span class="corr-metric-val">${data.total_coincident_area_ha} ha</span>
        </div>
        <div class="corr-metric-chip">
          <span class="corr-metric-label">Intersecting Pairs</span>
          <span class="corr-metric-val">${data.intersecting_feature_pairs}</span>
        </div>
      </div>

      <div class="corr-implication-card">
        <strong>Empirical Policy Implication:</strong><br>
        ${data.policy_implication}
      </div>
    `;

    showToast(`Cross-Analysis Complete: ${data.total_coincident_area_ha} ha overlap detected.`);
  } catch (err) {
    container.innerHTML = `<p style="color:#dc2626; font-size:12px;">Failed to compute correlation: ${err.message}</p>`;
  }
}

async function handleQuickPublish(e) {
  e.preventDefault();

  const payload = {
    title: document.getElementById('pub-title').value.trim(),
    finding_statement: document.getElementById('pub-statement').value.trim(),
    author: document.getElementById('pub-author').value.trim(),
    institution: "Indian Academic Network",
    geography: "Malaprabha Basin, Karnataka",
    methodology: "In-situ hydraulic monitoring and satellite validation",
    dataset_used: document.getElementById('pub-dataset').value.trim() || "Bhuvan LULC & Ground Water Board",
    publication_year: 2026,
    policy_implications: document.getElementById('pub-policy').value.trim(),
    limitations: "Cadastral field boundaries subject to joint survey verification."
  };

  try {
    const res = await fetch('/api/research/findings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      showToast('✓ Research published! Now discoverable by government policymakers in decision studio.');
      document.getElementById('simple-publish-form').reset();
      loadResearcherCards();
      if (typeof switchSubTab === 'function') {
        switchSubTab('researcher', 'res-tab-explore');
      }
    }
  } catch (err) {
    showToast('Failed to publish research: ' + err.message);
  }
}
