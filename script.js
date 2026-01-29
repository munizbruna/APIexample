 // 1. Estado Global da Aplicação
        let allProducts = []; // Armazena a lista original intacta
        let currentCategory = 'all'; // Categoria ativa

        // 2. Seleção de Elementos
        const btnCarregar = document.getElementById('btnCarregar');
        const productsGrid = document.getElementById('productsGrid');
        const loadingDiv = document.getElementById('loading');
        const errorDiv = document.getElementById('error');
        const controlsDiv = document.getElementById('controls');
        const searchInput = document.getElementById('searchInput');
        const sortSelect = document.getElementById('sortSelect');
        const categoryFilters = document.getElementById('categoryFilters');
        
        // Elementos do Modal
        const modalBackdrop = document.getElementById('modalBackdrop');
        const modalContent = document.getElementById('modalContent');

        // URL da API
        const API_URL = 'https://fakestoreapi.com/products';

        // 3. Event Listeners
        btnCarregar.addEventListener('click', fetchProducts);
        
        // Interatividade em tempo real
        searchInput.addEventListener('input', applyFilters);
        sortSelect.addEventListener('change', applyFilters);
        
        // Fechar modal ao clicar fora
        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) closeModal();
        });

        // 4. Lógica de Busca (API)
        async function fetchProducts() {
            showLoadingState();

            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error(`Erro: ${response.status}`);
                
                // Salva os dados na variável global
                allProducts = await response.json();
                
                // Configura a UI pós-carregamento
                setupCategories(allProducts);
                renderProducts(allProducts);
                
                // Exibe os controles e esconde o botão de carregar inicial
                controlsDiv.classList.remove('hidden');
                btnCarregar.classList.add('hidden'); // Opcional: esconder botão após carregar

            } catch (error) {
                showErrorState(error.message);
            } finally {
                loadingDiv.classList.add('hidden');
            }
        }

        // 5. Configuração de Categorias
        function setupCategories(products) {
            // Extrai categorias únicas usando Set
            const categories = ['all', ...new Set(products.map(p => p.category))];
            
            categoryFilters.innerHTML = categories.map(cat => `
                <button 
                    onclick="filterByCategory('${cat}')"
                    class="category-btn px-4 py-1 rounded-full text-sm font-medium border border-gray-300 hover:bg-gray-100 transition-colors capitalize ${cat === 'all' ? 'active' : 'bg-white text-gray-600'}"
                    data-category="${cat}">
                    ${cat === 'all' ? 'Todos' : cat}
                </button>
            `).join('');
        }

        // 6. Lógica de Filtragem e Ordenação
        window.filterByCategory = (category) => {
            currentCategory = category;
            
            // Atualiza visual dos botões
            document.querySelectorAll('.category-btn').forEach(btn => {
                if(btn.dataset.category === category) {
                    btn.classList.add('active');
                    btn.classList.remove('bg-white', 'text-gray-600');
                } else {
                    btn.classList.remove('active');
                    btn.classList.add('bg-white', 'text-gray-600');
                }
            });

            applyFilters();
        };

        function applyFilters() {
            const searchTerm = searchInput.value.toLowerCase();
            const sortValue = sortSelect.value;

            // 1. Filtrar
            let filtered = allProducts.filter(product => {
                const matchesSearch = product.title.toLowerCase().includes(searchTerm);
                const matchesCategory = currentCategory === 'all' || product.category === currentCategory;
                return matchesSearch && matchesCategory;
            });

            // 2. Ordenar
            if (sortValue === 'price-asc') {
                filtered.sort((a, b) => a.price - b.price);
            } else if (sortValue === 'price-desc') {
                filtered.sort((a, b) => b.price - a.price);
            } else if (sortValue === 'title-asc') {
                filtered.sort((a, b) => a.title.localeCompare(b.title));
            }

            renderProducts(filtered);
        }

        // 7. Renderização
        function renderProducts(products) {
            productsGrid.innerHTML = '';

            if (products.length === 0) {
                productsGrid.innerHTML = `
                    <div class="col-span-full text-center py-10 text-gray-500">
                        Nenhum produto encontrado.
                    </div>`;
                return;
            }

            products.forEach(product => {
                const cardHTML = `
                    <div class="card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100 group">
                        <div class="bg-white p-6 flex items-center justify-center relative overflow-hidden">
                            <img src="${product.image}" alt="${product.title}" class="card-image">
                        </div>
                        <div class="p-4 flex-grow flex flex-col justify-between">
                            <div>
                                <span class="text-xs font-bold tracking-wide uppercase text-gray-400 mb-1 block">
                                    ${product.category}
                                </span>
                                <h3 class="font-bold text-gray-800 text-sm mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors" title="${product.title}">
                                    ${product.title}
                                </h3>
                                <div class="flex items-center mb-2">
                                    <span class="text-yellow-400 text-sm">★</span>
                                    <span class="text-gray-500 text-xs ml-1">${product.rating.rate} (${product.rating.count})</span>
                                </div>
                            </div>
                            <div class="mt-3 flex items-center justify-between border-t pt-3">
                                <span class="text-lg font-bold text-gray-900">$ ${product.price.toFixed(2)}</span>
                                <button onclick="openModal(${product.id})" class="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-100 font-medium transition-colors">
                                    Ver Detalhes
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                productsGrid.innerHTML += cardHTML;
            });
        }

        // 8. Lógica do Modal
        window.openModal = (id) => {
            const product = allProducts.find(p => p.id === id);
            if (!product) return;

            modalContent.innerHTML = `
                <div class="flex flex-col md:flex-row h-full max-h-[80vh]">
                    <div class="md:w-1/2 p-8 flex items-center justify-center bg-gray-50">
                        <img src="${product.image}" class="max-h-64 md:max-h-80 object-contain mix-blend-multiply">
                    </div>
                    <div class="md:w-1/2 p-8 flex flex-col overflow-y-auto">
                        <div class="flex justify-between items-start mb-4">
                            <span class="text-xs font-bold uppercase text-blue-600 bg-blue-50 px-2 py-1 rounded">${product.category}</span>
                            <button onclick="closeModal()" class="text-gray-400 hover:text-red-500 transition-colors text-2xl leading-none">&times;</button>
                        </div>
                        <h2 class="text-2xl font-bold text-gray-900 mb-4">${product.title}</h2>
                        <p class="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">${product.description}</p>
                        <div class="mt-auto border-t pt-6 flex items-center justify-between">
                            <div>
                                <p class="text-sm text-gray-500">Preço</p>
                                <p class="text-3xl font-bold text-gray-900">$ ${product.price.toFixed(2)}</p>
                            </div>
                            <button class="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg transform active:scale-95">
                                Comprar Agora
                            </button>
                        </div>
                    </div>
                </div>
            `;

            modalBackdrop.classList.remove('hidden');
            // Timeout pequeno para permitir a transição CSS
            setTimeout(() => {
                modalBackdrop.classList.remove('opacity-0');
                document.getElementById('modalContent').classList.remove('scale-95');
                document.getElementById('modalContent').classList.add('scale-100');
            }, 10);
        };

        window.closeModal = () => {
            modalBackdrop.classList.add('opacity-0');
            document.getElementById('modalContent').classList.remove('scale-100');
            document.getElementById('modalContent').classList.add('scale-95');
            
            setTimeout(() => {
                modalBackdrop.classList.add('hidden');
            }, 300);
        };

        // Funções de UI
        function showLoadingState() {
            loadingDiv.classList.remove('hidden');
            errorDiv.classList.add('hidden');
            productsGrid.innerHTML = '';
        }

        function showErrorState(msg) {
            errorDiv.classList.remove('hidden');
            errorMessage.textContent = msg;
            productsGrid.innerHTML = '';
        }
