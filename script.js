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
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
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
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(currentIndex - 1);
    if (e.key === "ArrowRight") show(currentIndex + 1);
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

  article.innerHTML = `
    <div class="project-head">
      <h4 class="project-title">${escapeHtml(meta.title || "Projekt")}</h4>
      <div class="project-links">${links.join("")}</div>
    </div>
    <p class="project-description">${escapeHtml(meta.description || "")}</p>
    ${techHtml || tags
      ? `<div class="project-tech-section">
            <h5 class="project-tech-heading">Technický popis a použité technologie</h5>
            ${techHtml ? `<div class="project-tech">${techHtml}</div>` : ""}
            ${tags ? `<div class="tag-list">${tags}</div>` : ""}
          </div>`
      : ""
    }
    ${galleryHtml}
    ${moreHtml
      ? `<details class="project-more">
            <summary><span class="project-more-label">Zobrazit detaily</span></summary>
            <div class="project-more-content">${moreHtml}</div>
          </details>`
      : ""
    }
  `;

  article.querySelectorAll(".gallery-tile").forEach((tile) => {
    tile.addEventListener("click", () => openLightbox(screenshots, Number(tile.dataset.index)));
  });

  const moreDetails = article.querySelector(".project-more");
  if (moreDetails) {
    const moreLabel = moreDetails.querySelector(".project-more-label");
    moreDetails.addEventListener("toggle", () => {
      moreLabel.textContent = moreDetails.open ? "Skrýt detaily" : "Zobrazit detaily";
    });
  }

  return article;
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

    container.innerHTML = "";
    projects.forEach((project, i) => container.appendChild(renderProject(project, i, openLightbox)));
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
