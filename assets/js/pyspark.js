/**
 * pyspark.js
 * Renders snippets from assets/data/pyspark_snippets.json
 * Uses shared utilities from shared.js (window.Site).
 */
(async function initPySparkPage() {
  const yearEl = document.getElementById("year");
  const grid = document.getElementById("snippetsGrid");

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  if (!grid) {
    console.error("Missing #snippetsGrid in pyspark.html");
    return;
  }

  try {
    const items = await Site.fetchJson("./assets/data/pyspark_snippets.json");
    if (!Array.isArray(items)) throw new Error("pyspark_snippets.json must be an array");

    grid.innerHTML = items.map(renderSnippetCard).join("");

    if (window.Prism) Prism.highlightAll();
    wireCopyButtons();
  } catch (err) {
    console.error(err);
    grid.innerHTML = `
      <div class="col-12">
        <div class="card-soft p-4">
          <div class="fw-semibold">Snippets failed to load.</div>
          <div class="text-muted small mt-1">${Site.escapeHtml(String(err.message || err))}</div>
        </div>
      </div>
    `;
  }

  function renderSnippetCard(s) {
    const title = s.title || "";
    const note = s.note || "";
    const code = String(s.code || "");

    return `
      <div class="col-lg-6">
        <article class="code-card">
          <div class="code-head">
            <div>
              <p class="code-title">${Site.escapeHtml(title)}</p>
              <p class="code-note">${Site.escapeHtml(note)}</p>
            </div>
            <button class="btn btn-sm btn-soft btn-copy" data-copy="${Site.escapeAttr(code)}">Copy</button>
          </div>
          <div class="code-body">
            <pre><code class="language-python">${Site.escapeHtml(code)}</code></pre>
          </div>
        </article>
      </div>
    `;
  }

  function wireCopyButtons() {
    document.querySelectorAll("[data-copy]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const code = btn.getAttribute("data-copy") || "";
        try {
          await navigator.clipboard.writeText(code);
          const old = btn.textContent;
          btn.textContent = "Copied";
          setTimeout(() => (btn.textContent = old), 900);
        } catch {
          btn.textContent = "Copy failed";
          setTimeout(() => (btn.textContent = "Copy"), 900);
        }
      });
    });
  }
})();
