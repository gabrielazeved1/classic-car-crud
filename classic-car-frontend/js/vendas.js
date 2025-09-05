const API_VENDAS = "http://localhost:8080/vendas";
const API_CARROS = "http://localhost:8080/carros";
const API_CLIENTES = "http://localhost:8080/clientes";
const API_VENDEDORES = "http://localhost:8080/vendedores";
const IMG_BASE_URL = "http://localhost:8080/images/";

const vendaForm = document.getElementById('vendaForm');
const vendasContainer = document.getElementById('vendas-container');
const carroSelecionadoContainer = document.getElementById('carro-selecionado-container');

// Função para preencher um select com opções da API
async function preencherSelect(url, selectId, campoLabel) {
    try {
        const res = await fetch(url);
        const dados = await res.json();
        const select = document.getElementById(selectId);
        select.innerHTML = "<option value=''>Selecione...</option>"; // Opção padrão
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

// Função para buscar e exibir os detalhes de um carro específico
async function carregarDetalhesCarro(carroId) {
    if (!carroId) {
        carroSelecionadoContainer.innerHTML = "<p>Nenhum carro selecionado. Escolha um na loja.</p>";
        return;
    }

    try {
        const response = await fetch(`${API_CARROS}/${carroId}`);
        const carro = await response.json();

        // Exibe os detalhes do carro na secção superior
        const imagemSrc = carro.imagemUrl ? `${IMG_BASE_URL}${carro.imagemUrl}` : 'https://placehold.co/400x250?text=Sem+Foto';
        const precoFormatado = carro.preco ? carro.preco.toFixed(2).replace('.', ',') : "0,00";

        carroSelecionadoContainer.innerHTML = `
            <h3>Carro Selecionado</h3>
            <div class="detalhes-content">
                <img src="${imagemSrc}" alt="${carro.modelo}">
                <div>
                    <h4>${carro.marca} ${carro.modelo}</h4>
                    <p>Ano: ${carro.ano}</p>
                    <p class="preco-detalhe">Preço: R$ ${precoFormatado}</p>
                </div>
            </div>
        `;

        // Preenche e desativa o select do carro
        const carroSelect = document.getElementById('carroId');
        carroSelect.innerHTML = `<option value="${carro.id}" selected>${carro.marca} ${carro.modelo}</option>`;
        carroSelect.disabled = true;

        // Preenche o campo de valor
        document.getElementById('valor').value = carro.preco.toFixed(2);

    } catch (error) {
        console.error("Erro ao carregar detalhes do carro:", error);
    }
}


// Função para listar o histórico de vendas
async function listarVendas() {
    vendasContainer.innerHTML = "";
    try {
        const res = await fetch(API_VENDAS);
        const vendas = await res.json();

        vendas.forEach(venda => {
            const card = document.createElement("div");
            card.className = "venda-card";
            const valorFormatado = venda.valor ? venda.valor.toFixed(2).replace('.', ',') : "0,00";
            
            // Adiciona fallback para dados que possam ser nulos
            const carroNome = venda.carro ? `${venda.carro.marca} ${venda.carro.modelo}` : "Carro não informado";
            const clienteNome = venda.cliente ? venda.cliente.nome : "Cliente não informado";

            card.innerHTML = `
                <h3>Venda #${venda.id}</h3>
                <p><b>Carro:</b> ${carroNome}</p>
                <p><b>Cliente:</b> ${clienteNome}</p>
                <p><b>Data:</b> ${new Date(venda.data).toLocaleDateString('pt-BR')}</p>
                <p><b>Valor:</b> R$ ${valorFormatado}</p>
            `;
            vendasContainer.appendChild(card);
        });
    } catch (err) {
        console.error("Erro ao buscar vendas:", err);
    }
}

// Evento de submissão do formulário de venda
vendaForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const vendaData = {
        carro: { id: parseInt(document.getElementById("carroId").value) },
        cliente: { id: parseInt(document.getElementById("clienteId").value) },
        vendedor: { id: parseInt(document.getElementById("vendedorId").value) },
        data: document.getElementById("data").value,
        valor: parseFloat(document.getElementById("valor").value)
    };

    try {
        const res = await fetch(API_VENDAS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(vendaData)
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Erro ao registar venda");
        }

        vendaForm.reset();
        document.getElementById('carroId').disabled = false; // Reabilita o select
        carroSelecionadoContainer.innerHTML = ""; // Limpa os detalhes do carro
        listarVendas();
        alert("Venda registada com sucesso!");
        window.location.href = 'index.html'; // Redireciona para a home

    } catch (err) {
        console.error(err);
        alert(`Erro ao registar venda: ${err.message}`);
    }
});

// Inicialização da página
document.addEventListener("DOMContentLoaded", () => {
    // Preenche os selects de cliente e vendedor
    preencherSelect(API_CLIENTES, "clienteId", "nome");
    preencherSelect(API_VENDEDORES, "vendedorId", "nome");
    listarVendas();

    // Verifica se há um ID de carro na URL
    const urlParams = new URLSearchParams(window.location.search);
    const carroId = urlParams.get('carroId');

    // Carrega os detalhes do carro se o ID existir
    carregarDetalhesCarro(carroId);
});
