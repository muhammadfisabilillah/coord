document.addEventListener("DOMContentLoaded", render);

function addTimeBlock() {
  const timeInput = document.getElementById("timeInput");
  const activityInput = document.getElementById("activityInput");

  const time = timeInput.value.trim();
  const activity = activityInput.value.trim();

  if (!time || !activity) {
    alert("Isi waktu dan aktivitas");
    return;
  }

  const duration = calculateDuration(time);
  if (duration <= 0) {
    alert("Format waktu salah. Contoh: 16.00 - 18.00");
    return;
  }

  const block = { time, activity, duration };

  let blocks = JSON.parse(localStorage.getItem("blocks")) || [];
  blocks.push(block);
  localStorage.setItem("blocks", JSON.stringify(blocks));

  timeInput.value = "";
  activityInput.value = "";

  render();
}

function render() {
  const list = document.getElementById("timeList");
  list.innerHTML = "";

  const blocks = JSON.parse(localStorage.getItem("blocks")) || [];
  let totalHours = 0;

  blocks.forEach(b => {
    if (typeof b.duration !== "number") return;

    totalHours += b.duration;

    const li = document.createElement("li");
    li.textContent = `${b.time} — ${b.activity} (${b.duration} jam)`;
    list.appendChild(li);
  });

  document.getElementById("totalBlocks").textContent =
    blocks.length + " aktivitas";

  document.getElementById("totalHours").textContent =
    totalHours + " jam";
}

function calculateDuration(range) {
  const parts = range.split("-");
  if (parts.length !== 2) return 0;

  const start = parts[0].trim().replace(".", ":");
  const end = parts[1].trim().replace(".", ":");

  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);

  if ([sh, sm, eh, em].some(isNaN)) return 0;

  return Math.max(0, (eh + em / 60) - (sh + sm / 60));
}
