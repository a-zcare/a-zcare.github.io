(() => {
  const history = [];
  let internalNavigation = false;

  function pushHistory(name) {
    if (internalNavigation && name && history[history.length - 1] !== name) history.push(name);
  }

  document.addEventListener('click', e => {
    const app = e.target.closest('[data-app]');
    const tab = e.target.closest('.phone-tab');
    const back = e.target.closest('[data-back]');
    if (app && window.currentPhoneScreen) {
      history.push(window.currentPhoneScreen);
      internalNavigation = false;
    }
    if (tab) history.length = 0;
    if (back) {
      e.preventDefault(); e.stopImmediatePropagation();
      const previous = history.pop() || 'home';
      if (typeof window.showPhoneScreen === 'function') window.showPhoneScreen(previous, !['home','protect','location','ai'].includes(previous));
    }
  }, true);

  function deviceScreen() {
    return `
      <div class="phone-subhead"><button data-back>‹</button><div><small>MY PHONE</small><h3>A-Z Care Phone 1</h3></div></div>
      <div class="device-spec-list">
        <div><span>Platform</span><strong>Snapdragon 7-series</strong></div><div><span>Memory</span><strong>12 GB · 256 GB</strong></div><div><span>Display</span><strong>AMOLED · 120 Hz</strong></div><div><span>Battery</span><strong>6200–6500 mAh</strong></div><div><span>Network</span><strong>5G · eSIM · NFC</strong></div><div><span>Protection</span><strong>IP68 · SOS button</strong></div>
      </div>
      <div class="phone-label">PRIVACY CONTROLS</div>
      <div class="device-controls">
        <div class="device-toggle"><span>Microphone access</span><button class="on" data-device-toggle aria-label="Toggle microphone"></button></div>
        <div class="device-toggle"><span>Camera access</span><button class="on" data-device-toggle aria-label="Toggle camera"></button></div>
        <div class="device-toggle"><span>Location access</span><button class="on" data-device-toggle aria-label="Toggle location"></button></div>
        <div class="device-toggle"><span>Family sharing</span><button class="on" data-device-toggle aria-label="Toggle family sharing"></button></div>
      </div>
      <a class="phone-link" href="hardware.html">Full specifications →</a>`;
  }

  function patchPhone() {
    if (!window.phoneScreens || typeof window.showPhoneScreen !== 'function') return;
    const originalShow = window.showPhoneScreen;
    window.phoneScreens.device = deviceScreen();
    window.phoneScreens.home = window.phoneScreens.home.replace(
      '<button class="phone-sos" data-app="sosphone">SOS · Emergency</button>',
      '<button class="phone-device-card" data-app="device"><span><b class="device-icon">▣</b><span><strong>Device</strong><small>12 GB · 256 GB · 5G · AMOLED 120 Hz</small></span><b>›</b></span></button><button class="phone-sos" data-app="sosphone">SOS · Emergency</button>'
    );
    window.phoneScreens.location = window.phoneScreens.location
      .replace('<span class="map-pin a">A</span><span class="map-pin m">M</span>','<span class="map-pin a">M</span><span class="map-pin m">G</span>')
      .replace('<div class="phone-mini-actions"><button data-app="safezones">Safe zones</button><button data-app="imok">I\'m OK</button></div>','<div class="phone-mini-actions"><button data-app="safezones">Safe zones</button><button data-app="sharelocation">Share location</button></div>');
    window.phoneScreens.lost = `
      <div class="phone-subhead"><button data-back>‹</button><div><small>FIND ME</small><h3>I'm lost</h3></div></div>
      <div class="location-card"><span>⌖</span><strong>Your current location</strong><p id="liveLocationText">Location available for demo</p></div>
      <button class="phone-wide-action good" data-location-action="navigate">Navigate home</button><button class="phone-wide-action" data-app="contacts">☎ Call family</button><button class="phone-wide-action" data-location-action="share">Share location</button><div class="location-action-status" id="locationActionStatus"></div>`;
    window.phoneScreens.sharelocation = `
      <div class="phone-subhead"><button data-back>‹</button><div><small>LOCATION SHARING</small><h3>Share location</h3></div></div>
      <div class="location-card"><span>⌖</span><strong>Share with family</strong><p>Send your current location to Mom and Grandma.</p></div><button class="phone-wide-action good" data-location-action="share">Share now</button><div class="location-action-status" id="locationActionStatus"></div>`;

    window.showPhoneScreen = function(name, keepTab = false) {
      pushHistory(window.currentPhoneScreen);
      internalNavigation = false;
      originalShow(name, keepTab);
      window.currentPhoneScreen = name;
      bindExtras();
    };
    window.currentPhoneScreen = 'home';
    window.showPhoneScreen('home');
  }

  function bindExtras() {
    document.querySelectorAll('[data-device-toggle]').forEach(btn => btn.onclick = () => btn.classList.toggle('on'));
    document.querySelectorAll('[data-location-action]').forEach(btn => btn.onclick = () => {
      const status = document.getElementById('locationActionStatus');
      if (btn.dataset.locationAction === 'share') {
        if (navigator.share) navigator.share({title:'A-Z Care location', text:'I am sharing my location with you.'}).catch(()=>{});
        if (status) status.textContent = 'Location ready to share with trusted family ✓';
      } else {
        if (status) status.textContent = 'Home route ready · navigation demo ✓';
      }
    });
  }

  function compactLanding() {
    const ai = document.getElementById('ai'); if (ai) ai.remove();
    const scam = document.getElementById('scam'); if (scam) scam.remove();
    const sos = document.getElementById('sos'); if (sos) sos.innerHTML = '<div class="container"><div class="mini-sos reveal"><div class="compact-icon danger">SOS</div><div><h3>Emergency SOS</h3><p>One clear emergency action. The full flow lives inside the interactive phone.</p></div><button class="button primary" data-phone-screen="home" data-open-sos>Try SOS</button></div></div>';
    const overview = document.getElementById('overview');
    if (overview) overview.innerHTML = `<div class="container"><div class="compact-heading reveal"><p class="eyebrow">WHAT IT DOES</p><h2>One phone. Four safety layers.</h2><p>The main product experience lives in the interactive phone above.</p></div><div class="compact-grid"><article class="compact-card reveal"><div class="compact-icon">◇</div><h3>Protect</h3><p>Check messages, links and callers before acting.</p></article><article class="compact-card reveal"><div class="compact-icon">✦</div><h3>AI Care</h3><p>Explain risk in simple language and suggest safer next steps.</p></article><article class="compact-card reveal"><div class="compact-icon danger">SOS</div><h3>SOS</h3><p>Reach trusted people and share emergency status quickly.</p></article><article class="compact-card reveal"><div class="compact-icon">⌖</div><h3>Family</h3><p>Consent-based location, safe zones and device status.</p></article></div></div>`;
    const modes = document.getElementById('modes');
    if (modes) modes.innerHTML = `<div class="container"><div class="compact-heading reveal"><p class="eyebrow">WHO IT'S FOR</p><h2>Different people. Different risks.</h2></div><div class="compact-grid audience-grid"><article class="compact-card reveal"><div class="compact-icon">K</div><h3>Kids</h3><p>Safer communication, location and simple protection without overwhelming controls.</p></article><article class="compact-card reveal"><div class="compact-icon">S</div><h3>Seniors</h3><p>Clear warnings, trusted contacts and understandable emergency actions.</p></article><article class="compact-card reveal"><div class="compact-icon">F</div><h3>Families</h3><p>Stay connected with consent-based safety tools instead of hidden tracking.</p></article></div></div>`;
    const privacy = document.getElementById('privacy');
    if (privacy) privacy.innerHTML = `<div class="container"><div class="compact-heading reveal"><p class="eyebrow">PRIVACY</p><h2>Safety without surveillance.</h2></div><div class="principles"><div class="principle"><strong>Visible controls</strong><span>Camera, microphone, location and sharing stay understandable and controllable.</span></div><div class="principle"><strong>Consent first</strong><span>Family features are designed around explicit sharing, not hidden tracking.</span></div><div class="principle"><strong>Minimum necessary data</strong><span>Collect only what a safety feature actually needs.</span></div></div></div>`;
    const roadmap = document.getElementById('roadmap');
    if (roadmap) roadmap.innerHTML = `<div class="container"><div class="compact-heading reveal"><p class="eyebrow">ROADMAP</p><h2>From concept to tested prototype.</h2></div><div class="roadmap-short"><div><small>01</small><strong>Concept</strong><span>Product direction and interactive experience.</span></div><div><small>02</small><strong>Prototype</strong><span>Android safety flows and hardware platform.</span></div><div><small>03</small><strong>Testing</strong><span>Real users, safety validation and iteration.</span></div></div></div>`;
    document.querySelectorAll('.desktop-nav a[href="#ai"],.desktop-nav a[href="#sos"]').forEach(a => a.remove());
    const survey = document.getElementById('survey'); if (survey) survey.classList.add('compact-section');
    document.querySelector('[data-open-sos]')?.addEventListener('click', () => window.showPhoneScreen?.('sosphone', true));
  }

  window.addEventListener('DOMContentLoaded', () => { compactLanding(); patchPhone(); });
})();
