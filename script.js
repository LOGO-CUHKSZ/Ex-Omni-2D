document.documentElement.classList.add("js");

const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const menuButton = document.querySelector("[data-menu-button]");
const toast = document.querySelector("[data-toast]");
let toastTimer;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2200);
}

function closeMenu() {
  menuButton?.setAttribute("aria-expanded", "false");
  nav?.classList.remove("open");
  document.body.classList.remove("menu-open");
}

window.addEventListener(
  "scroll",
  () => header?.classList.toggle("scrolled", window.scrollY > 16),
  { passive: true },
);

menuButton?.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  nav?.classList.toggle("open", !open);
  document.body.classList.toggle("menu-open", !open);
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 700) closeMenu();
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.08, rootMargin: "0px 0px -7% 0px" },
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  if (element.closest(".hero")) {
    element.style.transitionDelay = `${Math.min(index * 45, 260)}ms`;
  }
  revealObserver.observe(element);
});

const navLinks = [...document.querySelectorAll("nav a[href^='#']")];
const sectionObserver = new IntersectionObserver(
  (entries) => {
    const current = entries.find((entry) => entry.isIntersecting);
    if (!current) return;
    navLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${current.target.id}`,
      );
    });
  },
  { rootMargin: "-28% 0px -62% 0px" },
);

navLinks.forEach((link) => {
  const section = document.querySelector(link.getAttribute("href"));
  if (section) sectionObserver.observe(section);
});

document.querySelector("[data-copy-bibtex]")?.addEventListener("click", async () => {
  const value = document.querySelector("#bibtex")?.innerText.trim();
  if (!value) return;

  try {
    await navigator.clipboard.writeText(value);
    const label = document.querySelector("[data-copy-label]");
    if (label) label.textContent = "Copied";
    showToast("BibTeX copied");
    setTimeout(() => {
      if (label) label.textContent = "Copy";
    }, 1600);
  } catch {
    showToast("Select the BibTeX and copy it manually");
  }
});

const modal = document.querySelector("[data-lightbox-modal]");
const modalImage = document.querySelector("[data-lightbox-image]");
const closeButton = document.querySelector("[data-lightbox-close]");
let origin;

function closeLightbox() {
  if (!modal) return;
  modal.hidden = true;
  document.body.classList.remove("lightbox-open");
  origin?.focus();
}

document.querySelectorAll("[data-lightbox]").forEach((figure) => {
  figure.addEventListener("click", (event) => {
    const image = figure.querySelector("img");
    if (!modal || !modalImage || !image) return;
    origin = event.target instanceof HTMLElement ? event.target : figure;
    modalImage.src = image.currentSrc || image.src;
    modalImage.alt = image.alt;
    modal.hidden = false;
    document.body.classList.add("lightbox-open");
    closeButton?.focus();
  });
});

closeButton?.addEventListener("click", closeLightbox);
modal?.addEventListener("click", (event) => {
  if (event.target === modal) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  closeMenu();
  closeLightbox();
});
