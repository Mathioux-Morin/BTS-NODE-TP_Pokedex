/**
* Serveur Backend Pokedex
*/
//console.log ("Hello World!");
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
const app = express();

app.get('/', (req, res) => {
    fs.readFile('./DATA/pokedex.json', 'utf8', (err, data) => {
        if (err) {
            console.error("Erreur de lecture du fichier :", err);
            res.status(500).send("Erreur serveur : impossible de lire le pokedex.");
        } else {
            const pokedex = JSON.parse(data);
            res.json(pokedex);
        }
    });
});

app.get('/hasard', (req, res) => {
    fs.readFile('./DATA/pokedex.json', 'utf8', (err, data) => {
        if (err) {
            console.error("Erreur de lecture du fichier :", err);
            res.status(500).send("Erreur serveur : impossible de lire le pokedex.");
        } else {
            try {
                const pokedex = JSON.parse(data);
                const total = pokedex.length - 1;
                const randomIndex = Math.floor(Math.random() * total);
                const randomPokemon = pokedex[randomIndex];
                console.log(randomIndex);
                res.json(randomPokemon);
            } catch (parseError) {
                console.error("Erreur de parsing JSON :", parseError);
                res.status(500).send("Erreur serveur : format JSON invalide.");
            }
        }
    });
});

app.get('/pokemon/id/:id', (req, res) => {
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
app.get('/pokemon/nom/:name', (req, res) => {
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
// Lancement du serveur et attendre
app.listen(
	PORT,
	'172.16.198.1',
	() => {
		console.log('Server Pokedex is listening on ' + PORT);
	}
)
