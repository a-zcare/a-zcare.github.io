// Same-origin runtime loader for A-Z Care.
// CSS is loaded once from index.html; this file only loads the phone logic.
(() => {
  const build = '20260908-phone-polish-1';

  const polish = document.createElement('style');
  polish.id = 'az-phone-polish';
  polish.textContent = `
    /* Mobile breathing room around the interactive phone. */
    @media(max-width:700px){
      .hero .phone-stage{margin-top:22px!important;margin-bottom:30px!important}
      .hardware-teaser{padding-top:4px!important}
      .hero-grid{gap:12px!important}
      .hero .floating-chip{display:none!important}
    }

    /* One visual language for the A-Z Care home screen. */
    .android-grid .android-app>span,
    .android-dock .android-app>span{
      position:relative!important;
      border:1px solid rgba(255,255,255,.08)!important;
      box-shadow:0 5px 14px rgba(0,0,0,.22),inset 0 1px 0 rgba(255,255,255,.07)!important;
    }
    .android-grid .android-app>span{
      background:linear-gradient(145deg,#172943,#102039)!important;
      color:#dfe9f8!important;
      font-size:0!important;
    }
    .android-grid .android-app>span:before,
    .android-dock .android-app>span:before{
      content:"";
      position:absolute;
      left:50%;top:50%;
      width:25px;height:25px;
      transform:translate(-50%,-50%);
      background-repeat:no-repeat;
      background-position:center;
      background-size:contain;
    }

    .android-grid [data-az-app="protect"]>span{background:linear-gradient(145deg,#214d42,#16352e)!important}
    .android-grid [data-az-app="protect"]>span:before{display:none!important}

    .android-grid [data-az-app="ai"]>span{background:linear-gradient(145deg,#173453,#10233d)!important;background-image:none!important}
    .android-grid [data-az-app="ai"]>span:before{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2389e7ff' stroke-width='1.9' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3l1.5 4.1L17.5 9 13.5 10.5 12 15l-1.5-4.5L6.5 9l4-1.9L12 3Z'/%3E%3Cpath d='M18.5 14.5l.8 2.1 2.2.9-2.2.9-.8 2.1-.8-2.1-2.2-.9 2.2-.9.8-2.1Z'/%3E%3C/svg%3E")}

    .android-grid [data-az-app="location"]>span:before{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238fc2ff' stroke-width='1.9' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='3.2'/%3E%3Cpath d='M12 2.7v3M12 18.3v3M2.7 12h3M18.3 12h3M5.4 5.4l2.1 2.1M16.5 16.5l2.1 2.1M18.6 5.4l-2.1 2.1M7.5 16.5l-2.1 2.1'/%3E%3C/svg%3E")}

    .android-grid [data-az-app="familydetail"]>span:before{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23dbe7f8' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='8.2' cy='8' r='2.5'/%3E%3Ccircle cx='16.3' cy='9.1' r='2.1'/%3E%3Cpath d='M3.8 18c.3-3 2-4.8 4.4-4.8s4.1 1.8 4.4 4.8M13.3 14.1c.8-.9 1.8-1.4 3-1.4 2.1 0 3.5 1.6 3.9 4.2'/%3E%3C/svg%3E")}

    .android-grid [data-az-app="contacts"]>span:before{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23cbd8ea' stroke-width='1.9' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='5' y='3.5' width='14' height='17' rx='2.5'/%3E%3Ccircle cx='12' cy='9' r='2.4'/%3E%3Cpath d='M8.2 16.2c.7-2 2-3 3.8-3s3.1 1 3.8 3M3.5 7h2M3.5 12h2M3.5 17h2'/%3E%3C/svg%3E")}

    .android-grid [data-az-app="settings"]>span:before{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23d7e1ef' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='3'/%3E%3Cpath d='M19 13.2v-2.4l-2-.7a6.2 6.2 0 0 0-.7-1.7l.9-1.9-1.7-1.7-1.9.9a6.2 6.2 0 0 0-1.7-.7l-.7-2H8.8l-.7 2a6.2 6.2 0 0 0-1.7.7l-1.9-.9-1.7 1.7.9 1.9a6.2 6.2 0 0 0-.7 1.7l-2 .7v2.4l2 .7c.2.6.4 1.2.7 1.7l-.9 1.9 1.7 1.7 1.9-.9c.5.3 1.1.5 1.7.7l.7 2h2.4l.7-2c.6-.2 1.2-.4 1.7-.7l1.9.9 1.7-1.7-.9-1.9c.3-.5.5-1.1.7-1.7l2-.7Z'/%3E%3C/svg%3E")}

    .android-grid [data-az-app="sosphone"]>span{background:linear-gradient(145deg,#572432,#3d1823)!important}
    .android-grid [data-az-app="sosphone"]>span:before{content:'SOS';display:grid;place-items:center;background:none!important;color:%23fff;font:700 9px/1 Inter,sans-serif;letter-spacing:.04em}

    .android-dock [data-az-app="messages"]>span{background:linear-gradient(180deg,#397dca,#275d9d)!important;font-size:0!important}
    .android-dock [data-az-app="messages"]>span:before{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M5 4.5h14a2.5 2.5 0 0 1 2.5 2.5v7.5A2.5 2.5 0 0 1 19 17H10l-5 3v-3H5a2.5 2.5 0 0 1-2.5-2.5V7A2.5 2.5 0 0 1 5 4.5Z'/%3E%3C/svg%3E")}

    .android-dock [data-az-app="browser"]>span{background:linear-gradient(145deg,#1b3656,#152940)!important;font-size:0!important}
    .android-dock [data-az-app="browser"]>span:before{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='1.9' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='8.2'/%3E%3Cpath d='M12 3.8c2.2 2.2 3.4 5 3.4 8.2S14.2 18 12 20.2C9.8 18 8.6 15.2 8.6 12S9.8 6 12 3.8ZM4.3 12h15.4'/%3E%3C/svg%3E")}

    .android-dock [data-az-app="camera"]>span{background:linear-gradient(145deg,#354860,#24364b)!important;font-size:0!important}
    .android-dock [data-az-app="camera"]>span:before{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='1.9' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4.2 7.3h3l1.4-2h6.8l1.4 2h3A1.8 1.8 0 0 1 21.6 9v8.5a1.8 1.8 0 0 1-1.8 1.8H4.2a1.8 1.8 0 0 1-1.8-1.8V9a1.8 1.8 0 0 1 1.8-1.7Z'/%3E%3Ccircle cx='12' cy='13' r='4'/%3E%3C/svg%3E")}
  `;
  document.head.appendChild(polish);

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