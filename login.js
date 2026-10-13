const loginForm = document.querySelector("#login-form");
const signupForm = document.querySelector("#signup-form");
const signupRole = document.querySelector("#signup-role");
const founderExtraFields = document.querySelector("#founder-extra-fields");
const employeeExtraFields = document.querySelector("#employee-extra-fields");
const accountPicker = document.querySelector("#account-picker");
const accountSwitch = document.querySelector("#account-switch");
const backToLogin = document.querySelector("#back-to-login");
const errorMessage = document.querySelector("#login-error");
const signupError = document.querySelector("#signup-error");
const formEyebrow = document.querySelector("#form-eyebrow");
const formTitle = document.querySelector("#form-title");
const formIntro = document.querySelector("#form-intro");
const profilesStorageKey = "amigo-fiel-profiles";
const activeProfileKey = "amigo-fiel-profile";

function normalizeProfile(profile) {
  if (!profile || !profile.email) {
    return null;
  }

  return {
    name: String(profile.name || "Usuário").trim(),
    email: String(profile.email).trim().toLowerCase(),
    password: String(profile.password || ""),
    userType: profile.userType || "cliente",
    role: profile.role || profile.userType || "cliente"
  };
}

function getSavedProfiles() {
  const legacyProfile = normalizeProfile(JSON.parse(localStorage.getItem(activeProfileKey) || "null"));
  const storedProfiles = JSON.parse(localStorage.getItem(profilesStorageKey) || "[]");
  const profiles = [];
  const uniqueEmails = new Set();

  [legacyProfile, ...storedProfiles].forEach((profile) => {
    const normalizedProfile = normalizeProfile(profile);
    if (!normalizedProfile) {
      return;
    }

    if (uniqueEmails.has(normalizedProfile.email)) {
      return;
    }

    uniqueEmails.add(normalizedProfile.email);
    profiles.push(normalizedProfile);
  });

  if (profiles.length) {
    localStorage.setItem(profilesStorageKey, JSON.stringify(profiles));
  }

  return profiles;
}

function storedProfile() {
  return normalizeProfile(JSON.parse(localStorage.getItem(activeProfileKey) || "null"));
}

if (sessionStorage.getItem("amigo-fiel-auth") === "authenticated") {
  window.location.replace("index.html");
}

function togglePasswordVisibility(button, input) {
  const isPassword = input.type === "password";
  input.type = isPassword ? "text" : "password";
  button.textContent = isPassword ? "Ocultar" : "Mostrar";
  button.setAttribute("aria-label", isPassword ? "Ocultar senha" : "Mostrar senha");
}

document.querySelectorAll(".password-toggle, .saved-password-toggle").forEach((button) => {
  const input = button.parentElement.querySelector("input");
  if (!input) {
    return;
  }

  button.addEventListener("click", () => togglePasswordVisibility(button, input));
});

function authenticate(profile) {
  const normalizedProfile = normalizeProfile(profile);

  if (!normalizedProfile) {
    return;
  }

  sessionStorage.setItem("amigo-fiel-auth", "authenticated");
  sessionStorage.setItem("amigo-fiel-profile", JSON.stringify(normalizedProfile));
  localStorage.setItem(activeProfileKey, JSON.stringify(normalizedProfile));
  const profiles = getSavedProfiles();
  const currentIndex = profiles.findIndex((item) => item.email === normalizedProfile.email);

  if (currentIndex >= 0) {
    profiles[currentIndex] = normalizedProfile;
  } else {
    profiles.push(normalizedProfile);
  }

  localStorage.setItem(profilesStorageKey, JSON.stringify(profiles));
  window.location.replace("index.html");
}

function updateSignupFields() {
  const role = signupRole?.value || "medico-veterinario";
  const isFounder = role === "fundador";
  const isEmployee = role === "medico-veterinario" || role === "estagiario";

  if (founderExtraFields) {
    founderExtraFields.hidden = !isFounder;
    founderExtraFields.style.display = isFounder ? "grid" : "none";
  }

  if (employeeExtraFields) {
    employeeExtraFields.hidden = !isEmployee;
    employeeExtraFields.style.display = isEmployee ? "grid" : "none";
  }
}

function showLoginView() {
  loginForm.hidden = false;
  signupForm.hidden = true;
  accountPicker.hidden = true;
  backToLogin.hidden = true;
  formEyebrow.textContent = "BEM-VINDA DE VOLTA";
  formTitle.textContent = "Entre na sua conta";
  formIntro.textContent = "Acesse o painel da Amigo Fiel para continuar.";
  accountSwitch.textContent = getSavedProfiles().length ? "Trocar conta" : "Ainda não tenho um perfil · Criar conta";
  errorMessage.textContent = "";
  signupError.textContent = "";
}

function deleteSavedProfile(email) {
  if (!email) {
    return;
  }

  const profiles = getSavedProfiles().filter((profile) => profile.email !== email);
  const active = storedProfile();

  if (active?.email === email || profiles.length === 0) {
    localStorage.removeItem(activeProfileKey);
    sessionStorage.removeItem("amigo-fiel-auth");
    sessionStorage.removeItem("amigo-fiel-profile");
  }

  if (profiles.length) {
    localStorage.setItem(profilesStorageKey, JSON.stringify(profiles));
    localStorage.removeItem(activeProfileKey);
    renderSavedAccounts();
    return;
  }

  localStorage.removeItem(profilesStorageKey);
  localStorage.removeItem(activeProfileKey);
  sessionStorage.removeItem("amigo-fiel-auth");
  sessionStorage.removeItem("amigo-fiel-profile");
  showLoginView();
}

function renderSavedAccounts() {
  const profiles = getSavedProfiles();

  if (!profiles.length) {
    accountPicker.innerHTML = '<p class="saved-empty">Nenhuma conta salva ainda.</p>';
    return;
  }

  accountPicker.innerHTML = profiles
    .map((profile) => {
      const initials = (profile.name || "U")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("") || "AF";

      return `
        <div class="saved-account-card" data-email="${profile.email}">
          <div class="saved-account-header">
            <button type="button" class="saved-account" data-email="${profile.email}">
              <span class="saved-avatar">${initials}</span>
              <span class="saved-account-meta">
                <strong>${profile.name}</strong>
                <small>${profile.role || profile.userType || "Cliente"}</small>
              </span>
              <span class="saved-account-action">Entrar</span>
            </button>
            <button type="button" class="saved-account-delete" data-email="${profile.email}" aria-label="Excluir conta ${profile.name}">Excluir</button>
          </div>
          <div class="saved-account-login" hidden>
            <div class="saved-password-field">
              <input type="password" class="saved-password-input" data-email="${profile.email}" placeholder="Digite sua senha" aria-label="Senha para ${profile.name}" />
              <button type="button" class="saved-password-toggle" aria-label="Mostrar senha">Mostrar</button>
            </div>
            <button type="button" class="saved-account-submit" data-email="${profile.email}">Entrar</button>
          </div>
        </div>
      `;
    })
    .join("");

  accountPicker.querySelectorAll(".saved-account").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".saved-account-card");
      const passwordRow = card.querySelector(".saved-account-login");
      const isVisible = !passwordRow.hidden;

      document.querySelectorAll(".saved-account-login").forEach((row) => {
        row.hidden = true;
      });

      if (!isVisible) {
        passwordRow.hidden = false;
        const input = passwordRow.querySelector(".saved-password-input");
        input.focus();
      }
    });
  });

  accountPicker.querySelectorAll(".saved-account-delete").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      deleteSavedProfile(button.dataset.email);
    });
  });

  accountPicker.querySelectorAll(".saved-account-submit").forEach((button) => {
    button.addEventListener("click", () => {
      const selectedProfile = getSavedProfiles().find((profile) => profile.email === button.dataset.email);

      if (!selectedProfile) {
        return;
      }

      const password = button.parentElement.querySelector(".saved-password-input").value;

      if (password !== selectedProfile.password) {
        errorMessage.textContent = "Senha incorreta. Tente novamente.";
        return;
      }

      authenticate(selectedProfile);
    });
  });

  accountPicker.querySelectorAll(".saved-password-input").forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const button = input.parentElement.parentElement.querySelector(".saved-account-submit");
        button.click();
      }
    });
  });
}

function showAccountPicker() {
  loginForm.hidden = true;
  signupForm.hidden = true;
  accountPicker.hidden = false;
  backToLogin.hidden = false;
  formEyebrow.textContent = "CONTAS SALVAS";
  formTitle.textContent = "Escolha uma conta";
  formIntro.textContent = "Entre rapidamente usando a senha salva da conta.";
  accountSwitch.textContent = "Voltar ao login";
  renderSavedAccounts();
  errorMessage.textContent = "";
  signupError.textContent = "";
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(loginForm);
  const email = data.get("email").trim().toLowerCase();
  const password = data.get("password");
  const profiles = getSavedProfiles();
  const profile = profiles.find((item) => item.email === email);

  if (!profile || password !== profile.password) {
    errorMessage.textContent = "E-mail ou senha inválidos. Confira os dados cadastrados.";
    return;
  }

  authenticate(profile);
});

if (signupRole) {
  signupRole.addEventListener("change", updateSignupFields);
  signupRole.addEventListener("input", updateSignupFields);
}

signupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(signupForm);
  const role = data.get("role");
  const userType = role === "cliente" ? "cliente" : "funcionario";
  const profile = {
    name: data.get("name").trim(),
    email: data.get("email").trim().toLowerCase(),
    password: data.get("password"),
    userType,
    role,
    phone: data.get("phone")?.trim() || "",
    specialty: data.get("specialty")?.trim() || "",
    crmv: data.get("crmv")?.trim() || "",
    department: data.get("department")?.trim() || "",
    shift: data.get("shift")?.trim() || ""
  };

  const profiles = getSavedProfiles();
  const alreadyExists = profiles.some((item) => item.email === profile.email);

  if (alreadyExists) {
    signupError.textContent = "Este e-mail já possui um perfil. Entre na sua conta.";
    return;
  }

  profiles.push(profile);
  localStorage.setItem(profilesStorageKey, JSON.stringify(profiles));
  localStorage.setItem(activeProfileKey, JSON.stringify(profile));
  authenticate(profile);
});

accountSwitch.addEventListener("click", () => {
  const profiles = getSavedProfiles();

  if (profiles.length && !accountPicker.hidden) {
    showLoginView();
    return;
  }

  if (profiles.length) {
    showAccountPicker();
    return;
  }

  const creatingAccount = signupForm.hidden;
  signupForm.hidden = !creatingAccount;
  loginForm.hidden = creatingAccount;
  accountPicker.hidden = true;
  backToLogin.hidden = true;
  formEyebrow.textContent = creatingAccount ? "SEU NOVO PERFIL" : "BEM-VINDA DE VOLTA";
  formTitle.textContent = creatingAccount ? "Crie seu perfil" : "Entre na sua conta";
  formIntro.textContent = creatingAccount ? "Cadastre seus dados para começar a usar a clínica." : "Acesse o painel da Amigo Fiel para continuar.";
  accountSwitch.textContent = creatingAccount ? "Já tenho um perfil · Entrar" : "Ainda não tenho um perfil · Criar conta";
  updateSignupFields();
  errorMessage.textContent = "";
  signupError.textContent = "";
});

backToLogin.addEventListener("click", () => {
  showLoginView();
});

showLoginView();
updateSignupFields();
