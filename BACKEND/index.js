/**
* Serveur Backend Pokedex
*/

// Définir l'emplacement des fichiers bases de données
const POKEDEX_SRC = "./DATA/pokedex.json";
// Définir l'emplacement des images
const IMAGES_SRC = "./FILES/images";
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

// Lancement du serveur et attendre
app.listen(
	PORT,
	'172.16.198.1',
	() => {
		console.log('Server Pokedex is listening on ' + PORT);
	}
)
