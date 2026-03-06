let ALL_RISKS=[];
let sortKey="severity";
let sortDir="desc";

function severity(r){
return Number(r.impact)*Number(r.probability);
}

function escapeHtml(str){
return String(str??"")
.replaceAll("&","&amp;")
.replaceAll("<","&lt;")
.replaceAll(">","&gt;");
}

function normStr(v){
return String(v??"");
}

function renderCards(risks){

const container=document.getElementById("risk-data");
if(!container)return;

container.innerHTML="";

risks.forEach(risk=>{

const card=document.createElement("div");
card.className="card";

card.innerHTML=`
<h3>${escapeHtml(risk.risk)}</h3>
<p><strong>Impact:</strong> ${risk.impact}</p>
<p><strong>Probability:</strong> ${risk.probability}</p>
<p><strong>Owner:</strong> ${escapeHtml(risk.owner)}</p>
<p><strong>Mitigation:</strong> ${escapeHtml(risk.mitigation)}</p>
`;

container.appendChild(card);

});

}

function renderHeatmap(risks){

const heatmap=document.getElementById("heatmap");
if(!heatmap)return;

heatmap.innerHTML="";

risks.forEach(risk=>{

const sev=severity(risk);

const cell=document.createElement("div");
cell.classList.add("heat-cell");

if(sev>=16)cell.classList.add("high");
else if(sev>=8)cell.classList.add("medium");
else cell.classList.add("low");

cell.innerText=sev;

heatmap.appendChild(cell);

});

}

function renderMatrix(risks){

const matrix=document.getElementById("riskMatrix");
if(!matrix)return;

matrix.innerHTML="";

for(let impact=5;impact>=1;impact--){

for(let probability=1;probability<=5;probability++){

const cell=document.createElement("div");
cell.className="matrix-cell";

const matches=risks.filter(r=>
Number(r.impact)===impact &&
Number(r.probability)===probability
);

const sev=impact*probability;

if(sev>=16)cell.classList.add("high");
else if(sev>=8)cell.classList.add("medium");
else cell.classList.add("low");

if(matches.length>0){
cell.textContent=matches.length;
}else{
cell.textContent="";
}

matrix.appendChild(cell);

}

}

}

function renderTable(risks){

const tbody=document.getElementById("riskTbody");
if(!tbody)return;

tbody.innerHTML=risks.map(r=>`
<tr>
<td>${escapeHtml(r.risk)}</td>
<td>${r.impact}</td>
<td>${r.probability}</td>
<td>${severity(r)}</td>
<td>${escapeHtml(r.owner)}</td>
</tr>
`).join("");

}

function sortRisks(risks){

return [...risks].sort((a,b)=>{

const av=sortKey==="severity"?severity(a):a?.[sortKey];
const bv=sortKey==="severity"?severity(b):b?.[sortKey];

if(["impact","probability","severity"].includes(sortKey)){

const an=Number(av)||0;
const bn=Number(bv)||0;

return sortDir==="asc"?an-bn:bn-an;

}

return sortDir==="asc"
?normStr(av).localeCompare(normStr(bv))
:normStr(bv).localeCompare(normStr(av));

});

}

function applySearch(){

const q=(document.getElementById("riskSearch")?.value??"")
.toLowerCase()
.trim();

const filtered=ALL_RISKS.filter(r=>{

const blob=`${r.risk??""} ${r.owner??""} ${r.mitigation??""}`.toLowerCase();

return q===""?true:blob.includes(q);

});

const sorted=sortRisks(filtered);

renderHeatmap(sorted);
renderMatrix(sorted);
renderTable(sorted);
renderCards(sorted);

}

function wireSortButtons(){

document.querySelectorAll(".thbtn").forEach(btn=>{

btn.addEventListener("click",()=>{

const key=btn.getAttribute("data-sort");

if(sortKey===key){
sortDir=sortDir==="asc"?"desc":"asc";
}else{
sortKey=key;
sortDir="desc";
}

applySearch();

});

});

}

fetch("data/risk_register.json")
.then(res=>res.json())
.then(data=>{

ALL_RISKS=data.map(r=>({
...r,
impact:Number(r.impact),
probability:Number(r.probability)
}));

document.getElementById("riskSearch")
?.addEventListener("input",applySearch);

wireSortButtons();

applySearch();

});