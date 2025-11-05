const API_URL = 'http://172.16.198.254:5001';

// Gestion des onglets
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.search-content').forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
});

// Gestion des touches Enter
document.getElementById('search-id').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchById();
});

document.getElementById('search-name').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchByName();
});

document.getElementById('random-count').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') getRandomPokemon();
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

async function searchById() {
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

async function searchByName() {
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

// Charger automatiquement quelques Pokémon au démarrage
window.addEventListener('load', () => {
    getRandomPokemon();
});