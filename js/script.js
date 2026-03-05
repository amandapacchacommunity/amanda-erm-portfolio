fetch('data/risk_register.json')
  .then(response => response.json())
  .then(data => {

    const container = document.getElementById("risk-data");

    data.forEach(risk => {

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

    });

  });