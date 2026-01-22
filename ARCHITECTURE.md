# Architecture - FilmFinder

## Vue d'ensemble

FilmFinder est une application web moderne (Single Page Application) permettant de rechercher des films et séries via l'API OMDb. L'application utilise des technologies web modernes avec un design glassmorphisme et des animations fluides.

## Technologies principales

### Frontend
- **HTML5** : Structure sémantique
- **CSS3** : Styles personnalisés avec animations CSS
- **JavaScript ES6+** : Logique applicative vanilla (sans framework)
- **Tailwind CSS** : Framework CSS utilitaire (via CDN)
- **Font Awesome** : Bibliothèque d'icônes (via CDN)

### API externe
- **OMDb API** : The Open Movie Database
  - Endpoint recherche : `?s={query}&page={page}`
  - Endpoint détails : `?i={imdbID}&plot=full`

## Architecture des fichiers

```
FilmFinder-JS-API/
├── index.html              # Point d'entrée HTML
├── script.js               # Logique JavaScript complète
├── styles.css              # Styles et animations CSS
├── config.js               # Configuration API (non versionné)
├── .cursorrules            # Règles pour Cursor IA
├── .cursorignore           # Fichiers ignorés par Cursor
├── .gitignore              # Fichiers ignorés par Git
├── .vscode/                # Configuration VS Code/Cursor
│   ├── settings.json       # Paramètres éditeur
│   └── extensions.json     # Extensions recommandées
└── README.md               # Documentation principale
```

## Structure du code JavaScript

### Organisation du code (`script.js`)

#### Variables globales
```javascript
let currentPage = 1;           // Page de résultats actuelle
let totalResults = 0;          // Nombre total de résultats
let isLoading = false;         // État de chargement
let currentSearch = '';        // Recherche actuelle
let displayedMovieIds = Set(); // IDs affichés (anti-doublons)
let currentFilter = 'all';     // Filtre actif
```

#### Modules fonctionnels

1. **Initialisation**
   - `initializeApp()` : Setup événements
   - `setupModal()` : Configuration modal
   - `setupFilters()` : Configuration filtres

2. **Gestion API**
   - `fetchMovies(query, page)` : Recherche films
   - `fetchMovieDetails(imdbID)` : Détails d'un film

3. **Gestion UI**
   - `handleSearch(e)` : Traitement formulaire recherche
   - `createFilmCard(film)` : Création carte film
   - `handleReadMore(imdbID)` : Affichage modal détails
   - `applyFilter(filter)` : Application filtres

4. **Animations**
   - `observeFilmCard(element)` : Intersection Observer
   - `setupInfiniteScroll()` : Scroll infini

5. **Utilitaires**
   - `showLoading(show)` : Affichage loader
   - `showError(message)` : Affichage erreurs
   - `clearResults()` : Réinitialisation résultats

## Flux de données

### Recherche de films

```
Utilisateur saisit → handleSearch()
  ↓
Validation input
  ↓
fetchMovies(query, page)
  ↓
API OMDb (GET /?s=query&page=page)
  ↓
Traitement réponse JSON
  ↓
Filtrage doublons (Set)
  ↓
createFilmCard() pour chaque film
  ↓
Insertion DOM + observeFilmCard()
  ↓
Affichage avec animations
```

### Détails d'un film

```
Clic "En savoir plus" → handleReadMore(imdbID)
  ↓
fetchMovieDetails(imdbID)
  ↓
API OMDb (GET /?i=imdbID&plot=full)
  ↓
Affichage dans modal
```

## Design System

### Palette de couleurs (2025-2026)

| Usage | Couleur | Code |
|-------|---------|------|
| Fond principal | Navy/Charcoal | `#0C1120` |
| Surfaces | Dark Gray | `#151A21` |
| Texte principal | Blanc cassé | `#E9EEF5` |
| Texte secondaire | Gris moyen | `#B0B0B0` |
| Accent primaire | Electric Cyan | `#40E0FF` |
| Accent secondaire | Plum/Violet | `#845EC2` |
| Accent tertiaire | Emerald Green | `#22C55E` |
| Accent quaternaire | Rose vif | `#D65DB1` |

### Glassmorphisme

- **Backdrop blur** : `backdrop-blur-xl` (16px) / `backdrop-blur-2xl` (24px)
- **Transparence** : `bg-white/5` à `bg-white/10`
- **Bordures** : `border-white/10` à `border-white/20`
- **Ombres** : Ombres colorées avec glow

### Animations

- **Fade In Up** : Apparition cartes (opacity + translateY)
- **Float** : Orbes flottants (translate + scale)
- **Geometric Rotate** : Formes géométriques (rotation 360°)
- **Particle Float** : Particules avec mouvement aléatoire
- **Grid Move** : Grille en translation continue

## Patterns de design

### Intersection Observer
Utilisé pour :
- Animation progressive des cartes au scroll
- Infinite scroll (détection fin de page)
- Performance optimale (pas de polling)

### Event Delegation
- Gestionnaires centraux pour les boutons
- Réduction de la mémoire utilisée

### Anti-doublons
- `Set` JavaScript pour tracker les IDs affichés
- Filtrage avant insertion DOM

### Gestion d'erreurs
- Try/catch sur toutes les requêtes API
- Messages utilisateur clairs et traduits (français)
- Fallback sur images manquantes

## Performance

### Optimisations

1. **Lazy Loading** : Images avec `loading="lazy"`
2. **Debouncing** : Potentiel pour recherche (non implémenté)
3. **Pagination** : Chargement par pages de 10 résultats
4. **Intersection Observer** : Pas de polling actif
5. **CSS Animations** : Hardware accelerated (transform, opacity)

### Métriques cibles

- **Temps chargement initial** : < 2s
- **Temps réponse API** : < 500ms
- **FPS animations** : 60fps
- **Taille bundle** : Minimal (vanilla JS)

## Sécurité

### Bonnes pratiques

- ✅ Clé API dans `config.js` (non versionné)
- ✅ Validation input utilisateur
- ✅ Sanitisation données API (échappement HTML)
- ✅ HTTPS pour API (OMDb supporte HTTPS)

### Points d'attention

- ⚠️ Pas de rate limiting côté client
- ⚠️ Pas de cache pour réduire appels API
- ⚠️ Pas de validation côté serveur (client-side uniquement)

## Accessibilité

### Implémentations

- ✅ HTML sémantique
- ✅ Alt text pour images
- ✅ Labels pour formulaires
- ✅ Navigation clavier (modal)
- ✅ Contraste WCAG AA

### Améliorations possibles

- ⚠️ Support `prefers-reduced-motion`
- ⚠️ ARIA labels pour animations
- ⚠️ Focus visible sur tous les éléments interactifs

## Évolutions futures

### Fonctionnalités possibles

1. **Favoris** : Stockage local des films favoris
2. **Historique** : Sauvegarde recherches récentes
3. **Comparaison** : Comparer plusieurs films
4. **Filtres avancés** : Par année, genre, note
5. **PWA** : Progressive Web App avec offline support

### Optimisations techniques

1. **Service Worker** : Cache pour offline
2. **IndexedDB** : Stockage local des résultats
3. **Web Components** : Modularité accrue
4. **TypeScript** : Typage statique
5. **Tests** : Unit tests + E2E tests

## Décisions d'architecture

### Pourquoi vanilla JavaScript ?

- **Simplicité** : Pas de build step nécessaire
- **Performance** : Aucune dépendance lourde
- **Apprentissage** : Focus sur les APIs natives
- **Déploiement** : Hébergement statique simple

### Pourquoi Tailwind CSS ?

- **Rapidité** : Développement UI plus rapide
- **Cohérence** : Design system intégré
- **Maintenabilité** : Pas de CSS custom excessif
- **CDN** : Pas de build CSS nécessaire

### Pourquoi Intersection Observer ?

- **Performance** : Meilleure que scroll events
- **Native** : Pas de dépendance externe
- **Flexibilité** : Configuration fine des seuils

## Dependencies externes

### CDN

- Tailwind CSS : Design system
- Font Awesome : Icônes
- Pas de package manager nécessaire

### API

- OMDb API : Données films (clé API requise)

## Maintenance

### Versioning

- Version actuelle : 1.0.0
- Pas de versioning sémantique strict (projet simple)

### Documentation

- README.md : Guide utilisateur
- ARCHITECTURE.md : Ce document
- Code comments : Documentation inline

### Tests

- Tests manuels actuellement
- Pas de tests automatisés (à implémenter si nécessaire)

---

**Dernière mise à jour** : 2025-01-21
**Auteur** : FlowTech AI Team
