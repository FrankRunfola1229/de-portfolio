/**
 * app.js
 * Projects page renderer.
 *
 * Reads:
 * - ./assets/data/projects.json
 *
 * Renders:
 * - #projectsGrid -> Bootstrap cards
 * - #updated -> simple "Updated" text
 * - #year -> footer year
 *
 * Depends on shared.js (window.Site)
 */

(async function initProjectsPage() {
  const grid = document.getElementById("projectsGrid");
  const updatedEl = document.getElementById("updated");
  const yearEl = document.getElementById("year");

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // If this page doesn't have a grid, do nothing.
  if (!grid) return;

  try {
    const items = await Site.fetchJson("./assets/data/projects.json");
    if (!Array.isArray(items)) throw new Error("projects.json must be an array");

    // Keep your layout stable:
    // - Title centered
    // - No dates
    // - Description + service pills
    // - Bottom buttons: Repo + Flow (if present)
    grid.innerHTML = items.map(renderProjectCard).join("");

    if (updatedEl) {
      const d = new Date();
      updatedEl.textContent = `Updated: ${d.toLocaleDateString()}`;
    }
  } catch (err) {
    console.error(err);
    grid.innerHTML = `
      <div class="col-12">
        <div class="card-soft p-4">
          <div class="section-title mb-2">Projects failed to load.</div>
          <div class="text-muted small mono">${Site.escapeHtml(String(err.message || err))}</div>
        </div>
      </div>
    `;
  }

  function renderProjectCard(p) {
    const title = p?.title ?? "";
    const desc = p?.desc ?? "";
    const image = p?.image ?? "";
    const services = Array.isArray(p?.services) ? p.services : [];
    const repo = p?.repo ?? "";
    const flow = p?.flow ?? "";

    // Buttons: only show if the link is present
    const repoBtn = repo ? renderBtn("Repo", repo, "bi-github") : renderBtnDisabled("Repo");
    const flowBtn = flow ? renderBtn("Flow", flow, "bi-diagram-3") : renderBtnDisabled("Flow");

    return `
      <div class="col-12 col-sm-6 col-lg-4">
        <article class="project-card h-100">
          <div class="project-img-wrap">
            <img class="project-img" src="${Site.escapeAttr(image)}" alt="${Site.escapeAttr(title)} image" loading="lazy">
          </div>

          <div class="project-body">
            <div class="project-title">${Site.escapeHtml(title)}</div>

            <div class="project-desc">${Site.escapeHtml(desc)}</div>

            <div class="svc-row">
              ${Site.renderServicePills(services)}
            </div>

            <div class="card-actions">
              ${repoBtn}
              ${flowBtn}
            </div>
          </div>
        </article>
      </div>
    `.trim();
  }

  function renderBtn(label, href, iconClass) {
    // target=_blank for external / assets links
    const safeHref = Site.escapeAttr(href);
    const safeLabel = Site.escapeHtml(label);

    return `
      <a class="btn btn-sm btn-card" href="${safeHref}" target="_blank" rel="noreferrer">
        <i class="bi ${Site.escapeAttr(iconClass)} me-1"></i>${safeLabel}
      </a>
    `.trim();
  }

  function renderBtnDisabled(label) {
    const safeLabel = Site.escapeHtml(label);
    return `<button class="btn btn-sm btn-card disabled" type="button" aria-disabled="true">${safeLabel}</button>`;
  }
})();
