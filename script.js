const storageKey = "eistabelleData";
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

function startApp() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("app").style.display = "block";
  initializeData();
}

function initializeData() {
  if (!localStorage.getItem(storageKey)) {
    const data = defaultSorten.map(name => ({ name, iH: "", aH: "" }));
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
    const row = createRow(entry.name, entry.iH, entry.aH);
    tableBody.appendChild(row);
  });
  updateDeleteDropdown();
}

function createRow(name, iH, aH) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input class="name" type="text" value="${name}"></td>
    <td><input class="iH" type="number" value="${iH}"></td>
    <td><input class="aH" type="number" value="${aH}"></td>
  `;
  return tr;
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
    const iH = row.querySelector(".iH").value;
    const aH = row.querySelector(".aH").value;
    data.push({ name, iH, aH });
  });
  localStorage.setItem(storageKey, JSON.stringify(data));
  showSaveNotice();
}

function showSaveNotice() {
  const notice = document.getElementById("saveNotice");
  notice.classList.add("show");
  clearTimeout(notice._hideTimeout);
  notice._hideTimeout = setTimeout(() => {
    notice.classList.remove("show");
  }, 2000);
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

document.addEventListener("input", () => {
  if (document.getElementById("app").style.display !== "none") {
    saveData();
  }
});



