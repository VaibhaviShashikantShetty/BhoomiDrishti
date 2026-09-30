/**
 * BhoomiDrishti — Team ThunderBolt
 * App Initialization, 2-Second Slow Reveal Splash, and Role & Sub-Tab Switcher
 */

window.currentRole = 'policymaker';

document.addEventListener('DOMContentLoaded', () => {
  // 1. 2-Second Slow Reveal Loading Screen
  setTimeout(() => {
    const splash = document.getElementById('splash-screen');
    if (splash) {
      splash.classList.add('fade-out');
    }
  }, 2000);

  // 2. Initialize default maps, simulation, and data
  initMaps();
  loadResearcherCards();
  loadCitizenMiniFeed();
  if (typeof onSimParamChange === 'function') {
    onSimParamChange();
  }
  if (typeof runDatasetCorrelation === 'function') {
    runDatasetCorrelation();
  }
  if (typeof initCitizenParcelInspector === 'function') {
    initCitizenParcelInspector();
  }
});

function switchUserRole(role) {
  window.currentRole = role;

  // Update top role pills
  document.querySelectorAll('.role-pill').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-role') === role);
  });

  // Switch role section
  document.querySelectorAll('.role-view').forEach(view => {
    view.classList.remove('active');
  });

  const target = document.getElementById(`view-${role}`);
  if (target) {
    target.classList.add('active');
  }

  // Refresh maps
  setTimeout(() => {
    if (role === 'policymaker' && window.pmMap) window.pmMap.invalidateSize();
    if (role === 'citizen' && window.citMap) window.citMap.invalidateSize();
  }, 100);

  showToast(`Operating as: ${role === 'policymaker' ? 'Policymaker' : role === 'researcher' ? 'Researcher' : 'Citizen & Farmer'}`);
}

function switchSubTab(role, tabId, btnElement) {
  const roleSection = document.getElementById(`view-${role}`);
  if (!roleSection) return;

  // Update rail buttons
  roleSection.querySelectorAll('.rail-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  if (btnElement) {
    btnElement.classList.add('active');
  } else {
    const matchingBtn = roleSection.querySelector(`.rail-btn[data-target="${tabId}"]`);
    if (matchingBtn) matchingBtn.classList.add('active');
  }

  // Update tab panes
  roleSection.querySelectorAll('.sub-view-pane').forEach(pane => {
    pane.classList.remove('active');
  });

  const targetPane = document.getElementById(tabId);
  if (targetPane) {
    targetPane.classList.add('active');
  }

  // Invalidate map size if switching back to map tab
  setTimeout(() => {
    if (tabId === 'pm-tab-routes' && window.pmMap) window.pmMap.invalidateSize();
    if (tabId === 'cit-tab-land' && window.citMap) window.citMap.invalidateSize();
    if (tabId === 'pm-tab-passport' && typeof renderPassportContent === 'function') {
      renderPassportContent();
    }
  }, 80);
}

function showToast(msg) {
  const box = document.getElementById('toast-box');
  if (!box) return;

  const t = document.createElement('div');
  t.className = 'clean-toast';
  t.innerText = msg;
  box.appendChild(t);

  setTimeout(() => {
    t.style.opacity = '0';
    setTimeout(() => t.remove(), 300);
  }, 3200);
}
