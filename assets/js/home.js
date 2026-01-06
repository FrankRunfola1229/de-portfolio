/**
 * home.js
 * Home page-only:
 * - footer year
 * - hero Azure service pills (left aligned, slightly bigger by CSS)
 *
 * Depends on shared.js (window.Site)
 */

(function initHome() {
  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Render hero services pills
  const heroServices = document.getElementById("heroServices");
  if (!heroServices || !window.Site) return;

  // Keep this simple: fixed “core stack” for your brand
  const core = ["adf", "adls", "databricks", "synapse"];
  heroServices.innerHTML = Site.renderServicePills(core);
})();
