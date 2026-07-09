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

// --- Tiny frontmatter + Markdown ------------------------------------------

function parseFrontmatter(raw) {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };

  const [, fmBlock, body] = match;
  const meta = {};
  const lines = fmBlock.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1];
    let value = kv[2].trim();

    if (value === "") {
      // Possible block list on following indented "- " lines
      const items = [];
      while (i + 1 < lines.length && /^\s*-\s+/.test(lines[i + 1])) {
        items.push(lines[++i].replace(/^\s*-\s+/, "").trim());
      }
      meta[key] = items;
    } else if (/^\[.*\]$/.test(value)) {
      meta[key] = value
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    } else {
      meta[key] = value;
    }
  }

  return { meta, body: body.trim() };
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inlineMarkdown(text) {
  let html = escapeHtml(text);
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  return html;
}

function markdownToHtml(md) {
  const blocks = md.split(/\n\s*\n/);
  return blocks
    .map((block) => {
      const trimmed = block.trim();
      const headingMatch = trimmed.match(/^#{2,3}\s+(.+)$/);
      if (headingMatch) {
        return `<h2 class="project-tech-heading">${inlineMarkdown(headingMatch[1])}</h2>`;
      }
      const lines = trimmed.split("\n");
      if (lines.every((l) => /^\s*-\s+/.test(l))) {
        const items = lines.map((l) => `<li>${inlineMarkdown(l.replace(/^\s*-\s+/, ""))}</li>`).join("");
        return `<ul>${items}</ul>`;
      }
      return `<p>${inlineMarkdown(lines.join(" "))}</p>`;
    })
    .join("\n");
}

// Splits markdown body into sections keyed by "## Heading" titles.
function splitSections(body) {
  const sections = {};
  const parts = body.split(/\n(?=##\s+)/);
  for (const part of parts) {
    const headingMatch = part.match(/^##\s+(.+)\n?([\s\S]*)$/);
    if (headingMatch) {
      sections[headingMatch[1].trim()] = headingMatch[2].trim();
    }
  }
  return sections;
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
  let pz = null;

  function bindZoom() {
    if (pz) {
      pz.dispose();
      pz = null;
    }
    if (window.panzoom) {
      pz = window.panzoom(lightboxImg, {
        maxZoom: 4,
        minZoom: 1,
        bounds: true,
        boundsPadding: 0.5,
        zoomDoubleClickSpeed: 1,
      });
    }
  }

  function currentScale() {
    return pz ? pz.getTransform().scale : 1;
  }

  function show(index) {
    currentIndex = (index + currentGallery.length) % currentGallery.length;
    lightboxImg.src = currentGallery[currentIndex];
    counter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;
    bindZoom();
  }

  function open(gallery, index) {
    currentGallery = gallery;
    show(index);
    lightbox.classList.add("open");
  }

  function close() {
    lightbox.classList.remove("open");
    lightboxImg.src = "";
    if (pz) {
      pz.dispose();
      pz = null;
    }
  }

  closeBtn.addEventListener("click", close);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });
  prevBtn.addEventListener("click", () => show(currentIndex - 1));
  nextBtn.addEventListener("click", () => show(currentIndex + 1));
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(currentIndex - 1);
    if (e.key === "ArrowRight") show(currentIndex + 1);
  });

  // Desktop: click the image to advance, like the right arrow.
  // Touch: tapping does nothing; swipe navigates, double-tap toggles zoom, pinch zooms (via panzoom).
  let pointerStart = null;
  let lastTapTime = 0;
  let lastTapX = 0;
  let lastTapY = 0;

  lightboxImg.addEventListener("pointerdown", (e) => {
    pointerStart = { x: e.clientX, y: e.clientY, t: Date.now(), type: e.pointerType };
  });

  lightboxImg.addEventListener("pointerup", (e) => {
    if (!pointerStart) return;
    const dx = e.clientX - pointerStart.x;
    const dy = e.clientY - pointerStart.y;
    const dt = Date.now() - pointerStart.t;
    const type = pointerStart.type;
    pointerStart = null;

    if (type === "mouse") {
      if (Math.abs(dx) < 5 && Math.abs(dy) < 5) show(currentIndex + 1);
      return;
    }

    const isTap = Math.abs(dx) < 10 && Math.abs(dy) < 10 && dt < 300;
    if (isTap) {
      const now = Date.now();
      const isDoubleTap =
        now - lastTapTime < 300 && Math.abs(e.clientX - lastTapX) < 30 && Math.abs(e.clientY - lastTapY) < 30;
      if (isDoubleTap && pz) {
        const scale = currentScale();
        const target = scale > 1.01 ? 1 : 2.5;
        pz.smoothZoom(e.clientX, e.clientY, target / scale);
        lastTapTime = 0;
      } else {
        lastTapTime = now;
        lastTapX = e.clientX;
        lastTapY = e.clientY;
      }
      return;
    }

    if (currentScale() <= 1.01 && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      show(currentIndex + (dx < 0 ? 1 : -1));
    }
  });

  return open;
}

// --- Rendering ---------------------------------------------------------------

const REPO_ICON =
  '<svg width="13" height="13" viewBox="0 0 24 24"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.4 0C6.1 2.8 5 3.1 5 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 3.6 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>';

const APP_ICON =
  '<svg width="13" height="13" viewBox="0 0 24 24"><path d="M14 4h6v6M20 4 10 14M19 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>';

function renderProject(project, index, openLightbox) {
  const { meta, body } = project;
  const sections = splitSections(body);
  const screenshots = meta.screenshots || [];
  const hero = screenshots[0];

  const article = document.createElement("article");
  article.className = "project";

  const links = [];
  if (meta.repo) links.push(`<a href="${meta.repo}" target="_blank" rel="noopener">${REPO_ICON}Repozitář</a>`);
  if (meta.app) links.push(`<a href="${meta.app}" target="_blank" rel="noopener">${APP_ICON}Aplikace</a>`);

  const tags = (meta.tags || []).map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("");

  const techHtml = sections["Technický popis"] ? markdownToHtml(sections["Technický popis"]) : "";
  const moreHtml = sections["Více informací"] ? markdownToHtml(sections["Více informací"]) : "";

  const COLLAGE_LIMIT = 3;
  const collageShots = screenshots.slice(0, COLLAGE_LIMIT);
  const remaining = screenshots.length - collageShots.length;

  const collageTiles = collageShots
    .map((src, i) => {
      const isLastVisible = i === collageShots.length - 1 && remaining > 0;
      return `<button type="button" class="gallery-tile" data-index="${i}" aria-label="Zobrazit screenshot ${i + 1} z ${screenshots.length}">
        <img src="${src}" alt="Náhled ${i + 1}" loading="lazy">
        ${isLastVisible ? `<span class="gallery-more">+${remaining}</span>` : ""}
      </button>`;
    })
    .join("");

  const galleryHtml = screenshots.length
    ? `<div class="gallery-collage">${collageTiles}</div>`
    : "";

  const hasMore = Boolean(techHtml || galleryHtml || moreHtml);

  article.innerHTML = `
    ${hero
      ? `<button type="button" class="project-hero" aria-label="Zobrazit více o projektu">
          <img src="${hero}" alt="Náhled projektu ${escapeHtml(meta.title || "")}" loading="lazy">
        </button>`
      : ""
    }
    <div class="project-summary">
      <div class="project-head">
        <h4 class="project-title">${escapeHtml(meta.title || "Projekt")}</h4>
        <div class="project-links">${links.join("")}</div>
      </div>
      <p class="project-description">${escapeHtml(meta.description || "")}</p>
      ${tags ? `<div class="tag-list">${tags}</div>` : ""}
    </div>
    ${hasMore
      ? `<details class="project-more">
            <summary><span class="project-more-label">Zobrazit více</span></summary>
            <div class="project-more-content">
              ${techHtml
                ? `<div class="project-tech-section">
                      <h5 class="project-tech-heading">Použité technologie</h5>
                      <div class="project-tech">${techHtml}</div>
                    </div>`
                : ""
              }
              ${galleryHtml}
              ${moreHtml}
            </div>
          </details>`
      : ""
    }
  `;

  const moreDetails = article.querySelector(".project-more");

  const heroBtn = article.querySelector(".project-hero");
  if (heroBtn) {
    heroBtn.addEventListener("click", () => {
      if (moreDetails) moreDetails.open = !moreDetails.open;
    });
  }

  article.querySelectorAll(".gallery-tile").forEach((tile) => {
    tile.addEventListener("click", () => openLightbox(screenshots, Number(tile.dataset.index)));
  });

  if (moreDetails) {
    const moreLabel = moreDetails.querySelector(".project-more-label");
    moreDetails.addEventListener("toggle", () => {
      moreLabel.textContent = moreDetails.open ? "Skrýt" : "Zobrazit více";
    });
  }

  return article;
}

const WIDE_QUERY = "(min-width: 881px)";

// Splits articles into two independent columns (alternating) so expanding a
// card in one column never shifts the vertical position of cards in the other.
function layoutProjects(container, articles) {
  const isWide = window.matchMedia(WIDE_QUERY).matches;
  container.innerHTML = "";
  container.classList.toggle("projects-columns", isWide);

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

async function loadProjects() {
  const container = document.getElementById("projects");
  const openLightbox = setupLightbox();

  try {
    const indexRes = await fetch("projects/index.json");
    const files = await indexRes.json();

    const projects = await Promise.all(
      files.map(async (file) => {
        const res = await fetch(`projects/${file}`);
        const raw = await res.text();
        return parseFrontmatter(raw);
      })
    );

    const articles = projects.map((project, i) => renderProject(project, i, openLightbox));
    layoutProjects(container, articles);

    let wasWide = window.matchMedia(WIDE_QUERY).matches;
    window.addEventListener("resize", () => {
      const isWide = window.matchMedia(WIDE_QUERY).matches;
      if (isWide !== wasWide) {
        wasWide = isWide;
        layoutProjects(container, articles);
      }
    });
  } catch (err) {
    container.innerHTML = '<p class="projects-error">Projekty se nepodařilo načíst.</p>';
    console.error(err);
  }
}

// --- Site content ------------------------------------------------------------

async function loadContent() {
  try {
    const res = await fetch("content.md");
    const raw = await res.text();
    const { meta } = parseFrontmatter(raw);

    if (meta.page_title) {
      const titleEl = document.createElement("div");
      titleEl.innerHTML = meta.page_title;
      document.title = titleEl.textContent;
    }

    document.querySelectorAll("[data-content]").forEach((el) => {
      const key = el.dataset.content;
      if (meta[key] !== undefined) el.innerHTML = meta[key];
    });

    document.querySelectorAll("[data-content-href]").forEach((el) => {
      const key = el.dataset.contentHref;
      if (meta[key] !== undefined) el.setAttribute("href", meta[key]);
    });

    document.querySelectorAll("[data-content-aria]").forEach((el) => {
      const key = el.dataset.contentAria;
      if (meta[key] !== undefined) el.setAttribute("aria-label", meta[key]);
    });
  } catch (err) {
    console.error(err);
  }
}

setupThemeToggle();
loadContent();
loadProjects();
