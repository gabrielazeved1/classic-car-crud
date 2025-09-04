const API_URL_VENDEDORES = "http://localhost:8080/vendedores";

// GET - Lista todos os vendedores
async function fetchVendedores() {
  const response = await fetch(API_URL_VENDEDORES);
  const vendedores = await response.json();

  const tableBody = document.getElementById("vendedores-table-body");
  tableBody.innerHTML = "";

  vendedores.forEach((v) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${v.id}</td>
      <td>${v.nome ?? ""}</td>
      <td>${v.matricula ?? ""}</td>
      <td>${v.contato ?? ""}</td>
      <td>
        <button onclick="deleteVendedor(${v.id})">Deletar</button>
        <button onclick="carregarFormularioEdicaoVendedor(${v.id})">Atualizar</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// DELETE - Remove vendedor
async function deleteVendedor(id) {
  await fetch(`${API_URL_VENDEDORES}/${id}`, { method: "DELETE" });
  fetchVendedores();
}

// POST - Adicionar vendedor
document.getElementById("vendedor-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const novoVendedor = {
    nome: document.getElementById("nome").value,
    matricula: document.getElementById("matricula").value,
    contato: document.getElementById("contato").value,
  };

  await fetch(API_URL_VENDEDORES, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(novoVendedor),
  });

  e.target.reset();
  fetchVendedores();
});

// Carrega dados no formulário de edição
async function carregarFormularioEdicaoVendedor(id) {
  const response = await fetch(`${API_URL_VENDEDORES}/${id}`);
  const v = await response.json();

  document.getElementById("editar-vendedor-form").style.display = "block";
  document.getElementById("edit-id").value = v.id;
  document.getElementById("edit-nome").value = v.nome ?? "";
  document.getElementById("edit-matricula").value = v.matricula ?? "";
  document.getElementById("edit-contato").value = v.contato ?? "";
}

// PUT - Editar vendedor
document.getElementById("editar-vendedor-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("edit-id").value;

  const vendedorAtualizado = {
    nome: document.getElementById("edit-nome").value,
    matricula: document.getElementById("edit-matricula").value,
    contato: document.getElementById("edit-contato").value,
  };

  await fetch(`${API_URL_VENDEDORES}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vendedorAtualizado),
  });

  document.getElementById("editar-vendedor-form").style.display = "none";
  fetchVendedores();
});

function cancelarEdicaoVendedor() {
  document.getElementById("editar-vendedor-form").style.display = "none";
}

// Carrega lista ao abrir a página
fetchVendedores();
