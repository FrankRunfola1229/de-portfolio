/**
 * shared.js
 * Tiny shared utilities used across pages.
 * Keeps code DRY and easy to read.
 */
(function () {
  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function escapeAttr(s) {
    // attribute-safe (good enough for simple text/urls)
    return escapeHtml(s).replaceAll("`", "&#096;");
  }

  async function fetchJson(path) {
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) throw new Error(`${path} HTTP ${res.status}`);
    return await res.json();
  }

  function formatUpdated() {
    return "Updated " + new Date().toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit"
    });
  }

  // Expose a tiny namespace (keeps global clean)
  window.Site = {
    escapeHtml,
    escapeAttr,
    fetchJson,
    formatUpdated
  };
})();
