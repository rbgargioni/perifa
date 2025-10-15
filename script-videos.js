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
      divVideos.style.gridTemplateColumns = "repeat(auto-fit, minmax(340px, 1fr))";
      divVideos.style.gap = "20px";
      divVideos.style.justifyItems = "center";
      divVideos.style.padding = "10px";

      videos.forEach(video => {
        // Wrapper para forçar relação de aspecto e centralização
        const wrapper = document.createElement("div");
        wrapper.style.position = "relative";
        wrapper.style.width = "100%";
        wrapper.style.maxWidth = "400px";
        wrapper.style.aspectRatio = "16/9";
        wrapper.style.background = "#222";
        wrapper.style.borderRadius = "10px";
        wrapper.style.overflow = "hidden";
        wrapper.style.display = "flex";
        wrapper.style.alignItems = "center";
        wrapper.style.justifyContent = "center";

        const iframe = document.createElement("iframe");
        iframe.src = `https://drive.google.com/file/d/${video.id}/preview`;
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "none";
        iframe.title = video.name;

        wrapper.appendChild(iframe);
        divVideos.appendChild(wrapper);
      });

      galeria.appendChild(divVideos);
    })
    .catch(error => {
      galeria.innerHTML = "<p>Erro ao carregar vídeos.</p>";
      console.error(error);
    });
}

carregarPastaVideos();
