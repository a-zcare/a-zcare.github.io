// A-Z Care 2026-09-02 product refactor
(() => {
  const phoneView = document.getElementById('phoneView');
  if (!phoneView || typeof phoneScreens === 'undefined') return;

  const history = [];
  const originalShow = showPhoneScreen;

  phoneScreens.home = `
    <div class="phone-title"><div><small id="homeGreeting">${getPhoneGreeting()}</small><h3>Alex</h3><p id="homeDate" style="margin:5px 0 0;color:#8997aa;font-size:9px;line-height:1.3">${getPhoneDate()}</p></div><div class="avatar">A</div></div>
    <div class="status-card"><div class="shield">✓</div><div><strong>Everything looks safe</strong><small>No active safety alerts</small></div></div>
    <div class="phone-label">ESSENTIALS</div>
    <div class="phone-app-grid">
      <button data-app="calls"><span>☎</span><strong>Calls</strong></button>
      <button data-app="messages"><span>💬</span><strong>Messages</strong></button>
      <button data-app="browser"><span>◎</span><strong>Safe Browser</strong></button>
      <button data-app="contacts"><span>♥</span><strong>Trusted</strong></button>
      <button data-app="lost"><span>⌖</span><strong>Find me</strong></button>
      <button data-app="device"><span>▣</span><strong>Device</strong></button>
    </div>
    <button class="phone-sos" data-app="sosphone">SOS · Emergency</button>`;

  phoneScreens.device = `
    <div class="phone-subhead"><button data-back>‹</button><div><small>A-Z CARE PHONE 1</small><h3>Device</h3></div></div>
    <div class="device-spec-grid">
      <div><small>DISPLAY</small><strong>6.3” AMOLED · 120 Hz</strong></div>
      <div><small>PLATFORM</small><strong>Snapdragon 7-series</strong></div>
      <div><small>MEMORY</small><strong>12 GB RAM · 256 GB</strong></div>
      <div><small>BATTERY</small><strong>6500 mAh · 65 W</strong></div>
      <div><small>CONNECTIVITY</small><strong>5G · NFC · Wi-Fi 6E</strong></div>
      <div><small>DURABILITY</small><strong>IP68</strong></div>
      <div><small>CAMERA</small><strong>50 MP main · OIS</strong></div>
      <div><small>PRICE</small><strong>Est. $496</strong></div>
    </div>
    <a class="phone-wide-action phone-link-action" href="hardware.html">Full specifications →</a>`;

  phoneScreens.privacy = `
    <div class="phone-subhead"><button data-back>‹</button><div><small>PRIVACY CENTER</small><h3>Permissions</h3></div></div>
    <div class="phone-permissions">
      <label><div><strong>Location</strong><small>Family sharing</small></div><input type="checkbox" checked><span></span></label>
      <label><div><strong>AI protection</strong><small>Only when requested</small></div><input type="checkbox" checked><span></span></label>
      <label><div><strong>Microphone</strong><small>Voice assistant</small></div><input type="checkbox"><span></span></label>
      <label><div><strong>Camera</strong><small>Disabled</small></div><input type="checkbox"><span></span></label>
    </div>
    <div class="privacy-mini-note">Demo controls. Permissions stay visible and can be changed by the user.</div>`;

  phoneScreens.location = `
    <div class="phone-title"><div><small>FAMILY</small><h3>Family Hub</h3></div><button class="avatar avatar-button" data-app="privacy" aria-label="Privacy settings">⚙</button></div>
    <div class="mini-map"><span class="map-pin a">M</span><span class="map-pin m">G</span></div>
    <div class="phone-label">FAMILY STATUS</div>
    <button class="family-mini phone-row-button" data-app="familydetail"><div class="mini-avatar">M</div><div><strong>Mom · Home</strong><small>Battery 74% · Online</small></div><span class="dot"></span></button>
    <button class="family-mini phone-row-button" data-app="battery"><div class="mini-avatar">G</div><div><strong>Grandma · Home</strong><small>Battery 12% · Low</small></div><span class="warn-dot"></span></button>
    <div class="phone-mini-actions"><button data-app="safezones">Safe zones</button><button data-app="sharelocation">Share location</button></div>`;

  phoneScreens.sharelocation = `
    <div class="phone-subhead"><button data-back>‹</button><div><small>LOCATION</small><h3>Share location</h3></div></div>
    <div class="location-card"><span>⌖</span><strong>Current location ready</strong><p>Share only with trusted contacts and only when you choose.</p></div>
    <div class="trusted-list"><div><span class="mini-avatar">M</span><p><strong>Mom</strong><small>Trusted contact</small></p><button data-demo-action="share">Share</button></div><div><span class="mini-avatar">G</span><p><strong>Grandma</strong><small>Trusted contact</small></p><button data-demo-action="share">Share</button></div></div>`;

  phoneScreens.lost = `
    <div class="phone-subhead"><button data-back>‹</button><div><small>FIND ME</small><h3>I'm lost</h3></div></div>
    <div class="location-card"><span>⌖</span><strong>Your current location</strong><p>Brīvības iela 120<br>Riga, Latvia</p></div>
    <button class="phone-wide-action good" data-app="navigatehome">Navigate home</button><button class="phone-wide-action" data-app="contacts">☎ Call family</button><button class="phone-wide-action" data-app="sharelocation">Share location</button>`;

  phoneScreens.navigatehome = `
    <div class="phone-subhead"><button data-back>‹</button><div><small>NAVIGATION</small><h3>Route home</h3></div></div>
    <div class="location-card"><span>⌂</span><strong>Home route ready</strong><p>12 min · 3.4 km<br>Demo route from your current location.</p></div>
    <button class="phone-wide-action good" data-demo-action="navigate">Start navigation</button>`;

  const render = (name, keepTab = false, push = true) => {
    if (!phoneScreens[name]) return;
    if (push && currentPhoneScreen && currentPhoneScreen !== name) history.push(currentPhoneScreen);
    originalShow(name, keepTab);
    phoneView.scrollTop = 0;
    bindExtras();
  };

  window.showPhoneScreen = render;

  function bindExtras() {
    phoneView.querySelectorAll('[data-back]').forEach(button => {
      const clone = button.cloneNode(true);
      button.replaceWith(clone);
      clone.addEventListener('click', () => {
        const previous = history.pop() || 'home';
        render(previous, !['home','protect','location','ai'].includes(previous), false);
      });
    });
    phoneView.querySelectorAll('[data-app]').forEach(button => {
      const clone = button.cloneNode(true);
      button.replaceWith(clone);
      clone.addEventListener('click', () => render(clone.dataset.app, true, true));
    });
    phoneView.querySelectorAll('[data-demo-action]').forEach(button => button.addEventListener('click', () => {
      button.textContent = button.dataset.demoAction === 'share' ? 'Shared ✓' : 'Navigation started ✓';
      button.disabled = true;
    }));
  }

  document.querySelectorAll('.phone-tab').forEach(tab => {
    const clone = tab.cloneNode(true);
    tab.replaceWith(clone);
    clone.addEventListener('click', () => { history.length = 0; render(clone.dataset.screen, false, false); });
  });

  document.querySelector('.hero-actions .ghost[href="hardware.html"]')?.remove();
  document.querySelector('.desktop-nav a[href="hardware.html"]')?.remove();
  document.querySelector('.desktop-nav a[href="#ai"]')?.remove();
  document.querySelector('.desktop-nav a[href="#sos"]')?.remove();
  document.getElementById('ai')?.remove();
  document.getElementById('scam')?.remove();
  document.getElementById('sos')?.remove();

  const overview = document.querySelector('#overview .feature-grid');
  if (overview) overview.innerHTML = `
    <article class="feature-card reveal"><div class="card-icon">◇</div><h3>Protect</h3><p>Check suspicious calls, messages and links before acting.</p><button class="text-button" data-open-phone="protect">Open Protect →</button></article>
    <article class="feature-card reveal"><div class="card-icon">✦</div><h3>AI Care</h3><p>Get a plain-language explanation of warning signs and safer next steps.</p><button class="text-button" data-open-phone="ai">Open AI Care →</button></article>
    <article class="feature-card reveal"><div class="card-icon danger">SOS</div><h3>SOS</h3><p>One clear emergency path with trusted contacts and location sharing.</p><button class="text-button" data-open-phone="sosphone">Open SOS →</button></article>
    <article class="feature-card reveal"><div class="card-icon">⌖</div><h3>Family</h3><p>Consent-based location, safe zones and important device status.</p><button class="text-button" data-open-phone="location">Open Family →</button></article>`;

  document.querySelectorAll('[data-open-phone]').forEach(button => button.addEventListener('click', () => {
    render(button.dataset.openPhone, true, true);
    document.getElementById('product')?.scrollIntoView({behavior:'smooth', block:'center'});
  }));

  const modeGrid = document.querySelector('#modes .mode-grid');
  if (modeGrid) modeGrid.innerHTML = `
    <article class="mode-card kids reveal"><span class="mode-label">KIDS</span><h3>Safety without turning the phone into a cage.</h3><p>Safe browsing, age-appropriate controls, school mode and emergency access.</p></article>
    <article class="mode-card seniors reveal"><span class="mode-label">SENIORS</span><h3>Less complexity. Bigger confidence.</h3><p>Large controls, trusted contacts, scam warnings and a clear SOS path.</p></article>
    <article class="mode-card reveal"><span class="mode-label">FAMILIES</span><h3>Useful context without hidden tracking.</h3><p>Shared status, safe zones and check-ins only when people choose to share.</p></article>`;

  const privacy = document.querySelector('#privacy .container');
  if (privacy) privacy.innerHTML = `<div class="section-heading center reveal"><p class="eyebrow">PRIVACY FIRST</p><h2>Safety without invisible tracking.</h2><p>Clear consent. Visible permissions. Sharing you can switch off. Detailed microphone, camera, AI and location controls now live inside the phone demo.</p><button class="button ghost" data-open-privacy>Open Privacy Center in phone →</button></div>`;
  document.querySelector('[data-open-privacy]')?.addEventListener('click', () => { render('privacy', true, true); document.getElementById('product')?.scrollIntoView({behavior:'smooth',block:'center'}); });

  const surveyHeading = document.querySelector('#survey .section-heading');
  if (surveyHeading) surveyHeading.innerHTML = `<p class="eyebrow">HELP SHAPE A-Z CARE</p><h2>Would you use A-Z Care?</h2><p>A short product survey. Email is optional.</p>`;

  const roadmap = document.querySelector('#roadmap .roadmap');
  if (roadmap) roadmap.innerHTML = `<div class="roadmap-item done"><span>01</span><div><strong>Concept</strong><small>Product direction and safety principles</small></div></div><div class="roadmap-item current"><span>02</span><div><strong>Prototype</strong><small>Interactive web and mobile product flows</small></div></div><div class="roadmap-item"><span>03</span><div><strong>Testing</strong><small>Hardware, safety integrations and user validation</small></div></div>`;

  render('home', false, false);
})();