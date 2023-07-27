// Variables de la barra de busqueda -----------------------------
const searchBar = document.querySelector('#search-bar input');
const searchBarDiv = document.querySelector('#search-bar');
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
  searchBar.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
      searchSong();
    }
  });
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
    showAlert('No se encontro ningun resultado para la busqueda');
  }
}

function refreshHTML() {
  if (resultsDiv.firstChild) {
    while (resultsDiv.firstChild) {
      resultsDiv.firstChild.remove();
    }
  }
}

function mostrarResultados(results) {
  refreshHTML();
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
    <button class="download-button">Descargar</button>
    `;
      resultsDiv.appendChild(divResult);

      const downloadBtn = divResult.querySelector('.download-button');
      downloadBtn.onclick = function (e) {
        e.preventDefault();
        const videoURL = `https://www.youtube.com/watch?v=${videoId}`;
        const videoInfo = { videoURL };

        refreshHTML();
        searchBarDiv.remove();
        const downloadAlert = document.createElement('DIV');
        downloadAlert.classList.add('alert');
        downloadAlert.innerHTML = `
        <img src="${url}" class="video-img" id="video-img-alert"/>
        <h4 class="video-title" id="video-title-alert">${title}</h4>
        <h5 class="download-text">Descargando...<h5>
        <span class="loader"></span>
        `;
        resultsDiv.appendChild(downloadAlert);

        fetch('http://127.0.0.1:8000/download', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(videoInfo),
        })
          // El server obtiene el video de youtube
          .then((response) => response.blob())
          .then((data) => {
            // Descarga el video al cliente
            downloadClient(data, title, videoInfo);

            // Quita el loader y agrega el icono de completado y el boton de buscar otro video
            downloadComplete(downloadAlert);
          })
          .catch((error) => {
            // Handle errors
            showAlert('Hubo un error durante la descarga');
          });
      };
    }
  });
}

function downloadClient(data, title, videoInfo) {
  // Create a temporary link element
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(data);

  // Set the download attribute and the file name
  downloadLink.download = `${title}.${videoInfo.videoType}`;

  // Append the link to the document and click it to trigger the download
  document.body.appendChild(downloadLink);
  downloadLink.click();

  // Clean up: remove the link after download is triggered
  document.body.removeChild(downloadLink);
}

function downloadComplete(downloadAlert) {
  // Quita loader y pone icono de completado
  const loader = document.querySelector('.loader');
  loader.remove();
  const completeIcon = document.createElement('ion-icon');
  completeIcon.id = 'complete-icon';
  completeIcon.setAttribute('name', 'checkmark-circle-outline');
  downloadAlert.appendChild(completeIcon);
  const downloadText = downloadAlert.querySelector('.download-text');
  downloadText.textContent = 'Descargado';

  // Pone el boton de buscar otro video
  const backSearchBtn = document.createElement('button');
  backSearchBtn.textContent = 'Buscar otro video';
  backSearchBtn.classList.add('download-button');
  backSearchBtn.id = 'back-button';
  results.appendChild(backSearchBtn);

  backSearchBtn.onclick = function () {
    recolocateSearchBar();
  };
}

function showAlert(msj) {
  refreshHTML();
  const alert = document.createElement('DIV');
  const closeButton = document.createElement('BUTTON');
  alert.classList.add('alert');
  closeButton.classList.add('download-button');
  alert.id = 'error-alert';
  closeButton.id = 'error-btn';
  alert.innerHTML = `
  <h4 id="error-title">
    Error <ion-icon name="ban-outline"></ion-icon>
  </h4>
  <p id="error-info">${msj}</p> 
  `;
  closeButton.textContent = 'Cerrar';
  alert.appendChild(closeButton);
  resultsDiv.appendChild(alert);

  closeButton.onclick = function () {
    recolocateSearchBar();
  };
}

function recolocateSearchBar() {
  refreshHTML();
  resultsDiv.insertAdjacentElement('beforebegin', searchBarDiv);
}
