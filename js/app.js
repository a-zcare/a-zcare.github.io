// Same-origin runtime loader for A-Z Care.
// CSS is loaded once from index.html; this file only loads the phone logic.
(() => {
  const build = '20260904-mobile-layout-fix-7';

  const core = document.createElement('script');
  core.src = `js/core.js?v=${build}`;
  core.async = false;
  core.onload = () => {
    // Legacy core.js still injects an unversioned responsive.css at runtime.
    // Remove only that duplicate so the final CSS order from index.html remains authoritative.
    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
      if ((link.getAttribute('href') || '') === 'css/responsive.css') link.remove();
    });

    // Remove legacy landing additions that no longer belong to the compact static landing.
    document.querySelectorAll('.faq-section,.waitlist-mini,.product-definition,.usecase-family').forEach(el => el.remove());

    const landing = document.createElement('script');
    landing.src = `js/landing-v2.js?v=${build}`;
    landing.async = false;
    document.body.appendChild(landing);
  };
  document.body.appendChild(core);
})();