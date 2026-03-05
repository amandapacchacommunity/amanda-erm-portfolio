fetch('data/risk_register.json')
  .then(response => response.json())
  .then(data => {

    const container = document.getElementById("risk-data");
    const heatmap = document.getElementById("heatmap");

    data.forEach(risk => {

      /* Create risk card */

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <h3>
        <a href="case-studies/erm-risk-register.html">
        ${risk.risk}
        </a>
        </h3>

        <p><strong>Impact:</strong> ${risk.impact}</p>
        <p><strong>Probability:</strong> ${risk.probability}</p>
        <p><strong>Owner:</strong> ${risk.owner}</p>
        <p><strong>Mitigation:</strong> ${risk.mitigation}</p>
      `;

      container.appendChild(card);

      /* Create heat map cell */

      const severity = risk.impact * risk.probability;

      const cell = document.createElement("div");

      cell.classList.add("heat-cell");

      if(severity >= 16){
        cell.classList.add("high");
      }
      else if(severity >= 8){
        cell.classList.add("medium");
      }
      else{
        cell.classList.add("low");
      }

      cell.innerText = severity;

      heatmap.appendChild(cell);

    });

  });