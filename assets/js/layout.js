/**
 * layout.js
 * Injects the shared layout (navbar + optional backbar + footer).
 *
 * Usage:
 * - Put <div id="siteHeader"></div> at top of <body>
 * - Put <div id="siteBackbar"></div> after the header
 * - Put <footer id="siteFooter"></footer> inside <main>
 *
 * Control via <body> data attributes:
 * - data-page="home|projects|training|pyspark|sql|modeling"  (optional, used for semantics)
 * - data-show-back="0|1"  (1 = show backbar)
 * - data-footer-right="Static • Azure" (text on footer right)
 */

(function initLayout() {
  const headerHost = document.getElementById("siteHeader");
  const backbarHost = document.getElementById("siteBackbar");
  const footerHost = document.getElementById("siteFooter");

  if (!headerHost) return;

  const body = document.body;
  const showBack = body.dataset.showBack === "1";
  const footerRight = body.dataset.footerRight || "Static • Azure";

  // Centralize these once (no more copy/paste across pages)
  const LINKS = {
    github: "https://github.com/FrankRunfola1229",
    linkedin: "https://www.linkedin.com/in/frank-runfola-92897b53/",
  };

  headerHost.innerHTML = `
    <header class="site-header">
      <div class="container py-2">
        <nav class="navbar navbar-expand-md navbar-light p-0">
          <div class="d-flex flex-column">
            <div class="name">Frank Runfola</div>
            <div class="role">Data Engineering • Azure</div>
          </div>

          <button
            class="navbar-toggler ms-auto"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#siteNav"
            aria-controls="siteNav"
            aria-expanded="false"
            aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="siteNav">
            <div class="d-flex flex-column flex-md-row gap-2 align-items-start align-items-md-center ms-md-auto mt-3 mt-md-0">
              <a class="btn btn-sm btn-soft" href="index.html" data-nav><i class="bi bi-house-door me-1"></i>Home</a>
              <a class="btn btn-sm btn-soft" href="projects.html" data-nav><i class="bi bi-boxes me-1"></i>Projects</a>
              <a class="btn btn-sm btn-soft" href="labs.html" data-nav><i class="bi bi-beaker me-1"></i>Labs</a>

              <a class="btn btn-sm btn-soft" href="training.html" data-nav><i class="bi bi-journal-code me-1"></i>Training</a>

              <div class="d-flex gap-2">
                <a class="btn btn-sm btn-soft btn-icon"
                   href="${LINKS.github}" target="_blank" rel="noreferrer"
                   aria-label="GitHub">
                  <i class="bi bi-github"></i>
                </a>

                <a class="btn btn-sm btn-soft btn-icon"
                   href="${LINKS.linkedin}" target="_blank" rel="noreferrer"
                   aria-label="LinkedIn">
                  <i class="bi bi-linkedin"></i>
                </a>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  `.trim();

  if (backbarHost) {
    backbarHost.innerHTML = showBack
      ? `
        <div class="page-backbar">
          <div class="container">
            <a class="btn btn-sm btn-soft btn-back" href="#" id="navBack" aria-label="Go back">
              <i class="bi bi-arrow-left"></i>
              <span>Back</span>
            </a>
          </div>
        </div>
      `.trim()
      : "";
  }

  if (footerHost) {
    footerHost.innerHTML = `
      <div class="d-flex justify-content-between flex-wrap gap-2 small text-muted">
        <div>© <span id="year"></span> Frank Runfola</div>
        <div>${Site.escapeHtml(footerRight)}</div>
      </div>
    `.trim();

    const yearEl = footerHost.querySelector("#year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  // Wire shared navigation behaviors (back button + active link).
  if (window.Site && typeof Site.initNav === "function") Site.initNav();

})();
