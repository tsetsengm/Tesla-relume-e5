// Mobile navigation toggle
const navbar = document.querySelector(".navbar");
const toggle = document.querySelector(".navbar__toggle");

toggle.addEventListener("click", () => {
  const open = navbar.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".navbar__menu a").forEach((link) =>
  link.addEventListener("click", () => {
    navbar.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  })
);

// Robotaxi gallery slider
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
