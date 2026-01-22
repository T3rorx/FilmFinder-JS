// Variables globales
let currentPage = 1;
let totalResults = 0;
let isLoading = false;
let currentSearch = '';
let displayedMovieIds = new Set(); // Pour éviter les doublons
let currentFilter = 'all'; // Filtre actif

// Vérifier que les variables de config sont définies
if (typeof API_KEY === 'undefined' || typeof API_URL === 'undefined') {
    console.error('ERREUR: Les variables API_KEY et API_URL doivent être définies dans config.js');
    document.addEventListener('DOMContentLoaded', () => {
        showError('Erreur de configuration : vérifiez que config.js est chargé correctement');
    });
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    console.log('Application initialisée');
    initializeApp();
    setupModal();
});

// Initialisation de l'application
function initializeApp() {
    const searchForm = document.getElementById('searchForm');
    if (!searchForm) {
        console.error('ERREUR: Le formulaire de recherche est introuvable');
        return;
    }
    searchForm.addEventListener('submit', handleSearch);
    setupFilters();
    console.log('Formulaire de recherche initialisé');
}

// Configuration des filtres
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            // Retirer la classe active de tous les boutons
            filterButtons.forEach(b => b.classList.remove('active'));

            // Ajouter la classe active au bouton cliqué
            btn.classList.add('active');

            // Définir le filtre actif
            currentFilter = btn.dataset.filter;

            // Appliquer le filtre
            applyFilter(currentFilter);
        });
    });
}

// Appliquer le filtre aux résultats
function applyFilter(filter) {
    const filmCards = document.querySelectorAll('.film-card');

    filmCards.forEach(card => {
        const filmType = card.dataset.filmType ? card.dataset.filmType.toLowerCase() : '';

        if (filter === 'all') {
            card.style.display = '';
            card.classList.remove('filtered-out');
        } else if (filmType === filter || filmType === filter + 's') {
            card.style.display = '';
            card.classList.remove('filtered-out');
        } else {
            card.style.display = 'none';
            card.classList.add('filtered-out');
        }
    });

    // Afficher un message si aucun résultat après filtrage
    const visibleCards = Array.from(filmCards).filter(card => card.style.display !== 'none');
    if (visibleCards.length === 0 && filmCards.length > 0) {
        showNoResultsForFilter();
    } else {
        hideNoResultsForFilter();
    }
}

function showNoResultsForFilter() {
    const noResults = document.getElementById('noResults');
    if (noResults) {
        const filterLabels = {
            'all': 'ce filtre',
            'movie': 'les films',
            'series': 'les séries'
        };
        const filterLabel = filterLabels[currentFilter] || 'ce filtre';
        noResults.innerHTML = `
            <div class="text-gray-400 text-xl">
                <i class="fas fa-filter text-6xl mb-4 opacity-50"></i>
                <p>Aucun résultat pour ${filterLabel}.</p>
            </div>
        `;
        noResults.classList.remove('hidden');
    }
}

function hideNoResultsForFilter() {
    const noResults = document.getElementById('noResults');
    if (noResults && !noResults.querySelector('.fas.fa-search')) {
        noResults.classList.add('hidden');
    }
}

// Configuration de la modal
function setupModal() {
    const modal = document.getElementById('filmModal');
    const closeModal = document.getElementById('closeModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalOverlay = document.getElementById('modalOverlay');

    const hideModal = () => {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    };

    const showModal = () => {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };

    if (closeModal) {
        closeModal.addEventListener('click', hideModal);
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', hideModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', hideModal);
    }

    // Fermer avec Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            hideModal();
        }
    });

    // Exposer les fonctions globalement
    window.showModal = showModal;
    window.hideModal = hideModal;
}

// Gestion de la recherche
async function handleSearch(e) {
    e.preventDefault();

    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();

    if (!query) {
        showError('Veuillez entrer un terme de recherche');
        return;
    }

    // Vérifier que la clé API est configurée
    if (API_KEY === 'VOTRE_CLE_API') {
        showError('Veuillez configurer votre clé API dans le fichier config.js');
        return;
    }

    currentSearch = query;
    currentPage = 1;
    displayedMovieIds.clear(); // Réinitialiser les IDs affichés

    // Réinitialiser les résultats
    clearResults();
    showLoading(true);

    try {
        await fetchAndDisplayMovies(query, currentPage);
    } catch (error) {
        showError('Une erreur est survenue lors de la recherche : ' + error.message);
    } finally {
        showLoading(false);
    }
}

// Récupération des films depuis l'API
async function fetchMovies(query, page = 1) {
    const url = `${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}`;

    console.log('URL de recherche:', url);

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();

    console.log('Réponse API complète:', data);

    if (data.Response === 'False') {
        throw new Error(data.Error || 'Erreur inconnue');
    }

    if (!data.Search || !Array.isArray(data.Search)) {
        console.error('Format de réponse inattendu:', data);
        throw new Error('Format de réponse inattendu de l\'API');
    }

    console.log(`Nombre de résultats trouvés: ${data.Search.length}`);

    return data;
}

// Récupération des détails d'un film
async function fetchMovieDetails(imdbID) {
    const url = `${API_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();

    if (data.Response === 'False') {
        throw new Error(data.Error || 'Erreur inconnue');
    }

    return data;
}

// Affichage des films
async function fetchAndDisplayMovies(query, page) {
    try {
        const data = await fetchMovies(query, page);

        totalResults = parseInt(data.totalResults) || 0;

        if (!data.Search || data.Search.length === 0) {
            showNoResults();
            return;
        }

        const resultsContainer = document.getElementById('resultsContainer');
        if (!resultsContainer) {
            throw new Error('Le conteneur de résultats est introuvable dans le DOM');
        }

        console.log(`Affichage de ${data.Search.length} films`);

        // Filtrer les doublons et afficher seulement les nouveaux films
        const newFilms = data.Search.filter(film => {
            if (displayedMovieIds.has(film.imdbID)) {
                console.log(`Film dupliqué ignoré: ${film.Title} (${film.imdbID})`);
                return false;
            }
            displayedMovieIds.add(film.imdbID);
            return true;
        });

        console.log(`${newFilms.length} nouveaux films à afficher (${data.Search.length - newFilms.length} doublons ignorés)`);

        // Afficher les filtres après la première recherche
        if (currentPage === 1 && newFilms.length > 0) {
            const filtersContainer = document.getElementById('filtersContainer');
            if (filtersContainer) {
                filtersContainer.classList.remove('hidden');
            }
        }

        newFilms.forEach((film, index) => {
            const filmCard = createFilmCard(film, index);
            resultsContainer.appendChild(filmCard);
            // AOS gère automatiquement les animations
        });

        // Réappliquer le filtre actif
        if (currentFilter !== 'all') {
            applyFilter(currentFilter);
        }

        if (data.Search.length === 10 && currentPage * 10 < totalResults) {
            setupInfiniteScroll();
        }

    } catch (error) {
        console.error('Erreur lors de l\'affichage des films:', error);
        showError(error.message);
    }
}

// Création d'une carte film avec glassmorphisme et AOS
function createFilmCard(film, index = 0) {
    const cardWrapper = document.createElement('div');
    cardWrapper.className = 'film-card';
    cardWrapper.dataset.filmType = film.Type || '';
    cardWrapper.dataset.imdbId = film.imdbID;

    // Configuration AOS avec effet flip-down et délai progressif
    cardWrapper.setAttribute('data-aos', 'flip-down');
    cardWrapper.setAttribute('data-aos-duration', '800');
    cardWrapper.setAttribute('data-aos-easing', 'ease-out-cubic');
    cardWrapper.setAttribute('data-aos-delay', (index % 3) * 100); // Délai progressif par ligne (max 3)

    // Image par défaut en SVG base64 pour éviter les problèmes de chargement
    const defaultImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgZmlsbD0iIzFmMjkzNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';

    const poster = (film.Poster && film.Poster !== 'N/A' && film.Poster.trim() !== '')
        ? film.Poster
        : defaultImage;

    // Traduction des types
    const typeTranslations = {
        'movie': 'Film',
        'series': 'Série',
        'episode': 'Épisode'
    };
    const typeLabel = film.Type ? (typeTranslations[film.Type.toLowerCase()] || film.Type) : '';
    const typeBadge = typeLabel
        ? `<span class="inline-block px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-xl bg-[#845EC2]/30 text-[#E9EEF5] border border-[#845EC2]/40 ml-2 shadow-lg">${typeLabel}</span>`
        : '';

    cardWrapper.innerHTML = `
        <div class="backdrop-blur-2xl bg-gradient-to-br from-[#151A21]/50 to-[#0C1120]/60 border border-[#845EC2]/20 rounded-2xl overflow-hidden shadow-2xl hover:shadow-[#845EC2]/30 hover:border-[#845EC2]/40 transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col group relative">
            <div class="absolute inset-0 bg-gradient-to-r from-[#845EC2]/5 via-transparent to-[#40E0FF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="relative overflow-hidden bg-gradient-to-br from-[#1E1E1E]/60 to-[#0C1120]/80">
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                <img
                    src="${poster}"
                    class="w-full h-80 object-contain transition-transform duration-500 group-hover:scale-105 film-poster"
                    alt="${film.Title}"
                    loading="lazy"
                    data-src="${poster}"
                    onerror="handleImageError(this)"
                    onload="handleImageLoad(this)"
                >
                <div class="absolute inset-0 backdrop-blur-sm bg-[#0C1120]/60 flex items-center justify-center film-placeholder hidden z-20">
                    <div class="text-center text-[#7A7A7A]">
                        <i class="fas fa-image text-4xl mb-2"></i>
                        <p class="text-sm">Aucune Image</p>
                    </div>
                </div>
            </div>
            <div class="p-5 flex flex-col flex-grow backdrop-blur-xl bg-[#151A21]/40 relative z-10">
                <h3 class="text-lg font-bold text-[#E9EEF5] mb-3 line-clamp-2 min-h-[3.5rem] drop-shadow-lg">${film.Title}</h3>
                <div class="flex items-center text-[#B0B0B0] text-sm mb-4">
                    <i class="fas fa-calendar-alt mr-2 text-[#40E0FF]"></i>
                    <span>${film.Year}</span>
                    ${typeBadge}
                </div>
                <button
                    class="mt-auto w-full px-4 py-3 backdrop-blur-xl bg-gradient-to-r from-[#40E0FF]/90 to-[#22C55E]/90 hover:from-[#40E0FF] hover:to-[#22C55E] text-[#0C1120] font-semibold rounded-xl transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#40E0FF]/50 border border-[#40E0FF]/30 shadow-lg hover:shadow-[#40E0FF]/50 read-more-btn"
                    data-imdb-id="${film.imdbID}"
                >
                    <i class="fas fa-info-circle mr-2"></i>En savoir plus
                </button>
            </div>
        </div>
    `;

    const readMoreBtn = cardWrapper.querySelector('.read-more-btn');
    readMoreBtn.addEventListener('click', () => handleReadMore(film.imdbID));

    return cardWrapper;
}

// Gestion du clic sur "En savoir plus"
async function handleReadMore(imdbID) {
    const modalBody = document.getElementById('modalBody');
    const modalLabel = document.getElementById('filmModalLabel');

    if (window.showModal) {
        window.showModal();
    }

    modalBody.innerHTML = `
        <div class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
    `;

    try {
        const filmDetails = await fetchMovieDetails(imdbID);

        const defaultImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgZmlsbD0iIzFmMjkzNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';

        const poster = (filmDetails.Poster && filmDetails.Poster !== 'N/A' && filmDetails.Poster.trim() !== '')
            ? filmDetails.Poster
            : defaultImage;

        const rating = filmDetails.imdbRating ? parseFloat(filmDetails.imdbRating) : 0;
        const stars = '★'.repeat(Math.round(rating));

        modalLabel.textContent = filmDetails.Title;

        modalBody.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="md:col-span-1">
                    <img
                        src="${poster}"
                        class="w-full rounded-lg shadow-xl"
                        alt="${filmDetails.Title}"
                        onerror="this.onerror=null; this.src='${defaultImage}'"
                    >
                </div>
                <div class="md:col-span-2">
                    <h4 class="text-2xl font-bold text-white mb-4">${filmDetails.Title}</h4>
                    <div class="space-y-2 text-gray-300">
                        <p><span class="font-semibold text-purple-400">Année:</span> ${filmDetails.Year || 'Non disponible'}</p>
                        <p><span class="font-semibold text-purple-400">Genre:</span> ${filmDetails.Genre || 'Non disponible'}</p>
                        <p><span class="font-semibold text-purple-400">Réalisateur:</span> ${filmDetails.Director || 'Non disponible'}</p>
                        <p><span class="font-semibold text-purple-400">Acteurs:</span> ${filmDetails.Actors || 'Non disponible'}</p>
                        <p><span class="font-semibold text-purple-400">Durée:</span> ${filmDetails.Runtime || 'Non disponible'}</p>
                        <p class="flex items-center">
                            <span class="font-semibold text-purple-400 mr-2">Note IMDb:</span>
                            ${filmDetails.imdbRating || 'Non disponible'}
                            ${rating > 0 ? `<span class="text-yellow-400 ml-2">${stars}</span>` : ''}
                        </p>
                    </div>
                    <hr class="my-4 border-gray-700">
                    <div class="mt-4">
                        <h5 class="text-xl font-semibold text-purple-400 mb-2">Synopsis</h5>
                        <p class="text-gray-300 leading-relaxed">
                            ${filmDetails.Plot && filmDetails.Plot !== 'N/A' ? filmDetails.Plot : 'Aucun synopsis disponible.'}
                        </p>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        modalBody.innerHTML = `
            <div class="p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
                Erreur lors du chargement des détails : ${error.message}
            </div>
        `;
    }
}

// Note: Les animations sont maintenant gérées par AOS (Animate On Scroll)
// L'Intersection Observer personnalisé a été remplacé par AOS pour simplifier le code
// et offrir plus d'effets d'animation disponibles.

// Infinite scroll pour charger plus de résultats
function setupInfiniteScroll() {
    if (isLoading) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isLoading) {
                loadMoreMovies();
            }
        });
    }, {
        rootMargin: '100px'
    });

    const resultsContainer = document.getElementById('resultsContainer');
    const lastCard = resultsContainer.lastElementChild;
    if (lastCard) {
        observer.observe(lastCard);
    }
}

// Charger plus de films
async function loadMoreMovies() {
    if (isLoading || currentPage * 10 >= totalResults) return;

    isLoading = true;
    currentPage++;

    try {
        await fetchAndDisplayMovies(currentSearch, currentPage);
    } catch (error) {
        console.error('Erreur lors du chargement de plus de films:', error);
    } finally {
        isLoading = false;
    }
}

// Fonctions utilitaires
// Gestion des erreurs d'images
window.handleImageError = function(img) {
    const placeholder = img.parentElement.querySelector('.film-placeholder');
    if (placeholder) {
        placeholder.classList.remove('hidden');
    }
    img.style.display = 'none';

    // Essayer avec une image de secours
    const defaultImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgZmlsbD0iIzFmMjkzNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
    if (img.src !== defaultImage) {
        img.src = defaultImage;
    }
};

window.handleImageLoad = function(img) {
    const placeholder = img.parentElement.querySelector('.film-placeholder');
    if (placeholder) {
        placeholder.classList.add('hidden');
    }
    img.style.display = 'block';
};

// Fonctions utilitaires
function clearResults() {
    const resultsContainer = document.getElementById('resultsContainer');
    if (resultsContainer) {
        resultsContainer.innerHTML = '';
    }
    displayedMovieIds.clear(); // Réinitialiser les IDs
    currentFilter = 'all'; // Réinitialiser le filtre
    hideError();
    hideNoResults();

    // Réinitialiser les boutons de filtre
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(b => b.classList.remove('active'));
    const allFilter = document.querySelector('[data-filter="all"]');
    if (allFilter) {
        allFilter.classList.add('active');
    }

    // Masquer les filtres
    const filtersContainer = document.getElementById('filtersContainer');
    if (filtersContainer) {
        filtersContainer.classList.add('hidden');
    }
}

function showLoading(show) {
    const loading = document.getElementById('loading');
    if (!loading) {
        console.error('Élément loading introuvable');
        return;
    }
    if (show) {
        loading.classList.remove('hidden');
    } else {
        loading.classList.add('hidden');
    }
}

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    if (!errorMessage) {
        console.error('Erreur (élément non trouvé):', message);
        return;
    }
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    console.error('Erreur affichée:', message);
}

function hideError() {
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
        errorMessage.classList.add('hidden');
    }
}

function showNoResults() {
    const noResults = document.getElementById('noResults');
    if (noResults) {
        noResults.classList.remove('hidden');
    }
}

function hideNoResults() {
    const noResults = document.getElementById('noResults');
    if (noResults) {
        noResults.classList.add('hidden');
    }
}
