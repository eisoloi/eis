// Lokaler Speicher-Schlüssel
const storageKey = "eistabelleData";

// Alphabetisch sortierte Eissorten mit Überschriften
const defaultSorten = [
  "A",
  "Amadeus", "Amarena-Kirsch", "Ananas", "Ananas-Rosmarien", "Aperol Spritz", "Apfel", "Aprikose",
  "B",
  "Bacio", "Banane", "Basil", "Biscoff (Spekulatius)", "Brownie",
  "C",
  "Cassis", "Cherrymania", "Chocoprezel", "Choco bello", "Cookies", "Crema Italiana", "Cheesecake", "Cheesecake, Caramel, Cookies",
  "D",
  "Dulce de Leche", "dunkle Schokolade",
  "E",
  "Erdbeere", "Erdbeere-Prosecco", "Espresso-Chip", "Erdnuss-Karamell", "Erdnuss, Honig, Schoko", "Erdbeer-Karamell",
  "G",
  "Griesflammerie", "Gurke", "Granatapfel, Blutorange",
  "H",
  "Heidelbeere", "Himbeere", "Himbeere, Rhabarber", "Haselnuss", "Himmelblau",
  "I",
  "Indische Mango",
  "J",
  "Joghurt-Natur", "Joghurt-Orange", "Joghurt-Kirsche", "Joghurt-Gurke", "Joghurt-Maracuja",
  "K",
  "Kaki", "Kinde", "Kokosnuss", "Kokos-Limette", "Kiwi", "Kaktus-Feige", "Kastanie",
  "L",
  "Limette-Minze",
  "M",
  "Miss Purple (Süßkartoffel)", "Mandel", "Mandel-Krokant", "Malage", "Melone", "Menta",
  "O",
  "Orange-Basilikum", "Omas Apfelkuchen",
  "P",
  "Papaya", "Pistazie", "Praline-Haselnuss", "Pfirsich-Maracuja", "Pflaume-Zimt",
  "Q",
  "Quark-Himbeere", "Quark-Holunder",
  "S",
  "Sacher-Art", "Sesamkrokant", "Schokolade", "salziges Karamell", "Stracciatella", "Schoko-Banane", "Schoko-Kirsch", "Schoko-Brezel",
  "T",
  "Tiramisu",
  "U",
  "Uhu",
  "V",
  "Vitaminbombe", "Vanille",
  "W",
  "Waldmeister", "Waldfrucht", "Walnuss-Feige", "weiße Schokolade",
  "Z",
  "Zabaione (Eierlikör)", "Zitrone"
];

// Startbildschirm nur einmal anzeigen
window.addEventListener("DOMContentLoaded", () => {
  const hasSeenStart = localStorage.getItem("startScreenSeen");
  if (hasSeenStart) {
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("app").style.display = "block";
    initializeData();
  } else {
    document.getElementById("startScreen").style.display = "block";
  }
});

// Startfunktion bei Klick auf "Weiter"
function startApp() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("app").style.display = "block";
  localStorage.setItem("startScreenSeen", "true");
  initializeData();
}

// Initialisierung mit Standarddaten
function initializeData() {
  if (!localStorage.getItem(storageKey)) {
    const data = defaultSorten.map(name => ({ name, iH: "", aH: "" }));
    localStorage.setItem(storageKey, JSON.stringify(data));
  }
  loadData();
}

// Daten laden und Tabelle aufbauen
function loadData() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) return;
  const data = JSON.parse(saved);
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";
  data.forEach(entry => {
    const row = createRow(entry.name, entry.iH, entry.aH);
    tableBody.appendChild(row);
  });
  updateDeleteDropdown();
}

// Zeile erstellen
function createRow(name, iH, aH) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input class="name" type="text" value="${name}"></td>
    <td><input class="iH" type="number" value="${iH}"></td>
    <td><input class="aH" type="number" value="${aH}"></td>
  `;
  return tr;
}

// Neue Zeile hinzufügen
function addRow() {
  const tableBody = document.getElementById("tableBody");
  const row = createRow("", "", "");
  tableBody.appendChild(row);
  updateDeleteDropdown();
  saveData();
}

// Speichern
function saveData() {
  const data = [];
  const rows = document.querySelectorAll("#tableBody tr");
  rows.forEach(row => {
    const name = row.querySelector(".name").value;
    const iH = row.querySelector(".iH").value;
    const aH = row.querySelector(".aH").value;
    data.push({ name, iH, aH });
  });
  localStorage.setItem(storageKey, JSON.stringify(data));
  showSaveNotice();
}

// Speichern-Hinweis
function showSaveNotice() {
  const notice = document.getElementById("saveNotice");
  notice.classList.add("show");
  clearTimeout(notice._hideTimeout);
  notice._hideTimeout = setTimeout(() => {
    notice.classList.remove("show");
  }, 2000);
}

// Lösch-Dialog anzeigen
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

// Zeile löschen
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

// Automatisch speichern bei Änderungen
document.addEventListener("input", () => {
  if (document.getElementById("app").style.display !== "none") {
    saveData();
  }
});
