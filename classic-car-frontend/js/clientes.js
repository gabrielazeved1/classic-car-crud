const API_URL = "http://localhost:8080/clientes";
const form = document.getElementById("cliente-form");
const tableBody = document.getElementById("clientes-table-body");
const formTitle = document.getElementById("form-title");
const clienteIdInput = document.getElementById("clienteId");
const cancelEditBtn = document.getElementById("cancel-edit-btn");

// === Lógica do Modal ===
const modal = document.getElementById('confirm-modal');
const modalConfirmBtn = document.getElementById('modal-confirm-btn');
const modalCancelBtn = document.getElementById('modal-cancel-btn');
const closeBtn = document.querySelector('.close-btn');

let deleteId = null;

function showModal(id) {
    deleteId = id;
    modal.style.display = 'flex';
}

function closeModal() {
    deleteId = null;
    modal.style.display = 'none';
}

modalConfirmBtn.addEventListener('click', () => {
    if (deleteId) {
        handleDelete(deleteId);
    }
    closeModal();
});

modalCancelBtn.addEventListener('click', closeModal);
closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', (event) => {
    if (event.target == modal) {
        closeModal();
    }
});
// =======================

// === Lógica de Máscaras com IMask.js ===
document.addEventListener('DOMContentLoaded', () => {
    // Máscara para o campo CPF
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        IMask(cpfInput, {
            mask: '000.000.000-00'
        });
    }

    // Máscara para o campo de Contacto (Telefone)
    const contatoInput = document.getElementById('contato');
    if (contatoInput) {
        IMask(contatoInput, {
            mask: [
                { mask: '(00) 0000-0000' },  // Telefone fixo
                { mask: '(00) 00000-0000' } // Telemóvel
            ]
        });
    }
});
// ======================================

async function fetchClientes() {
    try {
        const response = await fetch(API_URL);
        const clientes = await response.json();
        tableBody.innerHTML = "";
        clientes.forEach(cliente => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${cliente.id}</td>
                <td>${cliente.nome}</td>
                <td>${cliente.cpf}</td>
                <td>${cliente.contato || ''}</td>
                <td>
                    <button class="edit-btn" onclick="editCliente(${cliente.id})">Editar</button>
                    <button class="delete-btn" onclick="showModal(${cliente.id})">Excluir</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Erro ao buscar clientes:", error);
    }
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = clienteIdInput.value;
    const cliente = {
        nome: document.getElementById("nome").value,
        cpf: document.getElementById("cpf").value,
        contato: document.getElementById("contato").value,
        endereco: document.getElementById("endereco").value,
    };

    const method = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
        await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cliente),
        });
        resetForm();
        fetchClientes();
    } catch (error) {
        console.error("Erro ao salvar cliente:", error);
    }
});

async function editCliente(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const cliente = await response.json();
        formTitle.textContent = "Editar Cliente";
        clienteIdInput.value = cliente.id;
        document.getElementById("nome").value = cliente.nome;
        document.getElementById("cpf").value = cliente.cpf;
        document.getElementById("contato").value = cliente.contato || "";
        document.getElementById("endereco").value = cliente.endereco || "";
        cancelEditBtn.style.display = "inline-block";
    } catch (error) {
        console.error("Erro ao carregar cliente para edição:", error);
    }
}

async function handleDelete(id) {
    try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        fetchClientes();
    } catch (error) {
        console.error("Erro ao excluir cliente:", error);
    }
}

function resetForm() {
    form.reset();
    clienteIdInput.value = "";
    formTitle.textContent = "Adicionar Novo Cliente";
    cancelEditBtn.style.display = "none";
}

cancelEditBtn.addEventListener("click", resetForm);

fetchClientes();

