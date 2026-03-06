document.addEventListener("DOMContentLoaded", function(){

const buttons = document.querySelectorAll(".portfolio-btn");
const panels = document.querySelectorAll(".portfolio-panel");

buttons.forEach(button => {

button.addEventListener("click", function(){

buttons.forEach(btn => btn.classList.remove("active"));
panels.forEach(panel => panel.classList.remove("active"));

this.classList.add("active");

const target = this.getAttribute("data-target");

document.getElementById(target).classList.add("active");

});

});

});
