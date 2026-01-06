/**
 * modeling.js
 * Renders snippets from assets/data/modeling_snippets.json
 *
 * Depends on shared.js (window.Site)
 * Uses Prism for SQL highlighting (we’ll mark code blocks as SQL).
 */

(async function initModelingPage() {
  const grid = document.getElementById("snippetsGrid");
  if (!grid) return;

  try {
    const items = await Site.fetchJson("./assets/data/modeling_snippets.json");
    if (!Array.isArray(items)) throw new Error("modeling_snippets.json must be an array");

    grid.innerHTML = items.map(renderSnippetCard).join("");

    if (window.Prism) Prism.highlightAll();
    wireCopyButtons();
  } catch (err) {
    console.error(err);
    grid.innerHTML = `
      <div class="col-12">
        <div class="card-soft p-4">
          <div class="section-title mb-2">Snippets failed to load.</div>
          <div class="text-muted small mono">${Site.escapeHtml(String(err.message || err))}</div>
        </div>
      </div>
    `;
  }

  function renderSnippetCard(s) {
    const title = s?.title ?? "";
    const note = s?.note ?? "";
    const code = String(s?.code ?? "");

    return `
      <div class="col-12 col-lg-6">
        <article class="project-card h-100">
          <div class="project-body">
            <div class="project-title">${Site.escapeHtml(title)}</div>
            <div class="project-desc">${Site.escapeHtml(note)}</div>

            <div class="d-flex justify-content-center mb-2">
              <button class="btn btn-sm btn-card" type="button" data-copy="${Site.escapeAttr(code)}">
                <i class="bi bi-clipboard me-1"></i>Copy
              </button>
            </div>

            <pre class="m-0"><code class="language-sql">${Site.escapeHtml(code)}</code></pre>
          </div>
        </article>
      </div>
    `.trim();
  }

  function wireCopyButtons() {
    document.querySelectorAll("[data-copy]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const code = btn.getAttribute("data-copy") || "";

        try {
          await navigator.clipboard.writeText(code);
          const old = btn.innerHTML;
          btn.innerHTML = `<i class="bi bi-check2 me-1"></i>Copied`;
          setTimeout(() => (btn.innerHTML = old), 900);
        } catch {
          const old = btn.innerHTML;
          btn.innerHTML = `<i class="bi bi-x-lg me-1"></i>Copy failed`;
          setTimeout(() => (btn.innerHTML = old), 900);
        }
      });
    });
  }
})();
