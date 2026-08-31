const phoneView = document.getElementById('phoneView');
const phoneTabs = [...document.querySelectorAll('.phone-tab')];
let currentPhoneScreen = 'home';

function getPhoneGreeting(hour = new Date().getHours()) {
  if (hour >= 5 && hour < 12) return 'GOOD MORNING';
  if (hour >= 12 && hour < 17) return 'GOOD AFTERNOON';
  if (hour >= 17 && hour < 22) return 'GOOD EVENING';
  return 'GOOD NIGHT';
}

function getPhoneDate() {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(new Date());
}

const phoneScreens = {
  home: `
    <div class="phone-title"><div><small id="homeGreeting">${getPhoneGreeting()}</small><h3>Alex</h3><p id="homeDate" style="margin:5px 0 0;color:#8997aa;font-size:9px;line-height:1.3">${getPhoneDate()}</p></div><div class="avatar">A</div></div>
    <div class="status-card"><div class="shield">✓</div><div><strong>Everything looks safe</strong><small>No active safety alerts</small></div></div>
    <div class="phone-label">ESSENTIALS</div>
    <div class="phone-app-grid">
      <button data-app="calls"><span>☎</span><strong>Calls</strong></button>
      <button data-app="messages"><span>💬</span><strong>Messages</strong></button>
      <button data-app="browser"><span>◎</span><strong>Safe Browser</strong></button>
      <button data-app="contacts"><span>♥</span><strong>Trusted</strong></button>
      <button data-app="lost"><span>⌖</span><strong>Find me</strong></button>
      <button data-app="emergency"><span>✚</span><strong>Emergency</strong></button>
    </div>
    <button class="phone-sos" data-app="sosphone">SOS · Emergency</button>`,

  protect: `
    <div class="phone-title"><div><small>PROTECTION</small><h3>Safety Center</h3></div><div class="avatar">◇</div></div>
    <div class="status-card"><div class="shield">✓</div><div><strong>Protection ready</strong><small>Demo safety services active</small></div></div>
    <div class="phone-label">CHECK SOMETHING</div>
    <div class="phone-app-grid compact">
      <button data-app="messages"><span>✉</span><strong>Message</strong></button>
      <button data-app="browser"><span>↗</span><strong>Link</strong></button>
      <button data-app="calls"><span>☎</span><strong>Caller</strong></button>
      <button data-app="ai"><span>✦</span><strong>Ask AI</strong></button>
    </div>
    <div class="phone-label">RECENT</div>
    <button class="phone-alert-row" data-app="messages"><span>⚠</span><div><strong>Suspicious message</strong><small>Potential phishing link · 12:14</small></div><b>›</b></button>`,

  location: `
    <div class="phone-title"><div><small>FAMILY</small><h3>Family Hub</h3></div><div class="avatar">⌖</div></div>
    <div class="mini-map"><span class="map-pin a">A</span><span class="map-pin m">M</span></div>
    <div class="phone-label">FAMILY STATUS</div>
    <button class="family-mini phone-row-button" data-app="familydetail"><div class="mini-avatar">M</div><div><strong>Mom · Home</strong><small>Battery 74% · Online</small></div><span class="dot"></span></button>
    <button class="family-mini phone-row-button" data-app="battery"><div class="mini-avatar">G</div><div><strong>Grandma · Home</strong><small>Battery 12% · Low</small></div><span class="warn-dot"></span></button>
    <div class="phone-mini-actions"><button data-app="safezones">Safe zones</button><button data-app="imok">I'm OK</button></div>`,

  ai: `
    <div class="phone-title"><div><small>SAFETY ASSISTANT</small><h3>A-Z Care AI</h3></div><div class="avatar">✦</div></div>
    <div class="ai-phone-chat">“My bank says I need to verify my account through a link. Is this safe?”</div>
    <div class="ai-phone-result"><strong>⚠ Pause before acting</strong><p>Unexpected urgency and a login link are common scam signals. Open your bank app directly or call the official number instead.</p></div>
    <div class="phone-label">ASK A-Z CARE</div>
    <div class="phone-app-grid compact"><button data-app="messages"><span>✉</span><strong>Message</strong></button><button data-app="browser"><span>↗</span><strong>Link</strong></button><button data-app="calls"><span>☎</span><strong>Call</strong></button><button data-app="contacts"><span>♥</span><strong>Ask family</strong></button></div>
    <button class="voice-button">🔊 Read explanation aloud</button>`,

  calls: `
    <div class="phone-subhead"><button data-back>‹</button><div><small>CALL PROTECTION</small><h3>Incoming call</h3></div></div>
    <div class="caller-big">?</div><h4 class="phone-center-title">Unknown caller</h4><p class="phone-center-muted">+371 2X XXX XXX</p>
    <div class="phone-warning"><strong>⚠ Possible scam</strong><p>This caller may be impersonating an organization. Never share passwords or verification codes.</p></div>
    <div class="phone-action-row"><button class="good">Decline</button><button data-app="ai">✦ Ask AI</button></div>
    <button class="phone-wide-action" data-app="contacts">Call trusted contact instead</button>`,

  messages: `
    <div class="phone-subhead"><button data-back>‹</button><div><small>SAFE INBOX</small><h3>Message check</h3></div></div>
    <div class="sms-phone-bubble">Your bank account has been blocked. Verify now: <b>secure-bank-check.example</b></div>
    <div class="phone-warning"><strong>⚠ Be careful</strong><p>A-Z Care noticed urgency, an unfamiliar link and a request to take account action.</p></div>
    <div class="phone-signal-list"><span>• Creates urgency</span><span>• Unknown domain</span><span>• Account threat</span></div>
    <div class="phone-action-row"><button>Delete</button><button data-app="ai">✦ Ask AI</button></div><button class="phone-wide-action" data-app="contacts">Ask family</button>`,

  browser: `
    <div class="phone-subhead"><button data-back>‹</button><div><small>SAFE BROWSER</small><h3>Website warning</h3></div></div>
    <div class="browser-bar">🔒 delivery-check.example</div>
    <div class="browser-warning-icon">!</div>
    <h4 class="phone-center-title">This page may be unsafe</h4><p class="phone-center-muted wide">The address does not match the expected official website and asks for payment information.</p>
    <button class="phone-wide-action good">← Go back</button><button class="phone-wide-action" data-app="ai">✦ Ask A-Z Care</button>`,

  contacts: `
    <div class="phone-subhead"><button data-back>‹</button><div><small>TRUSTED PEOPLE</small><h3>My contacts</h3></div></div>
    <div class="trusted-list"><div><span class="mini-avatar">A</span><p><strong>Anna</strong><small>Daughter · Trusted</small></p><button>☎</button></div><div><span class="mini-avatar">M</span><p><strong>Michael</strong><small>Son · Trusted</small></p><button>☎</button></div><div><span class="mini-avatar">N</span><p><strong>Neighbour</strong><small>Trusted helper</small></p><button>☎</button></div></div>
    <button class="phone-wide-action">+ Add trusted person</button>`,

  lost: `
    <div class="phone-subhead"><button data-back>‹</button><div><small>FIND ME</small><h3>I'm lost</h3></div></div>
    <div class="location-card"><span>⌖</span><strong>Your current location</strong><p>Brīvības iela 120<br>Riga, Latvia</p></div>
    <button class="phone-wide-action good">Navigate home</button><button class="phone-wide-action" data-app="contacts">☎ Call family</button><button class="phone-wide-action" data-app="imok">Share location</button>`,

  emergency: `
    <div class="phone-subhead"><button data-back>‹</button><div><small>LOCK SCREEN ACCESS</small><h3>Emergency Card</h3></div></div>
    <div class="emergency-card"><div class="emergency-symbol">✚</div><strong>Emergency information</strong><p>Only information chosen by the owner is visible here.</p></div>
    <div class="phone-label">TRUSTED CONTACT</div><div class="trusted-quick"><span class="mini-avatar">A</span><div><strong>Anna</strong><small>Daughter</small></div><button>☎ Call</button></div>
    <button class="phone-sos" data-app="sosphone">SOS · Get help</button>`,

  sosphone: `
    <div class="phone-subhead"><button data-back>‹</button><div><small>EMERGENCY</small><h3>Get help</h3></div></div>
    <div class="phone-sos-orb">SOS</div><p class="phone-center-muted wide">Choose what is happening. Trusted contacts and location sharing activate only when you confirm.</p>
    <div class="sos-phone-grid"><button>I feel unsafe</button><button>I'm lost</button><button>Medical help</button><button>Call family</button></div>
    <button class="phone-sos active-demo">Hold to activate SOS</button>`,

  safezones: `
    <div class="phone-subhead"><button data-back>‹</button><div><small>FAMILY SAFETY</small><h3>Safe zones</h3></div></div>
    <div class="zone-list"><div><span>⌂</span><p><strong>Home</strong><small>Active · Arrive/leave alerts</small></p><b>ON</b></div><div><span>▣</span><p><strong>School</strong><small>Active · Weekdays</small></p><b>ON</b></div><div><span>♥</span><p><strong>Grandma's house</strong><small>Optional family zone</small></p><b>ON</b></div></div>
    <div class="privacy-mini-note">Visible and consent-based. No hidden tracking.</div>`,

  imok: `
    <div class="phone-subhead"><button data-back>‹</button><div><small>CHECK-IN</small><h3>I'm OK</h3></div></div>
    <div class="ok-orb">✓</div><h4 class="phone-center-title">Let family know you're safe</h4><p class="phone-center-muted wide">Send a simple check-in without starting an emergency alert.</p>
    <button class="phone-wide-action good" id="sendOkDemo">Send “I'm OK”</button><div id="okResult" class="ok-result">Ready to send to trusted contacts.</div>`,

  familydetail: `
    <div class="phone-subhead"><button data-back>‹</button><div><small>FAMILY MEMBER</small><h3>Mom</h3></div></div>
    <div class="family-profile"><div class="avatar large">M</div><strong>Home</strong><small>Online now · Battery 74%</small></div>
    <div class="phone-info-grid"><div><small>LOCATION</small><strong>Home</strong></div><div><small>BATTERY</small><strong>74%</strong></div><div><small>LAST UPDATE</small><strong>Now</strong></div><div><small>SHARING</small><strong>Enabled</strong></div></div>
    <button class="phone-wide-action">☎ Call Mom</button>`,

  battery: `
    <div class="phone-subhead"><button data-back>‹</button><div><small>DEVICE STATUS</small><h3>Grandma's phone</h3></div></div>
    <div class="battery-big"><span>12%</span></div><div class="phone-warning"><strong>Low battery</strong><p>The phone is online, but battery is low. A family member can choose whether to check in.</p></div><button class="phone-wide-action" data-app="contacts">☎ Check in</button>`,
};

function showPhoneScreen(name, keepTab = false) {
  if (!phoneScreens[name]) return;
  currentPhoneScreen = name;
  phoneView.innerHTML = phoneScreens[name];
  if (!keepTab) phoneTabs.forEach(tab => tab.classList.toggle('active', tab.dataset.screen === name));
  else phoneTabs.forEach(tab => tab.classList.remove('active'));
  bindPhoneScreenActions();
}

function bindPhoneScreenActions() {
  phoneView.querySelectorAll('[data-app]').forEach(button => button.addEventListener('click', () => showPhoneScreen(button.dataset.app, true)));
  phoneView.querySelectorAll('[data-back]').forEach(button => button.addEventListener('click', () => showPhoneScreen('home')));
  const sendOk = document.getElementById('sendOkDemo');
  if (sendOk) sendOk.addEventListener('click', () => {
    const result = document.getElementById('okResult');
    sendOk.textContent = 'Sent ✓';
    sendOk.disabled = true;
    result.textContent = 'Trusted contacts received your check-in.';
    result.classList.add('sent');
  });
  const phoneSos = phoneView.querySelector('.active-demo');
  if (phoneSos) phoneSos.addEventListener('click', () => {
    phoneSos.textContent = 'SOS demo activated ✓';
    phoneSos.disabled = true;
  });
}

phoneTabs.forEach(tab => tab.addEventListener('click', () => showPhoneScreen(tab.dataset.screen)));
document.querySelectorAll('[data-phone-screen]').forEach(button => button.addEventListener('click', () => {
  showPhoneScreen(button.dataset.phoneScreen);
  document.getElementById('product').scrollIntoView({behavior:'smooth', block:'center'});
}));
showPhoneScreen('home');

function updatePhoneClock() {
  const clock = document.querySelector('.phone-status span:first-child');
  if (!clock) return;
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  clock.textContent = `${hours}:${minutes}`;
  const greeting = document.getElementById('homeGreeting');
  const date = document.getElementById('homeDate');
  if (greeting) greeting.textContent = getPhoneGreeting(now.getHours());
  if (date) date.textContent = getPhoneDate();
}
updatePhoneClock();
setInterval(updatePhoneClock, 1000);
window.addEventListener('pageshow', updatePhoneClock);
document.addEventListener('visibilitychange', () => { if (!document.hidden) updatePhoneClock(); });

const aiButton = document.getElementById('runAiDemo');
const aiResult = document.getElementById('aiResult');
if (aiButton && aiResult) aiButton.addEventListener('click', () => {
  aiButton.disabled = true;
  aiButton.textContent = 'Analyzing…';
  aiResult.className = 'analysis-card';
  aiResult.innerHTML = '<div class="analysis-state"><span class="loader-dot"></span><span>Checking message patterns…</span></div><p>Looking for urgency, impersonation cues and suspicious link behavior.</p>';
  setTimeout(() => {
    aiResult.className = 'analysis-card danger-result';
    aiResult.innerHTML = '<div class="analysis-state"><span class="loader-dot"></span><span>High-risk signals detected</span></div><p>This example creates urgency and asks the user to sign in through an unfamiliar link. Safer next step: do not open it; use the bank app or official contact details instead.</p><div class="risk-tags"><span>Urgency</span><span>Unknown domain</span><span>Account threat</span><span>Credential risk</span></div>';
    aiButton.textContent = 'Analysis complete ✓';
    setTimeout(() => { aiButton.disabled = false; aiButton.textContent = 'Run demo analysis'; }, 2600);
  }, 1200);
});

let selectedReason = 'I feel unsafe';
const reasonButtons = [...document.querySelectorAll('[data-sos-reason]')];
reasonButtons[0]?.classList.add('selected');
reasonButtons.forEach(button => button.addEventListener('click', () => {
  selectedReason = button.dataset.sosReason;
  reasonButtons.forEach(item => item.classList.toggle('selected', item === button));
}));

const activateSos = document.getElementById('activateSos');
const resetSos = document.getElementById('resetSos');
const sosConsole = document.getElementById('sosConsole');
if (activateSos && resetSos && sosConsole) {
  activateSos.addEventListener('click', () => {
    const title = sosConsole.querySelector('.sos-top h3');
    const steps = [...sosConsole.querySelectorAll('.sos-step')];
    title.textContent = `${selectedReason} · SOS active`;
    activateSos.textContent = 'SOS simulation active';
    activateSos.disabled = true;
    steps.forEach((step, index) => setTimeout(() => {
      step.classList.add('complete');
      step.querySelector('span').textContent = '✓';
      step.querySelector('small').textContent = index === 0 ? 'Trusted contacts notified' : index === 1 ? 'Location shared for this SOS' : 'Emergency status is live';
    }, 450 * (index + 1)));
  });
  resetSos.addEventListener('click', () => {
    sosConsole.querySelector('.sos-top h3').textContent = 'Emergency mode ready';
    [...sosConsole.querySelectorAll('.sos-step')].forEach((step, index) => {
      step.classList.remove('complete'); step.querySelector('span').textContent = index + 1;
      step.querySelector('small').textContent = ['Ready to notify','Sharing only when activated','Visible to trusted contacts'][index];
    });
    activateSos.disabled = false; activateSos.textContent = 'Hold to simulate SOS';
  });
}

document.querySelectorAll('[data-scroll]').forEach(button => button.addEventListener('click', () => document.querySelector(button.dataset.scroll)?.scrollIntoView({behavior:'smooth'})));
const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), {threshold:.12});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const responsiveStyles = document.createElement('link');
responsiveStyles.rel = 'stylesheet';
responsiveStyles.href = 'css/responsive.css';
document.head.appendChild(responsiveStyles);

const siteNav = document.querySelector('.nav');
if (siteNav) {
  const mobileButton = document.createElement('button');
  mobileButton.className = 'mobile-menu-button'; mobileButton.type = 'button';
  mobileButton.setAttribute('aria-label', 'Open navigation'); mobileButton.setAttribute('aria-expanded', 'false'); mobileButton.innerHTML = '☰';
  siteNav.appendChild(mobileButton);
  const mobileMenu = document.createElement('nav');
  mobileMenu.className = 'mobile-menu'; mobileMenu.setAttribute('aria-label', 'Mobile navigation');
  mobileMenu.innerHTML = '<a href="#product">Product</a><a href="#ai">AI Safety</a><a href="#scam">Scam Protection</a><a href="#sos">SOS</a><a href="#family">Family</a><a href="#modes">Kids & Seniors</a><a href="#privacy">Privacy</a><a href="#roadmap">Roadmap</a>';
  document.body.appendChild(mobileMenu);
  const closeMobileMenu = () => { mobileMenu.classList.remove('open'); document.body.classList.remove('mobile-menu-open'); mobileButton.setAttribute('aria-expanded','false'); mobileButton.innerHTML='☰'; };
  mobileButton.addEventListener('click', () => { const opening = !mobileMenu.classList.contains('open'); mobileMenu.classList.toggle('open', opening); document.body.classList.toggle('mobile-menu-open', opening); mobileButton.setAttribute('aria-expanded', String(opening)); mobileButton.innerHTML = opening ? '×' : '☰'; });
  mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMobileMenu));
  window.addEventListener('resize', () => { if (window.innerWidth > 640) closeMobileMenu(); });
}