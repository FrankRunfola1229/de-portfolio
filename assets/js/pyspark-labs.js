/**
 * pyspark-labs.js
 * Renders labs from assets/data/pyspark_labs.json
 * Uses shared utilities from shared.js (window.Site)
 * Uses Prism to highlight after render.
 */

(async function initPySparkLabs() {
  const grid = document.getElementById("labsGrid");
  if (!grid || !window.Site) return;

  try {
    const labs = await Site.fetchJson("./assets/data/pyspark_labs.json");
    if (!Array.isArray(labs)) throw new Error("pyspark_labs.json must be an array");

    grid.innerHTML = labs.map(renderLabCard).join("");

    if (window.Prism) Prism.highlightAll();
    Site.bindCopyButtons(grid);
  } catch (err) {
    console.error(err);
    grid.innerHTML = `
      <div class="col-12">
        <div class="card-soft p-4">
          <div class="section-title mb-2">Labs failed to load.</div>
          <div class="text-muted small mono">${Site.escapeHtml(String(err.message || err))}</div>
        </div>
      </div>
    `;
  }

  function renderLabCard(lab) {
    const title = lab?.title ?? "";
    const goal = lab?.goal ?? "";
    const runPath = lab?.runPath ?? "";
    const expected = lab?.expected ?? "";
    const steps = Array.isArray(lab?.steps) ? lab.steps : [];
    const code = String(lab?.code ?? "");

    const metaRow = `
      <div class="small text-muted mb-3">
        ${runPath ? `<div><strong>Run:</strong> ${Site.escapeHtml(runPath)}</div>` : ""}
        ${expected ? `<div class="mt-1"><strong>Expect:</strong> ${Site.escapeHtml(expected)}</div>` : ""}
      </div>
    `.trim();

    const stepsHtml = steps.length
      ? `
        <div class="mb-3">
          <div class="small text-muted mb-1"><strong>Steps:</strong></div>
          <ul class="mb-0 ps-3">
            ${steps.map((s) => `<li>${Site.escapeHtml(s)}</li>`).join("")}
          </ul>
        </div>
      `.trim()
      : "";

    return `
      <div class="col-12">
        <article class="project-card h-100">
          <div class="project-body">
            <div class="project-title">${Site.escapeHtml(title)}</div>
            ${goal ? `<div class="project-desc">${Site.escapeHtml(goal)}</div>` : ""}

            ${metaRow}
            ${stepsHtml}

            <div class="d-flex justify-content-center mb-2">
              <button class="btn btn-sm btn-card" type="button" data-copy="${Site.escapeAttr(code)}">
                <i class="bi bi-clipboard me-1"></i>Copy
              </button>
            </div>

            <pre class="m-0"><code class="language-python">${Site.escapeHtml(code)}</code></pre>
          </div>
        </article>
      </div>
    `.trim();
  }
})();
