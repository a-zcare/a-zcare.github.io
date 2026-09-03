// Same-origin stable loader for A-Z Care.
(() => {
  const build = '20260904-0028';

  // Critical phone layout is injected directly so old responsive rules cannot hide the dock.
  const critical = document.createElement('style');
  critical.textContent = `
    .phone{width:330px!important;height:660px!important;max-width:calc(100vw - 18px)!important;overflow:hidden!important;position:relative!important}
    .phone-screen{position:relative!important;width:100%!important;height:100%!important;padding:0!important;overflow:hidden!important}
    .phone-view{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;min-height:100%!important;max-height:none!important;padding:13px 5px 96px!important;overflow:hidden!important;box-sizing:border-box!important}
    .android-grid{display:grid!important;grid-template-columns:repeat(4,1fr)!important}
    .android-dock{display:grid!important;visibility:visible!important;opacity:1!important;position:absolute!important;left:1px!important;right:1px!important;bottom:1px!important;z-index:999!important;height:86px!important;grid-template-columns:repeat(4,1fr)!important;align-items:start!important;padding:7px 4px 6px!important;overflow:visible!important;background:rgba(12,18,28,.96)!important;border-radius:0 0 18px 18px!important}
    .android-dock .android-app{display:flex!important;visibility:visible!important;opacity:1!important;flex-direction:column!important;align-items:center!important;justify-content:flex-start!important;min-width:0!important}
    .android-dock .android-app>span{display:grid!important;visibility:visible!important;opacity:1!important;width:46px!important;height:46px!important;margin:0 auto 3px!important}
    .android-dock .android-app small{display:block!important;visibility:visible!important;opacity:1!important;font-size:7px!important;line-height:1.1!important;color:#e8eef8!important;text-align:center!important}
    .android-gesture{display:none!important}
    @media(max-width:640px){
      .phone-stage{height:660px!important;min-height:660px!important;overflow:visible!important}
      .phone{width:330px!important;height:660px!important;max-width:calc(100vw - 18px)!important}
      .phone-screen,.phone-view{height:100%!important;min-height:100%!important;max-height:none!important}
      .phone-view{padding:13px 5px 96px!important}
      .android-dock{display:grid!important;bottom:1px!important;height:86px!important}
    }
  `;
  document.head.appendChild(critical);

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

  const forceDock = () => {
    const view = document.getElementById('phoneView');
    const dock = view?.querySelector('.android-dock');
    if (!view || !dock) return;
    view.style.setProperty('height','100%','important');
    view.style.setProperty('min-height','100%','important');
    view.style.setProperty('max-height','none','important');
    view.style.setProperty('padding-bottom','96px','important');
    dock.style.setProperty('display','grid','important');
    dock.style.setProperty('visibility','visible','important');
    dock.style.setProperty('opacity','1','important');
    dock.style.setProperty('position','absolute','important');
    dock.style.setProperty('left','1px','important');
    dock.style.setProperty('right','1px','important');
    dock.style.setProperty('bottom','1px','important');
    dock.style.setProperty('height','86px','important');
    dock.style.setProperty('z-index','999','important');
    dock.querySelectorAll('.android-app').forEach(btn => {
      btn.style.setProperty('display','flex','important');
      btn.style.setProperty('visibility','visible','important');
      btn.style.setProperty('opacity','1','important');
    });
  };

  const core = document.createElement('script');
  core.src = `js/core.js?v=${build}`;
  core.async = false;
  core.onload = () => {
    const landing = document.createElement('script');
    landing.src = `js/landing-v2.js?v=${build}`;
    landing.async = false;
    landing.onload = () => {
      forceDock();
      setTimeout(forceDock, 100);
      setTimeout(forceDock, 500);
      setInterval(forceDock, 1500);
    };
    document.body.appendChild(landing);
  };
  document.body.appendChild(core);
})();