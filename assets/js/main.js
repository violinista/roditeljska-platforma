/**
 * Adapted from BootstrapMade "College" template (main.js).
 * License: https://bootstrapmade.com/license/
 */

(function () {
  "use strict";

  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
  function mobileNavToogle() {
    const open = document.querySelector('body').classList.toggle('mobile-nav-active');
    const icon = mobileNavToggleBtn.querySelector('i');
    icon.classList.toggle('bi-list', !open);
    icon.classList.toggle('bi-x', open);
    mobileNavToggleBtn.setAttribute('aria-expanded', String(open));
    mobileNavToggleBtn.setAttribute('aria-label', open ? 'Zatvori meni' : 'Otvori meni');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  // Dropdown parents ("Ocenjivanje", "O nama") link to "#": clicking or
  // pressing Enter on them expands the submenu (needed on mobile; on desktop
  // the submenu also opens on hover / keyboard focus).
  const dropdownParents = document.querySelectorAll('.navmenu .dropdown > a');
  dropdownParents.forEach(parent => {
    parent.setAttribute('aria-expanded', 'false');
    parent.addEventListener('click', function (e) {
      e.preventDefault();
      const open = this.nextElementSibling.classList.toggle('dropdown-active');
      this.setAttribute('aria-expanded', String(open));
    });
  });

  function closeDropdowns(except) {
    dropdownParents.forEach(parent => {
      if (parent === except) return;
      parent.nextElementSibling.classList.remove('dropdown-active');
      parent.setAttribute('aria-expanded', 'false');
    });
  }
  document.addEventListener('click', e => {
    const parent = e.target.closest('.navmenu .dropdown > a');
    if (!e.target.closest('.navmenu .dropdown')) closeDropdowns();
    else if (parent) closeDropdowns(parent);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeDropdowns();
  });

  document.querySelectorAll('#navmenu a, #header-actions a').forEach(link => {
    if (link.parentNode.classList.contains('dropdown')) return;
    link.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });
  });

  function initSwiper() {
    if (typeof Swiper === 'undefined') return;
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      const configEl = swiperElement.querySelector(".swiper-config");
      if (!configEl) return;
      const config = JSON.parse(configEl.innerHTML.trim());
      new Swiper(swiperElement, config);
    });
  }
  window.addEventListener("load", initSwiper);

  if (typeof GLightbox !== 'undefined') {
    GLightbox({ selector: '.glightbox' });
  }
})();
