// URL base da API e para as imagens servidas pelo backend
const API_URL = "http://localhost:8080/carros";
const IMG_BASE_URL = "http://localhost:8080/images/";

// Elementos do DOM
const carrosTable = document.getElementById("carrosTable");
const carroForm = document.getElementById("carroForm");
const cancelButton = document.getElementById("cancelButton");

// Função para carregar e exibir os carros na tabela
async function carregarCarros() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erro ao buscar os carros');
        const carros = await response.json();

        carrosTable.innerHTML = ""; // Limpa a tabela antes de preencher
        carros.forEach(carro => {
            const row = document.createElement("tr");

            // Define a URL da imagem. Se não houver, usa uma imagem padrão.
            const imagemSrc = carro.imagemUrl ? `${IMG_BASE_URL}${carro.imagemUrl}` : 'https://placehold.co/100x60?text=Sem+Foto';

            row.innerHTML = `
                <td>${carro.id}</td>
                <td><img src="${imagemSrc}" alt="${carro.modelo}" width="100" style="object-fit: cover; border-radius: 4px;"></td>
                <td>${carro.marca}</td>
                <td>${carro.modelo}</td>
                <td>${carro.ano}</td>
                <td>R$ ${carro.preco ? carro.preco.toFixed(2).replace('.', ',') : "0,00"}</td>
                <td>
                    <button class="edit-btn" onclick="prepararEdicao(${carro.id})">Editar</button>
                    <button class="delete-btn" onclick="deletarCarro(${carro.id})">Excluir</button>
                </td>
            `;
            carrosTable.appendChild(row);
        });
    } catch (error) {
        console.error("Erro ao carregar carros:", error);
        alert("Não foi possível carregar os carros.");
    }
}

// Event listener para o envio do formulário (criar ou atualizar)
carroForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("carroId").value;
    const imagemFile = document.getElementById("imagemFile").files[0];

    // 1. Cria o objeto com os dados do carro a partir do formulário
    const carroData = {
        marca: document.getElementById("marca").value,
        modelo: document.getElementById("modelo").value,
        ano: parseInt(document.getElementById("ano").value),
        preco: parseFloat(document.getElementById("preco").value),
        descricao: document.getElementById("descricao").value,
    };

    // 2. Usa FormData para empacotar os dados e o arquivo
    const formData = new FormData();
    // O backend espera uma parte 'carro' do tipo 'application/json'
    formData.append('carro', new Blob([JSON.stringify(carroData)], { type: 'application/json' }));

    // Adiciona o arquivo apenas se um foi selecionado
    if (imagemFile) {
        formData.append('file', imagemFile);
    }

    const url = id ? `${API_URL}/${id}` : API_URL;
    const method = id ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
            method: method,
            body: formData, // O navegador define o Content-Type como multipart/form-data automaticamente
        });

        if (!response.ok) throw new Error('Erro ao salvar o carro');

        resetarFormulario();
        carregarCarros();
    } catch (error) {
        console.error("Erro ao salvar carro:", error);
        alert("Não foi possível salvar o carro.");
    }
});

// Função para preencher o formulário para edição
async function prepararEdicao(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error('Carro não encontrado');
        const carro = await response.json();

        document.getElementById("carroId").value = carro.id;
        document.getElementById("marca").value = carro.marca;
        document.getElementById("modelo").value = carro.modelo;
        document.getElementById("ano").value = carro.ano;
        document.getElementById("preco").value = carro.preco;
        document.getElementById("descricao").value = carro.descricao;

        cancelButton.style.display = 'inline-block'; // Mostra o botão de cancelar
        window.scrollTo(0, 0); // Rola a página para o topo para ver o formulário
    } catch (error) {
        console.error("Erro ao preparar edição:", error);
        alert("Não foi possível carregar os dados do carro para edição.");
    }
}

// Função para deletar um carro
async function deletarCarro(id) {
    if (confirm("Tem certeza que deseja excluir este carro?")) {
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error('Erro ao deletar o carro');
            carregarCarros();
        } catch (error) {
            console.error("Erro ao deletar carro:", error);
            alert("Não foi possível deletar o carro.");
        }
    }
}

// Função para limpar e resetar o formulário
function resetarFormulario() {
    carroForm.reset();
    document.getElementById("carroId").value = '';
    cancelButton.style.display = 'none';
}

// Event listener para o botão de cancelar edição
cancelButton.addEventListener("click", resetarFormulario);

// Carrega os carros assim que a página é aberta
document.addEventListener("DOMContentLoaded", carregarCarros);
