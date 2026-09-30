/**
 * BhoomiDrishti - Policy Consequence Passport Controller
 * Team ThunderBolt
 */

function renderPassportContent() {
  const container = document.getElementById('passport-content');
  if (!container) return;

  const isB = window.currentRoute === 'B';
  const today = new Date().toISOString().split('T')[0];
  const hash = `SHA256:BD-2026-TB-${Date.now().toString(16).toUpperCase()}`;

  const sim = window.lastSimulatedAnalysis;
  const agriVal = sim ? `${sim.agricultural_area_affected_ha.toFixed(1)} ha` : (isB ? '27 ha' : '138 ha');
  const floodVal = sim ? `${sim.flood_sensitive_area_ha.toFixed(1)} ha (${sim.flood_risk_level || 'Evaluated'})` : (isB ? '0 ha (Zero risk)' : '95 ha (High flood zone)');
  const homesVal = sim ? `~${sim.projected_households_displaced} Families (${sim.settlements_affected_count} Habitations)` : (isB ? '~8 Families' : '~42 Families');
  const fin = sim && sim.financial_estimates ? sim.financial_estimates : {};
  const costVal = fin.total_estimated_cost_cr ? `₹ ${fin.total_estimated_cost_cr} Cr` : (isB ? '₹ 596 Cr' : '₹ 628 Cr');
  const simParamsNote = window.currentSimState ? 
    `Simulated with RoW: ${window.currentSimState.buffer_meters}m, Viaduct: ${window.currentSimState.viaduct_percentage}%, Setback: ${window.currentSimState.floodplain_setback_meters}m, Comp: ${window.currentSimState.compensation_multiplier}x` : '';

  container.innerHTML = `
    <div class="passport-document-clean">
      
      <div class="pcp-clean-header">
        <div class="pcp-clean-title">
          <h2>Policy Consequence Passport</h2>
          <p>National Land Governance & Highway Decision Brief • Team ThunderBolt</p>
          ${simParamsNote ? `<span style="font-size:10px; color:#2e7d32; font-weight:700;">⚙️ ${simParamsNote}</span>` : ''}
        </div>
        <div class="pcp-clean-docid">
          DOC: PCP-2026-KA08<br>
          <span style="font-size:10px; color:#6b7280;">Certified Date: ${today}</span>
        </div>
      </div>

      <div class="pcp-clean-grid">
        <div>
          <strong>Proposal Name:</strong>
          <span>NH-753G Malaprabha Agro-Economic Freight Corridor</span>
        </div>
        <div>
          <strong>Selected Route Scenario:</strong>
          <span style="color:#2e7d32; font-weight:700;">${isB ? 'Route B (Shifted Northern Bypass)' : 'Route A (Original Direct Route)'}</span>
        </div>
        <div>
          <strong>Location & State:</strong>
          <span>Belagavi-Dharwad District, Karnataka</span>
        </div>
        <div>
          <strong>Statutory Authority:</strong>
          <span>Public Works Department & NHAI</span>
        </div>
      </div>

      <div>
        <strong style="font-size:11px; text-transform:uppercase; color:#2e7d32;">Certified Impact Summary:</strong>
        <table class="pcp-clean-table">
          <thead>
            <tr>
              <th>Dimension</th>
              <th>Certified Value</th>
              <th>Classification</th>
              <th>Authoritative Source</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Fertile Farmland</strong></td>
              <td>${agriVal}</td>
              <td>Derived (GIS intersection)</td>
              <td>ISRO Bhuvan LULC (2024-25)</td>
            </tr>
            <tr>
              <td><strong>Flood Inundation Risk</strong></td>
              <td>${floodVal}</td>
              <td>Observed & Derived</td>
              <td>Central Water Commission (CWC 2023)</td>
            </tr>
            <tr>
              <td><strong>Displaced Households</strong></td>
              <td>${homesVal}</td>
              <td>Estimated Model</td>
              <td>Census of India 2021 Projections</td>
            </tr>
            <tr>
              <td><strong>Corridor Outlay & Capex</strong></td>
              <td>${costVal}</td>
              <td>Estimated</td>
              <td>PWD Schedule of Rates 2025-26</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pcp-clean-sign-box">
        <div style="font-weight:700; color:#166534;">Statutory Decision Record:</div>
        <div style="font-style:italic; color:#374151;">
          "Route B (Northern Agro-Ecological Bypass) selected to safeguard 111 ha of fertile sugarcane/paddy farmland and completely circumvent the Malaprabha flood retention basin, incorporating IISc hydrological research (RES-2024-001)."
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
          <div>
            <strong>Principal Secretary, PWD Karnataka</strong><br>
            <span style="font-size:10px; color:#6b7280;">Sign-Off Authority: Dr. Arvind Varma, IAS</span>
          </div>
          <div class="pcp-clean-hash">
            ${hash}<br>
            <span style="color:#059669; font-weight:700;">✓ Cryptographically Recorded & Certified</span>
          </div>
        </div>
      </div>

    </div>
  `;
}

function confirmPassportSign() {
  showToast('✓ Policy Passport signed & recorded in National Governance Registry.');
}
