const API_URL = "https://script.google.com/macros/s/AKfycbwQVGigTT-toJR0eDw1A65OD2_j9_Oy_hdjd4AQ3Il3G6EvM6iuas2f8Jlfl7jQ0tjM6Q/exec";
const galeria = document.getElementById("videos");

// Histórico para navegação
let historicoPastas = [];
let pastaAtual = ""; // Para saber qual é a atual

function carregarPastaVideos(folderId = "1vpJkpgNWbIG4q7e951GNZWsm0ACZcbzy") {
  galeria.innerHTML = `<p class="carregando">Carregando vídeos...</p>`;

  fetch(`${API_URL}?folderId=${folderId}`)
    .then(response => {
      if (!response.ok) throw new Error("Erro HTTP " + response.status);
      return response.json();
    })
    .then(data => {
      console.log("Dados recebidos da API:", data);  // Debug para verificar estrutura do JSON

      galeria.innerHTML = "";
      pastaAtual = folderId;

      // Botão Voltar (se não for raiz)
      if (historicoPastas.length > 0) {
        const btnVoltar = document.createElement("button");
        btnVoltar.textContent = "⬅ Voltar";
        btnVoltar.style.margin = "15px 0";
        btnVoltar.style.padding = "8px 12px";
        btnVoltar.style.cursor = "pointer";
        btnVoltar.onclick = () => {
          const pastaAnterior = historicoPastas.pop();
          carregarPastaVideos(pastaAnterior);
        };
        galeria.appendChild(btnVoltar);
      }

      // Subpastas com pré-visualização (se houver)
      if (Array.isArray(data.folders) && data.folders.length > 0) {
        const divPastas = document.createElement("div");
        divPastas.style.display = "grid";
        divPastas.style.gridTemplateColumns = "repeat(auto-fill, minmax(250px, 1fr))";
        divPastas.style.gap = "15px";
        divPastas.style.margin = "20px 0";

        data.folders.forEach(pasta => {
          const card = document.createElement("div");
          card.style.border = "1px solid #ccc";
          card.style.padding = "10px";
          card.style.borderRadius = "8px";
          card.style.cursor = "pointer";
          card.style.background = "#f9f9f9";

          const nome = document.createElement("h3");
          nome.textContent = pasta.name;
          nome.style.marginBottom = "10px";

          const previewDiv = document.createElement("div");
          previewDiv.style.display = "flex";
          previewDiv.style.gap = "5px";

          if (pasta.preview) {
            pasta.preview.slice(0, 3).forEach(url => {
              const thumb = document.createElement("img");
              thumb.src = url;
              thumb.style.width = "60px";
              thumb.style.height = "60px";
              thumb.style.objectFit = "cover";
              thumb.style.borderRadius = "4px";
              previewDiv.appendChild(thumb);
            });
          }

          card.appendChild(nome);
          card.appendChild(previewDiv);

          card.onclick = () => {
            historicoPastas.push(pastaAtual);
            carregarPastaVideos(pasta.id);
          };

          divPastas.appendChild(card);
        });

        galeria.appendChild(divPastas);
      }

      // Verificar e carregar vídeos
      const videos = Array.isArray(data.videos) ? data.videos : [];

      if (videos.length === 0) {
        galeria.innerHTML += "<p>Nenhum vídeo encontrado.</p>";
      } else {
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
          iframe.style.cursor = "pointer";
          iframe.title = video.name;
          iframe.onclick = () => abrirLightboxIframe(video.id, video.name);
          divVideos.appendChild(iframe);
        });

        galeria.appendChild(divVideos);
      }
    })
    .catch(error => {
      console.error("Erro no fetch:", error);
      galeria.innerHTML = "<p>Erro ao carregar vídeos.</p>";
    });
}

// Função para abrir modal com iframe do preview Google Drive
function abrirLightboxIframe(fileId, nome) {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.background = "rgba(0,0,0,0.85)";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = 9999;

  const btnFechar = document.createElement("button");
  btnFechar.textContent = "✖";
  btnFechar.style.position = "absolute";
  btnFechar.style.top = "20px";
  btnFechar.style.right = "20px";
  btnFechar.style.fontSize = "24px";
  btnFechar.style.background = "transparent";
  btnFechar.style.border = "none";
  btnFechar.style.color = "white";
  btnFechar.style.cursor = "pointer";
  btnFechar.onclick = () => overlay.remove();

  const iframe = document.createElement("iframe");
  iframe.src = `https://drive.google.com/file/d/${fileId}/preview`;
  iframe.style.width = "90vw";
  iframe.style.height = "90vh";
  iframe.style.border = "none";
  iframe.style.borderRadius = "8px";

  const texto = document.createElement("p");
  texto.textContent = nome;
  texto.style.color = "white";
  texto.style.fontSize = "18px";
  texto.style.marginTop = "10px";

  overlay.appendChild(btnFechar);
  overlay.appendChild(iframe);
  overlay.appendChild(texto);
  document.body.appendChild(overlay);
}

// Inicializa carregando a pasta de vídeos padrão
carregarPastaVideos();
