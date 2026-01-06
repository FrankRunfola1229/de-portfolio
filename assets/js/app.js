/**
 * app.js (Home page)
 * Renders project cards from assets/data/projects.json
 * Uses shared utilities from shared.js (window.Site).
 *
 * Updates:
 * - Centered service icons in cards (CSS)
 * - Hero section uses the SAME icon chips as cards (slightly bigger via CSS)
 */
(async function initProjectsPage() {
  const yearEl = document.getElementById("year");
  const updatedEl = document.getElementById("updated");
  const grid = document.getElementById("projectsGrid");
  const heroServices = document.getElementById("heroServices");

  if (!grid) {
    console.error("Missing #projectsGrid in index.html");
    return;
  }

  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (updatedEl) updatedEl.textContent = Site.formatUpdated();

  // Hot-linked Azure icons (you don't store them)
  const SERVICE_META = {
    adls: {
      label: "ADLS",
      desc: "Azure Data Lake Storage Gen2",
      icon: "https://az-icons.com/api/icon/storage-accounts/download?format=png"
    },
    adf: {
      label: "ADF",
      desc: "Azure Data Factory",
      icon: "https://az-icons.com/api/icon/data-factories/download?format=png"
    },
    databricks: {
      label: "Databricks",
      desc: "Azure Databricks",
      icon: "https://az-icons.com/api/icon/azure-databricks/download?format=png"
    },
    synapse: {
      label: "Synapse",
      desc: "Azure Synapse Analytics",
      icon: "https://az-icons.com/api/icon/azure-synapse-analytics/download?format=png"
    }
  };

  // ✅ Hero uses the same service chips as cards
  if (heroServices) {
    const core = ["adf", "adls", "databricks", "synapse"];
    heroServices.innerHTML = renderServices(core, SERVICE_META, { extraSvcClass: "" });
  }

  try {
    const projects = await Site.fetchJson("./assets/data/projects.json");
    if (!Array.isArray(projects)) throw new Error("projects.json must be an array");
    grid.innerHTML = projects.map((p) => renderProjectCard(p, SERVICE_META)).join("");
  } catch (err) {
    console.error(err);
    grid.innerHTML = renderErrorCard(err);
  }

  function renderProjectCard(p, meta) {
    const title = p.title || "";
    const desc = p.desc || "";
    const image = p.image || "";

    const servicesHtml = renderServices(p.services || [], meta, { extraSvcClass: "" });
    const actionsHtml = renderActions(p);

    return `
      <div class="col-md-6 col-lg-4">
        <article class="project-card">
          <div class="project-img-wrap">
            <img class="project-img"
              src="${Site.escapeAttr(image)}"
              alt="${Site.escapeAttr(title)} image"
              loading="lazy" />
          </div>

          <div class="project-body d-flex flex-column">
            <div class="project-title">${Site.escapeHtml(title)}</div>

            <div class="card-label">Description</div>
            <div class="project-desc">${Site.escapeHtml(desc)}</div>

            <div class="svc-row">${servicesHtml}</div>

            <div class="mt-auto pt-2">
              ${actionsHtml}
            </div>
          </div>
        </article>
      </div>
    `;
  }

  function renderServices(services, meta, opts = {}) {
    if (!services.length) return `<span class="text-muted small">Not listed</span>`;
    const extra = (opts.extraSvcClass || "").trim();

    return services.map((keyRaw) => {
      const key = String(keyRaw || "").toLowerCase().trim();
      const m = meta[key];

      if (!m) {
        return `
          <span class="svc ${extra}" title="${Site.escapeAttr(key)}">
            <span class="svc-txt">${Site.escapeHtml(key)}</span>
          </span>
        `;
      }

      return `
        <span class="svc ${extra}" title="${Site.escapeAttr(m.desc)}" aria-label="${Site.escapeAttr(m.desc)}">
          <img class="svc-ico" src="${Site.escapeAttr(m.icon)}" alt="${Site.escapeAttr(m.label)} icon" loading="lazy" />
          <span class="svc-txt">${Site.escapeHtml(m.label)}</span>
        </span>
      `;
    }).join("");
  }

  // Repo + Flow buttons
  function renderActions(p) {
    const repoBtn = renderActionButton("Repo", p.repo);
    const flowBtn = renderActionButton("Flow", p.flow);

    return `
      <div class="card-actions">
        ${repoBtn}
        ${flowBtn}
      </div>
    `;
  }

  function renderActionButton(label, href) {
    const safeLabel = Site.escapeHtml(label);

    if (!href) {
      return `<a class="btn btn-sm btn-card disabled" href="#" tabindex="-1" aria-disabled="true">${safeLabel}</a>`;
    }

    return `<a class="btn btn-sm btn-card" href="${Site.escapeAttr(href)}" target="_blank" rel="noreferrer">${safeLabel}</a>`;
  }

  function renderErrorCard(err) {
    return `
      <div class="col-12">
        <div class="card-soft p-4">
          <div class="fw-semibold">Projects failed to load.</div>
          <div class="text-muted small mt-1">${Site.escapeHtml(String(err.message || err))}</div>
        </div>
      </div>
    `;
  }
})();
