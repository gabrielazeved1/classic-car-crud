const vendaForm = document.getElementById('vendaForm');
const vendasList = document.getElementById('vendasList');

const API_VENDAS = 'http://localhost:8080/vendas';
const API_CARROS = 'http://localhost:8080/carros';
const API_CLIENTES = 'http://localhost:8080/clientes';
const API_VENDEDORES = 'http://localhost:8080/vendedores';

const urlParams = new URLSearchParams(window.location.search);
const carroIdSelecionado = urlParams.get('carroId');

// Carregar selects de carros, clientes e vendedores
async function carregarSelects() {
    // Carros
    const carroSelect = document.getElementById('carroId');
    carroSelect.innerHTML = '';
    const carros = await (await fetch(API_CARROS)).json();
    carros.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = `${c.marca} ${c.modelo} (${c.ano})`;
        carroSelect.appendChild(opt);
    });
    if (carroIdSelecionado) {
        carroSelect.value = carroIdSelecionado;
        carroSelect.disabled = true;
    }

    // Clientes
    const clienteSelect = document.getElementById('clienteId');
    clienteSelect.innerHTML = '';
    const clientes = await (await fetch(API_CLIENTES)).json();
    clientes.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.nome;
        clienteSelect.appendChild(opt);
    });

    // Vendedores
    const vendedorSelect = document.getElementById('vendedorId');
    vendedorSelect.innerHTML = '';
    const vendedores = await (await fetch(API_VENDEDORES)).json();
    vendedores.forEach(v => {
        const opt = document.createElement('option');
        opt.value = v.id;
        opt.textContent = v.nome;
        vendedorSelect.appendChild(opt);
    });
}

// Listar vendas apenas com id, data e valor
async function listarVendas() {
    vendasList.innerHTML = '';
    try {
        const vendas = await (await fetch(API_VENDAS)).json();
        vendas.forEach(venda => {
            const li = document.createElement('li');
            li.textContent = `ID: ${venda.id} | Data: ${venda.data} | Valor: R$ ${venda.valor.toFixed(2)}`;
            vendasList.appendChild(li);
        });
    } catch (error) {
        console.error('Erro ao buscar vendas:', error);
    }
}

// Registrar venda
vendaForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const vendaData = {
        carro: { id: parseInt(document.getElementById('carroId').value) },
        cliente: { id: parseInt(document.getElementById('clienteId').value) },
        vendedor: { id: parseInt(document.getElementById('vendedorId').value) },
        data: document.getElementById('data').value,
        valor: parseFloat(document.getElementById('valor').value)
    };

    try {
        const res = await fetch(API_VENDAS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vendaData)
        });
        if (!res.ok) throw new Error('Erro ao registrar venda');

        vendaForm.reset();
        if (carroIdSelecionado) {
            document.getElementById('carroId').value = carroIdSelecionado;
            document.getElementById('carroId').disabled = true;
        }

        listarVendas();
        alert('Venda registrada com sucesso!');
    } catch (error) {
        console.error(error);
        alert('Erro ao registrar venda');
    }
});

// Inicializar selects e listar vendas
carregarSelects();
listarVendas();
