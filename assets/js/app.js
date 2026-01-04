(async function init(){
  // footer dates
  document.getElementById("year").textContent = new Date().getFullYear();
  document.getElementById("updated").textContent =
    "Updated " + new Date().toLocaleDateString(undefined, { year:"numeric", month:"short", day:"2-digit" });

  // render projects from data file (separation of content from UI)
  const grid = document.getElementById("projectsGrid");

  try {
    const res = await fetch("assets/data/projects.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load projects.json");
    const projects = await res.json();

    grid.innerHTML = projects.map(projectCardHtml).join("");
  } catch (err) {
    grid.innerHTML = `
      <div class="col-12">
        <div class="card-soft p-">
          <div class="fw-semibold">Projects failed to load.</div>
          <div class="text-muted small mt-1">${escapeHtml(String(err.message || err))}</div>
        </div>
      </div>
    `;
  }

  function projectCardHtml(p){
    const tags = (p.tags || []).slice(0, 4).map(t => (
      `<span class="badge badge-soft rounded-pill me-1 mb-1">${escapeHtml(t)}</span>`
    )).join("");

    return `
      <div class="col-sm-12 col-md-6 col-lg-4 p-2">
        <article class="project-card w-100">
          <img class="project-img" src="${escapeAttr(p.image)}" alt="${escapeAttr(p.title)} project image" loading="lazy" />
          <div class="project-body">
            <div class="project-title">${escapeHtml(p.title)}</div>
            <div class="project-desc">${escapeHtml(p.blurb)}</div>
            <div class="mb-3">${tags}</div>

            <div class="project-links d-flex gap-3 small">
              ${p.repo ? `<a href="${escapeAttr(p.repo)}" target="_blank" rel="noreferrer">Repo</a>` : ``}
              ${p.readme ? `<a href="${escapeAttr(p.readme)}" target="_blank" rel="noreferrer">README</a>` : ``}
              ${p.demo ? `<a href="${escapeAttr(p.demo)}" target="_blank" rel="noreferrer">Demo</a>` : ``}
            </div>
          </div>
        </article>
      </div>
    `;
  }

  // tiny safety helpers (keeps UI/data decoupled and safe)
  function escapeHtml(s){
    return String(s)
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }
  function escapeAttr(s){
    // good enough for simple URLs/text
    return escapeHtml(s).replaceAll("`","&#096;");
  }
})();
