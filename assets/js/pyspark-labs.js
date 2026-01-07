/**
 * pyspark-labs.js
 * Renders labs from assets/data/pyspark_labs.json
 * Uses shared utilities from shared.js (window.Site)
 */

(async function initPySparkLabs() {
  const grid = document.getElementById("labsGrid");
  if (!grid || !window.Site) return;

  try {
    const labs = await Site.fetchJson("./assets/data/pyspark_labs.json");
    if (!Array.isArray(labs)) throw new Error("pyspark_labs.json must be an array");

    grid.innerHTML = labs.map(renderLabCard).join("");

    if (window.Prism) Prism.highlightAll();
    wireCopyButtons();
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
      ? `<ul class="small text-muted mb-3">
          ${steps.map((s) => `<li>${Site.escapeHtml(String(s))}</li>`).join("")}
         </ul>`
      : "";

    return `
      <div class="col-12 col-lg-6">
        <article class="project-card h-100">
          <div class="project-body">
            <div class="project-title">${Site.escapeHtml(title)}</div>

            <div class="project-desc" style="-webkit-line-clamp: 6; min-height: auto;">
              ${Site.escapeHtml(goal)}
            </div>

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
