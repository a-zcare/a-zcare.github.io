(() => {
  const button = document.querySelector('.menu-toggle');
  if (!button) return;

  const navigation = document.getElementById(button.getAttribute('aria-controls'));
  if (!navigation) return;

  const desktop = window.matchMedia('(min-width: 801px)');

  function isOpen() {
    return button.getAttribute('aria-expanded') === 'true';
  }

  function setOpen(open, restoreFocus = false) {
    const mobileOpen = !desktop.matches && open;

    button.setAttribute('aria-expanded', String(mobileOpen));
    button.setAttribute('aria-label', mobileOpen ? 'Close navigation' : 'Open navigation');
    navigation.classList.toggle('is-open', mobileOpen);
    navigation.inert = !desktop.matches && !mobileOpen;

    if (!mobileOpen && restoreFocus) button.focus();
  }

  button.addEventListener('click', (event) => {
    const opening = !isOpen();
    setOpen(opening);

    // Keyboard activation of a native button dispatches a click with detail 0.
    // Move focus into the opened navigation explicitly so the next keyboard
    // target never depends on viewport-specific tab-order/layout timing.
    if (opening && event.detail === 0) navigation.querySelector('a')?.focus();
  });

  navigation.addEventListener('click', (event) => {
    if (!event.target.closest('a')) return;

    // Let the anchor complete its native activation before making the
    // mobile navigation inert. Closing it synchronously can race keyboard
    // activation of same-page hash links in some browsers.
    window.setTimeout(() => setOpen(false), 0);
  });

  document.addEventListener('click', (event) => {
    if (!isOpen() || button.contains(event.target) || navigation.contains(event.target)) return;
    setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) setOpen(false, true);
  });

  function handleViewportChange() {
    setOpen(false);
    navigation.inert = !desktop.matches;
  }

  if (desktop.addEventListener) desktop.addEventListener('change', handleViewportChange);
  else desktop.addListener(handleViewportChange);

  setOpen(false);
})();
