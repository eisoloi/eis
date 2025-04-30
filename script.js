
const correctPassword = "1234";
const storageKey = "eistabelleData";
const defaultSorten = [
  "Schokolade", "Vanille", "Erdbeer", "Himmelblau",
  "Lila", "Mango", "Menta", "Cookies",
  "Stracciatella", "Kinderschoko"
];

// Passwort prüfen
function checkPassword() {
  const input = document.getElementById("passwordInput").value;
  if (input === correctPassword) {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("app").style.display = "block";
    initializeData();
  } else {
    document.getElementById("loginError").style.display = "block";
  }
}

// Nur beim allerersten Start vorbelegen
function initializeData() {
  if (!localStorage.getItem(storageKey)) {
    const data = defaultSorten.map(name => ({ name, laden: "", lager: "" }));
    localStorage.setItem(storageKey, JSON.stringify(data));
  }
  loadData();
}

// Daten aus localStorage laden
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

// Neue Zeile hinzufügen
function addRow() {
  const tableBody = document.getElementById("tableBody");
  const row = createRow("", "", "");
  tableBody.appendChild(row);
  updateDeleteDropdown();
  saveData();
}

// Daten speichern
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

// Zeile erzeugen
function createRow(name, laden, lager) {
  const tr = document.createElement("tr");
  tr.innerHTML = \`
    <td><input class="name" type="text" value="\${name}"></td>
    <td><input class="laden" type="number" value="\${laden}"></td>
    <td><input class="lager" type="number" value="\${lager}"></td>
  \`;
  return tr;
}

// Löschen-Modal anzeigen/verstecken
function showDeleteModal() {
  document.getElementById("deleteModal").style.display = "block";
}
function hideDeleteModal() {
  document.getElementById("deleteModal").style.display = "none";
}

// Dropdown aktualisieren
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

// Eissorte löschen
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

// Hinweis anzeigen
function showSaveNotice() {
  const notice = document.getElementById("saveNotice");
  notice.style.display = "block";
  setTimeout(() => (notice.style.display = "none"), 1500);
}
