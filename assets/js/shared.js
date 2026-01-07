/**
 * shared.js
 * Small shared utilities with low coupling.
 * Exposes a single global: window.Site
 *
 * - fetchJson(path): fetch and parse JSON
 * - escapeHtml(str): safe HTML text
 * - escapeAttr(str): safe HTML attribute value
 * - SERVICE_META: Azure service metadata (label + icon url)
 * - renderServicePills(keys, opts): render the service pills row HTML
 */

(function attachSite() {
  const Site = {};

  // -----------------------
  // Safe escaping helpers
  // -----------------------
  Site.escapeHtml = function escapeHtml(value) {
    const s = String(value ?? "");
    return s
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  };

  Site.escapeAttr = function escapeAttr(value) {
    // Same as HTML escaping; used for attribute contexts.
    return Site.escapeHtml(value);
  };

  // -----------------------
  // JSON fetch helper
  // -----------------------
  // In-memory memoization to avoid repeat network work on single-page navigations.
  const _jsonCache = new Map();

  Site.fetchJson = async function fetchJson(path, opts = {}) {
    const key = String(path);
    const cacheMode = opts.cache ?? "force-cache"; // default: allow normal browser caching
    const bust = opts.bust === true;

    if (!bust && _jsonCache.has(key)) return _jsonCache.get(key);

    const p = (async () => {
      const res = await fetch(key, { cache: cacheMode });
      if (!res.ok) throw new Error(`HTTP ${res.status} while fetching ${key}`);
      return await res.json();
    })();

    _jsonCache.set(key, p);

    try {
      return await p;
    } catch (e) {
      _jsonCache.delete(key);
      throw e;
    }
  };

  // -----------------------
  // Text fetch helper (HTML partials)
  // -----------------------
  // In-memory memoization to avoid repeat network work.
  const _textCache = new Map();

  Site.fetchText = async function fetchText(path, opts = {}) {
    const key = String(path);
    const cacheMode = opts.cache ?? "force-cache";
    const bust = opts.bust === true;

    if (!bust && _textCache.has(key)) return _textCache.get(key);

    const p = (async () => {
      const res = await fetch(key, { cache: cacheMode });
      if (!res.ok) throw new Error(`HTTP ${res.status} while fetching ${key}`);
      return await res.text();
    })();

    _textCache.set(key, p);

    try {
      return await p;
    } catch (e) {
      _textCache.delete(key);
      throw e;
    }
  };

  // -----------------------
  // Azure service metadata
  // (Hot-linked icons — nothing stored locally)
  // -----------------------
  Site.SERVICE_META = {
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
    },

    // Extra icons (same pill style)
    api: {
      label: "API",
      desc: "API integration (APIs / API Management)",
      icon: "https://az-icons.com/api/icon/api-management-services/download?format=png"
    },
    sql: {
      label: "SQL",
      desc: "SQL (SQL Server / Azure SQL)",
      icon: "https://az-icons.com/api/icon/sql-database/download?format=png"
    },
    powerbi: {
      label: "Power BI",
      desc: "Power BI (reporting / dashboards)",
      icon: "https://az-icons.com/api/icon/power-bi-embedded/download?format=png"
    }
  };

  /**
   * Render the Azure service pills row.
   * @param {string[]} keys - list like ["adls","adf","databricks","synapse"]
   * @param {{ className?: string }} opts - optional extra class on wrapper pills
   * @returns {string} HTML string
   */
  Site.renderServicePills = function renderServicePills(keys, opts = {}) {
    if (!Array.isArray(keys) || keys.length === 0) return "";

    const cls = opts.className ? ` ${Site.escapeAttr(opts.className)}` : "";

    return keys
      .map((k) => {
        const m = Site.SERVICE_META[k];
        if (!m) return "";

        const label = m.label || String(k).toUpperCase();
        const desc = m.desc || label; // safe fallback

        return `
          <span class="svc${cls}" title="${Site.escapeAttr(desc)}" aria-label="${Site.escapeAttr(desc)}">
            <img class="svc-ico" src="${Site.escapeAttr(m.icon)}" alt="${Site.escapeAttr(label)} icon" loading="lazy">
            <span class="svc-txt">${Site.escapeHtml(label)}</span>
          </span>
        `.trim();
      })
      .filter(Boolean)
      .join("");
  };

  

  // -----------------------
  // Navigation helpers (Back button + active nav highlight)
  // -----------------------
  Site.initNav = function initNav() {
    // Back button
    const back = document.getElementById("navBack");
    if (back && !back.dataset.bound) {
      back.dataset.bound = "1";
      back.addEventListener("click", (e) => {
        e.preventDefault();
        if (window.history.length > 1) window.history.back();
        else window.location.href = "index.html";
      });
    }

    // Active nav highlight
    const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    const currentNav = current.startsWith("labs-") ? "labs.html" : current;
    document.querySelectorAll("[data-nav]").forEach((a) => {
      const href = (a.getAttribute("href") || "").toLowerCase();
      if (href === currentNav) {
        a.classList.add("is-active");
        a.setAttribute("aria-current", "page");
      }
    });
  };

  // -----------------------
  // Copy-to-clipboard helpers (delegated)
  // -----------------------
  Site.copyText = async function copyText(text) {
    const value = String(text ?? "");
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(value);
    }

    // Fallback (older browsers)
    const ta = document.createElement("textarea");
    ta.value = value;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
    } finally {
      document.body.removeChild(ta);
    }
  };

  Site.bindCopyButtons = function bindCopyButtons(container = document) {
    if (!container || container.dataset?.copyBound === "1") return;
    if (container.dataset) container.dataset.copyBound = "1";

    container.addEventListener("click", async (e) => {
      const btn = e.target && e.target.closest ? e.target.closest("[data-copy]") : null;
      if (!btn || !container.contains(btn)) return;

      const code = btn.getAttribute("data-copy") || "";
      const old = btn.innerHTML;

      try {
        await Site.copyText(code);
        btn.innerHTML = `<i class="bi bi-check2 me-1"></i>Copied`;
      } catch {
        btn.innerHTML = `<i class="bi bi-x-lg me-1"></i>Copy failed`;
      } finally {
        setTimeout(() => (btn.innerHTML = old), 900);
      }
    });
  };

  // -----------------------
  // Snippets page renderer (SQL / Modeling / PySpark)
  // -----------------------
  Site.initSnippetsPage = async function initSnippetsPage(opts) {
    const gridId = opts?.gridId || "snippetsGrid";
    const jsonPath = opts?.jsonPath;
    const codeLang = opts?.codeLang || "sql";

    const grid = document.getElementById(gridId);
    if (!grid || !jsonPath) return;

    try {
      const items = await Site.fetchJson(jsonPath);
      if (!Array.isArray(items)) throw new Error(`${jsonPath} must be an array`);

      grid.innerHTML = items
        .map((s) => {
          const title = s?.title ?? "";
          const note = s?.note ?? "";
          const code = String(s?.code ?? "");

          return `
            <div class="col-12 col-lg-6">
              <article class="project-card h-100">
                <div class="project-body">
                  <div class="project-title">${Site.escapeHtml(title)}</div>
                  <div class="project-desc">${Site.escapeHtml(note)}</div>

                  <div class="d-flex justify-content-center mb-2">
                    <button class="btn btn-sm btn-card" type="button" data-copy="${Site.escapeAttr(code)}">
                      <i class="bi bi-clipboard me-1"></i>Copy
                    </button>
                  </div>

                  <pre class="m-0"><code class="language-${Site.escapeAttr(codeLang)}">${Site.escapeHtml(code)}</code></pre>
                </div>
              </article>
            </div>
          `.trim();
        })
        .join("");

      if (window.Prism) Prism.highlightAll();
      Site.bindCopyButtons(grid);
    } catch (err) {
      console.error(err);
      grid.innerHTML = `
        <div class="col-12">
          <div class="card-soft p-4">
            <div class="section-title mb-2">Snippets failed to load.</div>
            <div class="text-muted small mono">${Site.escapeHtml(String(err.message || err))}</div>
          </div>
        </div>
      `;
    }
  };
window.Site = Site;
})();
