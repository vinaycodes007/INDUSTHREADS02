// Simple client-side filtering for the shop grid
document.addEventListener("DOMContentLoaded", () => {
  const catBoxes = document.querySelectorAll(".filter-cat");
  const motifBoxes = document.querySelectorAll(".filter-motif");
  const cards = document.querySelectorAll("#productGrid .product-card");
  const resultCount = document.querySelector(".result-count");
  const emptyState = document.querySelector(".empty-state");
  const resetBtn = document.querySelector(".reset-filters");
  const sortSelect = document.querySelector(".sort-select");
  const grid = document.getElementById("productGrid");

  function activeValues(boxes) {
    return Array.from(boxes)
      .filter((b) => b.checked)
      .map((b) => b.value);
  }

  function applyFilters() {
    const cats = activeValues(catBoxes);
    const motifs = activeValues(motifBoxes);
    let visible = 0;

    cards.forEach((card) => {
      const matchCat = cats.includes(card.dataset.cat);
      const matchMotif = motifs.includes(card.dataset.motif);
      const show = matchCat && matchMotif;
      card.style.display = show ? "" : "none";
      if (show) visible += 1;
    });

    resultCount.textContent = `${visible} piece${visible === 1 ? "" : "s"}`;
    emptyState.hidden = visible !== 0;
  }

  catBoxes.forEach((b) => b.addEventListener("change", applyFilters));
  motifBoxes.forEach((b) => b.addEventListener("change", applyFilters));

  resetBtn.addEventListener("click", () => {
    catBoxes.forEach((b) => (b.checked = true));
    motifBoxes.forEach((b) => (b.checked = true));
    applyFilters();
  });

  function parsePrice(card) {
    const text = card.querySelector(".price").textContent;
    return parseInt(text.replace(/[^\d]/g, ""), 10);
  }

  sortSelect.addEventListener("change", () => {
    const value = sortSelect.value;
    const items = Array.from(cards);

    if (value === "Price: Low to High") {
      items.sort((a, b) => parsePrice(a) - parsePrice(b));
    } else if (value === "Price: High to Low") {
      items.sort((a, b) => parsePrice(b) - parsePrice(a));
    } else {
      // Featured / Newest: restore original DOM order
      items.sort((a, b) => a.dataset.order - b.dataset.order);
    }

    items.forEach((item) => grid.appendChild(item));
  });

  // Store original order for "Featured" reset
  cards.forEach((card, i) => (card.dataset.order = i));

  applyFilters();
});
