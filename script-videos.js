const API_URL = "https://script.google.com/macros/s/AKfycbyMzb1XTy-vvHWeSgxAe0Wsmix2POuBHLVt3ltLL7aLJf3JhltnEqxur8hbObQLOpa_/exec";
const galeria = document.getElementById("videos");

function carregarPastaVideos(folderId = "1vpJkpgNWbIG4q7e951GNZWsm0ACZcbzy") {
  galeria.innerHTML = `<p class="carregando">Carregando vídeos...</p>`;

  fetch(`${API_URL}?folderId=${folderId}`)
    .then(response => {
      if (!response.ok) throw new Error("Erro HTTP " + response.status);
      return response.json();
    })
    .then(data => {
      galeria.innerHTML = "";

      const videos = Array.isArray(data.videos) ? data.videos : [];

      if (videos.length === 0) {
        galeria.innerHTML = "<p>Nenhum vídeo encontrado.</p>";
        return;
      }

      const divVideos = document.createElement("div");
      divVideos.style.display = "grid";
      divVideos.style.gridTemplateColumns = "repeat(auto-fill, minmax(200px, 1fr))";
      divVideos.style.gap = "15px";

      videos.forEach(video => {
        const iframe = document.createElement("iframe");
        iframe.src = `https://drive.google.com/file/d/${video.id}/preview`;
        iframe.style.width = "100%";
        iframe.style.height = "150px";
        iframe.style.border = "none";
        iframe.style.borderRadius = "8px";
        iframe.title = video.name;
        divVideos.appendChild(iframe);
      });

      galeria.appendChild(divVideos);
    })
    .catch(error => {
      galeria.innerHTML = "<p>Erro ao carregar vídeos.</p>";
      console.error(error);
    });
}

// Inicializa carregando a pasta de vídeos padrão
carregarPastaVideos();
