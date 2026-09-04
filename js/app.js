// Same-origin runtime loader for A-Z Care.
// CSS is loaded once from index.html; this file only loads the phone logic.
(() => {
  const build = '20260904-layout-refactor-6';

  const core = document.createElement('script');
  core.src = `js/core.js?v=${build}`;
  core.async = false;
  core.onload = () => {
    const landing = document.createElement('script');
    landing.src = `js/landing-v2.js?v=${build}`;
    landing.async = false;
    document.body.appendChild(landing);
  };
  document.body.appendChild(core);
})();