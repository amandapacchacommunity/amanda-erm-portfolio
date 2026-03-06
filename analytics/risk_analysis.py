import json

with open("../data/risk_register.json") as f:
    risks = json.load(f)

high_risk = [r for r in risks if r["impact"] == "High"]

print("Total Risks:", len(risks))
print("High Impact Risks:", len(high_risk))
