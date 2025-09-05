// URL base da API e para as imagens
const API_URL = "http://localhost:8080/carros";
const IMG_BASE_URL = "http://localhost:8080/images/";

// Elemento do DOM onde os cards serão inseridos
const vitrineContainer = document.getElementById("carros-vitrine");

// Função para carregar e exibir os carros na vitrine
async function carregarCarrosVitrine() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erro ao buscar os carros');
        const carros = await response.json();

        vitrineContainer.innerHTML = ""; // Limpa o container

        // Filtra para mostrar apenas carros com status "A_VENDA"
        const carrosAVenda = carros.filter(carro => carro.status === 'A_VENDA');

        if (carrosAVenda.length === 0) {
            vitrineContainer.innerHTML = "<p>Nenhum carro à venda no momento.</p>";
            return;
        }

        carrosAVenda.forEach(carro => {
            const card = document.createElement("div");
            card.className = "carro-card";

            const imagemSrc = carro.imagemUrl ? `${IMG_BASE_URL}${carro.imagemUrl}` : 'https://placehold.co/400x250?text=Sem+Foto';
            const precoFormatado = carro.preco ? carro.preco.toFixed(2).replace('.', ',') : "Consulte";

            card.innerHTML = `
                <img src="${imagemSrc}" alt="${carro.marca} ${carro.modelo}">
                <div class="card-content">
                    <h3>${carro.marca} ${carro.modelo}</h3>
                    <p class="ano">${carro.ano}</p>
                    <p class="descricao">${carro.descricao || "Um clássico atemporal."}</p>
                    <p class="preco">R$ ${precoFormatado}</p>
                    <button onclick="verDetalhes(${carro.id})">Mais Detalhes</button>
                </div>
            `;
            vitrineContainer.appendChild(card);
        });
    } catch (error) {
        console.error("Erro ao carregar carros da vitrine:", error);
        vitrineContainer.innerHTML = "<p>Não foi possível carregar os carros. Tente novamente mais tarde.</p>";
    }
}

// Função placeholder para o botão "Mais Detalhes"
function verDetalhes(id) {
    // No futuro, isso pode levar a uma página de detalhes do carro
    // Por enquanto, podemos redirecionar para a página de vendas
    alert(`Redirecionando para a página de vendas do carro com ID: ${id}`);
    window.location.href = `vendas.html?carroId=${id}`;
}

// Carrega os carros assim que a página é aberta
document.addEventListener("DOMContentLoaded", carregarCarrosVitrine);
