const defaultAppointments = [
  { time: "09:00", patient: "Mel", owner: "Carolina Mendes", type: "Consulta clínica", pet: "🐶", state: "Confirmado", className: "confirmed" },
  { time: "10:30", patient: "Simba", owner: "Rafael Oliveira", type: "Vacinação", pet: "🐱", state: "Confirmado", className: "confirmed" },
  { time: "13:00", patient: "Floquinho", owner: "Beatriz Santos", type: "Retorno", pet: "🐰", state: "Aguardando", className: "waiting" },
  { time: "15:30", patient: "Thor", owner: "Lucas Ferreira", type: "Consulta clínica", pet: "🐶", state: "Confirmado", className: "confirmed" }
];

const list = document.querySelector("#appointment-list");
const modal = document.querySelector("#appointment-modal");
const form = document.querySelector("#appointment-form");
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

document.querySelectorAll("#quick-patient, #quick-tutor, #quick-vaccine").forEach((button) => {
  button.addEventListener("click", () => showToast("Este atalho estará disponível no próximo ticket."));
});

renderAppointments();
