const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- Mobile navigation ----------
const navbar = document.querySelector(".navbar");
const toggle = document.querySelector(".navbar__toggle");

const closeMenu = () => {
  navbar.classList.remove("is-open");
  toggle.setAttribute("aria-expanded", "false");
};

toggle.addEventListener("click", () => {
  const open = navbar.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".navbar__menu a").forEach((link) => link.addEventListener("click", closeMenu));

// ---------- Robotaxi gallery slider ----------
document.querySelectorAll("[data-slider]").forEach((slider) => {
  const track = slider.querySelector(".slider__track");
  const slides = slider.querySelectorAll(".slider__slide");
  const dots = slider.querySelectorAll(".slider__dot");
  let index = 0;

  const goTo = (i) => {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(calc(${-index * 100}% - ${index * 32}px))`;
    dots.forEach((dot, d) => dot.classList.toggle("is-active", d === index));
  };

  slider.querySelector(".slider__arrow--prev").addEventListener("click", () => goTo(index - 1));
  slider.querySelector(".slider__arrow--next").addEventListener("click", () => goTo(index + 1));
  dots.forEach((dot, d) => dot.addEventListener("click", () => goTo(d)));
});

// ---------- Staggered scroll reveal ----------
const revealEls = document.querySelectorAll("[data-reveal]");
if (reduceMotion || !("IntersectionObserver" in window)) {
  revealEls.forEach((el) => el.classList.add("in"));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );
  revealEls.forEach((el) => io.observe(el));
}

// ---------- Lenis smooth scroll ----------
if (!reduceMotion) (async () => {
  try {
    const { default: Lenis } = await import("https://unpkg.com/lenis@1.3.23/dist/lenis.mjs");
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, touchMultiplier: 1.5 });
    const raf = (t) => {
      lenis.raf(t);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    const navOffset = -72; // keep section tops clear of the sticky navbar
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (id.length < 2) return;
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target, { offset: id === "#top" ? 0 : navOffset });
        }
      });
    });
  } catch (err) {
    console.warn("Lenis failed to load, using native scroll.", err);
  }
})();
