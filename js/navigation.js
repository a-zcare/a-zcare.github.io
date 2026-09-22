(() => {
  const header = document.querySelector('body > header');
  const nav = header?.querySelector('nav');
  const navBar = header?.querySelector('.nav');
  if (!nav || !navBar) return;

  nav.id = nav.id || 'site-navigation';
  const button = document.createElement('button');
  button.className = 'menu-toggle';
  button.type = 'button';
  button.setAttribute('aria-controls', nav.id);
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-label', 'Open navigation');
  button.innerHTML = '<span></span><span></span><span></span>';
  navBar.insertBefore(button, nav);

  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    button.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  };

  button.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });
  document.addEventListener('click', (event) => {
    if (!navBar.contains(event.target)) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setOpen(false);
      button.focus();
    }
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 800) setOpen(false);
  });
})();
