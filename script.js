
const correctPassword = "eisp1";
const storageKey = "eistabelleData";
const loginKey = "eistabelleLoggedIn";
const defaultSorten = [
  "Schokolade", "Vanille", "Erdbeer", "Himmelblau",
  "Lila", "Mango", "Menta", "Cookies",
  "Stracciatella", "Kinderschoko"
];

// Start: automatisch einloggen, wenn schon mal eingeloggt
window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem(loginKey) === "true") {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("app").style.display = "block";
    initializeData();
  }
});

function checkPassword() {
  const input = document.getElementById("passwordInput").value;
  if (input === correctPassword) {
    localStorage.setItem(loginKey, "true");
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("app").style.display = "block";
    initializeData();
  } else {
    document.getElementById("loginError").style.display = "block";
  }
}

function initializeData() {
  if (!localStorage.getItem(storageKey)) {
    const data = defaultSorten.map(name => ({ name, laden: "", lager: "" }));
    localStorage.setItem(storageKey, JSON.stringify(data));
  }
  loadData();
}

function loadData() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) return;
  const data = JSON.parse(saved);
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";
  data.forEach(entry => {
    const row = createRow(entry.name, entry.laden, entry.lager);
    tableBody.appendChild(row);
  });
  updateDeleteDropdown();
}

function addRow() {
  const tableBody = document.getElementById("tableBody");
  const row = createRow("", "", "");
  tableBody.appendChild(row);
  updateDeleteDropdown();
  saveData();
}

function saveData() {
  const data = [];
  const rows = document.querySelectorAll("#tableBody tr");
  rows.forEach(row => {
    const name = row.querySelector(".name").value;
    const laden = row.querySelector(".laden").value;
    const lager = row.querySelector(".lager").value;
    data.push({ name, laden, lager });
  });
  localStorage.setItem(storageKey, JSON.stringify(data));
  showSaveNotice();
}

function createRow(name, laden, lager) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input class="name" type="text" value="${name}"></td>
    <td><input class="laden" type="number" value="${laden}"></td>
    <td><input class="lager" type="number" value="${lager}"></td>
  `;
  return tr;
}

function showDeleteModal() {
  document.getElementById("deleteModal").style.display = "block";
}
function hideDeleteModal() {
  document.getElementById("deleteModal").style.display = "none";
}

function updateDeleteDropdown() {
  const select = document.getElementById("deleteSelect");
  select.innerHTML = "";
  const rows = document.querySelectorAll("#tableBody tr");
  rows.forEach((row, index) => {
    const name = row.querySelector(".name").value;
    const option = document.createElement("option");
    option.value = index;
    option.textContent = name || "Sorte " + (index + 1);
    select.appendChild(option);
  });
}

function deleteRow() {
  const index = document.getElementById("deleteSelect").value;
  const rows = document.querySelectorAll("#tableBody tr");
  if (rows[index]) {
    rows[index].remove();
    saveData();
    updateDeleteDropdown();
    hideDeleteModal();
  }
}

function showSaveNotice() {
  const notice = document.getElementById("saveNotice");
  notice.style.display = "inline-block";
  notice.style.animation = "none"; // Reset Animation
  notice.offsetHeight; // Trigger Reflow
  notice.style.animation = "fadeOut 2s ease forwards";

  setTimeout(() => {
    notice.style.display = "none";
  }, 2000);
}


// Änderungen automatisch speichern
document.addEventListener("input", () => {
  if (document.getElementById("app").style.display !== "none") {
    saveData();
  }
});
