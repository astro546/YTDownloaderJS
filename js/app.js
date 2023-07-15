// Variables de la barra de busqueda -----------------------------
const searchBar = document.querySelector('#search-bar input');
const searchBtn = document.querySelector('#search-btn');
const eraseBtn = document.querySelector('#erase-btn');

// Eventos de la barra de busqueda -------------------------------
document.addEventListener('DOMContentLoaded', () => {
  searchBar.addEventListener('input', displayEraseBtn);
  eraseBtn.addEventListener('click', eraseText);
  searchBtn.addEventListener('click', searchSong);
});

function displayEraseBtn(e) {
  if (e.target.value.length > 0) {
    eraseBtn.hidden = false;
  } else {
    eraseBtn.hidden = true;
  }
}

function eraseText(e) {
  searchBar.value = '';
  eraseBtn.hidden = true;
}

function searchSong() {
  console.log(searchBar.value);
}
