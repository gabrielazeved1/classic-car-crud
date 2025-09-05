const API_URL = "http://localhost:8080/vendedores";
const form = document.getElementById("vendedor-form");
const tableBody = document.getElementById("vendedores-table-body");
const formTitle = document.getElementById("form-title");
const vendedorIdInput = document.getElementById("vendedorId");
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
    // Máscara para a Matrícula (ex: V0000)
    const matriculaInput = document.getElementById('matricula');
    if (matriculaInput) {
        IMask(matriculaInput, {
            mask: 'V0000'
        });
    }

    // Máscara para o campo de Contacto (Telefone)
    const contatoInput = document.getElementById('contato');
    if (contatoInput) {
        IMask(contatoInput, {
            mask: [
                { mask: '(00) 0000-0000' },
                { mask: '(00) 00000-0000' }
            ]
        });
    }
});
// ======================================

async function fetchVendedores() {
    try {
        const response = await fetch(API_URL);
        const vendedores = await response.json();
        tableBody.innerHTML = "";
        vendedores.forEach(vendedor => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${vendedor.id}</td>
                <td>${vendedor.nome}</td>
                <td>${vendedor.matricula}</td>
                <td>${vendedor.contato || ''}</td>
                <td>
                    <button class="edit-btn" onclick="editVendedor(${vendedor.id})">Editar</button>
                    <button class="delete-btn" onclick="showModal(${vendedor.id})">Excluir</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Erro ao buscar vendedores:", error);
    }
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = vendedorIdInput.value;
    const vendedor = {
        nome: document.getElementById("nome").value,
        matricula: document.getElementById("matricula").value,
        contato: document.getElementById("contato").value,
    };

    const method = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
        await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(vendedor),
        });
        resetForm();
        fetchVendedores();
    } catch (error) {
        console.error("Erro ao salvar vendedor:", error);
    }
});

async function editVendedor(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const vendedor = await response.json();
        formTitle.textContent = "Editar Vendedor";
        vendedorIdInput.value = vendedor.id;
        document.getElementById("nome").value = vendedor.nome;
        document.getElementById("matricula").value = vendedor.matricula;
        document.getElementById("contato").value = vendedor.contato || "";
        cancelEditBtn.style.display = "inline-block";
    } catch (error) {
        console.error("Erro ao carregar vendedor para edição:", error);
    }
}

async function handleDelete(id) {
    try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        fetchVendedores();
    } catch (error) {
        console.error("Erro ao excluir vendedor:", error);
    }
}

function resetForm() {
    form.reset();
    vendedorIdInput.value = "";
    formTitle.textContent = "Adicionar Novo Vendedor";
    cancelEditBtn.style.display = "none";
}

cancelEditBtn.addEventListener("click", resetForm);

fetchVendedores();

