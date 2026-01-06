/**
 * home.js
 * Home page-only:
 * - hero Azure service pills
 *
 * Depends on shared.js (window.Site)
 * Footer year is handled by layout.js now.
 */

(function initHome() {
  const heroServices = document.getElementById("heroServices");
  if (!heroServices || !window.Site) return;

  const core = ["adf", "adls", "databricks", "synapse"];
  heroServices.innerHTML = Site.renderServicePills(core);
})();
