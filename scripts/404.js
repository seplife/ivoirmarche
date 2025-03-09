document.addEventListener('DOMContentLoaded', () => {
    const errorManager = new ErrorPageManager();
});

class ErrorPageManager {
    constructor() {
        this.initializeEventListeners();
        this.loadPopularProducts();
        this.initializeAnalytics();
        this.checkReferrer();
    }

    initializeEventListeners() {
        // Quick search functionality
        const searchInput = document.getElementById('quickSearch');
        const searchButton = document.getElementById('searchButton');

        searchButton.addEventListener('click', () => this.handleSearch(searchInput.value));
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch(searchInput.value);
            }
        });

        // Navigation tracking
        document.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                this.trackNavigation(e.target.href);
            });
        });
    }

    async handleSearch(query) {
        if (!query.trim()) {
            alert('Veuillez entrer un terme de recherche');
            return;
        }

        // Track search attempt from 404 page
        this.trackEvent('404_search', {
            query: query,
            page: window.location.pathname
        });

        // Redirect to search results
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }

    loadPopularProducts() {
        const popularProducts = [
            {
                id: 1,
                name: 'Smartphone Pro',
                price: 599.99,
                image: 'https://via.placeholder.com/200x200?text=Smartphone+Pro'
            },
            {
                id: 2,
                name: 'Écouteurs Sans Fil',
                price: 129.99,
                image: 'https://via.placeholder.com/200x200?text=Écouteurs'
            },
            {
                id: 3,
                name: 'Montre Connectée',
                price: 199.99,
                image: 'https://via.placeholder.com/200x200?text=Montre'
            }
        ];

        const grid = document.getElementById('popularProductsGrid');
        
        popularProducts.forEach(product => {
            const productEl = document.createElement('div');
            productEl.classList.add('product-card');
            productEl.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h4>${product.name}</h4>
                <p>${product.price.toFixed(2)} €</p>
                <button onclick="window.location.href='products.html?id=${product.id}'">
                    Voir le produit
                </button>
            `;
            grid.appendChild(productEl);
        });
    }

    initializeAnalytics() {
        // Track 404 page view
        this.trackPageView();

        // Store 404 error details
        this.logError({
            type: '404',
            url: window.location.href,
            referrer: document.referrer,
            timestamp: new Date().toISOString()
        });
    }

    checkReferrer() {
        const referrer = document.referrer;
        if (referrer && referrer.includes(window.location.hostname)) {
            // Internal 404 - might want to show different suggestions
            this.updateSuggestionsForInternalError(referrer);
        }
    }

    updateSuggestionsForInternalError(referrer) {
        // Analyze referrer URL to provide more contextual suggestions
        const path = new URL(referrer).pathname;
        const category = path.split('/')[1];

        if (category) {
            const suggestions = document.querySelector('.error-suggestions ul');
            const newSuggestion = document.createElement('li');
            newSuggestion.innerHTML = `
                <a href="${category}.html">
                    <i class="fas fa-arrow-left"></i> 
                    Retourner à ${category}
                </a>
            `;
            suggestions.insertBefore(newSuggestion, suggestions.firstChild);
        }
    }

    trackPageView() {
        // Implement your analytics tracking here
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: '404 Error Page',
                page_location: window.location.href,
                page_path: window.location.pathname
            });
        }
    }

    trackEvent(eventName, params = {}) {
        // Implement your analytics tracking here
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, params);
        }
    }

    trackNavigation(url) {
        // Track where users go from 404 page
        this.trackEvent('404_navigation', {
            from: window.location.pathname,
            to: url
        });
    }

    logError(errorDetails) {
        // Store error details for analysis
        const errors = JSON.parse(localStorage.getItem('404_errors') || '[]');
        errors.push(errorDetails);
        localStorage.setItem('404_errors', JSON.stringify(errors));

        // In production, you'd want to send this to your server
        console.log('404 Error logged:', errorDetails);
    }
}

// Add these styles to your CSS
const styles = `
    .error-page {
        min-height: 70vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
        background-color: #f8f8f8;
    }

    .error-content {
        max-width: 800px;
        text-align: center;
    }

    .error-animation {
        margin-bottom: 30px;
    }

    .error-404 {
        font-size: 120px;
        font-weight: bold;
        color: var(--primary-color);
        text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
    }

    .error-content h1 {
        font-size: 2em;
        color: #333;
        margin-bottom: 15px;
    }

    .error-content p {
        color: #666;
        margin-bottom: 30px;
    }

    .error-suggestions {
        margin: 40px 0;
    }

    .error-suggestions ul {
        list-style: none;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 20px;
    }

    .error-suggestions a {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 15px 25px;
        background-color: white;
        border-radius: 8px;
        text-decoration: none;
        color: #333;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        transition: transform 0.3s, box-shadow 0.3s;
    }

    .error-suggestions a:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        color: var(--primary-color);
    }

    .quick-search {
        margin: 40px 0;
    }

    .search-box {
        display: flex;
        gap: 10px;
        max-width: 500px;
        margin: 20px auto;
    }

    .search-box input {
        flex: 1;
        padding: 12px;
        border: 2px solid #ddd;
        border-radius: 8px;
        font-size: 16px;
    }

    .search-box button {
        padding: 12px 24px;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .search-box button:hover {
        background-color: var(--secondary-color);
    }

    .popular-products {
        margin-top: 40px;
    }

    .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-top: 20px;
    }

    .product-card {
        background: white;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        transition: transform 0.3s;
    }

    .product-card:hover {
        transform: translateY(-5px);
    }

    .product-card img {
        width: 100%;
        height: 200px;
        object-fit: cover;
        border-radius: 4px;
        margin-bottom: 10px;
    }

    .product-card button {
        width: 100%;
        padding: 8px;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .product-card button:hover {
        background-color: var(--secondary-color);
    }

    @media (max-width: 768px) {
        .error-404 {
            font-size: 80px;
        }

        .error-suggestions ul {
            flex-direction: column;
            align-items: center;
        }

        .error-suggestions a {
            width: 100%;
            justify-content: center;
        }

        .products-grid {
            grid-template-columns: 1fr;
        }
    }
`;

// Add the styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);
