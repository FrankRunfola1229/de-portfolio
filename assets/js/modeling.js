/**
 * modeling.js
 * Thin wrapper around Site.initSnippetsPage (implemented in shared.js).
 */
(function () {
  if (window.Site && typeof Site.initNav === "function") Site.initNav();
  if (window.Site && typeof Site.initSnippetsPage === "function") {
    Site.initSnippetsPage({
      gridId: "snippetsGrid",
      jsonPath: "./assets/data/modeling_snippets.json",
      codeLang: "sql",
    });
  }
})();
