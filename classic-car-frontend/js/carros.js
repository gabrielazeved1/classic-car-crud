const API_URL = "http://localhost:8080/carros";
const IMG_BASE_URL = "http://localhost:8080/images/";
const form = document.getElementById("carroForm");
const tableBody = document.getElementById("carros-table-body");
const formTitle = document.getElementById("form-title");
const carroIdInput = document.getElementById("carroId");
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
let precoMask; // Tornar a máscara acessível globalmente
document.addEventListener('DOMContentLoaded', () => {
    // Máscara para o campo Ano (4 dígitos)
    const anoInput = document.getElementById('ano');
    if (anoInput) {
        IMask(anoInput, {
            mask: '0000'
        });
    }

    // Máscara para o campo de Preço (Moeda)
    const precoInput = document.getElementById('preco');
    if (precoInput) {
        precoMask = IMask(precoInput, {
            mask: Number,
            scale: 2,
            thousandsSeparator: '.',
            padFractionalZeros: true,
            normalizeZeros: true,
            radix: ',',
            mapToRadix: ['.']
        });
    }
});
// ======================================

async function fetchCarros() {
    try {
        const response = await fetch(API_URL);
        const carros = await response.json();
        tableBody.innerHTML = "";
        carros.forEach(carro => {
            const row = document.createElement("tr");
            const imagemSrc = carro.imagemUrl ? `${IMG_BASE_URL}${carro.imagemUrl}` : 'images/default.jpg';
            row.innerHTML = `
                <td>${carro.id}</td>
                <td><img src="${imagemSrc}" alt="${carro.modelo}" width="100"></td>
                <td>${carro.marca}</td>
                <td>${carro.modelo}</td>
                <td>
                    <button class="edit-btn" onclick="editCarro(${carro.id})">Editar</button>
                    <button class="delete-btn" onclick="showModal(${carro.id})">Excluir</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Erro ao buscar carros:", error);
    }
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = carroIdInput.value;
    const imagemFile = document.getElementById("imagemFile").files[0];

    // Obter o valor numérico puro do campo de preço
    const precoNumerico = precoMask ? precoMask.unmaskedValue : document.getElementById("preco").value;

    const carroData = {
        marca: document.getElementById("marca").value,
        modelo: document.getElementById("modelo").value,
        ano: parseInt(document.getElementById("ano").value),
        preco: parseFloat(precoNumerico), // Usar o valor sem máscara
        descricao: document.getElementById("descricao").value,
    };
    const formData = new FormData();
    formData.append('carro', new Blob([JSON.stringify(carroData)], { type: 'application/json' }));
    if (imagemFile) {
        formData.append('file', imagemFile);
    }
    const method = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/${id}` : API_URL;
    try {
        await fetch(url, { method: method, body: formData });
        resetForm();
        fetchCarros();
    } catch (error) {
        console.error("Erro ao salvar carro:", error);
    }
});

async function editCarro(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const carro = await response.json();
        formTitle.textContent = "Editar Carro";
        carroIdInput.value = carro.id;
        document.getElementById("marca").value = carro.marca;
        document.getElementById("modelo").value = carro.modelo;
        document.getElementById("ano").value = carro.ano;
        // Atualizar o valor no campo de máscara
        if (precoMask) {
            precoMask.value = carro.preco.toString();
        } else {
            document.getElementById("preco").value = carro.preco;
        }
        document.getElementById("descricao").value = carro.descricao;
        cancelEditBtn.style.display = "inline-block";
    } catch (error) {
        console.error("Erro ao carregar carro para edição:", error);
    }
}

async function handleDelete(id) {
    try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        fetchCarros();
    } catch (error) {
        console.error("Erro ao excluir carro:", error);
    }
}

function resetForm() {
    form.reset();
    if (precoMask) {
        precoMask.value = ''; // Limpar o valor da máscara
    }
    carroIdInput.value = "";
    formTitle.textContent = "Adicionar Novo Carro";
    cancelEditBtn.style.display = "none";
}

cancelEditBtn.addEventListener("click", resetForm);

fetchCarros();

