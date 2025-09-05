document.addEventListener("DOMContentLoaded", function() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        fetch('header.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                headerPlaceholder.innerHTML = data;
                // Adiciona a classe 'active' ao link da página atual
                const currentPage = window.location.pathname.split("/").pop() || 'index.html';
                const navLink = headerPlaceholder.querySelector(`nav a[href="${currentPage}"]`);
                if (navLink) {
                    navLink.classList.add('active');
                }
            })
            .catch(error => {
                console.error('Erro ao carregar o cabeçalho:', error);
                headerPlaceholder.innerHTML = "<p>Erro ao carregar o menu de navegação.</p>";
            });
    }
});
