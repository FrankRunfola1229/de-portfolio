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
  Site.fetchJson = async function fetchJson(path) {
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status} while fetching ${path}`);
    return await res.json();
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

  window.Site = Site;
})();
