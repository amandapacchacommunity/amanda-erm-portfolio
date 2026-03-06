const ACCESS_CODE = "risklab2026";

(function protectPage() {
  const isLoginPage = window.location.pathname.includes("login.html") || window.location.pathname.endsWith("/");
  const access = sessionStorage.getItem("access");

  if (!isLoginPage && access !== "granted") {
    window.location.href = "/login.html";
  }
})();
