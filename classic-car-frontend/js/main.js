// constantes que guardam os enderecos da api para buscar os carros e as  imagens.
const API_URL = "http://localhost:8080/carros";
const IMG_BASE_URL = "http://localhost:8080/images/";

// seleciona o elemento html onde os cards dos carros da pagina principal serao inseridos.
const vitrineContainer = document.getElementById("home-vitrine");

// --- funcoes principais ---

// funcao assincrona para carregar e exibir os carros na vitrine da pagina principal.
async function carregarCarrosHome() {
    try {
        // faz a requisicao http get para a api de carros.
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erro ao buscar os carros');
        // converte a resposta para um objeto json.
        const carros = await response.json();

        vitrineContainer.innerHTML = ""; // limpa o conteudo atual do container.

        // usa o metodo 'filter' para criar uma nova lista contendo apenas os carros com status "a_venda".
        const carrosAVenda = carros.filter(carro => carro.status === 'A_VENDA');

        // se a lista de carros a venda estiver vazia, exibe uma mensagem.
        if (carrosAVenda.length === 0) {
            vitrineContainer.innerHTML = "<p>Nenhum carro à venda no momento.</p>";
            return;
        }

        // percorre a lista de carros filtrada.
        carrosAVenda.forEach(carro => {
            // para cada carro, cria um novo elemento 'div' para ser o card.
            const card = document.createElement("div");
            card.className = "carro-card";

            // constroi a url da imagem. se nao houver, usa uma imagem padrao.
            const imagemSrc = carro.imagemUrl ? `${IMG_BASE_URL}${carro.imagemUrl}` : 'https://placehold.co/400x250?text=Sem+Foto';
            // formata o preco para o padrao brasileiro (ex: 150000.00 -> 150.000,00).
            const precoFormatado = carro.preco ? carro.preco.toFixed(2).replace('.', ',') : "Consulte";

            // preenche o card com o html e os dados do carro.
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
            // adiciona o card preenchido ao container da vitrine.
            vitrineContainer.appendChild(card);
        });
    } catch (error) {
        console.error("Erro ao carregar carros da vitrine:", error);
        vitrineContainer.innerHTML = "<p>Não foi possível carregar os carros. Tente novamente mais tarde.</p>";
    }
}

// funcao chamada pelo botao "mais detalhes" de cada card.
function verDetalhes(id) {
    // redireciona o utilizador para a pagina de vendas, passando o id do carro como um parametro na url.
    window.location.href = `vendas.html?carroId=${id}`;
}

// --- inicializacao ---

// adiciona um "escutador" que espera o html ser completamente carregado para entao chamar a funcao principal.
document.addEventListener("DOMContentLoaded", carregarCarrosHome);

