// cadastro.js

// 1. Use o endpoint ATUAL do seu script:
const API_URL = "https://script.google.com/macros/s/AKfycby_ZzMAfUl74fZGKQXrzLdEMstJ9NdP9I1QacwaN6yCqzlHmbFUktT9B3vq6GGBLrb8mw/exec";

// 2. Referência ao formulário e ao campo de mensagens
const form = document.getElementById("formTime");
const mensagem = document.getElementById("mensagem");

// 3. Função de envio
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  mensagem.textContent = "⏳ Enviando dados...";

  // Pega dados do formulário
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    // Envia para o Apps Script usando POST com JSON
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    // Interpreta o retorno (JSON)
    const json = await response.json();

    if (json.status === "sucesso") {
      mensagem.textContent = "✅ " + json.mensagem;
      form.reset();
    } else {
      mensagem.textContent = "❌ " + (json.mensagem || "Erro desconhecido");
    }
  } catch (error) {
    mensagem.textContent = "Erro ao enviar: " + error.message;
    console.error(error);
  }
});
