/**
 * BhoomiDrishti - Policymaker Studio Controller
 * Team ThunderBolt
 */

window.currentRoute = 'A';

function selectRoute(routeId) {
  window.currentRoute = routeId;

  const btnA = document.getElementById('btn-route-a');
  const btnB = document.getElementById('btn-route-b');
  const badge = document.getElementById('hud-scenario-badge');

  if (routeId === 'A') {
    btnA.className = 'route-pill active-a';
    btnB.className = 'route-pill';
    if (badge) {
      badge.innerText = 'Analyzing Route A (Direct)';
      badge.style.color = '#b91c1c';
      badge.style.background = '#fef2f2';
    }

    document.getElementById('val-agri').innerText = '138 ha';
    document.getElementById('diff-agri').innerText = 'High loss (110 ha prime)';
    document.getElementById('diff-agri').className = 'hud-sub text-alert';

    document.getElementById('val-flood').innerText = '95 ha';
    document.getElementById('diff-flood').innerText = '25-Yr Malaprabha Inundation';
    document.getElementById('diff-flood').className = 'hud-sub text-alert';

    document.getElementById('val-homes').innerText = '~42 Families';
    document.getElementById('diff-homes').innerText = 'MK Hubballi & Deshnur';

    document.getElementById('decision-tradeoff-text').innerText = 
      'Route A is direct (34.8 km), but destroys 110 ha of fertile sugarcane/paddy fields and cuts through the Malaprabha flood retention plain.';

    showToast('Loaded Route A: Direct Valley Alignment');
  } else {
    btnA.className = 'route-pill';
    btnB.className = 'route-pill active-b';
    if (badge) {
      badge.innerText = 'Analyzing Route B (Northern Bypass)';
      badge.style.color = '#15803d';
      badge.style.background = '#f0fdf4';
    }

    document.getElementById('val-agri').innerText = '27 ha';
    document.getElementById('diff-agri').innerText = '✓ Saves 111 ha Farmland!';
    document.getElementById('diff-agri').className = 'hud-sub text-success';

    document.getElementById('val-flood').innerText = '0 ha';
    document.getElementById('diff-flood').innerText = '✓ Zero Flood Exposure';
    document.getElementById('diff-flood').className = 'hud-sub text-success';

    document.getElementById('val-homes').innerText = '~8 Families';
    document.getElementById('diff-homes').innerText = '✓ Bypasses settlement cores';

    document.getElementById('decision-tradeoff-text').innerText = 
      'Route B is 3.8 km longer (+₹38 Cr civil cost), but protects 111 ha of fertile paddy and completely avoids the Malaprabha river flood zone.';

    showToast('Loaded Route B: Northern Eco-Bypass Alignment');
  }

  // Update passport content dynamically
  if (typeof renderPassportContent === 'function') {
    renderPassportContent();
  }
}
