/**
 * Step-by-step slideshows ({% slideshow %} / {% slide %} shortcodes), used for
 * "Situacija 1–3" on /ocenjivanje/reagovanje-na-ocenu/.
 *
 * Each <dialog class="slideshow" id="…"> opens as a modal from any link to
 * "#<id>" (and from that hash in the URL). One slide is shown at a time;
 * Prethodni/Sledeći, the dots, ←/→ (Home/End) and a horizontal swipe change
 * slides. On the last slide "Sledeći" closes and a "Zakaži savetovanje"
 * button appears below the slide text. Only one slideshow is open at a time. Without this script the
 * slides are shown stacked via CSS :target.
 */
(function () {
  "use strict";

  const shows = new Map();
  const dialogs = document.querySelectorAll("dialog.slideshow");
  if (!dialogs.length || typeof HTMLDialogElement !== "function") return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  dialogs.forEach((dialog) => {
    const slides = [...dialog.querySelectorAll(".slide")];
    if (!slides.length) return;

    const body = dialog.querySelector(".slideshow-body");
    const prev = dialog.querySelector("[data-slideshow-prev]");
    const next = dialog.querySelector("[data-slideshow-next]");
    const nextLabel = next.querySelector("span");
    const nextIcon = next.querySelector("i");
    const cta = dialog.querySelector("[data-slideshow-cta]");
    const counter = dialog.querySelector("[data-slideshow-counter]");
    const dotsBox = dialog.querySelector("[data-slideshow-dots]");
    let current = 0;

    const dots = slides.map((slide, i) => {
      const label = slide.dataset.label || String(i + 1);
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "slideshow-dot";
      dot.title = label;
      dot.setAttribute("aria-label", "Idi na: " + label);
      dot.addEventListener("click", () => go(i));
      dotsBox.append(dot);
      return dot;
    });

    function go(i) {
      if (i < 0 || i >= slides.length) return;
      const dir = i > current ? "next" : i < current ? "prev" : "";
      slides.forEach((slide, n) => {
        slide.hidden = n !== i;
        slide.classList.remove("is-from-next", "is-from-prev");
      });
      if (dir && !reduceMotion.matches) {
        void slides[i].offsetWidth; // restart the animation
        slides[i].classList.add("is-from-" + dir);
      }
      dots.forEach((dot, n) => {
        if (n === i) dot.setAttribute("aria-current", "step");
        else dot.removeAttribute("aria-current");
      });
      const last = i === slides.length - 1;
      prev.disabled = i === 0;
      nextLabel.textContent = last ? "Zatvori" : "Sledeći";
      nextIcon.className = last ? "bi bi-x-lg" : "bi bi-arrow-right";
      cta.hidden = !last;
      // Not shown on screen; announced to screen readers ("Korak 5, 6 / 10").
      counter.textContent = (slides[i].dataset.label || "") + ", " + (i + 1) + " / " + slides.length;
      body.scrollTop = 0;
      current = i;
    }

    prev.addEventListener("click", () => go(current - 1));
    next.addEventListener("click", () => {
      if (current === slides.length - 1) dialog.close();
      else go(current + 1);
    });
    dialog.querySelectorAll("[data-slideshow-close]").forEach((btn) =>
      btn.addEventListener("click", () => dialog.close())
    );

    // Backdrop click (outside the panel) closes, as in search.js.
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) dialog.close();
    });

    dialog.addEventListener("keydown", (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const keys = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: slides.length - 1 };
      if (!(e.key in keys)) return;
      e.preventDefault();
      go(keys[e.key]);
    });

    // Horizontal swipe on touch screens; vertical drags keep scrolling.
    let startX = null;
    let startY = 0;
    body.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "touch") return;
      startX = e.clientX;
      startY = e.clientY;
    });
    body.addEventListener("pointerup", (e) => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      startX = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > 1.5 * Math.abs(dy)) go(current + (dx < 0 ? 1 : -1));
    });
    body.addEventListener("pointercancel", () => (startX = null));

    dialog.addEventListener("close", () => {
      const opener = document.querySelector('a[href="#' + dialog.id + '"]');
      if (opener) opener.focus({ preventScroll: true });
      if (location.hash === "#" + dialog.id) {
        history.replaceState(null, "", location.pathname + location.search);
      }
    });

    dialog.classList.add("is-ready");
    go(0);
    shows.set(dialog.id, dialog);
  });

  function open(id) {
    const dialog = shows.get(id);
    if (!dialog) return false;
    if (dialog.open) return true;
    shows.forEach((d) => d.open && d.close()); // only one at a time
    dialog.showModal();
    if (location.hash !== "#" + id) history.replaceState(null, "", "#" + id);
    return true;
  }

  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link || e.defaultPrevented) return;
    if (open(link.getAttribute("href").slice(1))) e.preventDefault();
  });

  const fromHash = () => location.hash.length > 1 && open(decodeURIComponent(location.hash.slice(1)));
  window.addEventListener("hashchange", fromHash);
  fromHash();
})();
