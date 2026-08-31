const phoneView = document.getElementById('phoneView');
const phoneTabs = [...document.querySelectorAll('.phone-tab')];

const phoneScreens = {
  home: `
    <div class="phone-title"><div><small>GOOD MORNING</small><h3>Alex</h3></div><div class="avatar">A</div></div>
    <div class="status-card"><div class="shield">✓</div><div><strong>Everything looks safe</strong><small>No active safety alerts</small></div></div>
    <div class="phone-label">FAMILY</div>
    <div class="family-mini"><div class="mini-avatar">M</div><div><strong>Mom</strong><small>Home · Battery 74%</small></div><span class="dot"></span></div>
    <div class="family-mini"><div class="mini-avatar">D</div><div><strong>Dad</strong><small>Work · Battery 61%</small></div><span class="dot"></span></div>
    <div class="phone-label">QUICK STATUS</div>
    <div class="phone-card-grid"><div class="phone-small-card"><span>◇</span><strong>Scam shield</strong><small>Ready</small></div><div class="phone-small-card"><span>✦</span><strong>AI Care</strong><small>Ask anything</small></div></div>
    <button class="phone-sos" id="phoneSos">SOS · Emergency</button>`,
  protect: `
    <div class="phone-title"><div><small>PROTECTION</small><h3>Safety shield</h3></div><div class="avatar">◇</div></div>
    <div class="status-card"><div class="shield">✓</div><div><strong>Protection ready</strong><small>Demo safety services active</small></div></div>
    <div class="phone-label">RECENT</div>
    <div class="phone-small-card"><span>⚠</span><strong>Suspicious message</strong><small>Potential phishing link · 12:14</small></div>
    <div class="phone-label">CHECK SOMETHING</div>
    <div class="phone-card-grid"><div class="phone-small-card"><span>✉</span><strong>Message</strong><small>Check text</small></div><div class="phone-small-card"><span>↗</span><strong>Link</strong><small>Review URL</small></div><div class="phone-small-card"><span>☎</span><strong>Caller</strong><small>Check call</small></div><div class="phone-small-card"><span>✦</span><strong>Ask AI</strong><small>Explain risk</small></div></div>`,
  location: `
    <div class="phone-title"><div><small>FAMILY</small><h3>Location</h3></div><div class="avatar">⌖</div></div>
    <div class="mini-map"><span class="map-pin a">A</span><span class="map-pin m">M</span></div>
    <div class="phone-label">SHARING STATUS</div>
    <div class="family-mini"><div class="mini-avatar">A</div><div><strong>Alex · Home</strong><small>Sharing enabled · 62%</small></div><span class="dot"></span></div>
    <div class="family-mini"><div class="mini-avatar">M</div><div><strong>Mom · Nearby</strong><small>Sharing enabled · 74%</small></div><span class="dot"></span></div>`,
  ai: `
    <div class="phone-title"><div><small>SAFETY ASSISTANT</small><h3>A-Z Care AI</h3></div><div class="avatar">✦</div></div>
    <div class="ai-phone-chat">“My bank says I need to verify my account through a link. Is this safe?”</div>
    <div class="ai-phone-result"><strong>⚠ Pause before acting</strong><p>Unexpected urgency and a login link are common scam signals. Open your bank app directly or call the official number instead.</p></div>
    <div class="phone-label">QUICK CHECK</div>
    <div class="phone-card-grid"><div class="phone-small-card"><span>✉</span><strong>Message</strong><small>Paste text</small></div><div class="phone-small-card"><span>↗</span><strong>Link</strong><small>Check URL</small></div><div class="phone-small-card"><span>☎</span><strong>Call</strong><small>Describe it</small></div><div class="phone-small-card"><span>♥</span><strong>Ask family</strong><small>Second opinion</small></div></div>`
};

function showPhoneScreen(name) {
  if (!phoneScreens[name]) return;
  phoneView.innerHTML = phoneScreens[name];
  phoneTabs.forEach(tab => tab.classList.toggle('active', tab.dataset.screen === name));
  const phoneSos = document.getElementById('phoneSos');
  if (phoneSos) phoneSos.addEventListener('click', () => document.getElementById('sos').scrollIntoView({behavior:'smooth'}));
}

phoneTabs.forEach(tab => tab.addEventListener('click', () => showPhoneScreen(tab.dataset.screen)));
document.querySelectorAll('[data-phone-screen]').forEach(button => button.addEventListener('click', () => {
  showPhoneScreen(button.dataset.phoneScreen);
  document.getElementById('product').scrollIntoView({behavior:'smooth', block:'center'});
}));
showPhoneScreen('home');

const aiButton = document.getElementById('runAiDemo');
const aiResult = document.getElementById('aiResult');
aiButton.addEventListener('click', () => {
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

document.querySelectorAll('[data-scroll]').forEach(button => button.addEventListener('click', () => document.querySelector(button.dataset.scroll)?.scrollIntoView({behavior:'smooth'})));

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
}), {threshold:.12});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
