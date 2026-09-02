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
    <div class="phone-app-grid compact"><button data-app="messages"><span>✉</span><strong>Message</strong></button><button data-app="browser"><span>↗</span><strong>Link</strong></button><button data-app="calls"><span>☎</span><strong>Call</strong></button><button data-app="contacts"><span>♥</span><strong>Ask family</strong></button></div>`,

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

// Product clarity, waitlist, interactive AI demo, use cases and FAQ.
(() => {
  const style = document.createElement('style');
  style.textContent = `
    .product-definition{margin:14px 0 0;color:#8997aa;font-size:11px;line-height:1.5}.waitlist-mini{margin-top:20px;max-width:520px}.waitlist-mini strong{display:block;color:#f4f7fb;font-size:12px;margin-bottom:9px}.waitlist-row{display:flex;gap:8px}.waitlist-row input{min-width:0;flex:1;border:1px solid var(--line);background:#09111b;color:#fff;border-radius:12px;padding:12px 14px;font:inherit;outline:none}.waitlist-row input:focus{border-color:rgba(91,140,255,.7);box-shadow:0 0 0 3px rgba(91,140,255,.08)}.waitlist-row button{white-space:nowrap}.waitlist-status{display:block;min-height:16px;margin-top:7px;color:#7f8b9c;font-size:10px}.waitlist-status.ok{color:var(--green)}.waitlist-status.err{color:#ff8090}
    .ai-live-form{margin-top:14px}.ai-live-form textarea{width:100%;min-height:94px;resize:vertical;border:1px solid var(--line);background:#09111b;color:#f5f7fb;border-radius:14px;padding:13px 14px;font:inherit;line-height:1.45;outline:none}.ai-live-form textarea:focus{border-color:rgba(91,140,255,.7);box-shadow:0 0 0 3px rgba(91,140,255,.08)}.ai-live-actions{display:flex;gap:8px;align-items:center;margin-top:9px;flex-wrap:wrap}.ai-live-actions button{border:1px solid var(--line);background:rgba(255,255,255,.04);color:#dce6f4;border-radius:10px;padding:9px 12px;cursor:pointer}.ai-live-actions .ai-analyze{background:linear-gradient(135deg,#4f7cff,#42d7c4);color:#061018;border:0;font-weight:800}.ai-demo-note{margin-top:9px!important;font-size:10px!important;color:#69778a!important}.ai-examples{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px}.ai-examples button{border:1px solid var(--line);background:transparent;color:#8e9bae;border-radius:999px;padding:6px 9px;font-size:9px;cursor:pointer}
    .usecase-family{border:1px solid var(--line);border-radius:22px;padding:28px;background:linear-gradient(145deg,rgba(255,255,255,.045),rgba(255,255,255,.015))}.usecase-family .mode-label{display:inline-block;margin-bottom:18px}.usecase-family h3{font-size:24px;margin:0 0 12px}.usecase-family p{color:var(--muted);line-height:1.65}.family-use-list{display:grid;gap:9px;margin-top:20px}.family-use-list span{border:1px solid var(--line);border-radius:11px;padding:10px 12px;color:#b7c2d0;font-size:11px}.mode-grid.three-usecases{grid-template-columns:repeat(3,1fr)}
    .faq-section{border-top:1px solid var(--line)}.faq-wrap{max-width:900px;margin:0 auto}.faq-list{display:grid;gap:10px;margin-top:30px}.faq-item{border:1px solid var(--line);border-radius:16px;background:rgba(255,255,255,.02);overflow:hidden}.faq-item button{width:100%;display:flex;justify-content:space-between;gap:20px;text-align:left;border:0;background:transparent;color:#eef3f9;padding:18px 20px;font:inherit;font-weight:700;cursor:pointer}.faq-item button span:last-child{color:#6f7f94}.faq-answer{display:none;padding:0 20px 18px;color:var(--muted);font-size:13px;line-height:1.65}.faq-item.open .faq-answer{display:block}
    @media(max-width:900px){.mode-grid.three-usecases{grid-template-columns:1fr}.waitlist-row{flex-direction:column}.waitlist-row .button{width:100%}}
  `;
  document.head.appendChild(style);

  const heroLead = document.querySelector('.hero-lead');
  if (heroLead) heroLead.textContent = 'A-Z Care is an AI-assisted smartphone safety concept for kids, seniors and families — designed to recognize scams and digital risks, make emergencies simpler and keep trusted people connected.';

  const heroActions = document.querySelector('.hero-copy .hero-actions');
  if (heroActions) {
    const definition = document.createElement('p');
    definition.className = 'product-definition';
    definition.textContent = 'Interactive web prototype · Mobile product in development';
    heroActions.insertAdjacentElement('beforebegin', definition);

    const waitlist = document.createElement('form');
    waitlist.className = 'waitlist-mini';
    waitlist.id = 'earlyAccess';
    waitlist.innerHTML = '<strong>Get early access to A-Z Care</strong><div class="waitlist-row"><input type="email" name="email" autocomplete="email" maxlength="254" required placeholder="Your email address" aria-label="Email address"><button class="button primary" type="submit">Join waitlist</button></div><span class="waitlist-status" aria-live="polite">No spam. Early prototype updates only.</span>';
    heroActions.insertAdjacentElement('afterend', waitlist);

    waitlist.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = waitlist.elements.email.value.trim();
      const button = waitlist.querySelector('button');
      const status = waitlist.querySelector('.waitlist-status');
      if (!email || !waitlist.reportValidity()) return;
      button.disabled = true; button.textContent = 'Joining…'; status.className = 'waitlist-status'; status.textContent = 'Saving your email…';
      try {
        const response = await fetch('https://juulhxotgrryscehsjlj.supabase.co/rest/v1/survey_responses', {
          method:'POST',
          headers:{'apikey':'sb_publishable_60swk3LP-qrxpWy-nLmM8g_SR-NrCI6','Content-Type':'application/json','Prefer':'return=minimal'},
          body:JSON.stringify({audience:'waitlist',purchase_intent:'early_access',important_features:'early_access',email})
        });
        if (!response.ok) throw new Error('Waitlist request failed');
        waitlist.elements.email.value = '';
        status.className = 'waitlist-status ok'; status.textContent = 'You’re on the early-access list ✓'; button.textContent = 'Joined ✓';
        if (typeof window.gtag === 'function') window.gtag('event','waitlist_join',{event_category:'conversion'});
      } catch (error) {
        status.className = 'waitlist-status err'; status.textContent = 'Could not join right now. Please try again.'; button.disabled = false; button.textContent = 'Join waitlist';
      }
    });
  }

  const aiPanel = document.querySelector('#ai .assistant-panel');
  const oldAiButton = document.getElementById('runAiDemo');
  if (oldAiButton) oldAiButton.style.display = 'none';
  if (aiPanel) {
    aiPanel.innerHTML = '<div class="panel-head"><div class="ai-mark">✦</div><div><strong>A-Z Care AI</strong><small>Safety Assistant · Interactive concept demo</small></div><span class="online-dot"></span></div><div class="analysis-card" id="liveAiResult"><div class="analysis-state"><span class="loader-dot"></span><span>Ask before you act</span></div><p>Paste a suspicious message, link or describe a situation. This demo recognizes common safety patterns locally; live AI will be connected next.</p></div><form class="ai-live-form" id="aiLiveForm"><textarea id="aiLiveInput" maxlength="600" required placeholder="Example: My bank texted me a link and says my account will be blocked today…"></textarea><div class="ai-examples"><button type="button" data-ai-example="bank">Bank message</button><button type="button" data-ai-example="parcel">Parcel link</button><button type="button" data-ai-example="call">Unknown call</button><button type="button" data-ai-example="family">Family safety</button></div><div class="ai-live-actions"><button class="ai-analyze" type="submit">✦ Ask A-Z Care</button><button type="button" id="clearAiDemo">Clear</button></div><p class="ai-demo-note">Concept demo — not a live security service. Do not enter passwords, card details or verification codes.</p></form>';
    const form = aiPanel.querySelector('#aiLiveForm');
    const input = aiPanel.querySelector('#aiLiveInput');
    const result = aiPanel.querySelector('#liveAiResult');
    const examples = {
      bank:'Your bank account will be locked today. Verify immediately using this link and enter the code we send you.',
      parcel:'Your parcel is waiting. Pay €1.99 now using delivery-check.example or it will be returned.',
      call:'Someone called my mother saying they are from the bank and asked for her verification code.',
      family:'My child is late coming home and is not answering the phone. What should I do?'
    };
    aiPanel.querySelectorAll('[data-ai-example]').forEach(button => button.addEventListener('click', () => { input.value = examples[button.dataset.aiExample]; input.focus(); }));
    aiPanel.querySelector('#clearAiDemo').addEventListener('click', () => { input.value=''; result.className='analysis-card'; result.innerHTML='<div class="analysis-state"><span class="loader-dot"></span><span>Ask before you act</span></div><p>Paste a suspicious message, link or describe a situation.</p>'; input.focus(); });
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const text = input.value.trim(); if (!text) return;
      const lower = text.toLowerCase();
      const hasLink = /(https?:\/\/|www\.|\.com|\.lv|\.net|\.org|link)/i.test(text);
      const urgency = /(urgent|immediately|today|now|blocked|locked|expire|return|срочно|сегодня|заблок|немедленно)/i.test(text);
      const code = /(code|verification|otp|password|pin|код|парол)/i.test(text);
      const payment = /(pay|€|payment|card|bank|оплат|банк|кар[тд])/i.test(text);
      const family = /(child|kid|daughter|son|mother|father|parent|grandma|family|реб[её]н|мам|пап|семь)/i.test(text);
      const signals = [hasLink&&'Unfamiliar link',urgency&&'Urgency / pressure',code&&'Sensitive code request',payment&&'Money / account context'].filter(Boolean);
      let title = 'No obvious high-risk pattern in this demo';
      let answer = 'Stay cautious and verify important requests through an official app, website or a trusted contact before acting.';
      let cls = 'analysis-card';
      if (code || (hasLink && urgency) || (payment && urgency)) { title='⚠ Possible scam — pause before acting'; answer='Do not share verification codes, passwords or payment details. Avoid the link and contact the organization through its official app, website or known phone number.'; cls='analysis-card danger-result'; }
      else if (family) { title='Family safety situation'; answer='Try the person again and contact a trusted nearby person. If you believe someone is in immediate danger, contact local emergency services rather than relying on this demo.'; }
      else if (hasLink || urgency) { title='⚠ Worth checking before you act'; answer='The message contains a warning sign. Do not rush. Verify the sender independently and open the official service directly instead of using the message link.'; cls='analysis-card danger-result'; }
      result.className=cls;
      result.innerHTML='<div class="analysis-state"><span class="loader-dot"></span><span>'+title+'</span></div><p>'+answer+'</p>'+(signals.length?'<div class="risk-tags">'+signals.map(s=>'<span>'+s+'</span>').join('')+'</div>':'');
      if (typeof window.gtag === 'function') window.gtag('event','ai_demo_question',{event_category:'ai_demo'});
    });
  }

  const modes = document.getElementById('modes');
  if (modes) {
    const eyebrow = modes.querySelector('.eyebrow'); const heading = modes.querySelector('h2'); const grid = modes.querySelector('.mode-grid');
    if (eyebrow) eyebrow.textContent='WHO A-Z CARE IS FOR';
    if (heading) heading.textContent='Different people. Different risks. One safety layer.';
    if (grid) {
      grid.classList.add('three-usecases');
      const familyCard=document.createElement('article'); familyCard.className='usecase-family reveal';
      familyCard.innerHTML='<span class="mode-label">FOR FAMILIES & CAREGIVERS</span><h3>More context. Less worrying.</h3><p>Trusted people can see the safety information that has deliberately been shared and step in when someone needs help.</p><div class="family-use-list"><span>⌖ Consent-based family status</span><span>✓ Safe-zone and battery context</span><span>♥ Trusted contact escalation</span></div>';
      grid.appendChild(familyCard); observer.observe(familyCard);
    }
  }

  const roadmap = document.getElementById('roadmap');
  if (roadmap) {
    const faq=document.createElement('section'); faq.className='section faq-section'; faq.id='faq';
    faq.innerHTML='<div class="container faq-wrap"><div class="section-heading center"><p class="eyebrow">FAQ</p><h2>What A-Z Care is — and what it isn’t yet.</h2><p>A-Z Care is currently an interactive concept and web prototype. The mobile product is still being designed and validated.</p></div><div class="faq-list"><div class="faq-item"><button type="button"><span>Is A-Z Care an app, a phone or an operating system?</span><span>+</span></button><div class="faq-answer">Right now it is an interactive product concept. The goal is a safer smartphone experience with protection, AI assistance, SOS and family-safety features. The final mobile architecture is still being evaluated.</div></div><div class="faq-item"><button type="button"><span>Does A-Z Care work on Android and iOS?</span><span>+</span></button><div class="faq-answer">Not yet. The public site demonstrates the intended experience; platform support will be confirmed as the mobile prototype is built.</div></div><div class="faq-item"><button type="button"><span>Is the AI Safety Assistant live?</span><span>+</span></button><div class="faq-answer">The current website demo uses example safety rules so people can try the interaction. A live AI service is planned, with clear limits and privacy protections.</div></div><div class="faq-item"><button type="button"><span>How will personal and family data be protected?</span><span>+</span></button><div class="faq-answer">The concept is privacy-first: clear consent, visible permissions and no hidden family tracking. Exact technical safeguards will be documented as the working prototype is developed.</div></div><div class="faq-item"><button type="button"><span>Will it work without internet?</span><span>+</span></button><div class="faq-answer">Offline behavior has not been finalized. Essential safety flows are being considered for degraded connectivity, but the site does not claim offline protection today.</div></div><div class="faq-item"><button type="button"><span>How much will A-Z Care cost?</span><span>+</span></button><div class="faq-answer">Pricing has not been decided. The current survey and early-access list are helping validate what people need before a pricing model is chosen.</div></div></div></div>';
    roadmap.insertAdjacentElement('beforebegin',faq);
    faq.querySelectorAll('.faq-item button').forEach(button=>button.addEventListener('click',()=>{const item=button.parentElement; const open=item.classList.toggle('open'); button.querySelector('span:last-child').textContent=open?'−':'+';}));
  }
})();