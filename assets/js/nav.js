/**
 * nav.js (legacy wrapper)
 * Navigation behavior is now implemented in shared.js as Site.initNav().
 * This file remains for backward compatibility.
 */
(function () {
  if (window.Site && typeof Site.initNav === "function") Site.initNav();
})();
