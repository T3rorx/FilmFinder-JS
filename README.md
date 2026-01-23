# FilmFinder

A modern, responsive web application for searching and discovering movies and TV series using the OMDb (Open Movie Database) API. Built with vanilla JavaScript, featuring a stunning glassmorphism design with smooth AOS (Animate On Scroll) animations.

## ✨ Features

- **Movie & Series Search**: Search for your favorite content using keywords
- **Progressive Display**: Results appear progressively on scroll with AOS flip-down animations
- **Detailed Information**: Click "En savoir plus" (Read More) to view complete film details in a modal
- **Infinite Scroll**: Automatically loads more results as you scroll
- **Advanced Filtering**: Filter results by type (All, Movies, Series)
- **Responsive Design**: Fully responsive interface optimized for mobile, tablet, and desktop
- **Lazy Loading**: Optimized image loading for better performance
- **Modern UI**: Glassmorphism design with 2025-2026 color palette

## 🚀 Quick Start

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- An OMDb API key (free tier available)

### Installation

1. **Clone or download the project**

2. **Get an OMDb API key**
   - Visit [http://www.omdbapi.com/apikey.aspx](http://www.omdbapi.com/apikey.aspx)
   - Choose "FREE" for a free API key
   - Confirm your email and retrieve your key

3. **Configure the API key**
   - Copy `config.js.example` to `config.js`
   - Replace `'YOUR_API_KEY'` with your obtained API key
   ```javascript
   const API_KEY = 'your-api-key-here';
   ```

4. **Run the application**
   - Simply open `index.html` in your web browser
   - Or serve the files via a local server (recommended)
     ```bash
     # Using Python
     python -m http.server 8000

     # Using Node.js (http-server)
     npx http-server
     ```

## 📁 Project Structure

```
FilmFinder-JS-API/
├── index.html              # Main HTML entry point
├── script.js               # Core JavaScript logic
├── styles.css              # Custom CSS styles and animations
├── config.js               # API configuration (not versioned)
├── config.js.example       # Example configuration file
├── .gitignore              # Git ignore rules
├── .cursorrules            # Cursor AI rules
├── .cursorignore           # Cursor ignore patterns
├── .vscode/                # VS Code/Cursor settings
│   ├── settings.json       # Editor settings
│   └── extensions.json     # Recommended extensions
├── ARCHITECTURE.md         # Architecture documentation
└── README.md               # This file
```

## 🛠️ Technologies

### Core Technologies
- **HTML5**: Semantic markup
- **CSS3**: Custom styles and animations
- **JavaScript (ES6+)**: Vanilla JavaScript with modern features
  - Fetch API for asynchronous requests
  - Async/Await for promise handling
  - ES6 Modules and closures
  - Event delegation

### External Libraries (CDN)
- **Tailwind CSS**: Modern utility-first CSS framework
  - Glassmorphism effects with backdrop-blur
  - 2025-2026 color palette (Electric Cyan, Plum, Emerald)
- **AOS (Animate On Scroll)**: Scroll animation library
  - Flip-down effect for movie cards
  - Progressive delay animations (staggered by row)
- **Font Awesome**: Icon library
- **OMDb API**: Movie and series data provider

## 🎨 Design Features

### Glassmorphism
- Translucent backgrounds with backdrop blur (16px-24px)
- Subtle borders and shadows with color glows
- Layered depth effects
- Modern 2025-2026 design trends

### Color Palette
- **Primary Background**: `#0C1120` (Navy/Charcoal)
- **Surface Colors**: `#151A21` (Dark Gray)
- **Text Primary**: `#E9EEF5` (Off-white)
- **Text Secondary**: `#B0B0B0` (Medium Gray)
- **Accent Colors**:
  - Electric Cyan: `#40E0FF`
  - Plum/Violet: `#845EC2`
  - Emerald Green: `#22C55E`
  - Bright Pink: `#D65DB1`

### Animations
- **AOS Flip-Down**: Cards flip down on scroll with 800ms duration
- **Progressive Delays**: Staggered animations per row (0ms, 100ms, 200ms)
- **Hover Effects**: Smooth scale (105%) and glow transitions
- **Background Elements**: Animated orbs, particles, and geometric shapes

## 🏗️ Architecture

### Data Flow

```
User Input → handleSearch()
    ↓
Validation
    ↓
fetchMovies(query, page)
    ↓
OMDb API Request
    ↓
Response Processing
    ↓
Duplicate Filtering (Set)
    ↓
createFilmCard() for each film
    ↓
DOM Insertion + AOS Animation
    ↓
Display with Progressive Animations
```

### Key Functions

- **API Management**: `fetchMovies()`, `fetchMovieDetails()`
- **UI Components**: `createFilmCard()`, `handleSearch()`, `applyFilter()`
- **Animations**: AOS integration with flip-down effect
- **Utilities**: `showError()`, `showLoading()`, `clearResults()`

### Design Patterns

- **Singleton Pattern**: Global state management
- **Observer Pattern**: AOS for scroll-triggered animations
- **Event Delegation**: Centralized event handlers
- **Async/Await**: Asynchronous API request handling
- **Error Handling**: Comprehensive try/catch with user-friendly messages

## 🎯 Features in Detail

### Search Functionality
- Real-time search with input validation
- Error handling for API configuration and network issues
- Loading indicators during API calls
- Duplicate prevention using Set data structure

### Results Display
- **Grid Layout**: Maximum 3 columns
  - Mobile: 1 column
  - Tablet (sm): 2 columns
  - Desktop (md+): 3 columns
- **Movie Cards** featuring:
  - Movie poster with `object-contain` (no cropping)
  - Title with line clamping (2 lines max)
  - Release year
  - Type badge (Movie/Series) with translations
  - "En savoir plus" (Read More) button

### Filtering System
- **All**: Display all results
- **Movies**: Filter by movie type
- **Series**: Filter by series type
- Real-time filtering without page reload
- Visual feedback for active filter

### Detail Modal
- Complete film information:
  - High-resolution poster
  - Title, year, genre
  - Director and cast
  - Runtime
  - IMDb rating with star display
  - Full plot synopsis
- Glassmorphism design with backdrop blur

### Infinite Scroll
- Automatic pagination
- Triggers when user approaches end of results
- Seamless loading experience
- Prevents duplicate results

## 📝 Important Notes

⚠️ **Security**: Never commit your API key to version control!
- The `config.js` file is already in `.gitignore`
- If using Git, verify that `config.js` is not tracked
- Use `config.js.example` as a template

## 🔧 Customization

### Styling
Edit `styles.css` to customize:
- Color palette
- Animation durations
- Spacing and sizing
- Background elements (orbs, particles, grid)

### Behavior
Edit `script.js` to modify:
- Number of results per page
- AOS animation settings
- Filter logic
- API request parameters

### AOS Configuration
Modify AOS settings in `index.html`:
```javascript
AOS.init({
    duration: 800,           // Animation duration (ms)
    easing: 'ease-out-cubic', // Easing function
    once: true,              // Animate only once
    offset: 100              // Trigger offset (px)
});
```

### Grid Layout
Modify grid columns in `index.html` (line 155):
```html
<!-- Current: 1 col mobile, 2 cols tablet, 3 cols desktop -->
<div id="resultsContainer" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"></div>
```

## 📱 Browser Compatibility

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Troubleshooting

### "Please configure your API key" Error
- Verify that you've replaced `'YOUR_API_KEY'` in `config.js`
- Ensure `config.js` is properly loaded (check browser console)
- Check that `config.js` exists and is not empty

### No Results Found
- Check your internet connection
- Verify your API key is valid and active
- Try different search terms
- Check browser console for API errors

### Animations Not Working
- Ensure AOS library is loaded (check network tab)
- Verify browser supports modern CSS features
- Check browser console for JavaScript errors
- Verify AOS.init() is called after DOM is loaded

### Images Not Loading
- Check internet connection
- Verify API returns valid image URLs
- Fallback placeholder should appear automatically
- Check browser console for CORS or loading errors

### Filtering Not Working
- Verify filter buttons are visible after first search
- Check browser console for JavaScript errors
- Ensure film cards have correct `data-film-type` attributes

## 🚀 Performance

### Optimizations
- **Lazy Loading**: Images load only when visible
- **Pagination**: Results loaded in batches of 10
- **AOS**: Efficient scroll-based animations
- **CSS Animations**: Hardware-accelerated transforms
- **Duplicate Prevention**: Set-based filtering

### Best Practices
- Minimal external dependencies (CDN only)
- Vanilla JavaScript (no build step required)
- Optimized CSS with Tailwind utilities
- Efficient DOM manipulation

## 📄 License

This project is a learning exercise. The OMDb API has its own terms of use.

## 🙏 Acknowledgments

- [OMDb API](http://www.omdbapi.com/) for providing movie and series data
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [AOS](https://michalsnik.github.io/aos/) for scroll animations
- [Font Awesome](https://fontawesome.com/) for icons

## 📚 Additional Documentation

- See `ARCHITECTURE.md` for detailed architecture documentation
- See `.cursorrules` for development guidelines

---

**Version**: 1.0.0
**Last Updated**: 2025-01-21
