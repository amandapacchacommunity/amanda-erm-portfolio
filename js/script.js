function renderMatrix(risks) {
  const matrix = document.getElementById("riskMatrix");
  if (!matrix) return;

  matrix.innerHTML = "";

  for (let impact = 5; impact >= 1; impact--) {
    for (let probability = 1; probability <= 5; probability++) {
      const cell = document.createElement("div");
      cell.className = "matrix-cell";

      const matches = risks.filter(r =>
        Number(r.impact) === impact && Number(r.probability) === probability
      );

      const sev = impact * probability;

      if (sev >= 16) cell.classList.add("high");
      else if (sev >= 8) cell.classList.add("medium");
      else cell.classList.add("low");

      if (matches.length > 0) {
        cell.textContent = matches.length;
        cell.title = matches.map(r => r.risk).join(", ");
      } else {
        cell.textContent = "";
        cell.title = `Impact ${impact}, Probability ${probability}`;
      }

      matrix.appendChild(cell);
    }
  }
}
