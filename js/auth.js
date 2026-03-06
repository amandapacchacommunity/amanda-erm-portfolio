const ACCESS_CODE = "risklab2026";

(function protectPage() {
  const path = window.location.pathname;
  const fileName = path.split("/").pop();
  const isLoginPage = fileName === "login.html" || fileName === "";
  const access = sessionStorage.getItem("access");

  if (!isLoginPage && access !== "granted") {
    const isInSubfolder = path.includes("/sections/") || path.includes("/case-studies/");
    window.location.href = isInSubfolder ? "../login.html" : "login.html";
  }
})();
