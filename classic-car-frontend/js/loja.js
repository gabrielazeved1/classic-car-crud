// constantes que guardam os enderecos da api para buscar os carros e as imagens.
const API_URL = "http://localhost:8080/carros";
const IMG_BASE_URL = "http://localhost:8080/images/";

// seleciona o elemento html onde os cards dos carros serao inseridos.
const vitrineContainer = document.getElementById("carros-vitrine");

// --- funcoes principais ---

// funcao assincrona para carregar e exibir os carros na vitrine da loja.
async function carregarCarrosVitrine() {
    try {
        // faz a requisicao http get para a api de carros.
        const response = await fetch(API_URL);
        // verifica se a resposta foi bem-sucedida.
        if (!response.ok) throw new Error('Erro ao buscar os carros');
        // converte a resposta para json.
        const carros = await response.json();

        vitrineContainer.innerHTML = ""; // limpa o conteudo atual da vitrine.

        // filtra a lista de carros para mostrar apenas aqueles com o status "a_venda".
        const carrosAVenda = carros.filter(carro => carro.status === 'A_VENDA');

        // se nao houver carros a venda, exibe uma mensagem.
        if (carrosAVenda.length === 0) {
            vitrineContainer.innerHTML = "<p>Nenhum carro à venda no momento.</p>";
            return;
        }

        // percorre a lista de carros filtrada.
        carrosAVenda.forEach(carro => {
            // para cada carro, cria um novo elemento 'div' que sera o card.
            const card = document.createElement("div");
            card.className = "carro-card"; // atribui a classe css para o estilo.

            // constroi a url da imagem. se o carro nao tiver imagem, usa uma imagem padrao.
            const imagemSrc = carro.imagemUrl ? `${IMG_BASE_URL}${carro.imagemUrl}` : 'https://placehold.co/400x250?text=Sem+Foto';
            // formata o preco para o padrao brasileiro.
            const precoFormatado = carro.preco ? carro.preco.toFixed(2).replace('.', ',') : "Consulte";

            // preenche o conteudo do card com os dados do carro.
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
            // adiciona o novo card a vitrine.
            vitrineContainer.appendChild(card);
        });
    } catch (error) {
        console.error("Erro ao carregar carros da vitrine:", error);
        vitrineContainer.innerHTML = "<p>Não foi possível carregar os carros. Tente novamente mais tarde.</p>";
    }
}

// funcao chamada pelo botao "mais detalhes".
function verDetalhes(id) {
    // redireciona o utilizador para a pagina de vendas, passando o id do carro
    // como um parametro na url. isto permite que a pagina de vendas saiba qual carro foi escolhido.
    window.location.href = `vendas.html?carroId=${id}`;
}

// --- inicializacao ---

// 'domcontentloaded' garante que o html foi totalmente carregado antes de executar o script.
document.addEventListener("DOMContentLoaded", carregarCarrosVitrine);

