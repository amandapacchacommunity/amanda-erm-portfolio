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
      <p><strong>Impact:</strong> ${risk.impact}</p>
      <p><strong>Probability:</strong> ${risk.probability}</p>
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

    cell.innerText = sev;
    cell.title = `${risk.risk} (I:${risk.impact} P:${risk.probability})`;

    heatmap.appendChild(cell);
  });
}

function renderTable(risks) {
  const tbody = document.getElementById("riskTbody");
  if (!tbody) return;

  tbody.innerHTML = risks.map(r => `
    <tr>
      <td>${escapeHtml(r.risk)}</td>
      <td>${r.impact}</td>
      <td>${r.probability}</td>
      <td>${severity(r)}</td>
      <td>${escapeHtml(r.owner)}</td>
    </tr>
  `).join("");
}

function sortRisks(risks) {
  return [...risks].sort((a, b) => {
    const av = sortKey === "severity" ? severity(a) : a[sortKey];
    const bv = sortKey === "severity" ? severity(b) : b[sortKey];

    // numeric keys
    if (["impact", "probability", "severity"].includes(sortKey)) {
      return sortDir === "asc" ? (av - bv) : (bv - av);
    }

    // string keys
    return sortDir === "asc"
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av));
  });
}

function applySearch() {
  const q = (document.getElementById("riskSearch")?.value ?? "").toLowerCase().trim();

  const filtered = ALL_RISKS.filter(r => {
    const blob = `${r.risk} ${r.owner} ${r.mitigation}`.toLowerCase();
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
  .then(res => res.json())
  .then(data => {
    ALL_RISKS = data.map(r => ({
      ...r,
      impact: Number(r.impact),
      probability: Number(r.probability)
    }));

    document.getElementById("riskSearch")?.addEventListener("input", applySearch);
    wireSortButtons();
   /* ERM 5x5 Matrix */
#riskMatrix {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
  max-width: 420px;
  margin: 12px 0 28px;
}

.matrix-cell {
  height: 70px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: white;
  font-size: 18px;
}
    applySearch();
  })
  .catch(err => console.error("Error loading risks:", err));
