// Reads the source content (content.md, projects/*.md) and the index.html
// template, and writes a fully pre-rendered static site to dist/. This is
// what actually gets deployed — no fetch/innerHTML rendering happens at
// runtime, so the page is fully readable without executing JavaScript.

const fs = require("fs");
const path = require("path");
const { parseFrontmatter, renderProject, renderProjectsColumns } = require("./render");

const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");

function readMeta(relPath) {
  const raw = fs.readFileSync(path.join(ROOT, relPath), "utf8");
  return parseFrontmatter(raw);
}

function renderProjectsSection() {
  const files = JSON.parse(fs.readFileSync(path.join(ROOT, "projects/index.json"), "utf8"));
  const projects = files.map((file) => readMeta(`projects/${file}`));
  const articles = projects.map((project, i) => renderProject(project, i));
  return renderProjectsColumns(articles);
}

function injectProjectsSection(html, columnsHtml) {
  return html.replace(
    /<section id="projects" class="projects">[\s\S]*?<\/section>/,
    `<section id="projects" class="projects projects-columns">${columnsHtml}</section>`
  );
}

function injectTitle(html, pageTitle) {
  if (!pageTitle) return html;
  return html.replace(/<title id="page-title"><\/title>/, `<title id="page-title">${pageTitle}</title>`);
}

// Fills every `data-content="key"` leaf element's inner content with
// content.md's matching frontmatter value (mirrors script.js's old
// loadContent(), but at build time instead of at runtime).
function injectDataContent(html, meta) {
  const re = /<([a-zA-Z][a-zA-Z0-9]*)([^>]*\bdata-content="([a-zA-Z0-9_]+)"[^>]*)>([\s\S]*?)<\/\1>/g;
  return html.replace(re, (match, tag, attrs, key, content) => {
    const value = meta[key] !== undefined ? meta[key] : content;
    return `<${tag}${attrs}>${value}</${tag}>`;
  });
}

function injectDataAttr(html, attrName, targetAttr, meta) {
  const re = new RegExp(`${attrName}="([a-zA-Z0-9_]+)"`, "g");
  return html.replace(re, (match, key) => {
    const value = meta[key];
    return value === undefined ? match : `${match} ${targetAttr}="${value}"`;
  });
}

function copyStaticAssets() {
  const entries = ["style.css", "script.js", "fonts", "assets", "profile-photo.jpg", "CNAME", ".nojekyll"];
  for (const entry of entries) {
    const src = path.join(ROOT, entry);
    if (!fs.existsSync(src)) continue;
    fs.cpSync(src, path.join(DIST, entry), { recursive: true });
  }
}

function build() {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  const { meta } = readMeta("content.md");
  let html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

  html = injectProjectsSection(html, renderProjectsSection());
  html = injectTitle(html, meta.page_title);
  html = injectDataContent(html, meta);
  html = injectDataAttr(html, "data-content-href", "href", meta);
  html = injectDataAttr(html, "data-content-aria", "aria-label", meta);

  fs.writeFileSync(path.join(DIST, "index.html"), html);
  copyStaticAssets();

  console.log(`Built static site to ${DIST}`);
}

build();
