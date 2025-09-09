// constantes que guardam os enderecos da api para facilitar a manutencao.
const API_URL = "http://localhost:8080/carros";
const IMG_BASE_URL = "http://localhost:8080/images/";

// seleciona os elementos principais do html com os quais vamos interagir.
const form = document.getElementById("carroForm");
const tableBody = document.getElementById("carros-table-body");
const formTitle = document.getElementById("form-title");
const carroIdInput = document.getElementById("carroId"); // campo escondido que guarda o id para edicao.
const cancelEditBtn = document.getElementById("cancel-edit-btn");

// --- logica do modal de confirmacao ---

// seleciona os elementos do modal no html.
const modal = document.getElementById('confirm-modal');
const modalConfirmBtn = document.getElementById('modal-confirm-btn');
const modalCancelBtn = document.getElementById('modal-cancel-btn');
const closeBtn = document.querySelector('.close-btn');

// variavel para guardar o id do carro que queremos apagar.
let deleteId = null;

// funcao para mostrar o modal. ela recebe o id do carro a ser apagado.
function showModal(id) {
    deleteId = id; // guarda o id.
    modal.style.display = 'flex'; // muda o css para 'flex' para o tornar visivel.
}

// funcao para esconder o modal.
function closeModal() {
    deleteId = null; // limpa o id guardado.
    modal.style.display = 'none'; // muda o css para 'none' para o esconder.
}

// adiciona os "escutadores" de eventos aos botoes do modal.
// quando o botao de confirmar e clicado, chama a funcao de apagar.
modalConfirmBtn.addEventListener('click', () => {
    if (deleteId) {
        handleDelete(deleteId);
    }
    closeModal(); // fecha o modal depois da acao.
});

// os botoes de cancelar e fechar apenas chamam a funcao para fechar o modal.
modalCancelBtn.addEventListener('click', closeModal);
closeBtn.addEventListener('click', closeModal);
// permite fechar o modal clicando fora da caixa de dialogo.
window.addEventListener('click', (event) => {
    if (event.target == modal) {
        closeModal();
    }
});



// logica das mascaras de entrada (imask.js) 

let precoMask; // variavel para guardar a instancia da mascara de preco.
// 'domcontentloaded' espera que todo o html da pagina seja carregado antes de executar este codigo.
document.addEventListener('DOMContentLoaded', () => {
    // mascara para o campo ano (so permite 4 digitos).
    const anoInput = document.getElementById('ano');
    if (anoInput) {
        IMask(anoInput, {
            mask: '0000'
        });
    }

    // mascara para o campo preco (formata como moeda brasileira).
    const precoInput = document.getElementById('preco');
    if (precoInput) {
        precoMask = IMask(precoInput, {
            mask: Number,
            scale: 2, // duas casas decimais.
            thousandsSeparator: '.', // separador de milhares.
            padFractionalZeros: true, // sempre mostra os centavos.
            radix: ',', // separador decimal.
        });
    }
});


// --- funcoes principais (crud) ---

// funcao assincrona para buscar os carros na api e preencher a tabela.
async function fetchCarros() {
    try {
        // 'fetch' faz a requisicao http get para a  api.
        const response = await fetch(API_URL);
        // '.json()' converte a resposta da api para um objeto javascript.
        const carros = await response.json();
        
        tableBody.innerHTML = ""; // limpa a tabela antes de a preencher.

        // percorre a lista de carros recebida.
        carros.forEach(carro => {
            const row = document.createElement("tr"); // cria uma nova linha na tabela.
            
            // constroi a url completa da imagem. se nao houver imagem, usa uma imagem padrao.
            const imagemSrc = carro.imagemUrl ? `${IMG_BASE_URL}${carro.imagemUrl}` : 'images/default.jpg';
            
            // preenche a linha com os dados do carro.
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
            tableBody.appendChild(row); // adiciona a nova linha a tabela.
        });
    } catch (error) {
        console.error("Erro ao buscar carros:", error);
    }
}

// escutador de evento para quando o formulario e submetido (criar ou atualizar).
form.addEventListener("submit", async (e) => {
    e.preventDefault(); // impede o recarregamento padrao da pagina.
    
    const id = carroIdInput.value; // pega o id do campo escondido. se estiver vazio, e um 'post'.
    const imagemFile = document.getElementById("imagemFile").files[0]; // pega o ficheiro de imagem selecionado.

    // .unmaskedvalue pega o valor do preco sem a mascara (ex: "150000.00").
    const precoNumerico = precoMask ? precoMask.unmaskedValue : document.getElementById("preco").value;

    // cria um objeto com os dados do formulario.
    const carroData = {
        marca: document.getElementById("marca").value,
        modelo: document.getElementById("modelo").value,
        ano: parseInt(document.getElementById("ano").value),
        preco: parseFloat(precoNumerico),
        descricao: document.getElementById("descricao").value,
    };
    
    // para enviar ficheiros, precisamos de usar 'formdata'.
    const formData = new FormData();
    // adiciona os dados do carro como um 'blob' json.
    formData.append('carro', new Blob([JSON.stringify(carroData)], { type: 'application/json' }));
    // se uma imagem foi selecionada, adiciona-a ao formdata.
    if (imagemFile) {
        formData.append('file', imagemFile);
    }
    
    // define o metodo http (post ou put) e a url com base na existencia de um id.
    const method = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/${id}` : API_URL;
    
    try {
        // faz a requisicao para a api, enviando o formdata.
        await fetch(url, { method: method, body: formData });
        resetForm(); // limpa o formulario.
        fetchCarros(); // atualiza a tabela.
    } catch (error) {
        console.error("Erro ao salvar carro:", error);
    }
});

// funcao para carregar os dados de um carro no formulario para edicao.
async function editCarro(id) {
    try {
        // busca os dados do carro especifico na api.
        const response = await fetch(`${API_URL}/${id}`);
        const carro = await response.json();
        
        // preenche o formulario com os dados recebidos.
        formTitle.textContent = "Editar Carro";
        carroIdInput.value = carro.id;
        document.getElementById("marca").value = carro.marca;
        document.getElementById("modelo").value = carro.modelo;
        document.getElementById("ano").value = carro.ano;
        
        // atualiza o valor no campo de mascara de preco.
        if (precoMask) {
            precoMask.value = carro.preco.toString();
        } else {
            document.getElementById("preco").value = carro.preco;
        }
        
        document.getElementById("descricao").value = carro.descricao;
        cancelEditBtn.style.display = "inline-block"; // mostra o botao de cancelar edicao.
    } catch (error) {
        console.error("Erro ao carregar carro para edição:", error);
    }
}

// funcao que efetivamente envia a requisicao para apagar o carro.
// e chamada apenas pelo modal.
async function handleDelete(id) {
    try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        fetchCarros(); // atualiza a tabela apos apagar.
    } catch (error) {
        console.error("Erro ao excluir carro:", error);
    }
}

// funcao para limpar o formulario e voltar ao estado de "adicionar novo".
function resetForm() {
    form.reset();
    if (precoMask) {
        precoMask.value = ''; // limpa o valor da mascara.
    }
    carroIdInput.value = "";
    formTitle.textContent = "Adicionar Novo Carro";
    cancelEditBtn.style.display = "none";
}

// adiciona o evento de clique ao botao de cancelar edicao.
cancelEditBtn.addEventListener("click", resetForm);

// --- inicializacao ---

// chama a funcao para buscar e exibir os carros assim que o script e carregado.
fetchCarros();

