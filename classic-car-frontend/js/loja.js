const API_URL = "http://localhost:8080/carros";

async function carregarCarrosVitrine() {
  const container = document.getElementById("carros-container");
  if (!container) return;

  try {
    const res = await fetch(API_URL);
    const carros = await res.json();
    container.innerHTML = "";

    carros.forEach(carro => {
      const card = document.createElement("div");
      card.className = "carro-card-loja";
      card.innerHTML = `
        <img src="${carro.imagem}" alt="${carro.modelo}">
        <h3>${carro.marca} ${carro.modelo} (${carro.ano})</h3>
        <p>${carro.descricao}</p>
        <p>R$ ${carro.preco.toFixed(2)}</p>
        <p><b>Frete grátis! Retire seu carro hoje mesmo.</b></p>
        <button onclick="comprarCarro(${carro.id})">Comprar</button>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error("Erro ao carregar carros:", err);
  }
}

function comprarCarro(id) {
  window.location.href = `vendas.html?carroId=${id}`;
}

window.addEventListener("DOMContentLoaded", carregarCarrosVitrine);
