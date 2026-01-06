/**
 * home.js
 * Renders the hero service icon row on index.html
 * Requires shared.js (window.Site).
 */

(function initHome() {
  const hero = document.getElementById("heroServices");
  if (!hero || !window.Site) return;

  // Core + extras (API / SQL / Power BI)
  const HERO_SERVICES = ["adf", "adls", "databricks", "synapse", "api", "sql", "powerbi"];

  // Use the shared renderer (single source of truth)
  hero.innerHTML = Site.renderServicePills(HERO_SERVICES, { className: "svc-hero" });
})();
