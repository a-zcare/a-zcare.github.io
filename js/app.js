// A-Z Care app loader — stable HTML entrypoint with modular product updates.
(() => {
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = 'css/refactor.css?v=20260902-product-refactor-2';
  document.head.appendChild(style);

  const core = document.createElement('script');
  core.src = 'https://raw.githubusercontent.com/a-zcare/a-zcare.github.io/c68cb055ca275d59cc16ad53784d748f66d9f6ab/js/app.js';
  core.async = false;
  core.onload = () => {
    const refactor = document.createElement('script');
    refactor.src = 'js/refactor.js?v=20260902-product-refactor-2';
    refactor.async = false;
    document.body.appendChild(refactor);
  };
  document.body.appendChild(core);
})();