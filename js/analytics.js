(() => {
  const EVENT_SCHEMA_VERSION = 1;
  const screens = [
    'ai',
    'browser',
    'calls',
    'camera',
    'contacts',
    'diabetes',
    'fall',
    'family',
    'health',
    'home',
    'location',
    'messages',
    'privacy',
    'protect',
    'settings',
    'sos',
    'specs',
  ];
  const scenarios = ['fall', 'scam_message', 'sos'];

  const schema = {
    navigation_select: {
      required: ['destination', 'placement'],
      values: {
        destination: ['how', 'privacy', 'privacy_policy', 'product', 'research', 'why'],
        placement: ['footer', 'header', 'hero'],
      },
    },
    project_link_open: {
      required: ['placement'],
      values: { placement: ['header'] },
    },
    specifications_open: {
      required: ['source'],
      values: { source: ['landing', 'phone'] },
    },
    demo_screen_view: {
      required: ['screen_name', 'previous_screen'],
      values: { screen_name: screens, previous_screen: screens },
    },
    scenario_start: {
      required: ['scenario_name'],
      values: { scenario_name: scenarios },
    },
    scenario_complete: {
      required: ['scenario_name', 'result'],
      values: {
        scenario_name: scenarios,
        result: ['help_requested', 'no_response', 'ok', 'simulation_complete', 'warning_shown'],
      },
    },
    privacy_settings_open: {
      required: ['source'],
      values: { source: ['banner', 'footer', 'privacy_page'] },
    },
    survey_start: {
      required: ['source'],
      values: { source: ['landing'] },
    },
    survey_complete: {
      required: ['source'],
      values: { source: ['landing'] },
    },
  };

  function sanitize(eventName, parameters) {
    const definition = schema[eventName];
    if (!definition) return null;

    const safe = { event_schema_version: EVENT_SCHEMA_VERSION, transport_type: 'beacon' };
    for (const [key, allowedValues] of Object.entries(definition.values)) {
      const value = parameters?.[key];
      if (value !== undefined && allowedValues.includes(value)) safe[key] = value;
    }

    if (definition.required.some((key) => safe[key] === undefined)) return null;
    return safe;
  }

  function track(eventName, parameters = {}) {
    if (!window.AZ_PRIVACY?.analyticsAllowed() || typeof window.gtag !== 'function') return false;

    const safeParameters = sanitize(eventName, parameters);
    if (!safeParameters) return false;

    window.gtag('event', eventName, safeParameters);
    return true;
  }

  window.AZ_ANALYTICS = Object.freeze({
    schemaVersion: EVENT_SCHEMA_VERSION,
    events: Object.freeze(Object.keys(schema)),
    track,
  });

  document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-analytics-event]');
    if (!target) return;

    track(target.dataset.analyticsEvent, {
      destination: target.dataset.analyticsDestination,
      placement: target.dataset.analyticsPlacement,
      source: target.dataset.analyticsSource,
    });
  });
})();
