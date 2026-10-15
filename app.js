if (sessionStorage.getItem("amigo-fiel-auth") !== "authenticated") {
  window.location.replace("login.html");
}

const defaultAppointments = [
  { time: "09:00", patient: "Mel", owner: "Carolina Mendes", type: "Consulta clínica", pet: "🐶", state: "Confirmado", className: "confirmed" },
  { time: "10:30", patient: "Simba", owner: "Rafael Oliveira", type: "Vacinação", pet: "🐱", state: "Confirmado", className: "confirmed" },
  { time: "13:00", patient: "Floquinho", owner: "Beatriz Santos", type: "Retorno", pet: "🐰", state: "Aguardando", className: "waiting" },
  { time: "15:30", patient: "Thor", owner: "Lucas Ferreira", type: "Consulta clínica", pet: "🐶", state: "Confirmado", className: "confirmed" }
];

const list = document.querySelector("#appointment-list");
const patientList = document.querySelector(".patient-list");
const modal = document.querySelector("#appointment-modal");
const form = document.querySelector("#appointment-form");
const patientModal = document.querySelector("#patient-modal");
const patientForm = document.querySelector("#patient-form");
const toast = document.querySelector("#toast");

function getAppointments() {
  return JSON.parse(localStorage.getItem("amigo-fiel-appointments") || "null") || defaultAppointments;
}

function renderAppointments() {
  list.innerHTML = getAppointments().map((appointment) => `
    <div class="appointment-row">
      <span class="appointment-time">${appointment.time}</span>
      <div class="appointment-info"><strong>${appointment.patient}</strong><small>${appointment.type} · ${appointment.owner}</small></div>
      <span class="appointment-pet ${appointment.pet === "🐱" ? "cat" : appointment.pet === "🐰" ? "bunny" : ""}">${appointment.pet}</span>
      <span class="status ${appointment.className}">${appointment.state}</span>
    </div>
  `).join("");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2800);
}

document.querySelector("#open-modal").addEventListener("click", () => modal.showModal());
document.querySelector("#logout-link").addEventListener("click", () => {
  sessionStorage.removeItem("amigo-fiel-auth");
});

document.querySelectorAll(".close-button").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    button.closest("dialog").close();
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const appointments = getAppointments();
  appointments.push({
    time: data.get("time"),
    patient: data.get("patient"),
    owner: data.get("owner"),
    type: data.get("procedure"),
    pet: "🐾",
    state: "Aguardando",
    className: "waiting"
  });
  appointments.sort((first, second) => first.time.localeCompare(second.time));
  localStorage.setItem("amigo-fiel-appointments", JSON.stringify(appointments));
  renderAppointments();
  form.reset();
  modal.close();
  showToast("Atendimento adicionado à agenda.");
});

document.querySelector("#quick-patient").addEventListener("click", () => patientModal.showModal());

patientForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(patientForm);
  const patient = document.createElement("div");
  const speciesIcon = { Cão: "🐶", Gato: "🐱", Coelho: "🐰", Outro: "🐾" }[data.get("species")];
  patient.className = "patient-row";
  patient.innerHTML = `<span class="pet-avatar">${speciesIcon}</span><div><strong></strong><small></small></div><span class="status active-status">Ativo</span>`;
  patient.querySelector("strong").textContent = data.get("patient");
  patient.querySelector("small").textContent = `${data.get("species")} · ${data.get("age")} ${Number(data.get("age")) === 1 ? "ano" : "anos"} · ${data.get("owner")}`;
  patientList.prepend(patient);
  patientForm.reset();
  patientModal.close();
  showToast("Paciente cadastrado com sucesso.");
});

document.querySelectorAll("#quick-tutor, #quick-vaccine").forEach((button) => {
  button.addEventListener("click", () => showToast("Este atalho será desenvolvido em outro ticket."));
});

renderAppointments();
