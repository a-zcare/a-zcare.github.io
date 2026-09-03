// Same-origin stable loader for A-Z Care.
(() => {
  const build = '20260904-dock-icons-1';

  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = `css/landing-v2.css?v=${build}`;
  document.head.appendChild(css);

  const refine = document.createElement('link');
  refine.rel = 'stylesheet';
  refine.href = `css/landing-refine.css?v=${build}`;
  document.head.appendChild(refine);

  const shell = document.createElement('link');
  shell.rel = 'stylesheet';
  shell.href = `css/phone-shell-v2.css?v=${build}`;
  document.head.appendChild(shell);

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