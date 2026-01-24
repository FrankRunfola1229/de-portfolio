/**
 * terms.js
 * Lightweight search + section filter for terms.html
 */
(function () {
  const input = document.getElementById("termSearch");
  const clearBtn = document.getElementById("clearSearch");
  const countEl = document.getElementById("termCount");
  const noEl = document.getElementById("noResults");
  const cards = Array.from(document.querySelectorAll(".term-card"));
  const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));

  if (!input || cards.length === 0) return;

  let activeSection = "all";

  function norm(s) {
    return (s || "").toLowerCase().trim();
  }

  function matches(card, q) {
    const t = norm(card.dataset.term);
    const d = norm(card.dataset.desc);
    const s = norm(card.dataset.section);
    const hay = `${t} ${d} ${s}`;
    return q === "" || hay.includes(q);
  }

  function sectionOk(card) {
    if (activeSection === "all") return true;
    return card.dataset.section === activeSection;
  }

  function render() {
    const q = norm(input.value);
    let shown = 0;

    cards.forEach((c) => {
      const ok = sectionOk(c) && matches(c, q);
      c.hidden = !ok;
      if (ok) shown++;
    });

    if (countEl) {
      const suffix = activeSection === "all" ? "" : ` • Filter: ${activeSection}`;
      countEl.textContent = `${shown} term${shown === 1 ? "" : "s"} shown${suffix}`;
    }

    if (noEl) noEl.hidden = shown !== 0;
  }

  // Search
  input.addEventListener("input", render);

  // Clear
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      input.value = "";
      input.focus();
      render();
    });
  }

  // Filter menu
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      activeSection = btn.dataset.filter === "all" ? "all" : btn.dataset.filter;
      render();
    });
  });

  render();
})();
