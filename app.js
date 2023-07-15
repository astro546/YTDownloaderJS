// Variables de la barra de busqueda -----------------------------
const searchBar = document.querySelector('#search-bar input');
const searchBtn = document.querySelector('#search-btn');
const eraseBtn = document.querySelector('#erase-btn');

// Llave y url base de la API de Youtube -------------------------
const ytKey = 'AIzaSyBf7DSh1TyqjegwO69wHvF3_fl9KJ77gWs';

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

function eraseText() {
  searchBar.value = '';
  eraseBtn.hidden = true;
}

async function searchSong() {
  const searchStr = searchBar.value.replace(/ /g, '-');
  const searchURL = `https://www.googleapis.com/youtube/v3/search?key=${ytKey}&part=snippet&q=${encodeURIComponent(
    searchStr
  )}`;

  try {
    const response = await fetch(searchURL);
    const results = await response.json();
    console.log(results.items);
  } catch (error) {
    console.log(error);
  }
}

function mostrarResultados() {
  console.log('Proximamente');
}
