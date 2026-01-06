/**
 * nav.js
 * Handles:
 * - Back button: browser back if possible, otherwise go Home
 * - Active link highlight for nav buttons (data-nav)
 */

(function initNav() {
  // ---- Back button ----
  const back = document.getElementById("navBack");
  if (back) {
    back.addEventListener("click", (e) => {
      e.preventDefault();
      if (window.history.length > 1) window.history.back();
      else window.location.href = "index.html";
    });
  }

  // ---- Active nav highlight ----
  const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll("[data-nav]").forEach((a) => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    if (href === current) {
      a.classList.add("is-active");
      a.setAttribute("aria-current", "page");
    }
  });
})();
