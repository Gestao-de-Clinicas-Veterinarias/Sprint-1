const loginForm = document.querySelector("#login-form");
const signupForm = document.querySelector("#signup-form");
const accountSwitch = document.querySelector("#account-switch");
const errorMessage = document.querySelector("#login-error");
const signupError = document.querySelector("#signup-error");
const formEyebrow = document.querySelector("#form-eyebrow");
const formTitle = document.querySelector("#form-title");
const formIntro = document.querySelector("#form-intro");
const togglePassword = document.querySelector("#toggle-password");
const storedProfile = () => JSON.parse(localStorage.getItem("amigo-fiel-profile") || "null");

if (sessionStorage.getItem("amigo-fiel-auth") === "authenticated") {
  window.location.replace("index.html");
}

togglePassword.addEventListener("click", () => {
  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  togglePassword.textContent = isPassword ? "Ocultar" : "Mostrar";
  togglePassword.setAttribute("aria-label", isPassword ? "Ocultar senha" : "Mostrar senha");
});

function authenticate(profile) {
  sessionStorage.setItem("amigo-fiel-auth", "authenticated");
  sessionStorage.setItem("amigo-fiel-profile", JSON.stringify(profile));
  window.location.replace("index.html");
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(loginForm);
  const email = data.get("email").trim().toLowerCase();
  const password = data.get("password");
  const profile = storedProfile();

  if (!profile || email !== profile.email || password !== profile.password) {
    errorMessage.textContent = "E-mail ou senha inválidos. Confira os dados cadastrados.";
    return;
  }

  authenticate(profile);
});

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(signupForm);
  const profile = {
    name: data.get("name").trim(),
    email: data.get("email").trim().toLowerCase(),
    password: data.get("password")
  };

  if (storedProfile()?.email === profile.email) {
    signupError.textContent = "Este e-mail já possui um perfil. Entre na sua conta.";
    return;
  }

  localStorage.setItem("amigo-fiel-profile", JSON.stringify(profile));
  authenticate(profile);
});

accountSwitch.addEventListener("click", () => {
  const creatingAccount = signupForm.hidden;
  signupForm.hidden = !creatingAccount;
  loginForm.hidden = creatingAccount;
  formEyebrow.textContent = creatingAccount ? "SEU NOVO PERFIL" : "BEM-VINDA DE VOLTA";
  formTitle.textContent = creatingAccount ? "Crie seu perfil" : "Entre na sua conta";
  formIntro.textContent = creatingAccount ? "Cadastre seus dados para começar a usar a clínica." : "Acesse o painel da Amigo Fiel para continuar.";
  accountSwitch.textContent = creatingAccount ? "Já tenho um perfil · Entrar" : "Ainda não tenho um perfil · Criar conta";
  errorMessage.textContent = "";
  signupError.textContent = "";
});

document.querySelector(".signup-password-toggle").addEventListener("click", (event) => {
  const input = event.currentTarget.previousElementSibling;
  const isPassword = input.type === "password";
  input.type = isPassword ? "text" : "password";
  event.currentTarget.textContent = isPassword ? "Ocultar" : "Mostrar";
});
