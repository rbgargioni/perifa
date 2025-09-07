const API_URL = "https://script.google.com/macros/s/AKfycbzPf5WIxsPymf5NfXNX4Ch5yAiVt9v6v3zNF71voICa5lP379fK-2A9YNQLkkH-DcuG/exec";
const galeria = document.getElementById("galeria");

// Histórico para navegação
let historicoPastas = [];
let pastaAtual = ""; // Para saber qual é a atual

function carregarPasta(folderId = "") {
 galeria.innerHTML = `<p class="carregando">Carregando...</p>`;

  fetch(`${API_URL}?folderId=${folderId}`)
    .then(response => {
      if (!response.ok) throw new Error("Erro HTTP " + response.status);
      return response.json();
    })
    .then(data => {
      galeria.innerHTML = "";
      pastaAtual = folderId;

      // Título da pasta
      const titulo = document.createElement("h2");
      titulo.textContent = `PERIFA`;
      titulo.style.textAlign = "center";
      galeria.appendChild(titulo);

      // Botão Voltar (se não for raiz)
      if (historicoPastas.length > 0) {
        const btnVoltar = document.createElement("button");
        btnVoltar.textContent = "⬅ Voltar";
        btnVoltar.style.margin = "15px 0";
        btnVoltar.style.padding = "8px 12px";
        btnVoltar.style.cursor = "pointer";
        btnVoltar.onclick = () => {
          const pastaAnterior = historicoPastas.pop();
          carregarPasta(pastaAnterior);
        };
        galeria.appendChild(btnVoltar);
      }

      // Subpastas com pré-visualização (se houver)
      if (data.folders.length > 0) {
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
            carregarPasta(pasta.id);
          };

          divPastas.appendChild(card);
        });

        galeria.appendChild(divPastas);
      }

      // Imagens
      if (data.files.length > 0) {
        const divImgs = document.createElement("div");
        divImgs.style.display = "grid";
        divImgs.style.gridTemplateColumns = "repeat(auto-fill, minmax(200px, 1fr))";
        divImgs.style.gap = "15px";

        data.files.forEach(file => {
          const img = document.createElement("img");
          img.src = "https://drive.google.com/thumbnail?id=" + file.id;
          img.alt = file.name;
          img.style.width = "100%";
          img.style.height = "150px";
          img.style.objectFit = "cover";
          img.style.borderRadius = "8px";
          img.style.cursor = "pointer";
          img.title = file.name;

          // Aqui chama a nova função com iframe
          img.onclick = () => abrirLightboxIframe(file.id, file.name);

          divImgs.appendChild(img);
        });

        galeria.appendChild(divImgs);
      }
    })
    .catch(error => {
      console.error("Erro no fetch:", error);
      galeria.innerHTML = "<p>Erro ao carregar dados.</p>";
    });
}

// Função para abrir modal com iframe do preview Google Drive
function abrirLightboxIframe(fileId, nome) {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.background = "rgba(0,0,0,0.85)";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = "9999";

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

  // iframe para preview oficial
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
//Cadastro na planilha
function doPost(e) {
  try {
    const dados = JSON.parse(e.postData.contents);
    const nomeTime = dados.time || "Time_Sem_Nome";
    const planilha = SpreadsheetApp.openById("1biJ_8jTQs1CGrD7ey7bv5QnBaPwBw5lK_JeXy3fiVCc");

    // Cria uma nova aba com o nome do time (se não existir)
    let aba = planilha.getSheetByName(nomeTime);
    if (!aba) {
      aba = planilha.insertSheet(nomeTime);
      aba.appendRow(["Técnico", "Jogadores", "Reservas"]);
    }

    // Coleta os dados
    const tecnico = dados.tecnico;
    const jogadores = Object.keys(dados).filter(k => k.startsWith("jogador")).map(k => dados[k]);
    const reservas = Object.keys(dados).filter(k => k.startsWith("reserva")).map(k => dados[k]);

    // Adiciona linha na aba
    aba.appendRow([tecnico, jogadores.join(", "), reservas.join(", ")]);
    return ContentService.createTextOutput("✅ Time cadastrado com sucesso!");
  } catch (error) {
    return ContentService.createTextOutput("❌ Erro ao cadastrar: " + error.message);
  }
}


// Inicializa mostrando a pasta raiz
carregarPasta();

const toggleBtn = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav .links');

toggleBtn.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
