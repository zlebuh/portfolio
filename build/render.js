// DOM-free port of script.js's rendering logic, used by build.js at build time
// to produce fully-inlined static HTML. Kept in sync with script.js's markup.

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

const REPO_ICON =
  '<svg width="13" height="13" viewBox="0 0 24 24"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.4 0C6.1 2.8 5 3.1 5 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 3.6 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>';

const APP_ICON =
  '<svg width="13" height="13" viewBox="0 0 24 24"><path d="M14 4h6v6M20 4 10 14M19 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>';

// Renders one project's markup as an HTML string. `index` is the project's
// position among all projects, used to build gallery data-index/aria labels
// and give each lightbox trigger a stable id (`gallery-<projectIndex>-<shotIndex>`).
function renderProject(project, projectIndex) {
  const { meta, body } = project;
  const sections = splitSections(body);
  const screenshots = meta.screenshots || [];
  const hero = screenshots[0];

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
      return `<button type="button" class="gallery-tile" data-project="${projectIndex}" data-index="${i}" aria-label="Zobrazit screenshot ${i + 1} z&nbsp;${screenshots.length}">
        <img src="${src}" alt="Náhled ${i + 1}" loading="lazy">
        ${isLastVisible ? `<span class="gallery-more">+${remaining}</span>` : ""}
      </button>`;
    })
    .join("");

  const galleryHtml = screenshots.length
    ? `<div class="gallery-collage" data-screenshots='${JSON.stringify(screenshots)}'>${collageTiles}</div>`
    : "";

  const hasMore = Boolean(techHtml || galleryHtml || moreHtml);

  return `<article class="project" data-index="${projectIndex}">
    ${hero
      ? `<div class="project-hero">
          <img src="${hero}" alt="Náhled projektu ${escapeHtml(meta.title || "")}" loading="lazy">
        </div>`
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
  </article>`;
}

// Splits rendered article strings into the two-column structure the browser
// otherwise builds at runtime (see layoutProjects in script.js), so the
// desktop-width layout is present by default in the static HTML.
function renderProjectsColumns(articlesHtml) {
  const col1 = [];
  const col2 = [];
  articlesHtml.forEach((html, i) => (i % 2 === 0 ? col1 : col2).push(html));
  return `<div class="projects-col">${col1.join("\n")}</div><div class="projects-col">${col2.join("\n")}</div>`;
}

module.exports = {
  parseFrontmatter,
  escapeHtml,
  inlineMarkdown,
  markdownToHtml,
  splitSections,
  renderProject,
  renderProjectsColumns,
};
