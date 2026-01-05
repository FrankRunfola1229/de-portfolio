// assets/js/app.js
"use strict";

import {
  setText,
  formatUpdatedDate,
  safeText,
  safeHtml,
  safeAttr,
  getErrorMessage,
} from "./utils.js";

const CONFIG = {
  projectsUrl: "assets/data/projects.json",
  fetchOptions: { cache: "no-store" },
  scrollElevateThresholdPx: 8,
};

document.addEventListener("DOMContentLoaded", () => {
  setFooterDates();
  initNavbarElevation();
  initFlowModal();
  loadAndRenderProjects();
});

// -------------------------
// Footer
// -------------------------
function setFooterDates() {
  const now = new Date();
  setText("year", String(now.getFullYear()));
  setText("updated", `Updated ${formatUpdatedDate(now)}`);
}

// -------------------------
// Navbar elevation
// -------------------------
function initNavbarElevation() {
  const nav = document.querySelector(".navbar.fixed-top");
  if (!nav) return;

  const update = () => {
    nav.classList.toggle(
      "navbar-elevated",
      window.scrollY > CONFIG.scrollElevateThresholdPx
    );
  };

  window.addEventListener("scroll", update, { passive: true });
  update();
}

// -------------------------
// Flow Modal
// -------------------------
function initFlowModal() {
  const bs = window.bootstrap;
  if (!bs) return;

  const modalEl = document.getElementById("flowModal");
  const imgEl = document.getElementById("flowModalImg");
  const titleEl = document.getElementById("flowModalLabel");
  const openNewEl = document.getElementById("flowModalOpenNew");

  if (!modalEl || !imgEl || !titleEl || !openNewEl) return;

  const modal = new bs.Modal(modalEl);

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("a.flow-link");
    if (!trigger) return;

    e.preventDefault();

    const src = trigger.getAttribute("data-flow") || "";
    const project = trigger.getAttribute("data-title") || "Project";
    if (!src) return;

    titleEl.textContent = `${project} — Flow`;
    imgEl.src = src;
    imgEl.alt = `${project} flow diagram`;
    openNewEl.href = src;

    modal.show();
  });

  modalEl.addEventListener("hidden.bs.modal", () => {
    titleEl.textContent = "Project Flow";
    imgEl.src = "";
    imgEl.alt = "";
    openNewEl.href = "#";
  });
}

// -------------------------
// Projects
// -------------------------
async function loadAndRenderProjects() {
  const grid = document.getElementById("projectsGrid");
  if (!grid) return;

  try {
    const projects = await fetchJson(CONFIG.projectsUrl, CONFIG.fetchOptions);
    grid.innerHTML = renderProjects(projects);
  } catch (err) {
    grid.innerHTML = renderProjectsError(err);
  }
}

function renderProjects(projects) {
  if (!Array.isArray(projects) || projects.length === 0) {
    return renderProjectsError("No projects found.");
  }
  return projects.map(renderProjectCard).join("");
}

function renderProjectCard(p) {
  const title = safeText(p?.title);
  const desc = safeText(p?.desc || "");

  const yearHtml = p?.year
    ? `<div class="project-year">${safeHtml(String(p.year))}</div>`
    : "";

  const descHtml = desc
    ? `
      <div class="project-section">
        <div class="project-section-label">Description</div>
        <div class="project-desc">${safeHtml(desc)}</div>
      </div>
    `
    : "";

  const servicesHtml = renderServicesDock(p?.services);

  // Buttons: Repo / README / Flow (modal)
  const primaryButtons = buildPrimaryButtons(p);
  const flowButton = hasUrl(p?.flow) ? flowButtonHtml(p.flow, title) : "";
  const actionsHtml = renderActions(primaryButtons, flowButton);

  return `
    <div class="col-md-6 col-lg-4">
      <article class="project-card">
        <img class="project-img"
             src="${safeAttr(p?.image)}"
             alt="${safeAttr(title)} project image"
             loading="lazy" />
        <div class="project-body">
          <!--${yearHtml}-->
          <div class="project-title">${safeHtml(title)}</div>
          ${descHtml}
          ${servicesHtml}
          ${actionsHtml}
        </div>
      </article>
    </div>
  `;
}

function renderActions(primaryButtons, flowButton) {
  const hasPrimary = primaryButtons.length > 0;
  const hasFlow = typeof flowButton === "string" && flowButton.length > 0;

  // Nothing at all => show status only
  if (!hasPrimary && !hasFlow) {
    return `
      <div class="card-actions">
        <span class="project-status">In progress</span>
      </div>
    `;
  }

  // No repo/readme/demo yet => show status + Flow (if flow exists)
  if (!hasPrimary && hasFlow) {
    return `
      <div class="card-actions">
        <span class="project-status">In progress</span>
        ${flowButton}
      </div>
    `;
  }

  // Repo/README/Demo exist => show them (+ Flow if it exists)
  const all = hasFlow ? [...primaryButtons, flowButton] : primaryButtons;

  return `
    <div class="card-actions">
      ${all.join("")}
    </div>
  `;
}

function buildPrimaryButtons(p) {
  const btns = [];
  if (hasUrl(p?.repo)) btns.push(actionButtonHtml(p.repo, "Repo"));
  if (hasUrl(p?.readme)) btns.push(actionButtonHtml(p.readme, "README"));
  if (hasUrl(p?.demo)) btns.push(actionButtonHtml(p.demo, "Demo"));
  return btns;
}

function hasUrl(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function actionButtonHtml(url, label) {
  return `
    <a class="card-btn"
       href="${safeAttr(url)}"
       target="_blank"
       rel="noreferrer">
      ${safeHtml(label)}
    </a>
  `;
}

function flowButtonHtml(url, title) {
  return `
    <a class="card-btn card-btn-flow flow-link"
       href="#"
       role="button"
       data-flow="${safeAttr(url)}"
       data-title="${safeAttr(title)}">
      ${safeHtml("Flow")}
    </a>
  `;
}

function renderServicesDock(services) {
  const list = Array.isArray(services) ? services : [];
  if (list.length === 0) return "";

  return `
    <div class="services-dock-wrap">
      <div class="services-dock" aria-label="Azure services used">
        ${list.map(renderServiceIcon).join("")}
      </div>
    </div>
  `;
}

function renderServiceIcon(code) {
  const c = String(code || "").toLowerCase();
  const iconMap = {
    adls: {
      label: "ADLS",
      src: "https://az-icons.com/api/icon/data-lake-store-gen1/download?format=png",
    },
    adf: {
      label: "ADF",
      src: "https://az-icons.com/api/icon/data-factories/download?format=png",
    },
    databricks: {
      label: "Databricks",
      src: "https://az-icons.com/api/icon/azure-databricks/download?format=png",
    },
    synapse: {
      label: "Synapse",
      src: "https://az-icons.com/api/icon/azure-synapse-analytics/download?format=png",
    },
  };

  const meta = iconMap[c];
  if (!meta) return "";

  return `
    <span class="svc-icon" title="${safeAttr(meta.label)}">
      <img class="svc-img" src="${safeAttr(meta.src)}" alt="${safeAttr(meta.label)}" loading="lazy" />
    </span>
  `;
}

function renderProjectsError(err) {
  const msg = safeHtml(getErrorMessage(err));
  return `
    <div class="col-12">
      <div class="card-soft p-4">
        <div class="fw-semibold">Projects failed to load.</div>
        <div class="text-muted small mt-1">${msg}</div>
      </div>
    </div>
  `;
}

// -------------------------
// Fetch
// -------------------------
async function fetchJson(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`Failed to load ${url} (${res.status})`);
  return res.json();
}
