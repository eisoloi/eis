const correctPassword = "eisp1";
const storageKey = "eistabelleData";
const defaultSorten = [
  "Schokolade", "Vanille", "Erdbeer", "Himmelblau", "Lila",
  "Mango", "Menta", "Cookies", "Stracciatella", "Kinderschoko"
];

window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("loginOk") === "true") {
    showApp();
  }
});

function checkPassword() {
  const input = document.getElementById("passwordInput").value;
  if (input === correctPassword) {
    localStorage.setItem("loginOk", "true");
    showApp();
  } else {
    document.getElementById("loginError").style.display = "block";
  }
}

function showApp() {
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("app").style.display = "block";
  loadData();
  document.activeElement.blur(); // Tastatur schließen
  window.scrollTo(0, 0); // nach oben scrollen
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

function loadData() {
  const saved = localStorage.getItem(storageKey);
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";

  let data;
  if (saved) {
    data = JSON.parse(saved);
  } else {
    data = defaultSorten.map(name => ({ name, laden: "", lager: "" }));
    localStorage.setItem(storageKey, JSON.stringify(data));
  }

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

function createRow(name, laden, lager) {
  const tr = document.createElement("tr");
  tr.innerHTML = 
    <td><input class="name" type="text" value="${name}"></td>
    <td><input class="laden" type="number" value="${laden}"></td>
    <td><input class="lager" type="number" value="${lager}"></td>
  ;
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
    option.textContent = name;
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
  notice.style.display = "block";
  setTimeout(() => (notice.style.display = "none"), 1500);
}
