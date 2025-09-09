// constante que guarda o endereco da api de clientes.
const API_URL = "http://localhost:8080/clientes";

// seleciona os elementos principais do html para podermos manipula-los.
const form = document.getElementById("cliente-form");
const tableBody = document.getElementById("clientes-table-body");
const formTitle = document.getElementById("form-title");
const clienteIdInput = document.getElementById("clienteId"); // campo escondido para guardar o id na edicao.
const cancelEditBtn = document.getElementById("cancel-edit-btn");

// --- logica do modal de confirmacao ---

// seleciona os elementos do modal no html.
const modal = document.getElementById('confirm-modal');
const modalConfirmBtn = document.getElementById('modal-confirm-btn');
const modalCancelBtn = document.getElementById('modal-cancel-btn');
const closeBtn = document.querySelector('.close-btn');

// variavel para guardar o id do cliente a ser apagado.
let deleteId = null;

// funcao para mostrar o modal, guardando o id do cliente.
function showModal(id) {
    deleteId = id;
    modal.style.display = 'flex'; // torna o modal visivel.
}

// funcao para esconder o modal.
function closeModal() {
    deleteId = null;
    modal.style.display = 'none'; // esconde o modal.
}

// adiciona os "escutadores" de eventos aos botoes do modal.
modalConfirmBtn.addEventListener('click', () => {
    if (deleteId) {
        handleDelete(deleteId); // chama a funcao de apagar se um id estiver guardado.
    }
    closeModal();
});

modalCancelBtn.addEventListener('click', closeModal);
closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', (event) => {
    // fecha o modal se o clique for fora da caixa de dialogo.
    if (event.target == modal) {
        closeModal();
    }
});
// =======================

// --- logica das mascaras de entrada (imask.js) ---

// 'domcontentloaded' espera o html ser carregado para aplicar as mascaras.
document.addEventListener('DOMContentLoaded', () => {
    // mascara para o campo cpf no formato "000.000.000-00".
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        IMask(cpfInput, {
            mask: '000.000.000-00'
        });
    }

    // mascara para o campo de contacto que aceita tanto telefone fixo como telemovel.
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

// --- funcoes principais (crud) ---

// funcao assincrona para buscar os clientes na api e preencher a tabela.
async function fetchClientes() {
    try {
        const response = await fetch(API_URL);
        const clientes = await response.json();
        
        tableBody.innerHTML = ""; // limpa a tabela.

        // percorre a lista de clientes e cria uma linha para cada um.
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

// escutador de evento para submissao do formulario (criar ou atualizar).
form.addEventListener("submit", async (e) => {
    e.preventDefault(); // impede o recarregamento da pagina.
    
    const id = clienteIdInput.value; // se id existir, e uma atualizacao (put).
    
    // cria um objeto javascript com os dados do formulario.
    const cliente = {
        nome: document.getElementById("nome").value,
        cpf: document.getElementById("cpf").value,
        contato: document.getElementById("contato").value,
        endereco: document.getElementById("endereco").value,
    };

    const method = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
        // faz a requisicao para a api, enviando os dados do cliente como json.
        await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" }, // informa a api que estamos a enviar json.
            body: JSON.stringify(cliente), // converte o objeto js para uma string json.
        });
        resetForm(); // limpa o formulario.
        fetchClientes(); // atualiza a tabela com os novos dados.
    } catch (error) {
        console.error("Erro ao salvar cliente:", error);
    }
});

// funcao para carregar os dados de um cliente no formulario para edicao.
async function editCliente(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const cliente = await response.json();
        
        // preenche o formulario com os dados do cliente.
        formTitle.textContent = "Editar Cliente";
        clienteIdInput.value = cliente.id;
        document.getElementById("nome").value = cliente.nome;
        document.getElementById("cpf").value = cliente.cpf;
        document.getElementById("contato").value = cliente.contato || "";
        document.getElementById("endereco").value = cliente.endereco || "";
        cancelEditBtn.style.display = "inline-block"; // mostra o botao de cancelar.
    } catch (error) {
        console.error("Erro ao carregar cliente para edição:", error);
    }
}

// funcao que envia a requisicao para apagar o cliente. e chamada pelo modal.
async function handleDelete(id) {
    try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        fetchClientes();
    } catch (error) {
        console.error("Erro ao excluir cliente:", error);
    }
}

// funcao para limpar o formulario e restaurar o seu estado inicial.
function resetForm() {
    form.reset();
    clienteIdInput.value = "";
    formTitle.textContent = "Adicionar Novo Cliente";
    cancelEditBtn.style.display = "none";
}

// adiciona o evento de clique ao botao de cancelar edicao.
cancelEditBtn.addEventListener("click", resetForm);

// --- inicializacao ---

// chama a funcao para carregar os clientes assim que a pagina e aberta.
fetchClientes();

