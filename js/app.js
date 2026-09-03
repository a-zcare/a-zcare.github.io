// Same-origin stable loader for A-Z Care.
(() => {
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'css/landing-v2.css?v=20260903-android-10';
  document.head.appendChild(css);

  const shell = document.createElement('link');
  shell.rel = 'stylesheet';
  shell.href = 'css/phone-shell-v2.css?v=20260903-7';
  document.head.appendChild(shell);

  const core = document.createElement('script');
  core.src = 'js/core.js?v=20260902-3';
  core.async = false;
  core.onload = () => {
    const landing = document.createElement('script');
    landing.src = 'js/landing-v2.js?v=20260903-android-7';
    landing.async = false;
    document.body.appendChild(landing);
  };
  document.body.appendChild(core);
})();