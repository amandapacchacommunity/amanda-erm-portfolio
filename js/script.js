let ALL_RISKS = [];
let currentSector = "museum";
let sortKey = "severity";
let sortDir = "desc";

/* ---------- helpers ---------- */
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
function normStr(v) { return String(v ?? ""); }

/* ---------- sector UI ---------- */
function setTheme(sector) {
  document.body.classList.remove("theme-museum","theme-nonprofit","theme-highered","theme-finance");
  document.body.classList.add(`theme-${sector}`);
}

function showSectorSummary(sector) {
  document.querySelectorAll("[data-sector-panel]").forEach(el => {
    el.classList.toggle("is-visible", el.getAttribute("data-sector-panel") === sector);
  });
}

function setActiveTab(sector) {
  document.querySelectorAll(".tab").forEach(btn => {
    const isActive = btn.getAttribute("data-sector") === sector;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-selected", isActive ? "true" : "false");
  });
}

/* ---------- rendering ---------- */
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

function renderMatrix(risks) {
  const matrix = document.getElementById("riskMatrix");
  if (!matrix) return;
  matrix.innerHTML = "";

  for (let impact = 5; impact >= 1; impact--) {
    for (let probability = 1; probability <= 5; probability++) {
      const cell = document.createElement("div");
      cell.classList.add("matrix-cell");

      const sev = impact * probability;
      if (sev >= 16) cell.classList.add("high");
      else if (sev >= 8) cell.classList.add("medium");
      else cell.classList.add("low");

      const matches = risks.filter(r => Number(r.impact) === impact && Number(r.probability) === probability);

      if (matches.length > 0) {
        cell.textContent = String(matches.length);
        cell.title = matches.map(r => r.risk).join(", ");
      } else {
        cell.textContent = "";
        cell.title = `Impact ${impact}, Probability ${probability}`;
      }

      matrix.appendChild(cell);
    }
  }
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

function renderCards(risks) {
  const container = document.getElementById("risk-data");
  if (!container) return;
  container.innerHTML = "";

  risks.forEach(risk => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3><a href="case-studies/erm-risk-register.html">${escapeHtml(risk.risk)}</a></h3>
      <p><strong>Impact:</strong> ${escapeHtml(risk.impact)}</p>
      <p><strong>Probability:</strong> ${escapeHtml(risk.probability)}</p>
      <p><strong>Owner:</strong> ${escapeHtml(risk.owner)}</p>
      <p><strong>Mitigation:</strong> ${escapeHtml(risk.mitigation)}</p>
    `;
    container.appendChild(card);
  });
}

/* Case studies per sector (starter set; you can add pages later) */
const CASE_STUDIES = {
  museum: [
    { title: "Collections Handling & Damage Risk", desc: "Controls, training, incident tracking, and reporting.", href: "case-studies/erm-risk-register.html" },
    { title: "Compensation & HR Compliance Analytics", desc: "Equity analysis, benchmarking, and audit-ready reporting.", href: "case-studies/erm-risk-register.html" }
  ],
  nonprofit: [
    { title: "Ethics Program & Code of Conduct", desc: "Policy alignment, investigations workflow, and training.", href: "case-studies/erm-risk-register.html" },
    { title: "Donor Data Governance & Controls", desc: "Data integrity, stewardship controls, and reporting.", href: "case-studies/erm-risk-register.html" }
  ],
  highered: [
    { title: "Clery Act Compliance Program Leadership", desc: "On-time reporting, CSA training, investigations, governance.", href: "case-studies/erm-risk-register.html" },
    { title: "ERM Risk Register Buildout", desc: "Impact×probability scoring, KRIs, executive reporting.", href: "case-studies/erm-risk-register.html" }
  ],
  finance: [
    { title: "RCSA-Style Risk Assessment & Tracking", desc: "Identify, assess, test, validate issues, report themes.", href: "case-studies/erm-risk-register.html" },
    { title: "Controls Testing & Monitoring", desc: "Control design, testing, remediation tracking, governance.", href: "case-studies/erm-risk-register.html" }
  ],
};

function renderCaseStudies(sector) {
  const grid = document.getElementById("caseStudyGrid");
  if (!grid) return;

  const items = CASE_STUDIES[sector] ?? [];
  grid.innerHTML = items.map(cs => `
    <div class="case-card">
      <h3><a href="${cs.href}">${escapeHtml(cs.title)}</a></h3>
      <p>${escapeHtml(cs.desc)}</p>
    </div>
  `).join("");
}

/* ---------- sorting + filtering ---------- */
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

function filteredBySector(risks, sector) {
  return risks.filter(r => (r.sector || "").toLowerCase() === sector);
}

function applyAll() {
  const q = (document.getElementById("riskSearch")?.value ?? "").toLowerCase().trim();

  const sectorRisks = filteredBySector(ALL_RISKS, currentSector);

  const searched = sectorRisks.filter(r => {
    const blob = `${r.risk ?? ""} ${r.owner ?? ""} ${r.mitigation ?? ""}`.toLowerCase();
    return q === "" ? true : blob.includes(q);
  });

  const sorted = sortRisks(searched);

  renderHeatmap(sorted);
  renderMatrix(sorted);
  renderTable(sorted);
  renderCards(sorted);
  renderCaseStudies(currentSector);
}

/* ---------- wiring ---------- */
function wireTabs() {
  document.querySelectorAll(".tab").forEach(btn => {
    btn.addEventListener("click", () => {
      currentSector = btn.getAttribute("data-sector") || "museum";
      setTheme(currentSector);
      showSectorSummary(currentSector);
      setActiveTab(currentSector);
      applyAll();
    });
  });
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
        sortDir = ["impact", "probability", "severity"].includes(key) ? "desc" : "asc";
      }
      applyAll();
    });
  });
}

/* ---------- load data ---------- */
setTheme(currentSector);
showSectorSummary(currentSector);
setActiveTab(currentSector);

fetch("data/risk_register.json")
  .then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
  .then(data => {
    ALL_RISKS = (Array.isArray(data) ? data : []).map(r => ({
      ...r,
      sector: String(r.sector ?? "").toLowerCase(),
      impact: Number(r.impact),
      probability: Number(r.probability),
    }));

    document.getElementById("riskSearch")?.addEventListener("input", applyAll);

    wireTabs();
    wireSortButtons();
    applyAll();
  })
  .catch(err => console.error("Error loading risks:", err));