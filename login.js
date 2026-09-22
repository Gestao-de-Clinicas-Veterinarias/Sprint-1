const loginForm = document.querySelector("#login-form");
const errorMessage = document.querySelector("#login-error");
const passwordInput = document.querySelector("input[name=\"password\"]");
const togglePassword = document.querySelector("#toggle-password");

if (sessionStorage.getItem("amigo-fiel-auth") === "authenticated") {
  window.location.replace("index.html");
}

togglePassword.addEventListener("click", () => {
  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  togglePassword.textContent = isPassword ? "Ocultar" : "Mostrar";
  togglePassword.setAttribute("aria-label", isPassword ? "Ocultar senha" : "Mostrar senha");
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(loginForm);
  const email = data.get("email").trim().toLowerCase();
  const password = data.get("password");

  if (email !== "admin@amigofiel.com" || password !== "123456") {
    errorMessage.textContent = "E-mail ou senha inválidos. Use o acesso de demonstração abaixo.";
    return;
  }

  sessionStorage.setItem("amigo-fiel-auth", "authenticated");
  window.location.replace("index.html");
});
