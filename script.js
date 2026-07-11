// Progressive enhancements only. All content is pre-rendered into index.html
// by build/build.js — this script never fetches or generates content, it
// only adds interactivity on top of markup that's already fully present.

// --- Dark mode -------------------------------------------------------------

(function initTheme() {
  const stored = localStorage.getItem("theme");
  const preferred = stored || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", preferred);
})();

function setupThemeToggle() {
  const btn = document.getElementById("theme-toggle");
  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
}

// --- Lightbox ---------------------------------------------------------------

function setupLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const counter = document.getElementById("lightbox-counter");
  const closeBtn = document.getElementById("lightbox-close");
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");

  let currentGallery = [];
  let currentIndex = 0;

  function show(index) {
    currentIndex = (index + currentGallery.length) % currentGallery.length;
    lightboxImg.src = currentGallery[currentIndex];
    counter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;
  }

  function open(gallery, index) {
    currentGallery = gallery;
    show(index);
    lightbox.classList.add("open");
  }

  function close() {
    lightbox.classList.remove("open");
    lightboxImg.src = "";
  }

  closeBtn.addEventListener("click", close);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });
  prevBtn.addEventListener("click", () => show(currentIndex - 1));
  nextBtn.addEventListener("click", () => show(currentIndex + 1));
  lightboxImg.addEventListener("click", () => show(currentIndex + 1));
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(currentIndex - 1);
    if (e.key === "ArrowRight") show(currentIndex + 1);
  });

  return open;
}

function setupGalleries(openLightbox) {
  document.querySelectorAll(".gallery-collage").forEach((collage) => {
    const screenshots = JSON.parse(collage.dataset.screenshots || "[]");
    collage.querySelectorAll(".gallery-tile").forEach((tile) => {
      tile.addEventListener("click", () => openLightbox(screenshots, Number(tile.dataset.index)));
    });
  });
}

function setupMoreToggles() {
  document.querySelectorAll(".project-more").forEach((details) => {
    const label = details.querySelector(".project-more-label");
    details.addEventListener("toggle", () => {
      label.textContent = details.open ? "Skrýt" : "Zobrazit více";
    });
  });
}

// --- Responsive two-column layout -------------------------------------------
// The static HTML already ships in the wide, two-column arrangement. This
// only re-flattens/rebuilds it when the viewport doesn't match that.

const WIDE_QUERY = "(min-width: 881px)";

function layoutProjects(container) {
  const articles = Array.from(container.querySelectorAll(".project")).sort(
    (a, b) => Number(a.dataset.index) - Number(b.dataset.index)
  );
  const isWide = window.matchMedia(WIDE_QUERY).matches;
  container.classList.toggle("projects-columns", isWide);
  container.querySelectorAll(".projects-col").forEach((col) => col.remove());

  if (!isWide) {
    articles.forEach((a) => container.appendChild(a));
    return;
  }

  const col1 = document.createElement("div");
  col1.className = "projects-col";
  const col2 = document.createElement("div");
  col2.className = "projects-col";
  articles.forEach((a, i) => (i % 2 === 0 ? col1 : col2).appendChild(a));
  container.appendChild(col1);
  container.appendChild(col2);
}

function setupResponsiveProjects() {
  const container = document.getElementById("projects");
  if (!container) return;

  let wasWide = window.matchMedia(WIDE_QUERY).matches;
  layoutProjects(container); // normalize for the current viewport on load

  window.addEventListener("resize", () => {
    const isWide = window.matchMedia(WIDE_QUERY).matches;
    if (isWide !== wasWide) {
      wasWide = isWide;
      layoutProjects(container);
    }
  });
}

setupThemeToggle();
const openLightbox = setupLightbox();
setupGalleries(openLightbox);
setupMoreToggles();
setupResponsiveProjects();
