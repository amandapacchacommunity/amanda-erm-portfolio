function showSection(sectionId) {
  const sections = document.querySelectorAll(".content-section");
  const buttons = document.querySelectorAll(".nav-btn");

  sections.forEach((section) => {
    section.classList.remove("active-section");
  });

  buttons.forEach((button) => {
    button.classList.remove("active");
  });

  document.getElementById(sectionId).classList.add("active-section");

  const clickedButton = Array.from(buttons).find(
    (button) => button.textContent.toLowerCase() === sectionId
  );

  if (clickedButton) {
    clickedButton.classList.add("active");
  }
}
