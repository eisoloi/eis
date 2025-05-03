<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Eistabelle</title>
  <style>
    #saveNotice {
      display: none;
      background: lightgreen;
      padding: 5px;
      border-radius: 5px;
    }
    @keyframes fadeOut {
      to { opacity: 0; }
    }
  </style>
</head>
<body>
  <div id="loginScreen">
    <input type="password" id="passwordInput" placeholder="Passwort">
    <button onclick="checkPassword()">Login</button>
    <div id="loginError" style="display:none; color:red;">Falsches Passwort!</div>
  </div>

  <div id="app" style="display:none;">
    <h1>Eissorten</h1>
    <select id="letterFilter" onchange="filterByLetter(this.value)">
      <option value="ALL">Alle</option>
      ${[..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"].map(l => `<option value="${l}">${l}</option>`).join("")}
    </select>
    <button onclick="addRow()">+ Sorte</button>
    <button onclick="showDeleteModal()">– Sorte</button>
    <div id="saveNotice">Gespeichert!</div>
    <table border="1">
      <thead>
        <tr><th>Name</th><th>Laden</th><th>Lager</th></tr>
      </thead>
      <tbody id="tableBody"></tbody>
    </table>
  </div>

  <div id="deleteModal" style="display:none; background:#eee; padding:10px; border:1px solid #aaa;">
    <h3>Sorte löschen</h3>
    <select id="deleteSelect"></select>
    <button onclick="deleteRow()">Löschen</button>
    <button onclick="hideDeleteModal()">Abbrechen</button>
  </div>

  <script>
    const correctPassword = "eisp1";
    const storageKey = "eistabelleData";
    const loginKey = "eistabelleLoggedIn";
    const defaultSorten = [
      "Amadeus", "Amarena-Kirsch", "Ananas", "Ananas-Rosmarien", "Aperol Spritz", "Apfel", "Aprikose",
      "Bacio", "Banane", "Basil", "Biscoff (Spekulatius)", "Brownie",
      "Cassis", "Cherrymania", "Chocoprezel", "Choco bello", "Cookies", "Crema Italiana", "Cheesecake", "Cheesecake, Caramel, Cookies",
      "Dulce de Leche", "dunkle Schokolade",
      "Erdbeere", "Erdbeere-Prosecco", "Espresso-Chip", "Erdnuss-Karamell", "Erdnuss, Honig, Schoko", "Erdbeer-Karamell",
      "Griesflammerie",
      "Gurke", "Granatapfel, Blutorange",
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
      notice.style.animation = "none";
      notice.offsetHeight;
      notice.style.animation = "fadeOut 2s ease forwards";
      setTimeout(() => {
        notice.style.display = "none";
      }, 2000);
    }

    document.addEventListener("input", () => {
      if (document.getElementById("app").style.display !== "none") {
        saveData();
      }
    });

    function filterByLetter(letter) {
      const allData = JSON.parse(localStorage.getItem(storageKey) || "[]");
      const filtered = letter === "ALL"
        ? allData
        : allData.filter(entry => entry.name?.toUpperCase().startsWith(letter));
      const tableBody = document.getElementById("tableBody");
      tableBody.innerHTML = "";
      filtered.forEach(entry => {
        const row = createRow(entry.name, entry.laden, entry.lager);
        tableBody.appendChild(row);
      });
      updateDeleteDropdown();
    }
  </script>
</body>
</html>

