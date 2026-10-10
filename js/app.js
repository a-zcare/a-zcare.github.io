(() => {
  const $ = (s) => document.querySelector(s),
    view = $('#phoneView'),
    history = [];
  let current = 'home',
    widget = +(localStorage.getItem('az_widget') || 0),
    specTab = 'display',
    fallTimer = null,
    fallLeft = 10;
  const logo = 'assets/azcare-logo-white.svg';
  const track = (eventName, parameters) => window.AZ_ANALYTICS?.track(eventName, parameters);
  const svg = (d, extra = '') => `<svg viewBox="0 0 24 24" aria-hidden="true">${d}${extra}</svg>`;
  const icons = {
    protect: `<img src="${logo}" alt="">`,
    ai: svg('<path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z"/>'),
    health: svg(
      '<path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 00-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 000-7.8z"/><path d="M5 12h3l1.5-3 2.5 6 1.5-3H19"/>',
    ),
    family: svg(
      '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.3"/><path d="M3.5 20c.4-4 2.3-6 5.5-6s5.1 2 5.5 6M14 15c3.7-.8 6 1 6.5 5"/>',
    ),
    location: svg(
      '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1116 0z"/><circle cx="12" cy="10" r="2.5"/>',
    ),
    contacts: svg(
      '<rect x="5" y="3" width="15" height="18" rx="2"/><path d="M5 7H3M5 12H3M5 17H3"/><circle cx="12.5" cy="9" r="2.2"/><path d="M8.5 17c.5-2.5 1.8-3.7 4-3.7s3.5 1.2 4 3.7"/>',
    ),
    specs: svg(
      '<rect x="5" y="2.5" width="14" height="19" rx="2.5"/><path d="M9 6h6M8 10h8M8 14h5M10 18h4"/>',
    ),
    settings: svg(
      '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
    ),
    sos: '<b>SOS</b>',
    calls: svg(
      '<path d="M5 3l4 1 1 5-2.5 1.5a15 15 0 006 6L15 14l5 1 1 4c-1 2-3 3-5 2C9 19 5 15 3 8 2 6 3 4 5 3z"/>',
    ),
    messages: svg('<path d="M4 4h16v12H9l-5 4V4z"/><path d="M8 9h8M8 12h5"/>'),
    browser: svg(
      '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    ),
    camera: svg('<path d="M4 7h4l1.5-2h5L16 7h4v12H4V7z"/><circle cx="12" cy="13" r="4"/>'),
  };
  const app = (label, target, cls = '') =>
    `<button class="app ${cls}" data-open="${target}" aria-label="${label}"><span class="app-icon" aria-hidden="true">${icons[target]}</span><small>${label}</small></button>`;
  const head = (k, t) =>
    `<div class="subhead"><button data-back aria-label="Back to previous screen"><span aria-hidden="true">‹</span></button><div><small>${k}</small><h3 tabindex="-1">${t}</h3></div></div>`;
  const row = (icon, title, note, target = '') =>
    `<button class="phone-row" ${target ? `data-open="${target}"` : ''}><span>${icon}</span><b>${title}<small>${note}</small></b><i>›</i></button>`;
  const widgets = [
    () =>
      `<div class="widget-weather-time"><div class="weather-side"><span class="widget-symbol">☁</span><div><small>RIGA · WEATHER</small><strong>18°</strong><p>Partly cloudy · 14° / 20°</p></div></div><div class="time-side"><small>LOCAL TIME</small><strong id="widgetClock"></strong><p id="widgetDate"></p></div></div>`,
    () =>
      `<div class="widget-health"><small>HEALTH · DEMO</small><div><b>6.4<em> mmol/L</em><span>Glucose</span></b><b>72<em> bpm</em><span>Pulse</span></b><b>122/78<span>Pressure</span></b></div></div>`,
    () =>
      `<div class="widget-music"><div class="album">♪</div><div><small>NOW PLAYING</small><b>Midnight Drive</b><p>A-Z Radio</p></div><button data-music aria-label="Play or pause music">▶</button></div>`,
    () =>
      `<div class="widget-agenda"><small>TODAY · CARE</small><b>18:00 Medication</b><p>19:30 · Call Anna</p><p>21:00 · Evening check-in</p></div>`,
    () =>
      `<div class="widget-agenda"><small>CALENDAR · TODAY</small><b>3 things left</b><p>✓ 09:00 Medication</p><p>○ 18:30 Grocery shopping</p><p>○ 20:00 Family call</p></div>`,
    () =>
      `<div class="widget-agenda"><small>NOTES</small><b>Quick note</b><p>Pick up prescription</p><p>Charge power bank</p><p>Remember keys ✓</p></div>`,
  ];
  function widgetHtml() {
    widget = (widget + widgets.length) % widgets.length;
    return `<div class="smart-widget"><button class="widget-arrow" data-widget="-1" aria-label="Previous widget">‹</button><div class="widget-content">${widgets[widget]()}</div><button class="widget-arrow" data-widget="1" aria-label="Next widget">›</button></div><div class="widget-footer"><span>WIDGET</span><div>${widgets.map((_, i) => `<button data-widget-set="${i}" class="${i === widget ? 'active' : ''}" aria-label="Show widget ${i + 1}" aria-pressed="${i === widget}"></button>`).join('')}</div></div>`;
  }
  function home(focusTarget = '') {
    clearInterval(fallTimer);
    current = 'home';
    history.length = 0;
    view.innerHTML = `<div class="android-status"><b id="clock"></b><span>5G · 82%</span></div>${widgetHtml()}<div class="apps">${app('Protect', 'protect')}${app('AI Care', 'ai')}${app('Health', 'health', 'health')}${app('Family', 'family')}${app('Location', 'location')}${app('Contacts', 'contacts')}${app('Specifications', 'specs', 'specs')}${app('Settings', 'settings')}${app('SOS', 'sos', 'sos')}</div><div class="dock">${app('Phone', 'calls')}${app('Messages', 'messages')}${app('Browser', 'browser')}${app('Camera', 'camera')}</div>`;
    tick();
    if (focusTarget)
      track('demo_screen_view', { screen_name: 'home', previous_screen: focusTarget });
    if (focusTarget)
      view.querySelector(`[data-open="${focusTarget}"]`)?.focus({ preventScroll: true });
  }
  const specData = window.AZ_PRODUCT?.specs || {};
  function specs() {
    const d = specData[specTab];
    return `${head('A-Z CARE PHONE', 'Specifications')}<div class="spec-hero"><span>${icons.specs}</span><div><strong>A-Z Care Phone</strong><small>Concept hardware</small></div></div><div class="spec-tabs">${Object.keys(
      specData,
    )
      .map(
        (x) =>
          `<button data-spec="${x}" class="${x === specTab ? 'active' : ''}">${x[0].toUpperCase() + x.slice(1)}</button>`,
      )
      .join(
        '',
      )}</div><div class="spec-detail"><small>${specTab.toUpperCase()}</small><strong>${d[0]}</strong><p>${d[1]}</p><p>${d[2]}</p></div><a class="wide phone-link" href="hardware.html" data-analytics-event="specifications_open" data-analytics-source="phone">Full specifications →</a>`;
  }
  function settings() {
    const tracking = localStorage.getItem('az_tracking') === 'on',
      alerts = localStorage.getItem('az_alerts') !== 'off';
    return `${head('SYSTEM', 'Settings')}<div class="phone-list">${row('◉', 'Privacy dashboard', 'Review permissions', 'privacy')}${row('⌁', 'Connectivity', '5G · Wi-Fi · emergency fallback', 'connectivity')}${row('ϟ', 'Battery Guardian', 'Starts at 20% · preserve safety', 'battery')}${row('▣', 'Device information', 'Specifications', 'specs')}<button class="phone-row toggle-row" data-toggle="alerts"><span>!</span><b>Safety alerts<small>Suspicious activity warnings</small></b><i class="toggle ${alerts ? 'on' : ''}"></i></button><button class="phone-row toggle-row" data-toggle="tracking"><span>⌖</span><b>Location sharing<small>Trusted people only</small></b><i class="toggle ${tracking ? 'on' : ''}"></i></button></div>`;
  }
  function battery() {
    const safety = localStorage.getItem('az_battery_demo') === 'safety';
    return `${head('POWER & SAFETY', 'Battery Guardian')}<div class="info-card ${safety ? 'warning' : 'health-head'}"><strong>${safety ? '19% · Safety mode' : '44% · Normal mode'}</strong><p>At 20%, A-Z Care reduces nonessential background work while preserving SOS, critical communication, safety sensing and permitted location snapshots.</p></div><button class="wide primary-phone" data-battery-demo>${safety ? 'Restore 44% demo' : 'Simulate battery below 20%'}</button><div class="phone-list">${row('SOS', 'Emergency reserve', 'Always highest priority')}${row('⌖', 'Location snapshots', safety ? 'Reduced frequency · permitted only' : 'Normal permitted schedule')}${row('⌁', 'Background activity', safety ? 'Nonessential work reduced' : 'Normal')}</div>`;
  }
  function connectivity() {
    const routes = [
      '5G / eSIM',
      'Wi-Fi',
      'Safety connectivity',
      'Nearby encrypted relay',
      'Satellite where supported',
      'Store & forward',
    ];
    const routeIndex = +(localStorage.getItem('az_route_demo') || 0) % routes.length;
    return `${head('RESILIENT SAFETY', 'Connectivity')}<div class="info-card health-head"><small>CURRENT SOS ROUTE</small><strong>${routes[routeIndex]}</strong><p>Demo route only · no emergency packet is transmitted.</p></div><button class="wide" data-route-next>Simulate next fallback</button><div class="route-flow">${routes.map((route, i) => `<span class="${i === routeIndex ? 'active' : ''}">${route}</span>`).join('<i>→</i>')}</div><div class="info-card"><small>Partner safety connectivity and satellite require compatible hardware, services and regional availability. Nearby relay and store-forward remain research concepts.</small></div>`;
  }
  function privacy() {
    const setting = (key, fallback = false) => {
      const value = localStorage.getItem('az_' + key);
      return value === null ? fallback : value === 'on';
    };
    const privacyRow = (key, icon, title, note, fallback = false) =>
      `<button class="phone-row toggle-row" data-toggle="${key}"><span>${icon}</span><b>${title}<small>${note}</small></b><i class="toggle ${setting(key, fallback) ? 'on' : ''}"></i></button>`;
    const analyticsAllowed = window.AZ_PRIVACY?.analyticsAllowed() === true;
    const lastShare = localStorage.getItem('az_last_share') || 'None · demo only';
    return `${head('PRIVACY', 'Privacy dashboard')}<div class="info-card"><strong>Local-first controls</strong><p>Choose what the demo may share. Emergency sharing remains limited to categories you explicitly allow.</p></div><div class="phone-list">${privacyRow('mic', '●', 'Microphone', 'AI Care voice assistance')}${privacyRow('family_location', '⌖', 'Family location', 'Off by default')}${privacyRow('sos_location', 'SOS', 'SOS location', 'Trusted contacts only', true)}${privacyRow('health_share', '♥', 'Health sharing', 'Private unless permitted')}${row('A', 'Optional analytics', analyticsAllowed ? 'Allowed · no health/location/message content' : 'Off')}${row('↗', 'Last data sent', lastShare)}</div>`;
  }
  function health() {
    return `${head('A-Z CARE', 'Health Guardian')}<div class="health-metrics"><button data-health="glucose"><small>CGM · EXTERNAL</small><b id="glucoseVal">6.4</b><span>mmol/L</span></button><button data-health="pulse"><small>PULSE</small><b id="pulseVal">72</b><span>bpm</span></button><button data-health="bp"><small>BP · EXTERNAL</small><b id="bpVal">122/78</b><span>mmHg</span></button></div><div class="phone-list">${row('ECG', 'ECG snapshot', 'Single-lead concept · where validated')}${row('O₂', 'SpO₂', '98% · wellness trend')}${row('Zz', 'Sleep', '7 h 24 min · demo')}${row('↟', 'Activity', '6,240 steps · demo')}${row('≈', 'Breathing', '15/min · demo')}${row('⌁', 'Fall detection', 'Watch + phone safety flow', 'fall')}</div><div class="info-card"><small>Demo values only. CGM and blood pressure come from compatible external devices. Health tools do not diagnose or prescribe treatment.</small></div>`;
  }
  function messages() {
    const scanned = localStorage.getItem('az_scanned') === 'yes';
    return `${head('SAFE INBOX', 'Messages')}<div class="message-bubble"><small>Unknown sender</small><p>Your bank account has been blocked. Verify now: <b>secure-bank-check.example</b></p></div>${scanned ? `<div class="info-card warning"><strong>⚠ Suspicious message · high risk</strong><p>Signals: urgency · account threat · unfamiliar domain. AI Care recommends avoiding the supplied link.</p></div><div class="safe-actions"><button data-scam-action="block">Block sender</button><button data-scam-action="trusted">Call trusted person</button><button data-scam-action="official">Open official site safely</button></div><div id="scamActionState"></div>` : `<button class="wide primary-phone" data-scan>Scan this message</button>`}`;
  }
  function fall() {
    return `${head('HEALTH & SAFETY', 'Fall detection')}<div class="info-card warning"><strong>Simulation only</strong><p>This prototype cannot detect a real fall or contact anyone.</p></div><div class="info-card"><strong>Concept flow</strong><p>Strong impact + inactivity would start a check-in.</p></div><button class="wide primary-phone" data-fall>Run fall simulation</button><div id="fallState"></div>`;
  }
  function sos() {
    return `${head('EMERGENCY', 'SOS')}<div class="sos-orb">SOS</div><div class="info-card warning"><strong>Simulation only</strong><p>No real emergency call, message or location sharing will happen.</p></div><div class="info-card"><strong>Concept flow</strong><p>In a working product, chosen contacts could receive your SOS status and shared location.</p></div><button class="wide danger-phone" data-sos>Run SOS simulation</button><div id="sosState"></div>`;
  }
  function careCenter() {
    return `${head('CARE CENTER · DEMO', 'Care Center')}<div class="info-card"><strong>Facility overview · permission-based</strong><p>Optional B2B monitoring for enrolled residents and devices.</p></div><div class="phone-list">${row('✓', 'Anna · Room 12', 'Online · Watch 76%')}${row('!', 'Michael · Room 18', 'Low battery · 18%')}${row('⌁', 'Eva · Room 21', 'Fall check-in · resolved')}${row('○', 'Peter · Room 08', 'Offline · 14 min')}</div><div class="info-card"><small>Demo only. Staff access, consent, audit logs and role controls would be required in production.</small></div>`;
  }
  const screens = {
    protect: () =>
      `${head('PROTECTION', 'Safety Center')}<div class="info-card health-head"><strong>✓ Protection ready</strong><small>Safety services active in this demo</small></div><div class="phone-list">${row('✉', 'Check message', 'Look for scam signals', 'messages')}${row('↗', 'Check link', 'Open safely', 'browser')}${row('☎', 'Check caller', 'Unknown-call protection', 'calls')}${row('✦', 'Ask AI Care', 'Explain what feels wrong', 'ai')}</div>`,
    ai: () =>
      `${head('SAFETY ASSISTANT', 'A-Z Care AI')}<div class="info-card"><strong>Explain the risk, then offer a safe next step</strong><p>For suspicious bank messages, do not use the supplied link. Open the known official bank app/site yourself, block the sender if appropriate, or ask a trusted person.</p></div><button class="wide" data-open="messages">Review suspicious message</button><button class="wide" data-open="contacts">Ask a trusted person</button>`,
    health,
    diabetes: () =>
      `${head('HEALTH', 'Diabetes')}<div class="info-card health-head"><strong>Food photo → useful estimate</strong><p>Review estimated carbohydrates before saving anything.</p></div>${row('◉', 'Scan food', 'Camera-based meal recognition', 'camera')}${row('+', 'Log glucose', 'Demo measurement')}${row('✓', 'Log insulin taken', 'Record only what was administered')}`,
    fall,
    family: () =>
      `${head('FAMILY', 'Family')}<div class="phone-list">${row('M', 'Mom · Home', 'Online · Battery 74%')}${row('G', 'Grandma · Home', 'Battery 12% · Low')}${row('+', 'Add trusted person', 'Explicit consent required')}</div>`,
    location: () =>
      `${head('FAMILY', 'Location')}<div class="info-card"><strong>Consent-based location</strong><p>Shared only with people you choose.</p></div>${row('⌂', 'Home', 'Mom arrived · now')}${row('S', 'School', 'Alex arrived · 08:47')}`,
    contacts: () =>
      `${head('TRUSTED PEOPLE', 'Contacts')}<div class="phone-list">${row('A', 'Anna', 'Daughter · Trusted')}${row('M', 'Michael', 'Son · Trusted')}${row('N', 'Neighbour', 'Trusted helper')}</div><button class="wide">+ Add trusted person</button>`,
    specs,
    settings,
    privacy,
    battery,
    connectivity,
    carecenter: careCenter,
    sos,
    calls: () =>
      `${head('CALL PROTECTION', 'Phone')}<div class="info-card"><strong>Unknown caller</strong><small>+371 2X XXX XXX</small></div><div class="info-card warning"><strong>⚠ Possible scam</strong><p>Never share passwords or verification codes.</p></div><button class="wide" data-open="ai">Ask AI Care</button>`,
    messages,
    browser: () =>
      `${head('BROWSER', 'Safe browsing')}<div class="info-card"><strong>Protected browsing</strong><p>A-Z Care can flag suspicious links before you open them.</p></div><button class="wide" data-open="protect">Check suspicious link</button>`,
    camera: () =>
      `${head('CAMERA', 'Camera')}<div class="camera-preview"><span>${icons.camera}</span><p>Camera preview</p></div><button class="wide" data-open="diabetes">Use for food scan</button>`,
  };
  function render(name, push = true) {
    clearInterval(fallTimer);
    if (name === 'home') return home();
    if (!screens[name]) return;
    const previous = current;
    if (push) history.push(current);
    current = name;
    view.innerHTML = screens[name]();
    view.querySelector('h3')?.focus({ preventScroll: true });
    if (previous !== name)
      track('demo_screen_view', { screen_name: name, previous_screen: previous });
  }
  function back() {
    const leaving = current;
    const prev = history.pop() || 'home';
    prev === 'home' ? home(leaving) : render(prev, false);
  }
  function tick() {
    const n = new Date(),
      c = $('#clock'),
      wc = $('#widgetClock'),
      wd = $('#widgetDate'),
      tm = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(n);
    if (c) c.textContent = tm;
    if (wc) wc.textContent = tm;
    if (wd)
      wd.textContent = new Intl.DateTimeFormat(undefined, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      }).format(n);
  }
  function refreshWidget() {
    if (current !== 'home') return;
    $('.widget-content').innerHTML = widgets[widget]();
    $('.widget-footer div').innerHTML = widgets
      .map(
        (_, i) =>
          `<button data-widget-set="${i}" class="${i === widget ? 'active' : ''}" aria-label="Show widget ${i + 1}" aria-pressed="${i === widget}"></button>`,
      )
      .join('');
    localStorage.setItem('az_widget', widget);
    tick();
  }
  function runSosDemo(source) {
    track('scenario_start', { scenario_name: 'sos', source });
    const screen = document.querySelector('.watch-screen');
    const watchState = document.querySelector('#watchDemoState');
    const payload = 'SOS status · permitted location · time · device battery';

    if (source === 'watch') {
      screen?.classList.remove('demo-health');
      screen?.classList.add('demo-alert');
      if (watchState) watchState.textContent = 'SOS sent to linked phone · demo';
      localStorage.setItem('az_last_share', 'Watch SOS → linked phone · simulation');
      render('sos');
      const state = $('#sosState');
      if (state) {
        state.innerHTML =
          '<div class="info-card warning"><strong>Watch SOS received</strong><p>The linked phone received the watch emergency signal. No real alert was sent.</p></div><div class="info-card health-head"><strong>Emergency packet prepared</strong><p>' +
          payload +
          '</p></div><div class="sos-actions"><button data-sos-confirm>Send to trusted contacts</button><button data-sos-cancel>Cancel demo</button></div>';
      }
    } else {
      const state = $('#sosState');
      if (state) {
        state.innerHTML =
          '<div class="info-card warning"><strong>Phone SOS ready · simulation</strong><p>No real emergency call, message or location sharing will happen.</p></div><div class="info-card"><strong>Permitted payload</strong><p>' +
          payload +
          '</p></div><div class="sos-actions"><button data-sos-confirm>Send to trusted contacts</button><button data-sos-cancel>Cancel demo</button></div>';
      }
    }
    track('scenario_complete', { scenario_name: 'sos', source, result: 'phone_received' });
  }

  function startFall() {
    const box = $('#fallState');
    track('scenario_start', { scenario_name: 'fall' });
    fallLeft = 10;
    box.innerHTML = `<div class="fall-alert warning"><strong>Possible fall detected</strong><p>Are you OK?</p><b id="fallCount">${fallLeft}</b><button data-ok>I'm OK</button><button data-need>I need help</button></div>`;
    fallTimer = setInterval(() => {
      fallLeft--;
      const c = $('#fallCount');
      if (c) c.textContent = fallLeft;
      if (fallLeft <= 0) {
        clearInterval(fallTimer);
        track('scenario_complete', { scenario_name: 'fall', result: 'no_response' });
        box.innerHTML =
          '<div class="fall-alert warning"><strong>Simulation complete · No alert sent</strong><p>In a working product, no response could alert chosen contacts and include the last permitted location.</p><button data-open="contacts">View demo contacts</button></div>';
      }
    }, 1000);
  }
  const watchScreens = [
    {
      action: 'heart',
      title: 'HEART',
      value: '72 <i>bpm</i>',
      wave: '⌁⌁⌁⌁⌁',
      stats: '<span>SpO₂<b>98%</b></span><span>STATUS<b>Normal</b></span>',
      message: 'Built-in optical heart-rate sensor · demo',
      detail:
        '<strong>Heart rate</strong><p>Current demo reading: 72 bpm. The watch can show resting trends and share permitted alerts with the linked phone.</p>',
    },
    {
      action: 'ecg',
      title: 'ECG',
      value: 'Sinus <i>demo</i>',
      wave: '⌁╲⌁╱⌁╲⌁',
      stats: '<span>RATE<b>72 bpm</b></span><span>LEAD<b>1-lead</b></span>',
      message: 'ECG concept · validation and regional approval required',
      detail:
        '<strong>ECG concept</strong><p>Single-lead ECG concept for rhythm snapshots. Medical claims require validation and regional regulatory approval.</p>',
    },
    {
      action: 'oxygen',
      title: 'SpO₂',
      value: '98 <i>%</i>',
      wave: '••••••',
      stats: '<span>PULSE<b>72</b></span><span>SIGNAL<b>Good</b></span>',
      message: 'Built-in SpO₂ sensor · wellness demo',
      detail:
        '<strong>Blood oxygen</strong><p>SpO₂ wellness trend from the built-in optical sensor. Demo values are not a diagnosis.</p>',
    },
    {
      action: 'temperature',
      title: 'TEMP',
      value: '33.4 <i>°C</i>',
      wave: '— — —',
      stats: '<span>TREND<b>Stable</b></span><span>TYPE<b>Skin</b></span>',
      message: 'Skin-temperature trend · not core-body temperature',
      detail:
        '<strong>Skin temperature</strong><p>Shows changes from the wearer’s baseline rather than claiming core-body temperature.</p>',
    },
    {
      action: 'glucose',
      title: 'GLUCOSE',
      value: '6.1 <i>mmol/L</i>',
      wave: '↗ — —',
      stats: '<span>SOURCE<b>CGM</b></span><span>LINK<b>External</b></span>',
      message: 'External CGM integration · watch does not measure glucose itself',
      detail:
        '<strong>Glucose · external CGM</strong><p>Shown from a compatible external continuous glucose monitor through A-Z Sensor Hub. The watch itself does not measure blood glucose.</p>',
    },
    {
      action: 'fall',
      title: 'FALL',
      value: 'Are you <i>OK?</i>',
      wave: '!',
      stats: '<span>PHONE<b>Linked</b></span><span>SOS<b>Ready</b></span>',
      message: 'Possible fall · phone safety flow linked',
      detail:
        '<strong>Fall detection</strong><p>Motion sensors can start a check-in flow and link the event to the phone safety screen.</p>',
    },
  ];
  let watchIndex = 0;
  function renderWatch() {
    const current = watchScreens[watchIndex];
    const screen = document.querySelector('.watch-screen');
    if (!screen) return;
    screen.classList.toggle('demo-alert', current.action === 'fall');
    screen.classList.toggle('demo-health', current.action !== 'fall');
    document.querySelector('#watchKicker').textContent = current.title;
    document.querySelector('#watchValue').innerHTML = current.value;
    document.querySelector('#watchWave').textContent = current.wave;
    document.querySelector('#watchStats').innerHTML = current.stats;
    document.querySelector('#watchPageIndicator').textContent =
      current.title + ' · ' + (watchIndex + 1) + ' of ' + watchScreens.length;
    const metric = document.querySelector('#watchMetric');
    metric.setAttribute('aria-label', 'Open ' + current.title + ' details');
    document.querySelector('#watchDemoState').textContent = current.message;
    const detail = document.querySelector('#watchDetailPanel');
    detail.hidden = true;
    detail.innerHTML = '';
  }
  renderWatch();
  document.addEventListener('click', (e) => {
    const demoOpen = e.target.closest('[data-demo-open]');
    if (demoOpen) {
      render(demoOpen.dataset.demoOpen);
      document
        .querySelector('.showcase-phone-demo')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    const watchDirection = e.target.closest('[data-watch-direction]');
    if (watchDirection) {
      watchIndex =
        (watchIndex + Number(watchDirection.dataset.watchDirection) + watchScreens.length) %
        watchScreens.length;
      renderWatch();
      return;
    }
    if (e.target.closest('[data-watch-sos]')) {
      runSosDemo('watch');
      track('watch_demo_action', { action: 'sos' });
      return;
    }
    if (e.target.closest('[data-watch-detail]')) {
      const current = watchScreens[watchIndex];
      const detail = document.querySelector('#watchDetailPanel');
      detail.innerHTML = current.detail;
      detail.hidden = false;
      document.querySelector('#watchDemoState').textContent = current.message;
      if (current.action === 'fall') render('fall');
      track('watch_demo_action', { action: current.action });
      return;
    }

    const o = e.target.closest('[data-open]'),
      b = e.target.closest('[data-back]'),
      w = e.target.closest('[data-widget]'),
      ws = e.target.closest('[data-widget-set]'),
      m = e.target.closest('[data-music]'),
      st = e.target.closest('[data-spec]'),
      tog = e.target.closest('[data-toggle]');
    if (o) {
      e.preventDefault();
      render(o.dataset.open);
      return;
    }
    if (b) {
      back();
      return;
    }
    if (w) {
      widget = (widget + +w.dataset.widget + widgets.length) % widgets.length;
      refreshWidget();
    }
    if (ws) {
      widget = +ws.dataset.widgetSet;
      refreshWidget();
    }
    if (m) m.textContent = m.textContent === '▶' ? 'Ⅱ' : '▶';
    if (st) {
      specTab = st.dataset.spec;
      render('specs', false);
    }
    if (tog) {
      const k = 'az_' + tog.dataset.toggle,
        stored = localStorage.getItem(k),
        v = tog.dataset.toggle === 'alerts' ? stored !== 'off' : stored === 'on';
      localStorage.setItem(k, v ? 'off' : 'on');
      render(current, false);
    }
    if (e.target.closest('[data-battery-demo]')) {
      localStorage.setItem(
        'az_battery_demo',
        localStorage.getItem('az_battery_demo') === 'safety' ? 'normal' : 'safety',
      );
      render('battery', false);
    }
    if (e.target.closest('[data-route-next]')) {
      const next = (+(localStorage.getItem('az_route_demo') || 0) + 1) % 6;
      localStorage.setItem('az_route_demo', String(next));
      render('connectivity', false);
    }
    const scamAction = e.target.closest('[data-scam-action]');
    if (scamAction) {
      const messages = {
        block: 'Sender blocked in this simulation.',
        trusted: 'Trusted-person call prepared in this simulation.',
        official: 'Use a known official app or manually entered official address · demo only.',
      };
      const state = $('#scamActionState');
      if (state)
        state.innerHTML =
          '<div class="info-card health-head"><strong>Safer action</strong><p>' +
          messages[scamAction.dataset.scamAction] +
          '</p></div>';
    }
    if (e.target.closest('[data-scan]')) {
      track('scenario_start', { scenario_name: 'scam_message' });
      localStorage.setItem('az_scanned', 'yes');
      render('messages', false);
      track('scenario_complete', { scenario_name: 'scam_message', result: 'warning_shown' });
    }
    if (e.target.closest('[data-fall]')) startFall();
    if (e.target.closest('[data-ok]')) {
      clearInterval(fallTimer);
      track('scenario_complete', { scenario_name: 'fall', result: 'ok' });
      $('#fallState').innerHTML =
        '<div class="info-card health-head"><strong>✓ Check-in confirmed</strong><small>No alert was sent.</small></div>';
    }
    if (e.target.closest('[data-need]')) {
      clearInterval(fallTimer);
      track('scenario_complete', { scenario_name: 'fall', result: 'help_requested' });
      localStorage.setItem('az_last_share', 'SOS status + permitted location · simulation');
      $('#fallState').innerHTML =
        '<div class="info-card warning"><strong>Help flow simulated · No alert sent</strong><p>Watch event → phone SOS → trusted contacts. Permitted payload: SOS status, last location, time and device battery.</p></div>';
    }
    if (e.target.closest('[data-sos-confirm]')) {
      localStorage.setItem('az_last_share', 'SOS status + permitted location · simulation');
      const state = $('#sosState');
      if (state)
        state.innerHTML =
          '<div class="info-card health-head"><strong>✓ Trusted contacts notified · simulation</strong><p>Anna and Michael would receive only the permitted emergency payload. No real message was sent.</p></div>';
      const watchState = document.querySelector('#watchDemoState');
      if (watchState) watchState.textContent = 'Trusted contacts notified · demo only';
      track('scenario_complete', {
        scenario_name: 'sos',
        source: 'linked_devices',
        result: 'trusted_contacts_demo',
      });
    }
    if (e.target.closest('[data-sos-cancel]')) {
      const state = $('#sosState');
      if (state)
        state.innerHTML =
          '<div class="info-card"><strong>SOS demo cancelled</strong><p>No data was sent.</p></div>';
      document.querySelector('.watch-screen')?.classList.remove('demo-alert');
    }
    if (e.target.closest('[data-sos]')) runSosDemo('phone');
    const h = e.target.closest('[data-health]');
    if (h) {
      const id =
          h.dataset.health === 'glucose'
            ? '#glucoseVal'
            : h.dataset.health === 'pulse'
              ? '#pulseVal'
              : '#bpVal',
        el = $(id);
      if (el)
        el.textContent =
          h.dataset.health === 'glucose' ? '6.7' : h.dataset.health === 'pulse' ? '74' : '124/80';
    }
  });
  home();
  setInterval(tick, 30000);
})();
