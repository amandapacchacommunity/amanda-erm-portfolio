const ACCESS_CODE = "risklab2026";

(function protectPage() {
  const path = window.location.pathname;
  const isLoginPage = path.includes("login.html");
  const access = sessionStorage.getItem("access");

  if (!isLoginPage && access !== "granted") {
    window.location.href = "../login.html";
  }
})();
