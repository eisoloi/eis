const storageKey = "eistabelleData";
const startScreenKey = "eistabelleVisited";
const homescreenShownKey = "homescreenShown";

let deferredPrompt;
let installButtonInitialized = false;

// Alphabetisch sortierte Eissorten mit Überschriften
const defaultSorten = [
  "A", "Amadeus", "Amarena-Kirsch", "Ananas", "Ananas-Rosmarien", "Aperol Spritz", "Apfel", "Aprikose",
  "B", "Bacio", "Banane", "Basil", "Biscoff (Spekulatius)", "Brownie",
  "C", "Cassis", "Cherrymania", "Chocoprezel", "Choco bello", "Cookies", "Crema Italiana", "Cheesecake", "Cheesecake, Caramel, Cookies",
  "D", "Dulce de Leche", "dunkle Schokolade",
  "E", "Erdbeere", "Erdbeere-Prosecco", "Espresso-Chip", "Erdnuss-Karamell", "Erdnuss, Honig, Schoko", "Erdbeer-Karamell",
  "G", "Griesflammerie", "Gurke", "Granatapfel, Blutorange",
  "H", "Heidelbeere", "Himbeere", "Himbeere, Rhabarber", "Haselnuss", "Himmelblau",
  "I", "Indische Mango",
  "J", "Joghurt-Natur", "Joghurt-Orange", "Joghurt-Kirsche", "Joghurt-Gurke", "Joghurt-Maracuja",
  "K", "Kaki", "Kinde", "Kokosnuss", "Kokos-Limette", "Kiwi", "Kaktus-Feige", "Kastanie",
  "L", "Limette-Minze",
  "M", "Miss Purple (Süßkartoffel)", "Mandel", "Mandel-Krokant", "Malage", "Melone", "Menta",
  "O", "Orange-Basilikum", "Omas Apfelkuchen",
  "P", "Papaya", "Pistazie", "Praline-Haselnuss", "Pfirsich-Maracuja", "Pflaume-Zimt",
  "Q", "Quark-Himbeere", "Quark-Holunder",
  "S", "Sacher-Art", "Sesamkrokant", "Schokolade", "salziges Karamell", "Stracciatella", "Schoko-Banane", "Schoko-Kirsch", "Schoko-Brezel",
  "T", "Tiramisu",
  "U", "Uhu",
  "V", "Vitaminbombe", "Vanille",
  "W", "Waldmeister", "Waldfrucht", "Walnuss-Feige", "weiße Schokolade",
  "Z", "Zabaione (Eierlikör)", "Zitrone"
];

// Startbildschirm bei erstem Besuch anzeigen
window.addEventListener("load", () => {
  if (!localStorage.getItem(startScreenKey)) {
    document.getElementById("startScreen").style.display = "block";
    document.getElementById("app").style.display = "none";
  } else {
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("app").style.display = "block";
    initializeData();
  }
});

// App starten (per Button vom Startbildschirm)
function startApp() {
  localStorage.setItem(startScreenKey, "1");
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("app").style.display = "block";
  initializeData();
}

// Installationsaufforderung behandeln
window.addEventListener('beforeinstallprompt', (e) => {
  console.log("beforeinstallprompt fired");
  e.preventDefault();
  deferredPrompt = e;

  const installBtn = document.getElementById("installButton");
  if (installBtn && !installButtonInitialized) {
    installBtn.style.display = "inline-block";
    installBtn.addEventListener("click", () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(choiceResult => {
          if (choiceResult.outcome === "accepted") {
            console.log("App wurde installiert.");
          } else {
            console.log("App-Installation abgelehnt.");
          }
          deferredPrompt = null;
        });
      }
    });
    installButtonInitialized = true;
  }
});

// Daten initialisieren und neue Sorten ergänzen
function initializeData() {
  let existingData = [];
  const saved = localStorage.getItem(storageKey);

  if (saved) {
    try {
      existingData = JSON.parse(saved);
    } catch (e) {
      console.error("Fehler beim Parsen der gespeicherten Daten:", e);
    }
  }

  const updatedNames = new Set(existingData.map(entry => entry.name));
  const newEntries = defaultSorten
    .filter(name => !updatedNames.has(name))
    .map(name => ({ name, iH: "", aH: "" }));

  const mergedData = [...existingData, ...newEntries];
  localStorage.setItem(storageKey, JSON.stringify(mergedData));
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

// Tabellenzeile erzeugen
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

// Hinweis nach dem Speichern
function showSaveNotice() {
  const notice = document.getElementById("saveNotice");
  notice.classList.add("show");
  clearTimeout(notice._hideTimeout);
  notice._hideTimeout = setTimeout(() => {
    notice.classList.remove("show");
  }, 2000);
}

// Modal anzeigen
function showDeleteModal() {
  document.getElementById("deleteModal").style.display = "block";
}

// Modal schließen
function hideDeleteModal() {
  document.getElementById("deleteModal").style.display = "none";
}

// Dropdown im Löschfenster aktualisieren
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

// Automatisches Speichern bei Änderungen
document.addEventListener("input", () => {
  if (document.getElementById("app").style.display !== "none") {
    saveData();
  }
});
