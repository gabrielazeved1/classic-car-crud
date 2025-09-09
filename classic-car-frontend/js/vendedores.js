
// constantes com os enderecos de todas as apis necessarias para esta pagina.
const API_VENDAS = "http://localhost:8080/vendas";
const API_CARROS = "http://localhost:8080/carros";
const API_CLIENTES = "http://localhost:8080/clientes";
const API_VENDEDORES = "http://localhost:8080/vendedores";
const IMG_BASE_URL = "http://localhost:8080/images/";

// seleciona os elementos principais do html com os quais vamos interagir.
const vendaForm = document.getElementById('vendaForm');
const vendasContainer = document.getElementById('vendas-container'); // onde o historico de vendas aparece.
const carroDetalhesContainer = document.getElementById('carro-selecionado-detalhes'); // onde os detalhes do carro aparecem.
const formSection = document.querySelector('.form-section'); // a seccao que contem o formulario.
const instructionMessage = document.getElementById('instruction-message'); // a mensagem de instrucao.

// --- logica das mascaras de entrada (imask.js) ---

let valorMask; // variavel para guardar a instancia da mascara de valor.
document.addEventListener('DOMContentLoaded', () => {
    // mascara para o campo data no formato "dd/mm/aaaa".
    const dataInput = document.getElementById('data');
    if (dataInput) {
        IMask(dataInput, { mask: '00/00/0000' });
    }

    // mascara para o campo valor, formatando como moeda brasileira.
    const valorInput = document.getElementById('valor');
    if (valorInput) {
        valorMask = IMask(valorInput, {
            mask: Number,
            scale: 2,
            thousandsSeparator: '.',
            padFractionalZeros: true,
            radix: ',',
        });
    }
});
// ======================================

// --- funcoes principais ---

// funcao generica para preencher os selects de clientes e vendedores.
async function preencherSelect(url, selectId, campoLabel) {
    try {
        const res = await fetch(url);
        const dados = await res.json();
        const select = document.getElementById(selectId);
        select.innerHTML = "<option value=''>Selecione...</option>";
        dados.forEach(d => {
            const option = new Option(d[campoLabel] || `ID ${d.id}`, d.id);
            select.appendChild(option);
        });
    } catch (err) {
        console.error(`Erro ao carregar ${selectId}:`, err);
    }
}

// funcao para listar as vendas existentes no historico.
async function listarVendas() {
    vendasContainer.innerHTML = "";
    try {
        const res = await fetch(API_VENDAS);
        const vendas = await res.json();
        vendas.forEach(venda => {
            const card = document.createElement("div");
            card.className = "venda-card";
            // adiciona t00:00:00 para evitar problemas de fuso horario ao formatar a data.
            const dataVenda = new Date(venda.data + 'T00:00:00');
            
            // preenche o card do historico apenas com os dados que a api envia.
            card.innerHTML = `
                <h3>Venda #${venda.id}</h3>
                <p><b>Data da Venda:</b> ${dataVenda.toLocaleDateString('pt-BR')}</p>
                <p><b>Valor da Venda:</b> R$ ${venda.valor.toFixed(2).replace('.', ',')}</p>
            `;
            vendasContainer.appendChild(card);
        });
    } catch (err) {
        console.error("Erro ao buscar vendas:", err);
    }
}

// escutador de evento para quando o formulario de venda e submetido.
vendaForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const dataInput = document.getElementById("data").value.split('/');
    // formata a data para o padrao aaaa-mm-dd, que o backend espera.
    const dataFormatada = `${dataInput[2]}-${dataInput[1]}-${dataInput[0]}`;
    const vendaData = {
        carro: { id: parseInt(document.getElementById("carroId").value) },
        cliente: { id: parseInt(document.getElementById("clienteId").value) },
        vendedor: { id: parseInt(document.getElementById("vendedorId").value) },
        data: dataFormatada,
        valor: parseFloat(valorMask.unmaskedValue) // envia o valor numerico puro.
    };

    try {
        await fetch(API_VENDAS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(vendaData)
        });
        
        // apos a venda, esconde o formulario e mostra a mensagem de instrucao novamente.
        formSection.style.display = 'none';
        carroDetalhesContainer.style.display = 'none';
        instructionMessage.style.display = 'block';

        listarVendas(); // atualiza o historico com a nova venda.
        alert("Venda registada com sucesso!");
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
});

// esta e a funcao principal que controla o fluxo da pagina.
async function carregarContextoDeVenda() {
    // le os parametros da url (ex: ?carroid=1).
    const params = new URLSearchParams(window.location.search);
    const carroId = params.get('carroId');

    if (carroId) {
        // se um carroid foi passado na url, significa que o utilizador quer registar uma venda.
        // esconde a mensagem de instrucao e mostra o formulario.
        instructionMessage.style.display = 'none';
        carroDetalhesContainer.style.display = 'flex';
        formSection.style.display = 'block';

        try {
            // busca os detalhes do carro selecionado na api.
            const res = await fetch(`${API_CARROS}/${carroId}`);
            const carro = await res.json();
            const imagemSrc = carro.imagemUrl ? `${IMG_BASE_URL}${carro.imagemUrl}` : 'images/default.jpg';

            // exibe os detalhes do carro para o utilizador.
            carroDetalhesContainer.innerHTML = `
                <img src="${imagemSrc}" alt="${carro.modelo}">
                <div>
                    <h3>Carro Selecionado</h3>
                    <p>${carro.marca} ${carro.modelo} (${carro.ano})</p>
                    <p class="preco">Valor: R$ ${carro.preco.toFixed(2).replace('.', ',')}</p>
                </div>
            `;
            
            // preenche o formulario com o carro e o valor automaticamente.
            const carroSelect = document.getElementById('carroId');
            carroSelect.innerHTML = `<option value="${carro.id}">${carro.modelo}</option>`;
            carroSelect.value = carro.id;
            if (valorMask) {
                valorMask.value = carro.preco.toString();
            }
        } catch (err) {
            console.error("Erro ao carregar detalhes do carro:", err);
        }
    } else {
        // se nenhum carroid foi passado na url, o utilizador so quer ver o historico.
        // mantem o formulario escondido e a mensagem de instrucao visivel.
        instructionMessage.style.display = 'block';
        carroDetalhesContainer.style.display = 'none';
        formSection.style.display = 'none';
    }
}

// --- inicializacao ---

window.addEventListener("DOMContentLoaded", () => {
    // carrega as listas de clientes e vendedores para o select.
    preencherSelect(API_CLIENTES, "clienteId", "nome");
    preencherSelect(API_VENDEDORES, "vendedorId", "nome");
    
    listarVendas(); // sempre carrega o historico de vendas.
    carregarContextoDeVenda(); // verifica se deve mostrar o formulario ou a instrucao.
});

