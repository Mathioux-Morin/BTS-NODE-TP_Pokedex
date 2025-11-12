const API_URL = 'http://172.16.198.254:5001';

// Gestion des catégories principales (Pokémons / Items)
function showCategory(category) {
    // Masquer toutes les catégories
    document.querySelectorAll('.category-content').forEach(c => c.classList.remove('active'));
    // Désactiver les boutons de catégorie
    document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));

    // Afficher la catégorie sélectionnée et activer le premier onglet de cette catégorie
    if (category === 'pokemon') {
        const pokCat = document.getElementById('pokemon-category');
        if (pokCat) {
            pokCat.classList.add('active');
            const firstTab = pokCat.querySelector('.tab-btn');
            // Réinitialiser onglets internes
            pokCat.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            pokCat.querySelectorAll('.search-content').forEach(c => c.classList.remove('active'));
            if (firstTab) {
                firstTab.classList.add('active');
                const tabName = firstTab.dataset.tab;
                const tabEl = document.getElementById(tabName);
                if (tabEl) tabEl.classList.add('active');
            }
        }
        // activer le bouton catégorie correspondant (suppose ordre pokemon, items)
        const catBtns = document.querySelectorAll('.category-btn');
        if (catBtns[0]) catBtns[0].classList.add('active');
    } else if (category === 'items') {
        const itmCat = document.getElementById('items-category');
        if (itmCat) {
            itmCat.classList.add('active');
            const firstTab = itmCat.querySelector('.tab-btn');
            // Réinitialiser onglets internes
            itmCat.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            itmCat.querySelectorAll('.search-content').forEach(c => c.classList.remove('active'));
            if (firstTab) {
                firstTab.classList.add('active');
                const tabName = firstTab.dataset.tab;
                const tabEl = document.getElementById(tabName);
                if (tabEl) tabEl.classList.add('active');
            }
        }
        const catBtns = document.querySelectorAll('.category-btn');
        if (catBtns[1]) catBtns[1].classList.add('active');
    }
}

// Gestion des onglets avec les data-tab
document.addEventListener('DOMContentLoaded', () => {
    // Ajouter les event listeners aux boutons des onglets
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabName = e.target.getAttribute('data-tab');
            if (tabName) {
                // Déterminer si c'est un onglet pokemon ou item
                const isPokemon = e.target.closest('#pokemon-category');
                const isItem = e.target.closest('#items-category');
                
                if (isPokemon) {
                    document.querySelectorAll('#pokemon-category .tab-btn').forEach(b => b.classList.remove('active'));
                    document.querySelectorAll('#pokemon-category .search-content').forEach(c => c.classList.remove('active'));
                    e.target.classList.add('active');
                    const tab = document.getElementById(tabName);
                    if (tab) tab.classList.add('active');
                } else if (isItem) {
                    document.querySelectorAll('#items-category .tab-btn').forEach(b => b.classList.remove('active'));
                    document.querySelectorAll('#items-category .search-content').forEach(c => c.classList.remove('active'));
                    e.target.classList.add('active');
                    const tab = document.getElementById(tabName);
                    if (tab) tab.classList.add('active');
                }
            }
        });
    });
    
    // Gestion des touches Enter pour Pokémons
    const searchIdInput = document.getElementById('search-id');
    const searchNameInput = document.getElementById('search-name');
    const randomCountInput = document.getElementById('random-count');
    const searchTypeInput = document.getElementById('search-type');
    
    if (searchIdInput) searchIdInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchPokemonById();
    });
    
    if (searchNameInput) searchNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchPokemonByName();
    });
    
    if (randomCountInput) randomCountInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') getRandomPokemon();
    });
    
    if (searchTypeInput) searchTypeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchPokemonByType();
    });
    
    // Gestion des touches Enter pour Items
    const randomItemCountInput = document.getElementById('random-item-count');
    const searchItemIdInput = document.getElementById('search-item-id');
    const searchItemNameInput = document.getElementById('search-item');
    
    if (randomItemCountInput) randomItemCountInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') getRandomItems();
    });
    
    if (searchItemIdInput) searchItemIdInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchItemById();
    });
    
    if (searchItemNameInput) searchItemNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchItemByName();
    });
});

function showError(message) {
    const errorContainer = document.getElementById('error-container');
    errorContainer.innerHTML = `<div class="error">${message}</div>`;
    setTimeout(() => errorContainer.innerHTML = '', 5000);
}

function showLoading() {
    document.getElementById('results').innerHTML = '<div class="loading">Chargement...</div>';
}

function updateJsonLink(url) {
    const jsonLinkElement = document.querySelector('#json-link a');
    jsonLinkElement.href = url;
    jsonLinkElement.textContent = url;
}

function copierTexte() {
            // Copier le lien JSON affiché dans le conteneur
            const linkEl = document.querySelector('#json-link a');
            const texte = linkEl ? linkEl.textContent || linkEl.href : '';
            if (!texte) return alert('Aucun lien à copier');
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(texte)
                    .then(() => { alert('Lien copié dans le presse-papiers !'); })
                    .catch(err => { alert('Erreur lors de la copie : ' + err); });
            } else {
                // fallback
                const tmp = document.createElement('textarea');
                tmp.value = texte;
                document.body.appendChild(tmp);
                tmp.select();
                try { document.execCommand('copy'); alert('Lien copié dans le presse-papiers !'); }
                catch (e) { alert('Impossible de copier : ' + e); }
                document.body.removeChild(tmp);
            }
    }

function createPokemonCard(pokemon) {
    // Traduction des types en français
    const typeTranslations = {
        'Grass': 'Plante',
        'Poison': 'Poison',
        'Fire': 'Feu',
        'Flying': 'Vol',
        'Water': 'Eau',
        'Bug': 'Insecte',
        'Normal': 'Normal',
        'Electric': 'Électrik',
        'Ground': 'Sol',
        'Fairy': 'Fée',
        'Fighting': 'Combat',
        'Psychic': 'Psy',
        'Rock': 'Roche',
        'Steel': 'Acier',
        'Ice': 'Glace',
        'Ghost': 'Spectre',
        'Dragon': 'Dragon',
        'Dark': 'Ténèbres'
    };

    const types = pokemon.type ? pokemon.type.map(t => 
        `<span class="type-badge type-${t}">${typeTranslations[t] || t}</span>`
    ).join('') : '';

    const stats = pokemon.base ? `
        <div class="pokemon-stats">
            <div class="stat-item"><span>PV:</span><span style="font-size: 17px;">${pokemon.base.HP || 0}</span></div>
            <div class="stat-item"><span>Attaque:</span><span style="font-size: 17px;">${pokemon.base.Attack || 0}</span></div>
            <div class="stat-item"><span>Défense:</span><span style="font-size: 17px;">${pokemon.base.Defense || 0}</span></div>
            <div class="stat-item"><span>Attaque Spé:</span><span style="font-size: 17px;">${pokemon.base["Sp. Attack"] || 0}</span></div>
            <div class="stat-item"><span>Défense Spé:</span><span style="font-size: 17px;">${pokemon.base["Sp. Defense"] || 0}</span></div>
            <div class="stat-item"><span>Vitesse:</span><span style="font-size: 17px;">${pokemon.base.Speed || 0}</span></div>
        </div>
    ` : '';

    const imageUrl = `${API_URL}/images/${String(pokemon.id).padStart(3, '0')}.png`;
    return `
        <div class="pokemon-card">
            <img class="pokemon-image" src="${imageUrl}" alt="${pokemon.name?.french || 'Pokemon'}" onerror="this.src='https://via.placeholder.com/200?text=No+Image'">
            <div class="pokemon-id">#${String(pokemon.id).padStart(3, '0')}</div>
            <div class="pokemon-name">${pokemon.name?.french || pokemon.name?.english || 'Unknown'}</div>
            <div class="pokemon-types">${types}</div>
            ${stats}
        </div>
    `;
}

function displayPokemon(data) {
    console.log('Pokemon data:', data); // Pour déboguer
    const results = document.getElementById('results');
    if (Array.isArray(data)) {
        results.innerHTML = data.map(createPokemonCard).join('');
    } else {
        results.innerHTML = createPokemonCard(data);
    }
}

async function loadAllPokemon() {
    showLoading();
    const url = `${API_URL}/api/pokemon`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Erreur de chargement');
        const data = await response.json();
        displayPokemon(data);
        updateJsonLink(url);
    } catch (error) {
        showError('Impossible de charger les Pokémon. Vérifiez que le serveur est lancé.');
        document.getElementById('results').innerHTML = '';
    }
}

async function searchPokemonById() {
    const id = document.getElementById('search-id').value;
    if (!id) {
        showError('Veuillez entrer un ID');
        return;
    }

    showLoading();
    const url = `${API_URL}/api/pokemon/id/${id}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Pokémon non trouvé');
        const data = await response.json();
        displayPokemon(data);
        updateJsonLink(url);
    } catch (error) {
        showError(`Aucun Pokémon trouvé avec l'ID ${id}`);
        document.getElementById('results').innerHTML = '';
    }
}

async function searchPokemonByName() {
    const name = document.getElementById('search-name').value.trim();
    if (!name) {
        showError('Veuillez entrer un nom');
        return;
    }

    showLoading();
    const url = `${API_URL}/api/pokemon/nom/${encodeURIComponent(name)}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Pokémon non trouvé');
        const data = await response.json();
        displayPokemon(data);
        updateJsonLink(url);
    } catch (error) {
        showError(`Aucun Pokémon trouvé avec le nom "${name}"`);
        document.getElementById('results').innerHTML = '';
    }
}

async function getRandomPokemon() {
    const count = document.getElementById('random-count').value || 6;
    showLoading();
    const url = `${API_URL}/api/pokemon/hasard/${count}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Erreur de chargement');
        const data = await response.json();
        displayPokemon(data);
        updateJsonLink(url);
    } catch (error) {
        showError('Impossible de charger les Pokémon aléatoires');
        document.getElementById('results').innerHTML = '';
    }
}

async function searchPokemonByType() {
    const type = document.getElementById('search-type').value.trim();
    if (!type) {
        showError('Veuillez entrer un type.');
        return;
    }
    
    showLoading();
    const url = `${API_URL}/api/pokemon/type/${encodeURIComponent(type)}`;
    updateJsonLink(url);
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Type non trouvé');
        const data = await response.json();
        displayPokemon(Array.isArray(data) ? data : [data]);
    } catch (error) {
        showError('Erreur: ' + error.message);
        document.getElementById('results').innerHTML = '';
    }
}

// Fonctions pour les Items
async function loadAllItems() {
    showLoading();
    const url = `${API_URL}/api/objet`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Erreur de chargement');
        const data = await response.json();
        displayItems(data);
        updateJsonLink(url);
    } catch (error) {
        showError('Impossible de charger les items. Vérifiez que le serveur est lancé.');
        document.getElementById('results').innerHTML = '';
    }
}

async function searchItemById() {
    const id = document.getElementById('search-item-id').value;
    if (!id) {
        showError('Veuillez entrer un ID');
        return;
    }

    showLoading();
    const url = `${API_URL}/api/objet/id/${id}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Erreur de chargement');
        const data = await response.json();
        console.log('Item data:', data);
        if (data) {
            displayItems([data]);
        } else {
            showError(`Aucun item trouvé avec l'ID ${id}`);
            document.getElementById('results').innerHTML = '';
        }
        updateJsonLink(url);
    } catch (error) {
        showError('Erreur: ' + error.message);
        document.getElementById('results').innerHTML = '';
    }
}

async function searchItemByName() {
    const name = document.getElementById('search-item').value.trim();
    if (!name) {
        showError('Veuillez entrer un nom');
        return;
    }

    showLoading();
    const url = `${API_URL}/api/objet/nom/${encodeURIComponent(name)}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Erreur de chargement');
        const data = await response.json();
        if (data) {
            displayItems([data]);
        } else {
            showError(`Aucun item trouvé avec le nom ${name}`);
            document.getElementById('results').innerHTML = '';
        }
        updateJsonLink(url);
    } catch (error) {
        showError('Erreur: ' + error.message);
        document.getElementById('results').innerHTML = '';
    }
}

async function getRandomItems() {
    const count = document.getElementById('random-item-count').value || 3;
    showLoading();
    const url = `${API_URL}/api/objet/hasard/${count}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Erreur de chargement');
        const data = await response.json();
        
        // Sélectionner des items aléatoires
        let randomItems = [];
        for (let i = 0; i < count && data.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * data.length);
            randomItems.push(data[randomIndex]);
        }
        
        displayItems(randomItems);
        updateJsonLink(url);
    } catch (error) {
        showError('Impossible de charger les items aléatoires');
        document.getElementById('results').innerHTML = '';
    }
}

function displayItems(items) {
    const resultsContainer = document.getElementById('results');
    if (!Array.isArray(items) || items.length === 0) {
        resultsContainer.innerHTML = '<p>Aucun item trouvé.</p>';
        return;
    }
    
    resultsContainer.innerHTML = items.map(item => `
        <div class="item-card">
            <h3>${item.name.english || 'Item'}</h3>
            <p1>#${item.id || 'N/A'}</p1>
        </div>
    `).join('');
}