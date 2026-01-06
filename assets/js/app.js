/**
 * app.js
 * Projects page renderer.
 * Footer year is handled by layout.js now.
 *
 * Flow button opens a modal and displays the PNG.
 * Depends on shared.js (window.Site)
 */

(async function initProjectsPage() {
  const grid = document.getElementById("projectsGrid");
  const updatedEl = document.getElementById("updated");

  if (!grid) return;

  const flowModalLabel = document.getElementById("flowModalLabel");
  const flowModalImg = document.getElementById("flowModalImg");

  try {
    const items = await Site.fetchJson("./assets/data/projects.json");
    if (!Array.isArray(items)) throw new Error("projects.json must be an array");

    grid.innerHTML = items.map(renderProjectCard).join("");

    if (updatedEl) {
      const d = new Date();
      updatedEl.textContent = `Updated: ${d.toLocaleDateString()}`;
    }

    wireFlowModal();
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

    const repoBtn = repo ? renderLinkBtn("Repo", repo, "bi-github") : renderBtnDisabled("Repo");
    const flowBtn = flow ? renderFlowBtn("Flow", flow, title) : renderBtnDisabled("Flow");

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

  function renderLinkBtn(label, href, iconClass) {
    const safeHref = Site.escapeAttr(href);
    const safeLabel = Site.escapeHtml(label);

    return `
      <a class="btn btn-sm btn-card" href="${safeHref}" target="_blank" rel="noreferrer">
        <i class="bi ${Site.escapeAttr(iconClass)} me-1"></i>${safeLabel}
      </a>
    `.trim();
  }

  function renderFlowBtn(label, flowSrc, title) {
    const safeLabel = Site.escapeHtml(label);
    const safeFlow = Site.escapeAttr(flowSrc);
    const safeTitle = Site.escapeAttr(title || "Flow");

    return `
      <button
        class="btn btn-sm btn-card"
        type="button"
        data-flow-img="${safeFlow}"
        data-flow-title="${safeTitle}"
        data-bs-toggle="modal"
        data-bs-target="#flowModal">
        <i class="bi bi-diagram-3 me-1"></i>${safeLabel}
      </button>
    `.trim();
  }

  function renderBtnDisabled(label) {
    const safeLabel = Site.escapeHtml(label);
    return `<button class="btn btn-sm btn-card disabled" type="button" aria-disabled="true">${safeLabel}</button>`;
  }

  function wireFlowModal() {
    if (!flowModalImg || !flowModalLabel) return;

    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-flow-img]");
      if (!btn) return;

      const src = btn.getAttribute("data-flow-img") || "";
      const title = btn.getAttribute("data-flow-title") || "Flow";

      flowModalLabel.textContent = `${title} — Flow`;
      flowModalImg.src = src;
      flowModalImg.alt = `${title} flow diagram`;
    });

    const modalEl = document.getElementById("flowModal");
    if (modalEl) {
      modalEl.addEventListener("hidden.bs.modal", () => {
        flowModalImg.src = "";
        flowModalImg.alt = "Flow diagram";
        flowModalLabel.textContent = "Flow";
      });
    }
  }
})();
