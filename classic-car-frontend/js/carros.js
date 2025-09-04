const API_URL = "http://localhost:8080/carros";

async function carregarCarros() {
  const tableBody = document.getElementById("carros-table-body");
  if (!tableBody) return;

  try {
    const res = await fetch(API_URL);
    const carros = await res.json();

    tableBody.innerHTML = "";
    carros.forEach(carro => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${carro.id}</td>
        <td>${carro.marca}</td>
        <td>${carro.modelo}</td>
        <td>${carro.ano}</td>
        <td>R$ ${carro.preco.toFixed(2)}</td>
        <td>${carro.descricao}</td>
        <td><img src="${carro.imagem || 'https://via.placeholder.com/100x60?text=Sem+Imagem'}" 
                 alt="${carro.modelo}" width="100"></td>
        <td>${carro.status}</td>
        <td>
          <button onclick="deletarCarro(${carro.id})">Deletar</button>
          <button onclick="carregarEdicao(${carro.id})">Editar</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error("Erro ao carregar carros:", err);
  }
}

// Adicionar carro
document.getElementById("carro-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const carro = {
    marca: document.getElementById("marca").value,
    modelo: document.getElementById("modelo").value,
    ano: parseInt(document.getElementById("ano").value),
    preco: parseFloat(document.getElementById("preco").value),
    descricao: document.getElementById("descricao").value,
    imagem: document.getElementById("imagem").value || 'https://via.placeholder.com/220x120?text=Sem+Imagem',
    status: document.getElementById("status").value
  };

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(carro)
  });

  e.target.reset();
  carregarCarros();
});

// Deletar
async function deletarCarro(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  carregarCarros();
}

// Carregar edição
async function carregarEdicao(id) {
  const res = await fetch(`${API_URL}/${id}`);
  const carro = await res.json();

  document.getElementById("editar-form").style.display = "block";
  document.getElementById("edit-id").value = carro.id;
  document.getElementById("edit-marca").value = carro.marca;
  document.getElementById("edit-modelo").value = carro.modelo;
  document.getElementById("edit-ano").value = carro.ano;
  document.getElementById("edit-preco").value = carro.preco;
  document.getElementById("edit-descricao").value = carro.descricao;
  document.getElementById("edit-imagem").value = carro.imagem;
  document.getElementById("edit-status").value = carro.status;
}

// Salvar edição
document.getElementById("editar-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("edit-id").value;
  const carro = {
    marca: document.getElementById("edit-marca").value,
    modelo: document.getElementById("edit-modelo").value,
    ano: parseInt(document.getElementById("edit-ano").value),
    preco: parseFloat(document.getElementById("edit-preco").value),
    descricao: document.getElementById("edit-descricao").value,
    imagem: document.getElementById("edit-imagem").value || 'https://via.placeholder.com/220x120?text=Sem+Imagem',
    status: document.getElementById("edit-status").value
  };

  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(carro)
  });

  document.getElementById("editar-form").style.display = "none";
  carregarCarros();
});

function cancelarEdicao() {
  document.getElementById("editar-form").style.display = "none";
}

carregarCarros();
