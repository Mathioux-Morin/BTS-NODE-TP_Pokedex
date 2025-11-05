# 🔴 TP SIO — Pokédex Fullstack avec API REST et Interface Web

Bienvenue dans ce TP dédié à la **création d'API REST**.  
L'objectif est simple : **créer un serveur backend express.js** pour gérer des données Pokémon et **développer une interface frontend (en bonus)** pour consulter et rechercher les Pokémon dynamiquement.

| [Voir le Frontend](./index.html) | [Backend API(serveur privé)](http://172.16.198.254:5001)|

Téléchargez le répertoire pour pouvoir lancer l'API.
---

## 🎯 Objectifs pédagogiques

- Comprendre l'architecture client-serveur d'une application web
- Créer une API REST avec Express.js et Node.js
- Manipuler des fichiers JSON pour stocker et récupérer des données
- Utiliser JavaScript pour créer une interface utilisateur dynamique
- Gérer les requêtes HTTP asynchrones avec fetch()
- Appréhender le routage et les paramètres d'URL

---

## 🛠️ Technologies utilisées

| Outil              | Description                                    |
|--------------------|------------------------------------------------|
| **Node.js**        | Environnement d'exécution JavaScript serveur   |
| **Express.js**     | Framework web minimaliste pour Node.js         |
| **HTML5 / CSS3**   | Structure et mise en page du frontend          |
| **JavaScript**     | Logique côté client et serveur                 |
| **JSON**           | Format de données pour le Pokédex              |
| **Fetch API**      | Communication asynchrone avec le backend       |

---

## 📦 Structure du projet

```
BACKEND/
├── DATA/
│   └── pokedex.json          # Base de données des Pokémon
│   └──
│   └──
├── FILES/
│   └── images/               # Images des Pokémon
│   └──
├── node_modules/             # Dépendances Node.js
├── index.js                  # Serveur Express (Backend)
├── package.json              # Configuration du projet
├── package-lock.json
└── README.md                 # Documentation

FRONTEND/
└── index.html                # Interface utilisateur
└── assets/
│   └── css/
│   └── js/
```

---

## 🚀 Installation et lancement

### Prérequis
- Node.js installé (version 12 ou supérieure)
- npm (gestionnaire de paquets Node)

### Backend

1. **Installer les dépendances**
   ```bash
   cd BACKEND
   npm install express
   ```

2. **Lancer le serveur**
   ```bash
   node index.js
   ```
   Le serveur démarre sur `http://votre_ip:5001`

### Frontend

1. **HTML**
   -  En allant directement sur l'adresse vous accèderez au site.

2. **Configuration de l'API**
   - Vérifiez que l'URL de l'API dans `index.html` correspond au serveur backend
   - Par défaut : `const API_URL = 'http://votre_ip:5001';`

---

## 📡 Endpoints de l'API

### 1. **GET /** - Récupérer tous les Pokémon
```http
GET http://votre_ip:5001/
```
**Réponse** : Tableau JSON de tous les Pokémon

---

### 2. **GET /pokemon/id/:id** - Rechercher par ID
```http
GET http:/votre_ip:5001/pokemon/id/25
```
**Paramètre** : `id` (entier positif)  
**Réponse** : Objet JSON du Pokémon correspondant

---

### 3. **GET /pokemon/nom/:name** - Rechercher par nom
```http
GET http://votre_ip:5001/pokemon/nom/pikachu
```
**Paramètre** : `name` (string, insensible à la casse)  
**Langues supportées** : français, anglais, chinois, japonais  
**Réponse** : Objet JSON du Pokémon correspondant

---

### 4. **GET /pokemon/hasard/:nbr** - Pokémon aléatoires
```http
GET http://votre_ip:5001/pokemon/hasard/6
```
**Paramètre** : `nbr` (nombre de Pokémon à générer)  
**Réponse** : Tableau JSON de Pokémon aléatoires

---

## 🎨 Fonctionnalités du Frontend

### Interface utilisateur
- **Design moderne** avec dégradé violet et effets d'animation
- **Système d'onglets** pour différents modes de recherche
- **Cartes interactives** avec effet hover
- **Affichage responsive** adapté aux mobiles

### Modes de recherche
1. **Tous les Pokémon** : Affiche l'intégralité du Pokédex
2. **Recherche par ID** : Trouve un Pokémon par son numéro (ex: 25)
3. **Recherche par Nom** : Recherche par nom dans toutes les langues
4. **Pokémon Aléatoires** : Génère entre 1 et 20 Pokémon au hasard

### Informations affichées
- Image haute résolution du Pokémon
- Numéro et nom (multilingue)
- Types avec badges colorés
- Statistiques (HP, Attaque, Défense, Vitesse)

---

## 📊 Structure des données JSON

Exemple d'objet Pokémon dans `pokedex.json` :
```json
{
  "id": 25,
  "name": {
    "english": "Pikachu",
    "french": "Pikachu",
    "japanese": "ピカチュウ",
    "chinese": "皮卡丘"
  },
  "type": ["Electric"],
  "base": {
    "HP": 35,
    "Attack": 55,
    "Defense": 40,
    "Speed": 90
  },
  "image": {
    "hires": "./FILES/images/pikachu.png"
  }
}
```

---

## 🔧 Points techniques importants

### Backend (Express.js)
- **Lecture asynchrone** des fichiers avec `fs.readFile()`
- **Parsing JSON** avec gestion d'erreurs
- **Routage dynamique** avec paramètres d'URL
- **Validation des entrées** (ID, nom)
- **Gestion des erreurs HTTP** (400, 404, 500)

### Frontend (JavaScript)
- **Fetch API** pour les requêtes asynchrones
- **Template literals** pour générer le HTML dynamiquement
- **Event listeners** pour l'interactivité
- **Gestion d'état** avec les onglets actifs
- **Error handling** avec messages utilisateur

---

## 🎓 Compétences développées

| Compétence                          | Niveau      |
|-------------------------------------|-------------|
| Création d'API REST                 | ⭐⭐⭐       |
| Manipulation de JSON                | ⭐⭐⭐       |
| JavaScript asynchrone (async/await) | ⭐⭐⭐       |
| Requêtes HTTP et Fetch API          | ⭐⭐⭐       |
| Routage Express.js                  | ⭐⭐         |
| Design responsive                   | ⭐⭐         |
| Gestion d'erreurs                   | ⭐⭐⭐       |

---

## 🐛 Dépannage

### Le serveur ne démarre pas
- Vérifiez que Node.js est installé : `node --version`
- Vérifiez que Express est installé : `npm list express`
- Vérifiez que le port 5001 est libre

### Le frontend ne se connecte pas au backend
- Vérifiez que le serveur backend est lancé
- Vérifiez l'URL dans le code frontend (ligne API_URL)
- Vérifiez la console navigateur (F12) pour les erreurs CORS
- Vérifiez que l'adresse IP correspond bien à votre réseau

### Les images ne s'affichent pas
- Vérifiez que le dossier `FILES/images/` contient les images
- Vérifiez les chemins dans le fichier `pokedex.json`
- Utilisez des URLs absolues si nécessaire

---

## 🚀 Améliorations possibles

- [ ] Ajouter un système de filtres par type
- [ ] Implémenter la pagination pour de meilleures performances
- [ ] Ajouter une route pour les évolutions des Pokémons
- [ ] Créer un système de favoris avec localStorage
- [ ] Implémenter une recherche avancée multicritères
- [ ] Ajouter une comparaison entre deux Pokémons
- [ ] Ajouter un système de combat entre deux Pokemons

---

## 📝 Notes de développement

- **Port par défaut** : 5001
- **Adresse IP** : 172.16.198.254 (à adapter selon votre réseau)
- **Encodage** : UTF-8 pour supporter les caractères spéciaux
- **CORS** : À configurer si déploiement en production

---

👩‍💻 *Projet réalisé dans le cadre du BTS SIO SLAM — Lycée Fénelon*