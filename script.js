        // 1. Seleção de Elementos do DOM
        const btnCarregar = document.getElementById('btnCarregar');
        const productsGrid = document.getElementById('productsGrid');
        const loadingDiv = document.getElementById('loading');
        const errorDiv = document.getElementById('error');
        const errorMessage = document.getElementById('errorMessage');

        // URL da API (Endpoint)
        const API_URL = 'https://fakestoreapi.com/products';

        // 2. Adicionar evento de clique
        btnCarregar.addEventListener('click', fetchProducts);

        // 3. Função assíncrona para buscar os dados
        async function fetchProducts() {
            // Passo A: Resetar a interface (Mostrar loading, esconder grid e erros)
            showLoadingState();

            try {
                // Passo B: Fazer a requisição (GET)
                // 'await' pausa a execução até o servidor responder
                const response = await fetch(API_URL);

                // Passo C: Verificar se a resposta foi bem sucedida (Status 200-299)
                if (!response.ok) {
                    throw new Error(`Erro HTTP! Status: ${response.status}`);
                }

                // Passo D: Converter a resposta (texto) para JSON (objeto JavaScript)
                const data = await response.json();

                // Passo E: Renderizar os dados na tela
                renderProducts(data);

            } catch (error) {
                // Passo F: Tratamento de erros (ex: sem internet ou API fora do ar)
                showErrorState(error.message);
                console.error('Falha na requisição:', error);
            } finally {
                // Passo G: Esconder o loading independente do resultado
                loadingDiv.classList.add('hidden');
            }
        }

        // Função para criar o HTML de cada produto
        function renderProducts(products) {
            // Limpa o conteúdo atual
            productsGrid.innerHTML = '';

            // Itera sobre cada produto recebido
            products.forEach(product => {
                // Criação do Card usando Template Strings
                const cardHTML = `
                    <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full border border-gray-100">
                        <div class="bg-white p-4 flex items-center justify-center">
                            <img src="${product.image}" alt="${product.title}" class="card-image">
                        </div>
                        <div class="p-4 flex-grow flex flex-col justify-between">
                            <div>
                                <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded text-blue-600 bg-blue-100 mb-2">
                                    ${product.category}
                                </span>
                                <h3 class="font-bold text-gray-800 text-sm mb-2 line-clamp-2" title="${product.title}">
                                    ${product.title}
                                </h3>
                            </div>
                            <div class="mt-4 flex items-center justify-between border-t pt-3">
                                <span class="text-lg font-bold text-gray-900">$ ${product.price.toFixed(2)}</span>
                                <button onclick="alert('Produto ID ${product.id} adicionado!')" class="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                    Detalhes
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                
                // Adiciona o HTML ao grid
                productsGrid.innerHTML += cardHTML;
            });
        }

        // Funções auxiliares de UI (Interface do Usuário)
        function showLoadingState() {
            loadingDiv.classList.remove('hidden');
            errorDiv.classList.add('hidden');
            productsGrid.innerHTML = ''; // Limpa a tela
        }

        function showErrorState(msg) {
            errorDiv.classList.remove('hidden');
            errorMessage.textContent = msg;
            productsGrid.innerHTML = '<div class="col-span-full text-center text-gray-500">Tente novamente mais tarde.</div>';
        }
    
