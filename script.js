const correctPassword = "eisp1";
const storageKey = "eistabelleData";
const loginKey = "eistabelleLoggedIn";

const defaultSorten = [
  "Amadeus", "Amarena-Kirsch", "Ananas", "Ananas-Rosmarien", "Aperol Spritz", "Apfel", "Aprikose",
  "Bacio", "Banane", "Basil", "Biscoff (Spekulatius)", "Brownie",
  "Cassis", "Cherrymania", "Chocoprezel", "Choco bello", "Cookies", "Crema Italiana", "Cheesecake", "Cheesecake, Caramel, Cookies",
  "Dulce de Leche", "dunkle Schokolade",
  "Erdbeere", "Erdbeere-Prosecco", "Espresso-Chip", "Erdnuss-Karamell", "Erdnuss, Honig, Schoko", "Erdbeer-Karamell",
  "Griesflammerie", "Gurke", "Granatapfel, Blutorange",
  "Heidelbeere", "Himbeere", "Himbeere, Rhabarber", "Haselnuss", "Himmelblau",
  "Indische Mango",
  "Joghurt-Natur", "Joghurt-Orange", "Joghurt-Kirsche", "Joghurt-Gurke", "Joghurt-Maracuja",
  "Kaki", "Kinde", "Kokosnuss", "Kokos-Limette", "Kiwi", "Kaktus-Feige", "Kastanie",
  "Limette-Minze",
  "Miss Purple (Süßkartoffel)", "Mandel", "Mandel-Krokant", "Malage", "Melone", "Menta",
  "Orange-Basilikum", "Omas Apfelkuchen",
  "Papaya", "Pistazie", "Praline-Haselnuss", "Pfirsich-Maracuja", "Pflaume-Zimt",
  "Quark-Himbeere", "Quark-Holunder",
  "Sacher-Art", "Sesamkrokant", "Schokolade", "salziges Karamell", "Stracciatella", "Schoko-Banane", "Schoko-Kirsch", "Schoko-Brezel",
  "Tiramisu",
  "Uhu",
  "Vitaminbombe", "Vanille",
  "Waldmeister", "Waldfrucht", "Walnuss-Feige", "weiße Schokolade",
  "Zabaione (Eierlikör)", "Zitrone"
];

// Automatisch einloggen, wenn vorher eingeloggt
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
  try {
    const saved = localStorage.getItem(storageKey);
    const data = saved ? JSON.parse(saved) : [];
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";
    data.forEach(entry => {
      const row = createRow(entry.name, entry.laden, entry.lager);
      tableBody.appendChild(row);
    });
    updateDeleteDropdown();
  } catch (e) {
    console.error("Fehler beim Laden der Daten:", e);
  }
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
  tr.innerHTML = `
    <td><input class="name" type="text" value="${name}"></td>
    <td><input class="laden" type="number" min="0" value="${laden}"></td>
    <td><input class="lager" type="number" min="0" value="${lager}"></td>
  `;
  return tr;
}

function saveData() {
  const data = [];
  const rows = document.querySelectorAll("#tableBody tr");
  rows.forEach(row => {
    const name = row.querySelector(".name").value.trim();
    const laden = row.querySelector(".laden").value || "0";
    const lager = row.querySelector(".lager").value || "0";
    data.push({ name, laden, lager });
  });
  localStorage.setItem(storageKey, JSON.stringify(data));
  showSaveNotice();
}

function showSaveNotice() {
  const notice = document.getElementById("saveNotice");
  notice.style.display = "inline-block";
  notice.style.animation = "none";
  notice.offsetHeight; // Trigger Reflow
  notice.style.animation = "fadeOut 2s ease forwards";

  setTimeout(() => {
    notice.style.display = "none";
  }, 2000);
}

// Zeige/Verstecke das Löschmenü
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
    const name = row.querySelector(".name").value.trim();
    const option = document.createElement("option");
    option.value = index;
    option.textContent = name || `Sorte ${index + 1}`;
    select.appendChild(option);
  });
}

function deleteRow() {
  const index = parseInt(document.getElementById("deleteSelect").value);
  const rows = document.querySelectorAll("#tableBody tr");
  if (!isNaN(index) && rows[index]) {
    rows[index].remove();
    saveData();
    updateDeleteDropdown();
    hideDeleteModal();
  }
}

// Beim Tippen automatisch speichern
document.addEventListener("input", () => {
  if (document.getElementById("app").style.display !== "none") {
    saveData();
  }
});

// Sortenüberschrift klickbar: zeigt Filtermenü
document.getElementById("sortenHeader").addEventListener("click", () => {
  const menu = document.getElementById("filterMenu");
  menu.classList.toggle("hidden");
});

// Filtere Einträge nach Anfangsbuchstabe
function filterByLetter(letter) {
  const rows = document.querySelectorAll("#tableBody tr");
  rows.forEach(row => {
    const name = row.querySelector(".name").value.trim().toLowerCase();
    row.style.display = (letter === "ALL" || name.startsWith(letter.toLowerCase())) ? "" : "none";
  });
}

}

