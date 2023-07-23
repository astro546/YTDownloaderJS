// Variables de la barra de busqueda -----------------------------
const searchBar = document.querySelector('#search-bar input');
const searchBtn = document.querySelector('#search-btn');
const eraseBtn = document.querySelector('#erase-btn');

const resultsDiv = document.querySelector('#results');

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
    mostrarResultados(results.items);
  } catch (error) {
    console.log(error);
  }
}

function mostrarResultados(results) {
  results.forEach((result) => {
    const {
      id: { videoId },
      snippet: {
        channelTitle,
        description,
        thumbnails: {
          medium: { url },
        },
        title,
      },
    } = result;

    if (videoId) {
      const divResult = document.createElement('DIV');
      divResult.classList.add('result');
      divResult.innerHTML = `
    <img src="${url}" class="video-img"/>
    <section class="video-info">
      <h4 class="video-title">${title}</h4>
      <h5 class="video-channel">
        <strong>Canal:</strong> ${channelTitle}
      </h5>
      <h5 class="video-description">
        <strong>Descripcion:</strong> ${description}
      </h5>
    </section>
    <section class="video-buttons">
      <button class="download-button">Descargar</button>
    </section>
    `;
      resultsDiv.appendChild(divResult);

      const downloadBtn = divResult.querySelector('.download-button');
      downloadBtn.onclick = function (e) {
        e.preventDefault();
        const videoURL = `https://www.youtube.com/watch?v=${videoId}`;
        const videoInfo = {
          videoURL,
          title,
          channelTitle,
          img: url,
        };

        fetch('http://127.0.0.1:5000/download', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(videoInfo),
        })
          .then((response) => response.json())
          .then((data) => {
            // Handle the response from the server (if needed)
            console.log(data);
          })
          .catch((error) => {
            // Handle errors
            console.error('Error:', error);
          });
      };
    }
  });
}
