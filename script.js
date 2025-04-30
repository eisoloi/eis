
document.addEventListener('DOMContentLoaded', () => {
  const correctPassword = 'eisp1';

  if (localStorage.getItem('pw_valid') === '1') {
    showApp();
  }

  document.getElementById('passwordInput')?.addEventListener('keypress', e => {
    if (e.key === 'Enter') checkPassword();
  });

  window.checkPassword = () => {
    const input = document.getElementById('passwordInput').value;
    if (input === correctPassword) {
      localStorage.setItem('pw_valid', '1');
      showApp();
    } else {
      document.getElementById('loginError').style.display = 'block';
    }
  };

  function showApp() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    loadData();
  }

  const tableBody = document.getElementById('tableBody');
  const deleteSelect = document.getElementById('deleteSelect');
  const saveNotice = document.getElementById('saveNotice');

  function saveData() {
    const data = [];
    tableBody?.querySelectorAll('tr').forEach(row => {
      const inputs = row.querySelectorAll('input');
      data.push({
        sorte: inputs[0].value,
        laden: inputs[1].value,
        lager: inputs[2].value
      });
    });
    localStorage.setItem('eistabelle', JSON.stringify(data));
    if (saveNotice) {
      saveNotice.style.display = 'block';
      setTimeout(() => saveNotice.style.display = 'none', 2000);
    }
  }

  function loadData() {
    const saved = localStorage.getItem('eistabelle');
    if (saved) {
      const data = JSON.parse(saved);
      data.forEach(row => addRow(row.sorte, row.laden, row.lager));
    }
  }

  window.addRow = function(sorte = '', laden = '', lager = '') {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input type="text" value="${sorte}"></td>
      <td><input type="text" value="${laden}"></td>
      <td><input type="text" value="${lager}"></td>
    `;
    row.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', saveData);
    });
    tableBody.appendChild(row);
    updateDeleteSelect();
    saveData();
  };

  function updateDeleteSelect() {
    deleteSelect.innerHTML = '';
    tableBody?.querySelectorAll('tr').forEach((row, index) => {
      const sorte = row.querySelector('input').value;
      const option = document.createElement('option');
      option.value = index;
      option.textContent = sorte || `Sorte ${index + 1}`;
      deleteSelect.appendChild(option);
    });
  }

  window.deleteRow = () => {
    const index = deleteSelect.value;
    if (index !== null && tableBody.children[index]) {
      tableBody.removeChild(tableBody.children[index]);
      updateDeleteSelect();
      saveData();
      hideDeleteModal();
    }
  };

  window.showDeleteModal = () => {
    document.getElementById('deleteModal').style.display = 'block';
  };

  window.hideDeleteModal = () => {
    document.getElementById('deleteModal').style.display = 'none';
  };

  window.saveData = saveData;
});
