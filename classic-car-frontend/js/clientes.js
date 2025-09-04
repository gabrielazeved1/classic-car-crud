const API_URL = "http://localhost:8080/clientes";
const tableBody = document.getElementById("clientes-table-body");

// Carregar clientes
async function carregarClientes() {
  if (!tableBody) return;
  try {
    const res = await fetch(API_URL);
    const clientes = await res.json();
    tableBody.innerHTML = "";

    clientes.forEach(cliente => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${cliente.id}</td>
        <td>${cliente.nome}</td>
        <td>${cliente.cpf}</td>
        <td>${cliente.contato || ''}</td>
        <td>${cliente.endereco || ''}</td>
        <td>
          <button onclick="deletarCliente(${cliente.id})">Deletar</button>
          <button onclick="carregarEdicao(${cliente.id})">Editar</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error("Erro ao carregar clientes:", err);
  }
}

// Adicionar cliente
document.getElementById("cliente-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const cliente = {
    nome: document.getElementById("nome").value,
    cpf: document.getElementById("cpf").value,
    contato: document.getElementById("contato").value,
    endereco: document.getElementById("endereco").value
  };
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cliente)
  });
  e.target.reset();
  carregarClientes();
});

// Deletar cliente
async function deletarCliente(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  carregarClientes();
}

// Carregar cliente para edição
async function carregarEdicao(id) {
  const res = await fetch(`${API_URL}/${id}`);
  const cliente = await res.json();
  document.getElementById("editar-form").style.display = "block";
  document.getElementById("edit-id").value = cliente.id;
  document.getElementById("edit-nome").value = cliente.nome;
  document.getElementById("edit-cpf").value = cliente.cpf;
  document.getElementById("edit-contato").value = cliente.contato || '';
  document.getElementById("edit-endereco").value = cliente.endereco || '';
}

// Salvar edição
document.getElementById("editar-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("edit-id").value;
  const cliente = {
    nome: document.getElementById("edit-nome").value,
    cpf: document.getElementById("edit-cpf").value,
    contato: document.getElementById("edit-contato").value,
    endereco: document.getElementById("edit-endereco").value
  };
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cliente)
  });
  document.getElementById("editar-form").style.display = "none";
  carregarClientes();
});

function cancelarEdicao() {
  document.getElementById("editar-form").style.display = "none";
}

carregarClientes();
