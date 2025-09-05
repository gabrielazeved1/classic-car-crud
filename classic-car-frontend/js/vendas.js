const API_VENDAS = "http://localhost:8080/vendas";
const API_CARROS = "http://localhost:8080/carros";
const API_CLIENTES = "http://localhost:8080/clientes";
const API_VENDEDORES = "http://localhost:8080/vendedores";
const IMG_BASE_URL = "http://localhost:8080/images/";

// Elementos do DOM
const vendaForm = document.getElementById('vendaForm');
const vendasContainer = document.getElementById('vendas-container');
const carroDetalhesContainer = document.getElementById('carro-selecionado-detalhes');
const formSection = document.querySelector('.form-section');
const instructionMessage = document.getElementById('instruction-message');

let valorMask;

// Lógica de Máscaras
document.addEventListener('DOMContentLoaded', () => {
    const dataInput = document.getElementById('data');
    if (dataInput) {
        IMask(dataInput, { mask: '00/00/0000' });
    }

    const valorInput = document.getElementById('valor');
    if (valorInput) {
        valorMask = IMask(valorInput, {
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

// Preencher selects de clientes e vendedores
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

// ============== FUNÇÃO CORRIGIDA ==============
// Listar vendas existentes
async function listarVendas() {
    vendasContainer.innerHTML = "";
    try {
        const res = await fetch(API_VENDAS);
        const vendas = await res.json();
        vendas.forEach(venda => {
            const card = document.createElement("div");
            card.className = "venda-card";
            // Adiciona T00:00:00 para evitar problemas de fuso horário
            const dataVenda = new Date(venda.data + 'T00:00:00');
            
            // Alterado para mostrar apenas os dados disponíveis: id, data e valor
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
// ==============================================

// Submeter o formulário de uma nova venda
vendaForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const dataInput = document.getElementById("data").value.split('/');
    const dataFormatada = `${dataInput[2]}-${dataInput[1]}-${dataInput[0]}`;
    const vendaData = {
        carro: { id: parseInt(document.getElementById("carroId").value) },
        cliente: { id: parseInt(document.getElementById("clienteId").value) },
        vendedor: { id: parseInt(document.getElementById("vendedorId").value) },
        data: dataFormatada,
        valor: parseFloat(valorMask.unmaskedValue)
    };

    try {
        const res = await fetch(API_VENDAS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(vendaData)
        });
        if (!res.ok) throw new Error("Erro ao registar venda. Verifique se o carro já foi vendido.");
        
        formSection.style.display = 'none';
        carroDetalhesContainer.style.display = 'none';
        instructionMessage.style.display = 'block';

        listarVendas();
        alert("Venda registada com sucesso!");
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
});

// Carrega o contexto da página
async function carregarContextoDeVenda() {
    const params = new URLSearchParams(window.location.search);
    const carroId = params.get('carroId');

    if (carroId) {
        instructionMessage.style.display = 'none';
        carroDetalhesContainer.style.display = 'flex';
        formSection.style.display = 'block';

        try {
            const res = await fetch(`${API_CARROS}/${carroId}`);
            const carro = await res.json();
            const imagemSrc = carro.imagemUrl ? `${IMG_BASE_URL}${carro.imagemUrl}` : 'images/default.jpg';
            carroDetalhesContainer.innerHTML = `
                <img src="${imagemSrc}" alt="${carro.modelo}">
                <div>
                    <h3>Carro Selecionado</h3>
                    <p>${carro.marca} ${carro.modelo} (${carro.ano})</p>
                    <p class="preco">Valor: R$ ${carro.preco.toFixed(2).replace('.', ',')}</p>
                </div>
            `;
            const carroSelect = document.getElementById('carroId');
            carroSelect.innerHTML = `<option value="${carro.id}">${carro.modelo}</option>`;
            carroSelect.value = carro.id;
            if (valorMask) {
                valorMask.value = carro.preco.toString();
            }
        } catch (err) {
            console.error("Erro ao carregar detalhes do carro:", err);
            carroDetalhesContainer.innerHTML = `<p>Erro ao carregar detalhes.</p>`;
        }
    } else {
        instructionMessage.style.display = 'block';
        carroDetalhesContainer.style.display = 'none';
        formSection.style.display = 'none';
    }
}

// Inicialização da página
window.addEventListener("DOMContentLoaded", () => {
    preencherSelect(API_CLIENTES, "clienteId", "nome");
    preencherSelect(API_VENDEDORES, "vendedorId", "nome");
    
    listarVendas();
    carregarContextoDeVenda();
});

