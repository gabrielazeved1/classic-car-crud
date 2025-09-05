const API_VENDAS = "http://localhost:8080/vendas";
const API_CARROS = "http://localhost:8080/carros";
const API_CLIENTES = "http://localhost:8080/clientes";
const API_VENDEDORES = "http://localhost:8080/vendedores";
const IMG_BASE_URL = "http://localhost:8080/images/";

const vendaForm = document.getElementById('vendaForm');
const vendasContainer = document.getElementById('vendas-container');
const carroDetalhesContainer = document.getElementById('carro-selecionado-detalhes');

// === Lógica de Máscaras com IMask.js ===
let valorMask;
document.addEventListener('DOMContentLoaded', () => {
    // Máscara para Data (Configuração simplificada e corrigida)
    const dataInput = document.getElementById('data');
    if (dataInput) {
        IMask(dataInput, {
            mask: 'DD/MM/YYYY',
            blocks: {
                DD: {
                    mask: IMask.MaskedRange,
                    from: 1,
                    to: 31
                },
                MM: {
                    mask: IMask.MaskedRange,
                    from: 1,
                    to: 12
                },
                YYYY: {
                    mask: IMask.MaskedRange,
                    from: 1900,
                    to: new Date().getFullYear() + 5 // Permitir anos futuros
                }
            }
        });
    }

    // Máscara para Valor (Moeda)
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
// ======================================

// Preencher selects
async function carregarOpcoes() {
    await preencherSelect(API_CARROS, "carroId", "modelo");
    await preencherSelect(API_CLIENTES, "clienteId", "nome");
    await preencherSelect(API_VENDEDORES, "vendedorId", "nome");
}

async function preencherSelect(url, selectId, campoLabel) {
    try {
        const res = await fetch(url);
        const dados = await res.json();
        const select = document.getElementById(selectId);
        select.innerHTML = "<option value=''>Selecione...</option>";
        dados.forEach(d => {
            const option = document.createElement("option");
            option.value = d.id;
            option.textContent = d[campoLabel] || `ID ${d.id}`;
            select.appendChild(option);
        });
    } catch (err) {
        console.error(`Erro ao carregar ${selectId}:`, err);
    }
}

// Listar vendas
async function listarVendas() {
    vendasContainer.innerHTML = "";
    try {
        const res = await fetch(API_VENDAS);
        const vendas = await res.json();
        vendas.forEach(venda => {
            const card = document.createElement("div");
            card.className = "venda-card";
            card.innerHTML = `
                <h3>Venda #${venda.id}</h3>
                <p><b>Carro:</b> ${venda.carro.modelo}</p>
                <p><b>Cliente:</b> ${venda.cliente.nome}</p>
                <p><b>Data:</b> ${new Date(venda.data).toLocaleDateString('pt-BR')}</p>
                <p><b>Valor:</b> R$ ${venda.valor.toFixed(2).replace('.', ',')}</p>
            `;
            vendasContainer.appendChild(card);
        });
    } catch (err) {
        console.error("Erro ao buscar vendas:", err);
    }
}

// Registar venda
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
        
        vendaForm.reset();
        if (valorMask) valorMask.value = '';
        carroDetalhesContainer.style.display = 'none';

        listarVendas();
        alert("Venda registada com sucesso!");
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
});

// Carregar detalhes do carro se o ID for passado na URL
async function carregarDetalhesCarro() {
    const params = new URLSearchParams(window.location.search);
    const carroId = params.get('carroId');

    if (carroId) {
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
            carroDetalhesContainer.style.display = 'flex';

            document.getElementById('carroId').value = carro.id;
            if (valorMask) {
                valorMask.value = carro.preco.toString();
            }
        } catch (err) {
            console.error("Erro ao carregar detalhes do carro:", err);
            carroDetalhesContainer.innerHTML = `<p>Erro ao carregar detalhes do carro selecionado.</p>`;
            carroDetalhesContainer.style.display = 'block';
        }
    }
}

// Inicialização
window.addEventListener("DOMContentLoaded", () => {
    carregarOpcoes();
    listarVendas();
    carregarDetalhesCarro();
});

