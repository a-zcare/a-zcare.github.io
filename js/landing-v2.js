(() => {
  const view = () => document.getElementById('phoneView');
  const mainTabs = new Set(['home', 'protect', 'location', 'ai']);
  const history = [];
  let current = 'home';

  const toggleRow = (label, note, on = true) => `
    <div class="settings-toggle-row">
      <div><strong>${label}</strong><small>${note}</small></div>
      <button class="settings-toggle${on ? ' on' : ''}" data-setting-toggle aria-label="Toggle ${label}"></button>
    </div>`;

  const menuRow = (icon, title, note, target) => `
    <button class="device-menu-row" data-addon-screen="${target}">
      <span class="device-menu-icon">${icon}</span>
      <span><strong>${title}</strong><small>${note}</small></span>
      <b>›</b>
    </button>`;

  function renderAddon(name) {
    const phone = view();
    if (!phone) return;
    current = name;
    document.querySelectorAll('.phone-tab').forEach(t => t.classList.remove('active'));

    if (name === 'device') {
      phone.innerHTML = `
        <div class="phone-subhead"><button data-addon-back>‹</button><div><small>DEVICE & SETTINGS</small><h3>A-Z Care Phone</h3></div></div>
        <div class="device-hero-card"><div class="device-hero-icon">▣</div><div><strong>Connected · Protected</strong><small>12 GB · 256 GB · 5G</small></div><span>✓</span></div>
        <div class="device-menu-list">
          ${menuRow('i','Device information','Model, memory and security','deviceinfo')}
          ${menuRow('◉','Privacy & permissions','Camera, microphone and location','privacysettings')}
          ${menuRow('⌁','Connectivity','5G, Wi-Fi, Bluetooth and NFC','connectivity')}
          ${menuRow('ϟ','Battery','Battery health and charging','batterysettings')}
        </div>
        <a class="phone-link" href="hardware.html">Full hardware specifications →</a>`;
    }

    if (name === 'deviceinfo') {
      phone.innerHTML = `
        <div class="phone-subhead"><button data-addon-back>‹</button><div><small>DEVICE</small><h3>Device information</h3></div></div>
        <div class="settings-list">
          <div><span>Device</span><strong>A-Z Care Phone</strong></div>
          <div><span>Memory</span><strong>12 GB RAM</strong></div>
          <div><span>Storage</span><strong>256 GB</strong></div>
          <div><span>System</span><strong>Android</strong></div>
          <div><span>Security</span><strong class="safe-text">Protected ✓</strong></div>
        </div>
        <a class="phone-link" href="hardware.html">Full specifications →</a>`;
    }

    if (name === 'privacysettings') {
      phone.innerHTML = `
        <div class="phone-subhead"><button data-addon-back>‹</button><div><small>PRIVACY</small><h3>Permissions</h3></div></div>
        <div class="privacy-summary"><strong>4 permissions active</strong><small>You stay in control of sensitive access.</small></div>
        <div class="settings-toggle-list">
          ${toggleRow('Microphone','Allowed when a feature needs it')}
          ${toggleRow('Camera','Allowed when a feature needs it')}
          ${toggleRow('Location','Used for safety and navigation')}
          ${toggleRow('Family location','Shared only with trusted family')}
        </div>`;
    }

    if (name === 'connectivity') {
      phone.innerHTML = `
        <div class="phone-subhead"><button data-addon-back>‹</button><div><small>DEVICE</small><h3>Connectivity</h3></div></div>
        <div class="settings-list">
          <div><span>Mobile network</span><strong>5G</strong></div>
          <div><span>Wi-Fi</span><strong>Connected</strong></div>
        </div>
        <div class="settings-toggle-list compact-toggles">
          ${toggleRow('Bluetooth','Nearby accessories')}
          ${toggleRow('NFC','Contactless payments')}
        </div>
        <button class="phone-wide-action">SIM & eSIM settings</button>`;
    }

    if (name === 'batterysettings') {
      phone.innerHTML = `
        <div class="phone-subhead"><button data-addon-back>‹</button><div><small>DEVICE</small><h3>Battery</h3></div></div>
        <div class="battery-summary"><strong>82%</strong><span>Battery health · Good</span></div>
        <div class="settings-toggle-list">
          ${toggleRow('Charge limit: 80%','Helps reduce long-term battery wear')}
          ${toggleRow('Adaptive charging','Learns your charging routine')}
        </div>`;
    }

    if (name === 'sharelocation') {
      phone.innerHTML = `
        <div class="phone-subhead"><button data-addon-back>‹</button><div><small>LOCATION SHARING</small><h3>Share location</h3></div></div>
        <div class="location-card"><span>⌖</span><strong>Share with family</strong><p>Send your current location to Mom and Grandma.</p></div>
        <button class="phone-wide-action good" data-location-action="share">Share now</button>
        <div class="location-action-status" id="locationActionStatus"></div>`;
    }

    if (name === 'navigate') {
      phone.innerHTML = `
        <div class="phone-subhead"><button data-addon-back>‹</button><div><small>NAVIGATION</small><h3>Navigate home</h3></div></div>
        <div class="location-card"><span>⌖</span><strong>Home route</strong><p>Navigation demo is ready. A production device would open the selected maps provider.</p></div>
        <button class="phone-wide-action good" data-location-action="navigate">Start route</button>
        <div class="location-action-status" id="locationActionStatus"></div>`;
    }

    bindAddonControls();
  }

  function goBack() {
    const previous = history.pop() || 'home';
    if (['device','deviceinfo','privacysettings','connectivity','batterysettings','sharelocation','navigate'].includes(previous)) {
      renderAddon(previous);
      return;
    }
    current = previous;
    if (typeof window.showPhoneScreen === 'function') {
      window.showPhoneScreen(previous, !mainTabs.has(previous));
      setTimeout(enhancePhoneScreen, 0);
    }
  }

  function bindAddonControls() {
    const phone = view();
    if (!phone) return;
    phone.querySelector('[data-addon-back]')?.addEventListener('click', goBack);
    phone.querySelectorAll('[data-addon-screen]').forEach(btn => btn.addEventListener('click', () => {
      history.push(current);
      renderAddon(btn.dataset.addonScreen);
    }));
    phone.querySelectorAll('[data-setting-toggle]').forEach(btn => btn.addEventListener('click', () => btn.classList.toggle('on')));
    phone.querySelectorAll('[data-location-action]').forEach(btn => btn.addEventListener('click', () => {
      const status = document.getElementById('locationActionStatus');
      if (btn.dataset.locationAction === 'share') {
        if (navigator.share) navigator.share({title:'A-Z Care location', text:'I am sharing my location with you.'}).catch(() => {});
        if (status) status.textContent = 'Location ready to share with Mom and Grandma ✓';
      } else if (status) status.textContent = 'Home route ready · navigation demo ✓';
    }));
  }

  function addDeviceToHome() {
    const phone = view();
    const homeActive = document.querySelector('.phone-tab[data-screen="home"]')?.classList.contains('active');
    if (!phone || !homeActive || phone.querySelector('[data-addon="device"]')) return;
    const sos = phone.querySelector('.phone-sos');
    if (!sos) return;
    const card = document.createElement('button');
    card.className = 'phone-device-card';
    card.dataset.addon = 'device';
    card.innerHTML = '<span><b class="device-icon">▣</b><span><strong>A-Z Care Phone</strong><small>Connected · Protected</small></span><b>›</b></span>';
    card.addEventListener('click', () => { history.push('home'); renderAddon('device'); });
    sos.after(card);
  }

  function enhanceLocation() {
    const phone = view();
    const locationActive = document.querySelector('.phone-tab[data-screen="location"]')?.classList.contains('active');
    if (!phone || !locationActive) return;
    phone.querySelectorAll('.map-pin').forEach((pin, i) => pin.textContent = i === 0 ? 'M' : 'G');
    const actions = phone.querySelector('.phone-mini-actions');
    if (!actions || actions.querySelector('[data-addon="share"]')) return;
    const old = actions.querySelector('button:last-child');
    if (!old) return;
    old.textContent = 'Share location';
    old.removeAttribute('data-app');
    old.dataset.addon = 'share';
    old.addEventListener('click', () => { history.push('location'); renderAddon('sharelocation'); });
  }

  function enhanceLost() {
    const phone = view();
    if (!phone || phone.querySelector('.phone-subhead h3')?.textContent.trim() !== "I'm lost") return;
    const buttons = [...phone.querySelectorAll('.phone-wide-action')];
    const nav = buttons.find(b => b.textContent.includes('Navigate home'));
    const share = buttons.find(b => b.textContent.includes('Share location'));
    if (nav && !nav.dataset.addon) {
      nav.dataset.addon = 'navigate';
      nav.addEventListener('click', e => { e.stopImmediatePropagation(); history.push('lost'); renderAddon('navigate'); });
    }
    if (share && !share.dataset.addon) {
      share.removeAttribute('data-app');
      share.dataset.addon = 'share';
      share.addEventListener('click', e => { e.stopImmediatePropagation(); history.push('lost'); renderAddon('sharelocation'); });
    }
  }

  function enhancePhoneScreen() {
    addDeviceToHome();
    enhanceLocation();
    enhanceLost();
  }

  function compactLanding() {
    document.querySelector('.hero-actions .button.ghost')?.remove();
    document.querySelectorAll('.desktop-nav a[href="#ai"], .desktop-nav a[href="#sos"]').forEach(a => a.remove());
    document.getElementById('ai')?.remove();
    document.getElementById('scam')?.remove();
    document.getElementById('sos')?.remove();
    document.querySelector('.cta-section')?.remove();

    const overview = document.getElementById('overview');
    if (overview) overview.innerHTML = `<div class="container"><div class="compact-heading reveal"><p class="eyebrow">WHAT IT DOES</p><h2>One phone. Four safety layers.</h2><p>The interactive phone is the main product demo. Everything below explains the idea without repeating the same flows.</p></div><div class="compact-grid"><article class="compact-card reveal"><div class="compact-icon">◇</div><h3>Protect</h3><p>Check messages, links and callers before acting.</p></article><article class="compact-card reveal"><div class="compact-icon">✦</div><h3>AI Care</h3><p>Explain risk simply and suggest safer next steps.</p></article><article class="compact-card reveal"><div class="compact-icon danger">SOS</div><h3>SOS</h3><p>Reach trusted people and share emergency status quickly.</p></article><article class="compact-card reveal"><div class="compact-icon">⌖</div><h3>Family</h3><p>Consent-based location, safe zones and device status.</p></article></div></div>`;

    const modes = document.getElementById('modes');
    if (modes) modes.innerHTML = `<div class="container"><div class="compact-heading reveal"><p class="eyebrow">WHO IT'S FOR</p><h2>Different people. Different risks.</h2></div><div class="compact-grid audience-grid"><article class="compact-card reveal"><div class="compact-icon">K</div><h3>Kids</h3><p>Safer communication, location and simple protection.</p></article><article class="compact-card reveal"><div class="compact-icon">S</div><h3>Seniors</h3><p>Clear warnings, trusted contacts and simple emergency actions.</p></article><article class="compact-card reveal"><div class="compact-icon">F</div><h3>Families</h3><p>Consent-based safety tools without hidden tracking.</p></article></div></div>`;

    const privacy = document.getElementById('privacy');
    if (privacy) privacy.innerHTML = `<div class="container"><div class="compact-heading reveal"><p class="eyebrow">PRIVACY</p><h2>Safety without surveillance.</h2></div><div class="principles"><div class="principle"><strong>Visible controls</strong><span>Permissions stay understandable and controllable.</span></div><div class="principle"><strong>Consent first</strong><span>Family sharing is explicit, not hidden.</span></div><div class="principle"><strong>Minimum necessary data</strong><span>Use only what a safety feature actually needs.</span></div></div></div>`;

    const roadmap = document.getElementById('roadmap');
    if (roadmap) roadmap.innerHTML = `<div class="container"><div class="compact-heading reveal"><p class="eyebrow">ROADMAP</p><h2>Concept → Prototype → Testing</h2></div><div class="roadmap-short"><div><small>01</small><strong>Concept</strong><span>Product direction and interactive experience.</span></div><div><small>02</small><strong>Prototype</strong><span>Android flows and hardware platform.</span></div><div><small>03</small><strong>Testing</strong><span>Real users, safety validation and iteration.</span></div></div></div>`;

    document.getElementById('survey')?.classList.add('compact-section');
  }

  function init() {
    compactLanding();
    enhancePhoneScreen();

    document.addEventListener('click', e => {
      const back = e.target.closest('[data-back]');
      if (back && history.length) {
        e.preventDefault();
        e.stopImmediatePropagation();
        goBack();
        return;
      }

      const tab = e.target.closest('.phone-tab');
      if (tab) {
        history.length = 0;
        current = tab.dataset.screen;
        setTimeout(enhancePhoneScreen, 0);
        return;
      }

      const app = e.target.closest('[data-app]');
      if (app) {
        history.push(current);
        current = app.dataset.app;
        setTimeout(enhancePhoneScreen, 0);
        return;
      }

      const phoneTarget = e.target.closest('[data-phone-screen]');
      if (phoneTarget) {
        history.length = 0;
        current = phoneTarget.dataset.phoneScreen;
        setTimeout(enhancePhoneScreen, 0);
      }
    }, true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();