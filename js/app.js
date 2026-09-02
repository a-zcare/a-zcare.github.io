// A-Z Care app loader — keeps the stable HTML entrypoint while allowing safe modular updates.
(() => {
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = 'css/refactor.css?v=20260902-product-refactor-1';
  document.head.appendChild(style);

  const core = document.createElement('script');
  core.src = 'js/app-core.js?v=20260902-product-refactor-1';
  core.async = false;
  core.onload = () => {
    const refactor = document.createElement('script');
    refactor.src = 'js/refactor.js?v=20260902-product-refactor-1';
    refactor.async = false;
    document.body.appendChild(refactor);
  };
  document.body.appendChild(core);
})();