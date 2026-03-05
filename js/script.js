let ALL_RISKS = [];
let sortKey = "severity";
let sortDir = "desc";

function severity(r) {
  return Number(r.impact) * Number(r.probability);
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normStr(v) {
  return String(v ?? "");
}

function renderCards(risks) {
  const container = document.getElementById("risk-data");
  if (!container) return;
  container.innerHTML = "";

  risks.forEach(risk => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>
        <a href="case-studies/erm-risk-register.html">${escapeHtml(risk.risk)}</a>
      </h3>
      <p><strong>Impact:</strong> ${escapeHtml(risk.impact)}</p>
      <p><strong>Probability:</strong> ${escapeHtml(risk.probability)}</p>
      <p><strong>Owner:</strong> ${escapeHtml(risk.owner)}</p>
      <p><strong>Mitigation:</strong> ${escapeHtml(risk.mitigation)}</p>
    `;

    container.appendChild(card);
  });
}

function renderHeatmap(risks) {
  const heatmap = document.getElementById("heatmap");
  if (!heatmap) return;
  heatmap.innerHTML = "";

  risks.forEach(risk => {
    const sev = severity(risk);
    const cell = document.createElement("div");
    cell.classList.add("heat-cell");

    if (sev >= 16) cell.classList.add("high");
    else if (sev >= 8) cell.classList.add("medium");
    else cell.classList.add("low");

    cell.innerText = String(sev);
    cell.title = `${normStr(risk.risk)} (I:${risk.impact} P:${risk.probability})`;

    heatmap.appendChild(cell);
  });
}

function renderTable(risks) {
  const tbody = document.getElementById("riskTbody");
  if (!tbody) return;

  tbody.innerHTML = risks.map(r => `
    <tr>
      <td>${escapeHtml(r.risk)}</td>
      <td>${escapeHtml(r.impact)}</td>
      <td>${escapeHtml(r.probability)}</td>
      <td>${escapeHtml(severity(r))}</td>
      <td>${escapeHtml(r.owner)}</td>
    </tr>
  `).join("");
}

function sortRisks(risks) {
  return [...risks].sort((a, b) => {
    const av = sortKey === "severity" ? severity(a) : a?.[sortKey];
    const bv = sortKey === "severity" ? severity(b) : b?.[sortKey];

    if (["impact", "probability", "severity"].includes(sortKey)) {
      const an = Number(av) || 0;
      const bn = Number(bv) || 0;
      return sortDir === "asc" ? (an - bn) : (bn - an);
    }

    const as = normStr(av);
    const bs = normStr(bv);
    return sortDir === "asc" ? as.localeCompare(bs) : bs.localeCompare(as);
  });
}

function applySearch() {
  const q = (document.getElementById("riskSearch")?.value ?? "").toLowerCase().trim();

  const filtered = ALL_RISKS.filter(r => {
    const blob = `${r.risk ?? ""} ${r.owner ?? ""} ${r.mitigation ?? ""}`.toLowerCase();
    return q === "" ? true : blob.includes(q);
  });

  const sorted = sortRisks(filtered);

  renderHeatmap(sorted);
  renderTable(sorted);
  renderCards(sorted);
}

function wireSortButtons() {
  document.querySelectorAll(".thbtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-sort");
      if (!key) return;

      if (sortKey === key) {
        sortDir = sortDir === "asc" ? "desc" : "asc";
      } else {
        sortKey = key;
        sortDir = (["impact", "probability", "severity"].includes(key)) ? "desc" : "asc";
      }
      applySearch();
    });
  });
}

fetch("data/risk_register.json")
  .then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
  .then(data => {
    ALL_RISKS = (Array.isArray(data) ? data : []).map(r => ({
      ...r,
      impact: Number(r.impact),
      probability: Number(r.probability)
    }));

    document.getElementById("riskSearch")?.addEventListener("input", applySearch);
    wireSortButtons();
   function renderMatrix(risks) {
  const matrix = document.getElementById("riskMatrix");
  if (!matrix) return;

  matrix.innerHTML = "";

  // Impact: 5 → 1 (top to bottom)
  for (let impact = 5; impact >= 1; impact--) {

    // Probability: 1 → 5 (left to right)
    for (let probability = 1; probability <= 5; probability++) {

      const cell = document.createElement("div");
      cell.className = "matrix-cell";

      const matches = risks.filter(r =>
        Number(r.impact) === impact && Number(r.probability) === probability
      );

      const sev = impact * probability;

      // reuse your existing color classes
      if (sev >= 16) cell.classList.add("high");
      else if (sev >= 8) cell.classList.add("medium");
      else cell.classList.add("low");

      // Show count of risks in this cell
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
    applySearch();
  })
  .catch(err => console.error("Error loading risks:", err));
