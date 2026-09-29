const menuToggle = document.querySelector("[data-menu-toggle]");
const siteNav = document.querySelector("[data-site-nav]");

function setNavigationOpen(isOpen) {
  if (!menuToggle || !siteNav) return;
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  siteNav.classList.toggle("is-open", isOpen);
}

menuToggle?.addEventListener("click", () => {
  setNavigationOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});

siteNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setNavigationOpen(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setNavigationOpen(false);
});

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  document.body.classList.add("js-ready");
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
}

const contactForm = document.querySelector("[data-contact-form]");
const formNote = document.querySelector("[data-form-note]");
contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const subject = `Portfolio message from ${formData.get("name")}`;
  const body = `Name: ${formData.get("name")}\nEmail: ${formData.get("email")}\n\n${formData.get("message")}`;
  const mailto = `mailto:dkksord@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  if (formNote) formNote.textContent = "Opening your email app with the message ready to send.";
  window.location.href = mailto;
});

document.querySelector("[data-print-resume]")?.addEventListener("click", () => {
  document.body.classList.add("printing-resume");
  window.print();
});

window.addEventListener("afterprint", () => {
  document.body.classList.remove("printing-resume");
});

const year = document.querySelector("[data-current-year]");
if (year) year.textContent = String(new Date().getFullYear());

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const hero = document.querySelector(".hero");
const leaves = document.querySelectorAll(".floating-leaf");

if (hero && leaves.length && !prefersReducedMotion.matches) {
  hero.addEventListener("pointermove", (event) => {
    const bounds = hero.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
    const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;

    leaves.forEach((leaf, index) => {
      const depth = (index + 1) * 4;
      leaf.style.setProperty("--leaf-x", `${horizontal * depth}px`);
      leaf.style.setProperty("--leaf-y", `${vertical * depth}px`);
    });
  });

  hero.addEventListener("pointerleave", () => {
    leaves.forEach((leaf) => {
      leaf.style.setProperty("--leaf-x", "0px");
      leaf.style.setProperty("--leaf-y", "0px");
    });
  });
}

const parallaxLayers = document.querySelectorAll("[data-parallax-speed]");
let parallaxFrame = 0;

function updateParallax() {
  parallaxFrame = 0;
  if (prefersReducedMotion.matches) return;

  parallaxLayers.forEach((layer) => {
    const speed = Number(layer.dataset.parallaxSpeed);
    const center = layer.getBoundingClientRect().top + layer.getBoundingClientRect().height / 2;
    layer.style.translate = `0 ${Math.round(-center * speed)}px`;
  });
}

function requestParallaxUpdate() {
  if (!parallaxFrame) parallaxFrame = window.requestAnimationFrame(updateParallax);
}

if (parallaxLayers.length) {
  window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
  window.addEventListener("resize", requestParallaxUpdate);
  prefersReducedMotion.addEventListener("change", requestParallaxUpdate);
  requestParallaxUpdate();
}

document.querySelectorAll(".button, .project-card").forEach((element) => {
  element.dataset.ripple = "";
  element.addEventListener("pointermove", (event) => {
    const bounds = element.getBoundingClientRect();
    element.style.setProperty("--ripple-x", `${event.clientX - bounds.left}px`);
    element.style.setProperty("--ripple-y", `${event.clientY - bounds.top}px`);
  });
});