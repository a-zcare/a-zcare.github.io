(() => {
  const CONSENT_KEY = 'azcare_consent_v1';
  const MEASUREMENT_ID = 'G-KC2R3GT4XF';
  const GA_DISABLE_KEY = `ga-disable-${MEASUREMENT_ID}`;

  const storage = {
    get() {
      try {
        const value = JSON.parse(localStorage.getItem(CONSENT_KEY));
        return typeof value?.analytics === 'boolean' ? value : null;
      } catch {
        return null;
      }
    },
    set(analytics) {
      try {
        localStorage.setItem(
          CONSENT_KEY,
          JSON.stringify({ analytics, updatedAt: new Date().toISOString(), version: 1 }),
        );
      } catch {
        // The choice applies for this page view even when browser storage is unavailable.
      }
    },
  };

  document.body.insertAdjacentHTML(
    'beforeend',
    `<aside class="consent-banner" id="consentBanner" role="dialog" aria-labelledby="consentTitle" aria-describedby="consentDescription" hidden>
      <div class="consent-copy">
        <strong id="consentTitle">Your privacy, your choice</strong>
        <p id="consentDescription">We use optional Google Analytics only if you agree. It helps us understand how this concept site is used. Rejecting analytics does not change the prototype.</p>
        <a href="privacy.html">Read the Privacy Policy</a>
      </div>
      <div class="consent-actions">
        <button class="consent-button secondary" type="button" data-consent="reject">Reject optional</button>
        <button class="consent-button secondary" type="button" data-consent="manage">Manage choices</button>
        <button class="consent-button primary" type="button" data-consent="accept">Accept analytics</button>
      </div>
    </aside>
    <dialog class="consent-dialog" id="consentDialog" aria-labelledby="preferencesTitle">
      <form method="dialog">
        <div class="consent-dialog-head">
          <div>
            <p class="consent-kicker">PRIVACY SETTINGS</p>
            <h2 id="preferencesTitle">Choose what this site may use</h2>
          </div>
          <button class="icon-button" type="submit" value="cancel" aria-label="Close privacy settings">×</button>
        </div>
        <div class="consent-option">
          <div>
            <strong>Essential storage</strong>
            <p>Remembers this choice and local demo settings on your device. No form responses are collected.</p>
          </div>
          <span>Always active</span>
        </div>
        <label class="consent-option selectable">
          <div>
            <strong>Optional analytics</strong>
            <p>Loads Google Analytics to measure page views and basic interactions. It is off until you enable it.</p>
          </div>
          <input id="analyticsConsent" type="checkbox" />
        </label>
        <p class="consent-fineprint">You can change this choice at any time using “Privacy settings” in the footer. Turning analytics off stops future measurement on this browser and removes accessible A-Z Care analytics cookies.</p>
        <button class="consent-button primary consent-save" type="button" data-consent="save">Save choices</button>
      </form>
    </dialog>`,
  );

  const banner = document.querySelector('#consentBanner');
  const dialog = document.querySelector('#consentDialog');
  const analyticsToggle = document.querySelector('#analyticsConsent');
  let currentChoice = storage.get();

  function removeAnalyticsCookies() {
    document.cookie.split(';').forEach((entry) => {
      const name = entry.split('=')[0].trim();
      if (name === '_ga' || name === '_gid' || name === '_gat' || name.startsWith('_ga_')) {
        document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
        document.cookie = `${name}=; Max-Age=0; path=/; domain=.${location.hostname}; SameSite=Lax`;
      }
    });
  }

  function disableAnalytics() {
    window[GA_DISABLE_KEY] = true;
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', { analytics_storage: 'denied' });
    }
    removeAnalyticsCookies();
  }

  function enableAnalytics() {
    window[GA_DISABLE_KEY] = false;
    if (document.querySelector(`script[data-analytics-id="${MEASUREMENT_ID}"]`)) {
      window.gtag('consent', 'update', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'granted',
      });
      return;
    }

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'granted',
    });
    window.gtag('js', new Date());
    window.gtag('config', MEASUREMENT_ID, {
      allow_ad_personalization_signals: false,
      allow_google_signals: false,
      anonymize_ip: true,
      cookie_expires: 60 * 60 * 24 * 90,
    });

    const script = document.createElement('script');
    script.async = true;
    script.dataset.analyticsId = MEASUREMENT_ID;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
    document.head.appendChild(script);
  }

  function applyChoice(choice) {
    if (choice?.analytics) enableAnalytics();
    else disableAnalytics();
    analyticsToggle.checked = Boolean(choice?.analytics);
  }

  function saveChoice(analytics) {
    currentChoice = { analytics };
    storage.set(analytics);
    applyChoice(currentChoice);
    banner.hidden = true;
  }

  function openPreferences() {
    analyticsToggle.checked = Boolean(currentChoice?.analytics);
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  }

  function closePreferences() {
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  }

  document.addEventListener('click', (event) => {
    const action = event.target.closest('[data-consent]')?.dataset.consent;
    if (action === 'accept') saveChoice(true);
    if (action === 'reject') saveChoice(false);
    if (action === 'manage') openPreferences();
    if (action === 'save') {
      saveChoice(analyticsToggle.checked);
      closePreferences();
    }
    if (event.target.closest('[data-privacy-settings]')) openPreferences();
  });

  applyChoice(currentChoice);
  banner.hidden = Boolean(currentChoice);
})();
