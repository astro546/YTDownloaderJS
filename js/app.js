// Variables de la barra de busqueda -----------------------------
const searchBar = document.querySelector('#search-bar input');
const searchBtn = document.querySelector('#search-btn');
const eraseBtn = document.querySelector('#erase-btn');

// Llave y url base de la API de Last.fm -------------------------
const key = '69b014cc12f6d2897c19242d5258fc7c';
const baseURL = 'http://ws.audioscrobbler.com/2.0/';

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

async function searchSong() {
  const searchStr = searchBar.value.replace(/ /g, '-');
  const searchURL = `${baseURL}?method=track.search&track=${searchStr}&api_key=${key}&format=json`;

  try {
    const response = await fetch(searchURL);
    const results = await response.json();
    console.log(results.results.trackmatches.track);
  } catch (error) {
    console.log(error);
  }
}

function mostrarResultados() {
  console.log('Proximamente');
}
