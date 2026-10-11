(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const apps = [
    ['SOS', '🚨'],
    ['Scam Shield', '🛡️'],
    ['AI Assistant', '✦'],
    ['Health', '♥'],
    ['Family', '👪'],
    ['Location', '⌖'],
    ['Battery', '⚡'],
    ['Connection', '◉'],
    ['Privacy', '🔒'],
    ['Kids', '★'],
    ['Senior', '♿'],
    ['Care Center', '▦'],
    ['Settings', '⚙'],
  ];
  const watch = [
    ['Heart rate', '72', 'bpm · simulated'],
    ['Oxygen', '98%', 'SpO₂ · simulated'],
    ['Movement', '2,840', 'steps · simulated'],
    ['Temperature', '33.4°', 'skin trend · simulated'],
    ['Glucose', '6.4', 'mmol/L · external CGM example'],
    ['Safety', 'Ready', 'SOS and fall check · demo'],
    ['Sleep', '7h 20m', 'estimated · simulated'],
    ['Connectivity', 'Phone', 'Bluetooth concept'],
  ];
  let screen = 'Home',
    watchIndex = 0,
    step = 0,
    incident = 'none',
    log = [],
    scamReviewed = false,
    checkIn = false;
  const state = {
    network: true,
    sharing: false,
    battery: false,
    privacy: false,
    role: 'Senior',
    ack: false,
  };
  function event(message) {
    log.unshift(message);
    log = log.slice(0, 18);
    $('timeline').replaceChildren(
      ...log.map((s) => {
        const li = document.createElement('li');
        li.textContent = s;
        return li;
      }),
    );
  }
  function btn(label, action, cls = '') {
    return '<button class="action ' + cls + '" data-action="' + action + '">' + label + '</button>';
  }
  function card(title, detail) {
    return '<div class="card"><strong>' + title + '</strong><p>' + detail + '</p></div>';
  }
  function renderPhone() {
    let h =
      '<button class="back" data-action="home">‹ Home</button><div class="tag">SIMULATED · LOCAL DEMO</div><h2 class="screen-title">' +
      screen +
      '</h2>';
    switch (screen) {
      case 'Home':
        h =
          '<div class="tag">A-Z CARE · DEMO</div><h2 class="screen-title">Good day 👋</h2>' +
          card(
            'Your safety overview',
            'Phone and Watch connected · ' +
              (state.network ? 'Network online' : 'Network unavailable') +
              ' · ' +
              (state.battery ? 'Battery saver' : 'Normal battery'),
          ) +
          '<div class="app-grid">' +
          apps
            .map(
              ([name, emoji]) =>
                '<button class="app-tile" data-open="' +
                name +
                '"><span>' +
                emoji +
                '</span>' +
                name +
                '</button>',
            )
            .join('') +
          '</div>';
        break;
      case 'SOS':
        h +=
          card(
            'Emergency simulation',
            incident === 'none'
              ? 'No active alert. No real messages will be sent.'
              : 'Status: ' + incident + ' · Source: Watch / Phone demo',
          ) +
          btn('Start SOS countdown', 'sos-start', 'danger') +
          btn('Confirm simulated alert', 'sos-confirm', 'primary') +
          btn('Cancel alert', 'sos-cancel') +
          btn('Trusted contact acknowledges', 'sos-ack') +
          card(
            'Delivery route',
            state.network
              ? 'Demo route: connected phone → trusted contact'
              : 'Offline: queued locally; retry when connection returns',
          );
        break;
      case 'Scam Shield':
        h +=
          card(
            'Sample SMS',
            'URGENT: Your bank account is locked. Verify your password at an unfamiliar link.',
          ) +
          btn('Analyze warning signs', 'scam-review', 'primary') +
          (scamReviewed
            ? card(
                'Possible scam · not a certainty',
                'Urgency, credential request and unfamiliar link are warning signs. Open your bank app independently; do not use the link.',
              ) +
              btn('Block sample sender', 'scam-block') +
              btn('Mark as false positive', 'scam-false')
            : '');
        break;
      case 'AI Assistant':
        h +=
          card(
            'AI Safety Assistant · scripted demo',
            'Choose a question. Responses are prewritten examples, not a live AI provider.',
          ) +
          btn('Is this bank message safe?', 'ai-scam') +
          btn('What should I do after a fall?', 'ai-fall') +
          btn('How do I protect my privacy?', 'ai-privacy');
        break;
      case 'Health':
        h +=
          card('Health Guardian', 'Example readings only. Not validated medical measurements.') +
          [
            'Heart rate: 72 bpm',
            'SpO₂: 98%',
            'Skin temperature: 33.4°C',
            'External CGM: 6.4 mmol/L',
            'Sleep: 7h 20m',
          ]
            .map(
              (x) =>
                '<div class="metric"><span>' +
                x.split(':')[0] +
                '</span><b>' +
                x.split(':')[1] +
                '</b></div>',
            )
            .join('') +
          btn('Simulate fall detection', 'fall') +
          btn('View sensor permissions', 'privacy-open');
        break;
      case 'Family':
        h +=
          card('Trusted contacts', 'Anna · Primary contact (fictional)') +
          card('Check-in', checkIn ? 'Checked in safely (simulated)' : 'No check-in yet') +
          btn('Send demo check-in', 'checkin') +
          btn('Manage location consent', 'location-open');
        break;
      case 'Location':
        h +=
          card(
            'Location sharing',
            state.sharing ? 'Enabled for this local demo' : 'Disabled — no position is accessed',
          ) +
          btn(state.sharing ? 'Revoke sharing' : 'Grant simulated sharing', 'share') +
          card('Safe zone', 'Home · illustrative zone only; no GPS accessed');
        break;
      case 'Battery':
        h +=
          card(
            'Battery Guardian',
            state.battery ? '20% · Essential safety mode' : '82% · Standard mode',
          ) +
          btn('Toggle 20% battery saver', 'battery') +
          card(
            'Sync policy',
            state.battery
              ? 'Nonessential updates paused; emergency action remains available in the demo'
              : 'Standard sample updates',
          );
        break;
      case 'Connection':
        h +=
          card(
            'Connectivity',
            state.network
              ? 'Phone network available'
              : 'Offline: emergency event queued, not delivered',
          ) +
          btn('Toggle network', 'network') +
          card(
            'Routes',
            'BLE → Phone → Wi-Fi/LTE; independent Watch LTE and emergency relay are concepts, not guaranteed connectivity.',
          );
        break;
      case 'Privacy':
        h +=
          card(
            'Consent dashboard',
            'Location: ' +
              (state.sharing ? 'allowed' : 'denied') +
              ' · Demo diagnostics: ' +
              (state.privacy ? 'enabled' : 'disabled'),
          ) +
          btn('Toggle location sharing', 'share') +
          btn('Toggle demo diagnostics', 'privacy') +
          btn('Clear demo timeline', 'clear');
        break;
      case 'Kids':
      case 'Senior':
        h +=
          card(
            screen + ' mode',
            'Simplified controls, trusted contacts and explicit sharing choices.',
          ) +
          btn('Activate ' + screen + ' mode', 'role') +
          btn('Check-in', 'checkin') +
          btn('Emergency demo', 'sos-open', 'danger');
        break;
      case 'Care Center':
        h +=
          card(
            'Devices · fictional',
            'A-Z Phone: ' + (state.network ? 'online' : 'offline') + ' · A-Z Watch: connected',
          ) +
          card('Alerts', incident === 'none' ? 'No active alerts' : 'Emergency: ' + incident) +
          btn('Acknowledge alert', 'sos-ack') +
          card(
            'Access control',
            'Demo only; real role-based permissions require a secure backend.',
          );
        break;
      case 'Settings':
        h +=
          btn('Restore defaults', 'reset') +
          btn('Show permissions', 'privacy-open') +
          card('Device status', 'Concept hardware · not a shipping specification');
        break;
      default:
        h += card('Example response', screen);
    }
    $('phoneContent').innerHTML = h;
  }
  function renderWatch() {
    const w = watch[watchIndex];
    $('watchContent').innerHTML =
      '<h3>' + w[0] + '</h3><div class="reading">' + w[1] + '</div><p>' + w[2] + '</p>';
    $('watchBattery').textContent = (state.battery ? '20%' : '82%') + ' ◉';
  }
  function open(s) {
    screen = s;
    renderPhone();
    event('Phone opened ' + s);
  }
  function sos(source) {
    incident = 'Countdown · ' + source;
    screen = 'SOS';
    renderPhone();
    event(source + ' initiated SOS countdown (demo)');
  }
  function act(a) {
    switch (a) {
      case 'home':
        open('Home');
        break;
      case 'sos-open':
        open('SOS');
        break;
      case 'sos-start':
        sos('Phone');
        break;
      case 'sos-confirm':
        if (!incident.startsWith('Countdown')) {
          event('SOS confirmation ignored: no countdown active');
          break;
        }
        incident = state.network ? 'Simulated contact notified' : 'Queued offline (not sent)';
        state.ack = false;
        event('SOS ' + incident);
        renderPhone();
        break;
      case 'sos-cancel':
        incident = 'Cancelled';
        event('SOS cancelled');
        renderPhone();
        break;
      case 'sos-ack':
        if (incident !== 'Simulated contact notified') {
          event('Acknowledgement unavailable: no delivered SOS');
          break;
        }
        state.ack = true;
        incident = 'Acknowledged by fictional contact';
        event('Fictional contact acknowledged alert');
        renderPhone();
        break;
      case 'scam-review':
        scamReviewed = true;
        event('Sample SMS reviewed');
        renderPhone();
        break;
      case 'scam-block':
        event('Sample sender blocked in demo');
        break;
      case 'scam-false':
        event('False positive feedback recorded locally');
        break;
      case 'ai-scam':
        screen = 'AI: Bank message';
        renderPhone();
        $('phoneContent').insertAdjacentHTML(
          'beforeend',
          card(
            'Scripted guidance',
            'Do not click the link. Verify using your bank’s official app or known phone number.',
          ),
        );
        break;
      case 'ai-fall':
        screen = 'AI: Fall guidance';
        renderPhone();
        $('phoneContent').insertAdjacentHTML(
          'beforeend',
          card(
            'Scripted guidance',
            'Check immediate safety and contact local emergency services directly when necessary.',
          ),
        );
        break;
      case 'ai-privacy':
        screen = 'AI: Privacy';
        renderPhone();
        $('phoneContent').insertAdjacentHTML(
          'beforeend',
          card(
            'Scripted guidance',
            'Share only with trusted people, review permissions and revoke access whenever needed.',
          ),
        );
        break;
      case 'fall':
        sos('Watch fall detection');
        break;
      case 'checkin':
        checkIn = true;
        event('Simulated safe check-in');
        renderPhone();
        break;
      case 'location-open':
        open('Location');
        break;
      case 'privacy-open':
        open('Privacy');
        break;
      case 'share':
        state.sharing = !state.sharing;
        $('sharing').checked = state.sharing;
        event('Location demo consent ' + (state.sharing ? 'granted' : 'revoked'));
        renderPhone();
        break;
      case 'battery':
        state.battery = !state.battery;
        $('battery').checked = state.battery;
        renderWatch();
        renderPhone();
        event('Battery saver ' + (state.battery ? 'enabled' : 'disabled'));
        break;
      case 'network':
        state.network = !state.network;
        $('network').checked = state.network;
        event('Network ' + (state.network ? 'restored' : 'lost'));
        if (state.network && incident.startsWith('Queued')) {
          incident = 'Simulated contact notified';
          event('Queued SOS delivered in demo');
        }
        renderPhone();
        break;
      case 'privacy':
        state.privacy = !state.privacy;
        renderPhone();
        event('Diagnostics permission changed');
        break;
      case 'role':
        state.role = screen;
        event(screen + ' mode selected');
        break;
      case 'clear':
        log = [];
        $('timeline').replaceChildren();
        break;
      case 'reset':
        reset();
        break;
    }
  }
  function reset() {
    screen = 'Home';
    watchIndex = 0;
    step = 0;
    incident = 'none';
    scamReviewed = false;
    checkIn = false;
    Object.assign(state, {
      network: true,
      sharing: false,
      battery: false,
      privacy: false,
      role: 'Senior',
      ack: false,
    });
    ['network', 'sharing', 'battery'].forEach((k) => ($(k).checked = state[k]));
    log = [];
    renderPhone();
    renderWatch();
    event('Demo reset');
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-action]');
    const o = e.target.closest('[data-open]');
    if (a) act(a.dataset.action);
    else if (o) open(o.dataset.open);
  });
  $('home').onclick = () => open('Home');
  $('watchSOS').onclick = () => sos('Watch');
  $('prev').onclick = () => {
    watchIndex = (watchIndex + watch.length - 1) % watch.length;
    renderWatch();
  };
  $('next').onclick = () => {
    watchIndex = (watchIndex + 1) % watch.length;
    renderWatch();
  };
  let x0 = null;
  const ws = $('watchContent');
  ws.addEventListener(
    'touchstart',
    (e) => {
      x0 = e.changedTouches[0].clientX;
    },
    { passive: true },
  );
  ws.addEventListener(
    'touchend',
    (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 35) {
        watchIndex = (watchIndex + (dx < 0 ? 1 : watch.length - 1)) % watch.length;
        renderWatch();
      }
      x0 = null;
    },
    { passive: true },
  );
  ws.tabIndex = 0;
  ws.setAttribute('aria-label', 'Watch metric screen. Use left and right arrow keys to navigate.');
  ws.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      watchIndex = (watchIndex + (e.key === 'ArrowRight' ? 1 : watch.length - 1)) % watch.length;
      renderWatch();
    }
  });
  ['network', 'sharing', 'battery'].forEach(
    (k) => ($(k).onchange = () => act(k === 'sharing' ? 'share' : k)),
  );
  $('reset').onclick = reset;
  $('clearLog').onclick = () => act('clear');
  const scenarios = [
    [
      'Suspicious bank SMS',
      () => {
        open('Scam Shield');
        act('scam-review');
      },
    ],
    ['Watch fall → Phone SOS', () => sos('Watch fall detection')],
    [
      'Child safe check-in',
      () => {
        open('Family');
        act('checkin');
      },
    ],
    [
      'Low battery mode',
      () => {
        if (!state.battery) act('battery');
        open('Battery');
      },
    ],
    [
      'Offline SOS retry',
      () => {
        if (state.network) act('network');
        sos('Watch');
        act('sos-confirm');
        open('Connection');
      },
    ],
    ['Privacy & consent', () => open('Privacy')],
  ];
  $('scenarios').innerHTML = scenarios
    .map((s, i) => '<button data-scenario="' + i + '">' + s[0] + ' →</button>')
    .join('');
  $('scenarios').onclick = (e) => {
    const b = e.target.closest('[data-scenario]');
    if (b) scenarios[Number(b.dataset.scenario)][1]();
  };
  function tick() {
    const d = new Date();
    $('clock').textContent = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }
  tick();
  setInterval(tick, 60000);
  reset();
})();
