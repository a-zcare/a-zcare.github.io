(() => {
  const phoneHistory = [];
  let navigatingBack = false;

  function deviceScreen() {
    return `
      <div class="phone-subhead"><button data-back>‹</button><div><small>MY PHONE</small><h3>A-Z Care Phone 1</h3></div></div>
      <div class="device-spec-list">
        <div><span>Platform</span><strong>Snapdragon 7-series</strong></div>
        <div><span>Memory</span><strong>12 GB · 256 GB</strong></div>
        <div><span>Display</span><strong>AMOLED · 120 Hz</strong></div>
        <div><span>Battery</span><strong>6200–6500 mAh · 65 W</strong></div>
        <div><span>Network</span><strong>5G · eSIM · NFC · Wi-Fi 6E</strong></div>
        <div><span>Camera</span><strong>50 MP OIS</strong></div>
        <div><span>Protection</span><strong>IP68 · SOS button</strong></div>
        <div><span>Price</span><strong>Est. $496</strong></div>
      </div>
      <div class="phone-label">PRIVACY CONTROLS</div>
      <div class="device-controls">
        <div class="device-toggle"><span>Microphone</span><button class="on" data-device-toggle aria-label="Toggle microphone"></button></div>
        <div class="device-toggle"><span>Camera</span><button class="on" data-device-toggle aria-label="Toggle camera"></button></div>
        <div class="device-toggle"><span>Location</span><button class="on" data-device-toggle aria-label="Toggle location"></button></div>
        <div class="device-toggle"><span>Family sharing</span><button class="on" data-device-toggle aria-label="Toggle family sharing"></button></div>
      </div>
      <a class="phone-link" href="hardware.html">Full specifications →</a>`;
  }

  function bindExtras() {
    phoneView.querySelectorAll('[data-device-toggle]').forEach(btn => {
      btn.onclick = () => btn.classList.toggle('on');
    });

    phoneView.querySelectorAll('[data-location-action]').forEach(btn => {
      btn.onclick = () => {
        const status = document.getElementById('locationActionStatus');
        if (btn.dataset.locationAction === 'share') {
          if (navigator.share) navigator.share({title:'A-Z Care location', text:'I am sharing my current location with my trusted family.'}).catch(()=>{});
          if (status) status.textContent = 'Location ready to share with Mom and Grandma ✓';
        } else {
          if (status) status.textContent = 'Home route opened in navigation demo ✓';
        }
      };
    });

    phoneView.querySelectorAll('[data-phone-action="decline"]').forEach(btn => {
      btn.onclick = () => { btn.textContent = 'Declined ✓'; btn.disabled = true; };
    });
    phoneView.querySelectorAll('[data-phone-action="delete"]').forEach(btn => {
      btn.onclick = () => { btn.textContent = 'Deleted ✓'; btn.disabled = true; };
    });
    phoneView.querySelectorAll('[data-sos-choice]').forEach(btn => {
      btn.onclick = () => {
        phoneView.querySelectorAll('[data-sos-choice]').forEach(x => x.classList.remove('good'));
        btn.classList.add('good');
      };
    });
  }

  function patchPhone() {
    if (typeof phoneScreens === 'undefined' || typeof showPhoneScreen !== 'function') return;

    phoneScreens.device = deviceScreen();
    phoneScreens.home = phoneScreens.home.replace(
      '<button class="phone-sos" data-app="sosphone">SOS · Emergency</button>',
      '<button class="phone-device-card" data-app="device"><span><b class="device-icon">▣</b><span><strong>Device</strong><small>12 GB · 256 GB · 5G · AMOLED 120 Hz</small></span><b>›</b></span></button><button class="phone-sos" data-app="sosphone">SOS · Emergency</button>'
    );

    phoneScreens.location = phoneScreens.location
      .replace('<span class="map-pin a">A</span><span class="map-pin m">M</span>','<span class="map-pin a">M</span><span class="map-pin m">G</span>')
      .replace('<div class="phone-mini-actions"><button data-app="safezones">Safe zones</button><button data-app="imok">I\'m OK</button></div>','<div class="phone-mini-actions"><button data-app="safezones">Safe zones</button><button data-app="sharelocation">Share location</button></div>');

    phoneScreens.contacts = `
      <div class="phone-subhead"><button data-back>‹</button><div><small>TRUSTED PEOPLE</small><h3>My family</h3></div></div>
      <div class="trusted-list">
        <div><span class="mini-avatar">M</span><p><strong>Mom</strong><small>Trusted · Online</small></p><button data-app="familydetail">View</button></div>
        <div><span class="mini-avatar">G</span><p><strong>Grandma</strong><small>Trusted · Battery 12%</small></p><button data-app="battery">View</button></div>
      </div>`;

    phoneScreens.lost = `
      <div class="phone-subhead"><button data-back>‹</button><div><small>FIND ME</small><h3>I'm lost</h3></div></div>
      <div class="location-card"><span>⌖</span><strong>Your current location</strong><p>Location is available for this demo.</p></div>
      <button class="phone-wide-action good" data-location-action="navigate">Navigate home</button>
      <button class="phone-wide-action" data-app="contacts">Trusted family</button>
      <button class="phone-wide-action" data-location-action="share">Share location</button>
      <div class="location-action-status" id="locationActionStatus"></div>`;

    phoneScreens.sharelocation = `
      <div class="phone-subhead"><button data-back>‹</button><div><small>LOCATION SHARING</small><h3>Share location</h3></div></div>
      <div class="location-card"><span>⌖</span><strong>Share with family</strong><p>Send your current location to Mom and Grandma.</p></div>
      <button class="phone-wide-action good" data-location-action="share">Share now</button>
      <div class="location-action-status" id="locationActionStatus"></div>`;

    phoneScreens.emergency = `
      <div class="phone-subhead"><button data-back>‹</button><div><small>LOCK SCREEN ACCESS</small><h3>Emergency Card</h3></div></div>
      <div class="emergency-card"><div class="emergency-symbol">✚</div><strong>Emergency information</strong><p>Only information chosen by the owner is visible here.</p></div>
      <div class="phone-label">TRUSTED CONTACT</div>
      <div class="trusted-quick"><span class="mini-avatar">M</span><div><strong>Mom</strong><small>Trusted family</small></div><button data-app="familydetail">View</button></div>
      <button class="phone-sos" data-app="sosphone">SOS · Get help</button>`;

    phoneScreens.familydetail = phoneScreens.familydetail.replace('☎ Call Mom','Trusted family').replace('class="phone-wide-action">Trusted family','class="phone-wide-action" data-app="contacts">Trusted family');
    phoneScreens.calls = phoneScreens.calls.replace('<button class="good">Decline</button>','<button class="good" data-phone-action="decline">Decline</button>');
    phoneScreens.messages = phoneScreens.messages.replace('<button>Delete</button>','<button data-phone-action="delete">Delete</button>');
    phoneScreens.browser = phoneScreens.browser.replace('<button class="phone-wide-action good">← Go back</button>','<button class="phone-wide-action good" data-back>← Go back</button>');
    phoneScreens.sosphone = phoneScreens.sosphone.replace(/<button>I feel unsafe<\/button><button>I'm lost<\/button><button>Medical help<\/button><button>Call family<\/button>/,"<button data-sos-choice>I feel unsafe</button><button data-sos-choice>I'm lost</button><button data-sos-choice>Medical help</button><button data-app=\"contacts\">Call family</button>");

    const baseShow = showPhoneScreen;
    showPhoneScreen = function(name, keepTab = false) {
      if (!navigatingBack && currentPhoneScreen && name !== currentPhoneScreen) phoneHistory.push(currentPhoneScreen);
      baseShow(name, keepTab);
      bindExtras();
    };

    document.addEventListener('click', e => {
      const back = e.target.closest('[data-back]');
      if (!back || !phoneView.contains(back)) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      const previous = phoneHistory.pop() || 'home';
      navigatingBack = true;
      showPhoneScreen(previous, !['home','protect','location','ai'].includes(previous));
      navigatingBack = false;
    }, true);

    phoneHistory.length = 0;
    showPhoneScreen('home');
    phoneHistory.length = 0;
  }

  function compactLanding() {
    document.querySelector('.hero-actions .button.ghost')?.remove();
    document.querySelector('.product-definition')?.remove();
    document.querySelector('.waitlist-mini')?.remove();
    document.getElementById('faq')?.remove();
    document.getElementById('ai')?.remove();
    document.getElementById('scam')?.remove();

    const overview = document.getElementById('overview');
    if (overview) overview.innerHTML = `<div class="container"><div class="compact-heading"><p class="eyebrow">WHAT IT DOES</p><h2>One phone. Four safety layers.</h2><p>Explore the main flows directly in the interactive phone.</p></div><div class="compact-grid"><article class="compact-card"><div class="compact-icon">◇</div><h3>Protect</h3><p>Check messages, links and callers before acting.</p></article><article class="compact-card"><div class="compact-icon">✦</div><h3>AI Care</h3><p>Explain risk clearly and suggest safer next steps.</p></article><article class="compact-card"><div class="compact-icon danger">SOS</div><h3>SOS</h3><p>Reach trusted people and share emergency status quickly.</p></article><article class="compact-card"><div class="compact-icon">⌖</div><h3>Family</h3><p>Consent-based location, safe zones and device status.</p></article></div></div>`;

    const sos = document.getElementById('sos');
    if (sos) sos.innerHTML = '<div class="container"><div class="mini-sos"><div class="compact-icon danger">SOS</div><div><h3>Emergency SOS</h3><p>The full emergency flow lives inside the interactive phone.</p></div><button class="button primary" data-open-sos>Try SOS</button></div></div>';

    const modes = document.getElementById('modes');
    if (modes) modes.innerHTML = `<div class="container"><div class="compact-heading"><p class="eyebrow">WHO IT'S FOR</p><h2>Different people. Different risks.</h2></div><div class="compact-grid audience-grid"><article class="compact-card"><div class="compact-icon">K</div><h3>Kids</h3><p>Safer communication, location and simple protection without overwhelming controls.</p></article><article class="compact-card"><div class="compact-icon">S</div><h3>Seniors</h3><p>Clear warnings, trusted contacts and understandable emergency actions.</p></article><article class="compact-card"><div class="compact-icon">F</div><h3>Families</h3><p>Stay connected through consent-based safety tools instead of hidden tracking.</p></article></div></div>`;

    const privacy = document.getElementById('privacy');
    if (privacy) privacy.innerHTML = `<div class="container"><div class="compact-heading"><p class="eyebrow">PRIVACY</p><h2>Safety without surveillance.</h2></div><div class="principles"><div class="principle"><strong>Visible controls</strong><span>Camera, microphone, location and family sharing are controlled inside the phone.</span></div><div class="principle"><strong>Consent first</strong><span>Family features are designed around explicit sharing, not hidden tracking.</span></div><div class="principle"><strong>Minimum necessary data</strong><span>Use only the information a safety feature actually needs.</span></div></div></div>`;

    const roadmap = document.getElementById('roadmap');
    if (roadmap) roadmap.innerHTML = `<div class="container"><div class="compact-heading"><p class="eyebrow">ROADMAP</p><h2>From concept to tested prototype.</h2></div><div class="roadmap-short"><div><small>01</small><strong>Concept</strong><span>Product direction and interactive experience.</span></div><div><small>02</small><strong>Prototype</strong><span>Android safety flows and hardware platform.</span></div><div><small>03</small><strong>Testing</strong><span>Real users, safety validation and iteration.</span></div></div></div>`;

    document.querySelectorAll('.desktop-nav a[href="#ai"],.desktop-nav a[href="#sos"]').forEach(a => a.remove());
    const survey = document.getElementById('survey'); if (survey) survey.classList.add('compact-section');
    document.querySelector('[data-open-sos]')?.addEventListener('click', () => showPhoneScreen('sosphone', true));
  }

  compactLanding();
  patchPhone();
})();
