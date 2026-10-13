if (sessionStorage.getItem("amigo-fiel-auth") !== "authenticated") {
  window.location.replace("login.html");
}

const stateKey = "amigo-fiel-clinica-state";
const defaultState = {
  appointments: [
    { time: "09:00", patient: "Mel", owner: "Carolina Mendes", type: "Consulta clínica", pet: "🐶", state: "Confirmado", className: "confirmed" },
    { time: "10:30", patient: "Simba", owner: "Rafael Oliveira", type: "Vacinação", pet: "🐱", state: "Confirmado", className: "confirmed" },
    { time: "13:00", patient: "Floquinho", owner: "Beatriz Santos", type: "Retorno", pet: "🐰", state: "Aguardando", className: "waiting" },
    { time: "15:30", patient: "Thor", owner: "Lucas Ferreira", type: "Consulta clínica", pet: "🐶", state: "Confirmado", className: "confirmed" }
  ],
  tutors: [
    { id: crypto.randomUUID(), name: "Carolina Mendes", phone: "(11) 98834-2211", email: "carolina@cliente.com", city: "São Paulo, SP" },
    { id: crypto.randomUUID(), name: "Rafael Oliveira", phone: "(11) 99642-1120", email: "rafael@cliente.com", city: "Osasco, SP" },
    { id: crypto.randomUUID(), name: "Beatriz Santos", phone: "(21) 98341-9098", email: "beatriz@cliente.com", city: "Rio de Janeiro, RJ" }
  ],
  employees: [
    { id: crypto.randomUUID(), name: "Dra. Camila Rocha", email: "camila@amigofiel.com", userType: "funcionario", role: "medico-veterinario" },
    { id: crypto.randomUUID(), name: "Bruno Costa", email: "bruno@amigofiel.com", userType: "funcionario", role: "estagiario" },
    { id: crypto.randomUUID(), name: "Maria Silva", email: "maria@amigofiel.com", userType: "funcionario", role: "fundador" }
  ],
  animals: [
    { id: crypto.randomUUID(), name: "Mel", species: "Cão", breed: "Golden Retriever", age: 4, owner: "Carolina Mendes", status: "Ativo" },
    { id: crypto.randomUUID(), name: "Simba", species: "Gato", breed: "Siamês", age: 2, owner: "Rafael Oliveira", status: "Ativo" },
    { id: crypto.randomUUID(), name: "Floquinho", species: "Coelho", breed: "Mini Lop", age: 1, owner: "Beatriz Santos", status: "Ativo" },
    { id: crypto.randomUUID(), name: "Thor", species: "Cão", breed: "Beagle", age: 6, owner: "Lucas Ferreira", status: "Retorno" }
  ],
  consultations: [
    { id: crypto.randomUUID(), patient: "Mel", doctor: "Dra. Camila Rocha", diagnosis: "Otite média", treatment: "Antibiótico oral por 7 dias", exam: "Hemograma + cultura", laudo: "Laudo de otoscopia sem lesões", recipe: "Amoxicilina 500mg 12/12h", notes: "Retorno em 5 dias para reavaliação." },
    { id: crypto.randomUUID(), patient: "Simba", doctor: "Dra. Camila Rocha", diagnosis: "Dermatite de pele", treatment: "Banho medicamentoso e pomada tópica", exam: "Exame dermatológico", laudo: "Sem sinais de infecção bacteriana", recipe: "Miconazol 1% tópica", notes: "Acompanhamento semanal." },
    { id: crypto.randomUUID(), patient: "Floquinho", doctor: "Bruno Costa", diagnosis: "Desidratação leve", treatment: "Hidratação oral e acompanhamento nutricional", exam: "Avaliação clínica", laudo: "Estável após hidratação", recipe: "Soro oral e dieta", notes: "Observação durante 48h." }
  ]
};

const list = document.querySelector("#appointment-list");
const tutorList = document.querySelector("#tutor-list");
const employeeList = document.querySelector("#employee-list");
const animalList = document.querySelector("#animal-list");
const consultationList = document.querySelector("#consultation-list");
const patientSummaryList = document.querySelector(".patient-list");
const toast = document.querySelector("#toast");
const appointmentModal = document.querySelector("#appointment-modal");
const appointmentForm = document.querySelector("#appointment-form");
const tutorModal = document.querySelector("#tutor-modal");
const tutorForm = document.querySelector("#tutor-form");
const employeeModal = document.querySelector("#employee-modal");
const employeeForm = document.querySelector("#employee-form");
const animalModal = document.querySelector("#animal-modal");
const animalForm = document.querySelector("#animal-form");
const consultModal = document.querySelector("#consult-modal");
const consultForm = document.querySelector("#consult-form");
const historySearch = document.querySelector("#history-search");
const profileMenuButton = document.querySelector("#profile-menu-button");
const profileMenu = document.querySelector("#profile-menu");
const currentProfile = JSON.parse(sessionStorage.getItem("amigo-fiel-profile") || "null");

function loadState() {
  const savedState = JSON.parse(localStorage.getItem(stateKey) || "null");
  if (!savedState) {
    localStorage.setItem(stateKey, JSON.stringify(defaultState));
    return JSON.parse(JSON.stringify(defaultState));
  }
  return savedState;
}

const appState = loadState();

function saveState() {
  localStorage.setItem(stateKey, JSON.stringify(appState));
}

function roleLabel(role) {
  const labels = {
    "medico-veterinario": "Médico-veterinário",
    estagiario: "Estagiário",
    fundador: "Fundador",
    cliente: "Cliente"
  };
  return labels[role] || role;
}

function updateProfileUi() {
  if (!currentProfile) {
    return;
  }

  const profileName = document.querySelector(".profile-info strong");
  const profileAvatar = document.querySelector(".avatar");
  const profileMenuName = document.querySelector(".profile-menu > strong");
  const profileRole = document.querySelector(".profile-info small");
  const welcomeName = document.querySelector("#welcome-name");
  const nameParts = currentProfile.name.trim().split(/\s+/);
  const initials = nameParts.slice(0, 2).map((part) => part[0]).join("").toUpperCase();

  profileName.textContent = currentProfile.name;
  profileAvatar.textContent = initials;
  profileMenuName.textContent = currentProfile.name;
  profileRole.textContent = roleLabel(currentProfile.role || currentProfile.userType || "cliente");
  welcomeName.textContent = currentProfile.name.split(/\s+/)[0];
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2800);
}

function populateSelects() {
  const tutorOptions = appState.tutors.map((tutor) => `<option value="${tutor.name}">${tutor.name}</option>`).join("");
  const animalOwner = document.querySelector("#animal-owner");
  const consultPatient = document.querySelector("#consult-patient");
  const consultDoctor = document.querySelector("#consult-doctor");

  if (animalOwner) {
    animalOwner.innerHTML = `<option value="">Selecione o tutor</option>${tutorOptions}`;
  }

  if (consultPatient) {
    consultPatient.innerHTML = `<option value="">Selecione o animal</option>${appState.animals.map((animal) => `<option value="${animal.name}">${animal.name} · ${animal.species}</option>`).join("")}`;
  }

  if (consultDoctor) {
    consultDoctor.innerHTML = `<option value="">Selecione o médico</option>${appState.employees.filter((employee) => employee.userType === "funcionario" && employee.role === "medico-veterinario").map((employee) => `<option value="${employee.name}">${employee.name}</option>`).join("")}`;
  }
}

function renderAppointments() {
  list.innerHTML = appState.appointments.map((appointment) => `
    <div class="appointment-row">
      <span class="appointment-time">${appointment.time}</span>
      <div class="appointment-info"><strong>${appointment.patient}</strong><small>${appointment.type} · ${appointment.owner}</small></div>
      <span class="appointment-pet ${appointment.pet === "🐱" ? "cat" : appointment.pet === "🐰" ? "bunny" : ""}">${appointment.pet}</span>
      <span class="status ${appointment.className}">${appointment.state}</span>
    </div>
  `).join("");
}

function renderTutors() {
  tutorList.innerHTML = appState.tutors.map((tutor) => `
    <div class="info-row">
      <div class="info-row-copy">
        <strong>${tutor.name}</strong>
        <small>${tutor.phone} · ${tutor.city}</small>
      </div>
      <span class="pill pill-green">Tutor</span>
    </div>
  `).join("") || "<p class='empty-state'>Nenhum tutor cadastrado.</p>";
}

function renderEmployees() {
  employeeList.innerHTML = appState.employees.map((employee) => `
    <div class="info-row">
      <div class="info-row-copy">
        <strong>${employee.name}</strong>
        <small>${roleLabel(employee.role)}</small>
      </div>
      <span class="pill ${employee.role === "medico-veterinario" ? "pill-green" : "pill-warm"}">${employee.userType}</span>
    </div>
  `).join("") || "<p class='empty-state'>Nenhum funcionário cadastrado.</p>";
}

function renderAnimals() {
  animalList.innerHTML = appState.animals.map((animal) => `
    <div class="info-row">
      <div class="info-row-copy">
        <strong>${animal.name}</strong>
        <small>${animal.species} · ${animal.breed} · ${animal.age} anos</small>
      </div>
      <span class="pill ${animal.status === "Retorno" ? "pill-warm" : "pill-green"}">${animal.status}</span>
    </div>
  `).join("") || "<p class='empty-state'>Nenhum animal cadastrado.</p>";

  patientSummaryList.innerHTML = appState.animals.map((animal) => `
    <div class="patient-row">
      <span class="pet-avatar ${animal.species === "Gato" ? "cat" : animal.species === "Coelho" ? "bunny" : "dog"}">${animal.species === "Gato" ? "🐱" : animal.species === "Coelho" ? "🐰" : animal.species === "Cão" ? "🐶" : "🐾"}</span>
      <div>
        <strong>${animal.name}</strong>
        <small>${animal.species} · ${animal.age} ${Number(animal.age) === 1 ? "ano" : "anos"} · ${animal.owner}</small>
      </div>
      <span class="status ${animal.status === "Retorno" ? "waiting" : "confirmed"}">${animal.status}</span>
    </div>
  `).join("") || "<p class='empty-state'>Nenhum paciente cadastrado.</p>";
}

function renderConsultations(filterText = "") {
  const normalized = filterText.trim().toLowerCase();
  const filtered = !normalized
    ? appState.consultations
    : appState.consultations.filter((consult) => [
        consult.patient,
        consult.doctor,
        consult.diagnosis,
        consult.treatment,
        consult.exam,
        consult.laudo,
        consult.recipe,
        consult.notes
      ].join(" ").toLowerCase().includes(normalized));

  consultationList.innerHTML = filtered.map((consult) => `
    <article class="consult-card">
      <div class="consult-header">
        <strong>${consult.patient}</strong>
        <span>${consult.doctor}</span>
      </div>
      <p><strong>Diagnóstico:</strong> ${consult.diagnosis}</p>
      <p><strong>Tratamento:</strong> ${consult.treatment || "Sem tratamento informado"}</p>
      <div class="consult-meta">
        <span>Exames: ${consult.exam || "-"}</span>
        <span>Laudo: ${consult.laudo || "-"}</span>
      </div>
      <div class="consult-meta">
        <span>Receita: ${consult.recipe || "-"}</span>
      </div>
      <small>${consult.notes || "Sem observações adicionais."}</small>
    </article>
  `).join("") || "<p class='empty-state'>Nenhuma consulta encontrada para esse filtro.</p>";
}

function resetForms() {
  appointmentForm.reset();
  tutorForm.reset();
  employeeForm.reset();
  animalForm.reset();
  consultForm.reset();
}

document.querySelector("#open-modal").addEventListener("click", () => appointmentModal.showModal());
document.querySelector("#quick-patient").addEventListener("click", () => animalModal.showModal());
document.querySelector("#quick-tutor").addEventListener("click", () => tutorModal.showModal());
document.querySelector("#quick-employee").addEventListener("click", () => employeeModal.showModal());
document.querySelector("#quick-vaccine").addEventListener("click", () => consultModal.showModal());

document.querySelectorAll("[data-open-modal]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.querySelector(`#${button.dataset.openModal}`);
    if (target) {
      target.showModal();
    }
  });
});

function leaveAccount() {
  sessionStorage.removeItem("amigo-fiel-auth");
  sessionStorage.removeItem("amigo-fiel-profile");
  window.location.replace("login.html");
}

profileMenuButton.addEventListener("click", () => {
  const isOpen = profileMenu.hidden;
  profileMenu.hidden = !isOpen;
  profileMenuButton.setAttribute("aria-expanded", String(isOpen));
});

document.querySelector("#switch-account").addEventListener("click", leaveAccount);
document.querySelector("#profile-logout").addEventListener("click", leaveAccount);
document.addEventListener("click", (event) => {
  if (!profileMenu.contains(event.target) && event.target !== profileMenuButton) {
    profileMenu.hidden = true;
    profileMenuButton.setAttribute("aria-expanded", "false");
  }
});

document.querySelectorAll(".close-button").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    const dialog = button.closest("dialog");
    if (dialog) {
      dialog.close();
    }
  });
});

appointmentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(appointmentForm);
  const newAppointment = {
    time: formData.get("time"),
    patient: formData.get("patient"),
    owner: formData.get("owner"),
    type: formData.get("procedure"),
    pet: "🐾",
    state: "Aguardando",
    className: "waiting"
  };

  appState.appointments.push(newAppointment);
  appState.appointments.sort((first, second) => first.time.localeCompare(second.time));
  saveState();
  renderAppointments();
  resetForms();
  appointmentModal.close();
  showToast("Atendimento adicionado à agenda.");
});

tutorForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(tutorForm);
  appState.tutors.push({
    id: crypto.randomUUID(),
    name: formData.get("name").toString().trim(),
    phone: formData.get("phone").toString().trim(),
    email: formData.get("email").toString().trim(),
    city: formData.get("city").toString().trim() || "Não informado"
  });
  saveState();
  renderTutors();
  populateSelects();
  resetForms();
  tutorModal.close();
  showToast("Tutor cadastrado com sucesso.");
});

employeeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(employeeForm);
  const userType = formData.get("userType");
  const role = formData.get("role");
  appState.employees.push({
    id: crypto.randomUUID(),
    name: formData.get("name").toString().trim(),
    email: formData.get("email").toString().trim(),
    userType,
    role: userType === "funcionario" ? role : "cliente"
  });
  saveState();
  renderEmployees();
  populateSelects();
  resetForms();
  employeeModal.close();
  showToast("Usuário salvo com sucesso.");
});

animalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(animalForm);
  const owner = formData.get("owner");
  appState.animals.push({
    id: crypto.randomUUID(),
    name: formData.get("name").toString().trim(),
    species: formData.get("species"),
    breed: formData.get("breed").toString().trim() || "Não informado",
    age: Number(formData.get("age") || 0),
    owner: owner || "Tutor não informado",
    status: "Ativo"
  });
  saveState();
  renderAnimals();
  populateSelects();
  resetForms();
  animalModal.close();
  showToast("Animal cadastrado com sucesso.");
});

consultForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(consultForm);
  appState.consultations.unshift({
    id: crypto.randomUUID(),
    patient: formData.get("patient"),
    doctor: formData.get("doctor"),
    diagnosis: formData.get("diagnosis") || "Não informado",
    treatment: formData.get("treatment") || "Sem tratamento informado",
    exam: formData.get("exam") || "-",
    laudo: formData.get("laudo") || "-",
    recipe: formData.get("recipe") || "-",
    notes: formData.get("notes") || "Sem observações adicionais."
  });
  saveState();
  renderConsultations();
  resetForms();
  consultModal.close();
  showToast("Consulta registrada no prontuário.");
});

historySearch.addEventListener("input", (event) => {
  renderConsultations(event.target.value);
});

updateProfileUi();
populateSelects();
renderAppointments();
renderTutors();
renderEmployees();
renderAnimals();
renderConsultations();
