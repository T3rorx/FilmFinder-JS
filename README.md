# FilmFinder - Application de Recherche de Films

Une application web moderne pour rechercher et découvrir des films et séries en utilisant l'API OMDb (The Open Movie Database).

## 🎬 Fonctionnalités

- **Recherche de films et séries** : Recherchez vos contenus préférés par mots-clés
- **Affichage progressif** : Les résultats apparaissent progressivement lors du scroll grâce à l'Intersection Observer
- **Détails complets** : Cliquez sur "Read More" pour voir toutes les informations d'un film dans une modal
- **Infinite Scroll** : Chargement automatique de plus de résultats lors du scroll
- **Design responsive** : Interface adaptée à tous les écrans avec Bootstrap 5
- **Lazy Loading** : Chargement optimisé des images

## 🚀 Installation

1. **Cloner ou télécharger le projet**

2. **Obtenir une clé API OMDb**
   - Rendez-vous sur [http://www.omdbapi.com/apikey.aspx](http://www.omdbapi.com/apikey.aspx)
   - Choisissez "FREE" pour une clé gratuite
   - Confirmez votre email et récupérez votre clé

3. **Configurer la clé API**
   - Ouvrez le fichier `config.js`
   - Remplacez `'VOTRE_CLE_API'` par votre clé API obtenue
   ```javascript
   const API_KEY = 'votre-cle-api-ici';
   ```

4. **Ouvrir l'application**
   - Ouvrez simplement `index.html` dans votre navigateur
   - Ou servez les fichiers via un serveur local (recommandé)

## 📁 Structure du projet

```
FilmFinder-JS-API/
├── index.html          # Page principale HTML
├── script.js           # Logique JavaScript principale
├── styles.css          # Styles CSS personnalisés
├── config.js           # Configuration de l'API (à ne pas commiter)
├── .gitignore          # Fichiers à ignorer par Git
└── README.md           # Documentation du projet
```

## 🛠️ Technologies utilisées

- **HTML5** : Structure de la page
- **CSS3** : Styles et animations personnalisées
- **JavaScript (ES6+)** : Logique de l'application
  - Fetch API pour les requêtes asynchrones
  - Intersection Observer API pour les animations au scroll
  - Async/Await pour la gestion asynchrone
  - ES6 Modules et closures
- **Tailwind CSS** : Framework CSS moderne (via CDN)
  - Glassmorphisme avec backdrop-blur
  - Palette de couleurs 2025-2026 (Electric Cyan, Plum, Emerald)
- **Font Awesome** : Icônes (via CDN)
- **OMDb API** : API pour les données de films

## 🏗️ Architecture

### Structure des fichiers
```
FilmFinder-JS-API/
├── index.html          # Point d'entrée - Structure HTML
├── script.js           # Logique JavaScript principale
│   ├── Gestion API (fetchMovies, fetchMovieDetails)
│   ├── UI (createFilmCard, handleSearch)
│   ├── Animations (Intersection Observer)
│   └── Utilitaires (showError, showLoading)
├── styles.css          # Styles CSS personnalisés
│   ├── Animations (fadeInUp, float, geometric-rotate)
│   ├── Glassmorphisme (backdrop-blur)
│   └── Éléments animés (orbes, particules, grille)
├── config.js           # Configuration API (non versionné)
└── .cursorrules        # Règles pour Cursor IA
```

### Flux de données
1. **Recherche utilisateur** → Formulaire (`handleSearch`)
2. **Appel API** → `fetchMovies(query, page)`
3. **Traitement réponse** → Filtrage doublons, création cartes
4. **Affichage** → Insertion DOM avec animations progressives
5. **Détails film** → `fetchMovieDetails(imdbID)` → Modal

### Patterns utilisés
- **Singleton Pattern** : Variables globales pour état application
- **Observer Pattern** : Intersection Observer pour animations scroll
- **Event Delegation** : Gestionnaires d'événements centralisés
- **Async/Await** : Gestion asynchrone des requêtes API
- **Error Handling** : Try/catch avec messages utilisateur

## 🎯 Fonctionnalités détaillées

### Recherche
- Formulaire de recherche avec validation
- Gestion des erreurs (API non configurée, erreurs réseau, etc.)
- Affichage d'un indicateur de chargement

### Affichage des résultats
- Cartes de films avec :
  - Affiche du film (avec image de remplacement si absente)
  - Titre du film
  - Année de sortie
  - Type (Film ou Série)
  - Bouton "Read More"

### Animation au scroll
- Les cartes apparaissent progressivement lors du scroll
- Animation de translation depuis la gauche
- Opacité qui passe de 0 à 1

### Modal de détails
- Affiche toutes les informations du film :
  - Affiche haute résolution
  - Titre, année, genre
  - Réalisateur et acteurs
  - Durée
  - Note IMDb avec étoiles
  - Synopsis complet

### Infinite Scroll
- Chargement automatique de la page suivante
- Se déclenche quand l'utilisateur approche de la fin des résultats

## 📝 Notes importantes

⚠️ **IMPORTANT** : Ne commitez jamais votre clé API sur GitHub !
- Le fichier `config.js` est déjà dans `.gitignore`
- Si vous utilisez Git, vérifiez que `config.js` n'est pas suivi

## 🔧 Personnalisation

### Modifier les styles
Éditez `styles.css` pour personnaliser l'apparence :
- Couleurs dans les variables CSS
- Durées d'animation
- Tailles et espacements

### Modifier le comportement
Éditez `script.js` pour :
- Changer le nombre de résultats par page
- Modifier le seuil d'Intersection Observer
- Ajuster les animations

## 📱 Compatibilité

- Navigateurs modernes (Chrome, Firefox, Safari, Edge)
- Responsive design pour mobile, tablette et desktop
- Fonctionne sans dépendances externes (hormis Bootstrap et Font Awesome via CDN)

## 🐛 Résolution de problèmes

**Erreur "Veuillez configurer votre clé API"**
- Vérifiez que vous avez bien remplacé `VOTRE_CLE_API` dans `config.js`

**Aucun résultat trouvé**
- Vérifiez votre connexion internet
- Vérifiez que votre clé API est valide
- Essayez avec des termes de recherche différents

**Les animations ne fonctionnent pas**
- Vérifiez que votre navigateur supporte l'Intersection Observer API
- Ouvrez la console du navigateur pour voir les erreurs éventuelles

## 📄 Licence

Ce projet est un exercice d'apprentissage. L'API OMDb a ses propres conditions d'utilisation.

## 🙏 Remerciements

- [OMDb API](http://www.omdbapi.com/) pour l'accès aux données de films
- [Bootstrap](https://getbootstrap.com/) pour le framework CSS
- [Font Awesome](https://fontawesome.com/) pour les icônes
# FilmFinder-JS
