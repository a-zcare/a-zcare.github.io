// Same-origin stable loader for A-Z Care.
(() => {
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'css/landing-v2.css?v=20260903-android-3';
  document.head.appendChild(css);

  const core = document.createElement('script');
  core.src = 'js/core.js?v=20260902-3';
  core.async = false;
  core.onload = () => {
    const landing = document.createElement('script');
    landing.src = 'js/landing-v2.js?v=20260903-android-3';
    landing.async = false;
    document.body.appendChild(landing);
  };
  document.body.appendChild(core);
})();