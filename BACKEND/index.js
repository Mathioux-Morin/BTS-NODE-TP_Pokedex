/**
* Serveur Backend Pokedex
*/

// Définir l'emplacement des fichiers bases de données
const POKEDEX_SRC = "./DATA/pokedex.json";
// Définir l'emplacement des items
const ITEMS_SRC = "./DATA/items.json";
// Définir l'emplacement des images
const IMAGES_SRC = "./FILES/images";
// Définir l'emplacement des types
const TYPES_SRC = "./DATA/types.json";
// Définir un port
const PORT = 5001;
// ************************************************
// Lancer un serveur express sur un port défini
const fs = require('fs');
// npm install express
const express = require('express');
const path = require('path');
const app = express();

// Configuration CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, '../FRONTEND')));  // Servir tous les fichiers du frontend
app.use('/images', express.static(path.join(__dirname, 'FILES/images')));
app.use('/sprites', express.static(path.join(__dirname, 'FILES/sprites')));
app.use('/thumbnails', express.static(path.join(__dirname, 'FILES/thumbnails')));
app.use(express.static(path.join(__dirname, '../FRONTEND')));

// Route pour servir le frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../FRONTEND/pokedex-frontend.html'));
});

// Route pour obtenir tous les pokemons
app.get('/api/pokemon', (req, res) => {
    fs.readFile(POKEDEX_SRC, 'utf8', (err, data) => {
        if (err) {
            console.error("Erreur de lecture du fichier :", err);
            res.status(500).send("Erreur serveur : impossible de lire le pokedex.");
        } else {
            try {
                const pokedex = JSON.parse(data);
                res.json(pokedex);
            } catch (parseError) {
                console.error("Erreur de parsing JSON :", parseError);
                res.status(500).send("Erreur serveur : format JSON invalide.");
            }
        }
    });
});

app.get('/api/pokemon/id/:id', (req, res) => {
    const id = parseInt(req.params.id);

    // Vérification de l'ID
    if (isNaN(id) || id < 1) {
        return res.status(400).send("ID invalide. Utilisez un entier positif.");
    }

    fs.readFile(POKEDEX_SRC, 'utf8', (err, data) => {
        if (err) {
            console.error("Erreur de lecture du fichier :", err);
            return res.status(500).send("Erreur serveur : impossible de lire le pokedex.");
        }

        try {
            const pokedex = JSON.parse(data);

            // Recherche du Pokémon par ID
            const pokemon = pokedex.find(p => p.id === id);

            if (pokemon) {
                res.json(pokemon);
            } else {
                res.status(404).send("Aucun Pokémon trouvé avec cet ID.");
            }
        } catch (parseError) {
            console.error("Erreur de parsing JSON :", parseError);
            res.status(500).send("Erreur serveur : format JSON invalide.");
        }
    });
});
app.get('/api/pokemon/nom/:name', (req, res) => {
    const name = req.params.name.toLowerCase();

    fs.readFile(POKEDEX_SRC, 'utf8', (err, data) => {
        if (err) {
            console.error("Erreur de lecture du fichier :", err);
            return res.status(500).send("Erreur serveur.");
        }

        try {
            const pokedex = JSON.parse(data);

            // Recherche par nom français (insensible à la casse)
            const pokemon = pokedex.find(p => p.name.french.toLowerCase() === name || p.name.chinese.toLowerCase() === name || p.name.english.toLowerCase() === name|| p.name.japanese.toLowerCase() === name);

            if (pokemon) {
                res.json(pokemon);
            } else {
                res.status(404).send("Aucun Pokémon trouvé avec ce nom.");
            }
        } catch (parseError) {
            console.error("Erreur de parsing JSON :", parseError);
            res.status(500).send("Erreur de format JSON.");
        }
    });
});

app.get('/api/pokemon/type/:type', (req, res) => {
    const type = req.params.type.toLowerCase();

    fs.readFile(POKEDEX_SRC, 'utf8', (err, data) => {
        if (err) {
            console.error("Erreur de lecture du fichier :", err);
            return res.status(500).send("Erreur serveur.");
        }

        try {
            const pokedex = JSON.parse(data);
            const typesData = require(TYPES_SRC);

            // Mpping si recherche en francais
            const typeMapping = {
                "combat":"fighting",
                "vol":"flying",
                "sol":"ground",
                "roche":"rock",
                "insecte":"bug",
                "spectre":"ghost",
                "acier":"steel",
                "feu":"fire",
                "eau":"water",
                "plante":"grass",
                "electrique":"electric",
                "psychique":"psychic",
                "glace":"ice",
                "tenebres":"dark",
                "fee":"fairy"
            }

            let searchType = type;

            if (typeMapping[type]) {
                searchType = typeMapping[type];
            }

            // Utilisation de types.json pour la recherche des types en chinois/japonais
            const foundType = typesData.find(t => 
                t.english.toLowerCase() === searchType||
                t.chinese === searchType||
                t.japanese === searchType
            )

            searchType = foundType ? foundType.english.toLowerCase() : searchType;

            // Recherche les pokemon ayant le type recherché
            const pokemon = pokedex.filter(p => p.type.some(t => t.toLowerCase().includes(searchType)));

            if (pokemon.length) {
                res.json(pokemon);
            } else {
                res.status(404).send("Aucun Pokémon trouvé avec ce type.");
            }
        } catch (parseError) {
            console.error("Erreur de parsing JSON :", parseError);
            res.status(500).send("Erreur de format JSON.");
        }
    });
});

app.get('/api/pokemon/hasard/:nbr', (req, res) => {
    fs.readFile(POKEDEX_SRC, 'utf8', (err, data) => {
        let nbr = 1;
        if (typeof parseInt(req.params.nbr) !== 'undefined' && parseInt(req.params.nbr) > 0)  
        {
            nbr = parseInt(req.params.nbr);
        }
        if (err) {
            console.error("Erreur de lecture du fichier :", err);
            return res.status(500).send("Erreur serveur : impossible de lire le pokedex.");
        }

        try {
            const pokedex = JSON.parse(data);
            const total = pokedex.length;
            let randomPokemon = [];
            for (let i=1; i<=nbr;i++)
            {
                const randomIndex = Math.floor(Math.random() * total);
                randomPokemon.push(pokedex[randomIndex]);
            }

            res.json(randomPokemon);
        } catch (parseError) {
            console.error("Erreur de parsing JSON :", parseError);
            res.status(500).send("Erreur serveur : format JSON invalide.");
        }
    });
});

app.get('/api/objet', (req, res) => {
    fs.readFile(ITEMS_SRC, 'utf8', (err, data) => {
        if (err) {
            console.error("Erreur de lecture du fichier :", err);
            res.status(500).send("Erreur serveur : impossible de lire le pokedex.");
        } else {
            try {
                const items = JSON.parse(data);
                res.json(items);
            } catch (parseError) {
                console.error("Erreur de parsing JSON :", parseError);
                res.status(500).send("Erreur serveur : format JSON invalide.");
            }
        }
    });
});

app.get('/api/objet/nom/:name', (req, res) => {
    const itemName = req.params.name.toLowerCase();
    
    fs.readFile(ITEMS_SRC, 'utf8', (err, data) => {
        if (err) {
            console.error("Erreur de lecture du fichier :", err);
            return res.status(500).send("Erreur serveur.");
        }
        
        try {
            const items = JSON.parse(data);
            const item = items.find(i => i.name?.toLowerCase() === itemName);
            
            if (item) {
                res.json(item);
            } else {
                res.status(404).send("Item non trouvé avec ce nom.");
            }
        } catch (parseError) {
            console.error("Erreur de parsing JSON :", parseError);
            res.status(500).send("Erreur de format JSON.");
        }
    });
});

app.get('/api/objet/id/:id', (req, res) => {
    const itemID = req.params.id.toLowerCase();
    
    fs.readFile(ITEMS_SRC, 'utf8', (err, data) => {
        if (err) {
            console.error("Erreur de lecture du fichier :", err);
            return res.status(500).send("Erreur serveur.");
        }
        
        try {
            const items = JSON.parse(data);
            const item = items.find(i => i.id === itemID);
            
            if (item) {
                res.json(item);
            } else {
                res.status(404).send("Item non trouvé avec cet id.");
            }
        } catch (parseError) {
            console.error("Erreur de parsing JSON :", parseError);
            res.status(500).send("Erreur de format JSON.");
        }
    });
});

// Lancement du serveur et attendre
app.listen(
	PORT,
	'172.16.198.254',
	() => {
		console.log('Server Pokedex is listening on ' + PORT);
	}
)
