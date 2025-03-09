import { createProductElement } from './product-utils.js';

class ProductsManager {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.activeFilters = new Set();
        
        this.filters = {
            category: '',
            brand: '',
            price: '',
            sort: 'popular',
            inStock: false,
            promo: false
        };

        this.initializeProducts();
        this.initializeEventListeners();
    }

    async initializeProducts() {
        // In a real app, this would be an API call
        this.products = [
            {
                id: 1,
                name: 'Smartphone Pro',
                price: 899.99,
                originalPrice: 999.99,
                category: 'tech',
                brand: 'samsung',
                rating: 4.5,
                reviews: 128,
                image: '/assets/laptop1.jpg',
                inStock: true,
                promo: true,
                description: 'Le dernier smartphone haut de gamme avec des fonctionnalités innovantes.'
            },
            {
                id: 1,
                name: 'Smartphone Pro',
                price: 899.99,
                originalPrice: 999.99,
                category: 'tech',
                brand: 'samsung',
                rating: 4.5,
                reviews: 128,
                image: '/assets/laptop1.jpg',
                inStock: true,
                promo: true,
                description: 'Le dernier smartphone haut de gamme avec des fonctionnalités innovantes.'
            },
            // Add more products...
        ];

        this.applyFilters();
    }

    initializeEventListeners() {
        // Filter change events
        document.getElementById('category-filter').addEventListener('change', () => this.updateFilters('category'));
        document.getElementById('brand-filter').addEventListener('change', () => this.updateFilters('brand'));
        document.getElementById('price-filter').addEventListener('change', () => this.updateFilters('price'));
        document.getElementById('sort-filter').addEventListener('change', () => this.updateFilters('sort'));
        document.getElementById('instock-filter').addEventListener('change', () => this.updateFilters('inStock'));
        document.getElementById('promo-filter').addEventListener('change', () => this.updateFilters('promo'));

        // Clear filters
        document.getElementById('clear-filters').addEventListener('click', () => this.clearFilters());

        // Pagination
        document.getElementById('prev-page').addEventListener('click', () => this.changePage('prev'));
        document.getElementById('next-page').addEventListener('click', () => this.changePage('next'));
        document.getElementById('items-per-page').addEventListener('change', (e) => {
            this.itemsPerPage = parseInt(e.target.value);
            this.currentPage = 1;
            this.renderProducts();
        });

        // Quick view functionality
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-view-btn')) {
                const productId = e.target.dataset.productId;
                this.showQuickView(productId);
            }
        });

        // Modal close functionality
        document.getElementById('quickViewModal').addEventListener('click', (e) => {
            if (e.target.id === 'quickViewModal') {
                this.closeQuickView();
            }
        });
    }

    updateFilters(filterType) {
        const value = document.getElementById(`${filterType}-filter`).value;
        this.filters[filterType] = filterType === 'inStock' || filterType === 'promo' 
            ? document.getElementById(`${filterType}-filter`).checked
            : value;

        this.currentPage = 1;
        this.applyFilters();
    }

    clearFilters() {
        // Reset all filter inputs
        document.getElementById('category-filter').value = '';
        document.getElementById('brand-filter').value = '';
        document.getElementById('price-filter').value = '';
        document.getElementById('sort-filter').value = 'popular';
        document.getElementById('instock-filter').checked = false;
        document.getElementById('promo-filter').checked = false;

        // Reset filter object
        this.filters = {
            category: '',
            brand: '',
            price: '',
            sort: 'popular',
            inStock: false,
            promo: false
        };

        this.currentPage = 1;
        this.applyFilters();
    }

    applyFilters() {
        this.filteredProducts = this.products.filter(product => {
            if (this.filters.category && product.category !== this.filters.category) return false;
            if (this.filters.brand && product.brand !== this.filters.brand) return false;
            if (this.filters.inStock && !product.inStock) return false;
            if (this.filters.promo && !product.promo) return false;
            if (this.filters.price) {
                const [min, max] = this.filters.price.split('-').map(price => parseInt(price));
                if (max && (product.price < min || product.price > max)) return false;
                if (!max && product.price < min) return false;
            }
            return true;
        });

        // Apply sorting
        this.sortProducts();

        // Update active filters display
        this.updateActiveFilters();

        // Render the filtered products
        this.renderProducts();
    }

    sortProducts() {
        switch(this.filters.sort) {
            case 'price-asc':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                this.filteredProducts.sort((a, b) => b.id - a.id);
                break;
            case 'rating':
                this.filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            default: // popular
                this.filteredProducts.sort((a, b) => b.reviews - a.reviews);
        }
    }

    updateActiveFilters() {
        const activeFiltersContainer = document.getElementById('activeFilters');
        activeFiltersContainer.innerHTML = '';

        Object.entries(this.filters).forEach(([key, value]) => {
            if (value && key !== 'sort') {
                const filterTag = document.createElement('span');
                filterTag.classList.add('filter-tag');
                filterTag.innerHTML = `
                    ${this.getFilterLabel(key, value)}
                    <i class="fas fa-times" data-filter="${key}"></i>
                `;
                filterTag.querySelector('i').addEventListener('click', () => this.removeFilter(key));
                activeFiltersContainer.appendChild(filterTag);
            }
        });
    }

    getFilterLabel(key, value) {
        const labels = {
            category: 'Catégorie',
            brand: 'Marque',
            price: 'Prix',
            inStock: 'En stock',
            promo: 'En promotion'
        };
        return `${labels[key]}: ${value}`;
    }

    removeFilter(filterKey) {
        this.filters[filterKey] = filterKey === 'inStock' || filterKey === 'promo' ? false : '';
        document.getElementById(`${filterKey}-filter`).value = '';
        if (filterKey === 'inStock' || filterKey === 'promo') {
            document.getElementById(`${filterKey}-filter`).checked = false;
        }
        this.applyFilters();
    }

    renderProducts() {
        const grid = document.getElementById('productsGrid');
        grid.innerHTML = '';

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageProducts = this.filteredProducts.slice(startIndex, endIndex);

        if (pageProducts.length === 0) {
            grid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>Aucun produit trouvé</h3>
                    <p>Essayez de modifier vos filtres de recherche</p>
                </div>
            `;
            return;
        }

        pageProducts.forEach(product => {
            const productEl = this.createProductCard(product);
            grid.appendChild(productEl);
        });

        this.updatePagination();
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.classList.add('product-card');
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.promo ? `
                    <span class="promo-tag">
                        -${Math.round((1 - product.price/product.originalPrice) * 100)}%
                    </span>
                ` : ''}
                <button class="quick-view-btn" data-product-id="${product.id}">
                    <i class="fas fa-eye"></i> Aperçu Rapide
                </button>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-rating">
                    ${this.generateStarRating(product.rating)}
                    <span>(${product.reviews})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">${product.price.toFixed(2)} €</span>
                    ${product.originalPrice ? `
                        <span class="original-price">${product.originalPrice.toFixed(2)} €</span>
                    ` : ''}
                </div>
                <div class="product-actions">
                    <button class="add-to-cart" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">
                        <i class="fas fa-shopping-cart"></i> Ajouter au panier
                    </button>
                </div>
            </div>
        `;
        return card;
    }

    generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return `
            ${'<i class="fas fa-star"></i>'.repeat(fullStars)}
            ${hasHalfStar ? '<i class="fas fa-star-half-alt"></i>' : ''}
            ${'<i class="far fa-star"></i>'.repeat(emptyStars)}
        `;
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        const pageNumbers = document.getElementById('pageNumbers');

        prevBtn.disabled = this.currentPage === 1;
        nextBtn.disabled = this.currentPage === totalPages;

        pageNumbers.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.classList.add('page-number');
            if (i === this.currentPage) pageBtn.classList.add('active');
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                this.currentPage = i;
                this.renderProducts();
            });
            pageNumbers.appendChild(pageBtn);
        }
    }

    changePage(direction) {
        if (direction === 'prev' && this.currentPage > 1) {
            this.currentPage--;
        } else if (direction === 'next' && this.currentPage < Math.ceil(this.filteredProducts.length / this.itemsPerPage)) {
            this.currentPage++;
        }
        this.renderProducts();
    }

    showQuickView(productId) {
        const product = this.products.find(p => p.id === parseInt(productId));
        const modal = document.getElementById('quickViewModal');
        const content = modal.querySelector('.modal-content');

        content.innerHTML = `
            <div class="quick-view-product">
                <div class="quick-view-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="quick-view-details">
                    <h2>${product.name}</h2>
                    <div class="product-rating">
                        ${this.generateStarRating(product.rating)}
                        <span>(${product.reviews} avis)</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">${product.price.toFixed(2)} €</span>
                        ${product.originalPrice ? `
                            <span class="original-price">${product.originalPrice.toFixed(2)} €</span>
                        ` : ''}
                    </div>
                    <p class="product-description">${product.description}</p>
                    <div class="product-status">
                        <span class="stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}">
                            <i class="fas fa-${product.inStock ? 'check' : 'times'}"></i>
                            ${product.inStock ? 'En stock' : 'Rupture de stock'}
                        </span>
                    </div>
                    <div class="quick-view-actions">
                        <button class="add-to-cart" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">
                            <i class="fas fa-shopping-cart"></i> Ajouter au panier
                        </button>
                        <a href="product.html?id=${product.id}" class="view-details">
                            Voir les détails
                        </a>
                    </div>
                </div>
                <button class="close-modal">×</button>
            </div>
        `;

        modal.style.display = 'flex';

        // Close button functionality
        content.querySelector('.close-modal').addEventListener('click', () => this.closeQuickView());
    }

    closeQuickView() {
        document.getElementById('quickViewModal').style.display = 'none';
    }
}

// Initialize the products manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.productsManager = new ProductsManager();
});

// Add these styles to your CSS
const styles = `
    .products-header {
        background: linear-gradient(to right, #4a90e2, #357abd);
    }

    .product-filters {
        background: white;
        padding: 20px;
        margin-bottom: 30px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .filter-container {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        align-items: flex-end;
    }

    .filter-group {
        flex: 1;
        min-width: 200px;
    }

    .filter-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
    }

    .filter-group select {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
    }

    .filter-group.checkboxes {
        display: flex;
        gap: 20px;
    }

    .checkbox-container {
        display: flex;
        align-items: center;
        gap: 5px;
        cursor: pointer;
    }

    .clear-filters-btn {
        padding: 8px 15px;
        background: #f44336;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .active-filters {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 20px;
    }

    .filter-tag {
        background: #e0e0e0;
        padding: 5px 10px;
        border-radius: 15px;
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .filter-tag i {
        cursor: pointer;
    }

    .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
    }

    .product-card {
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        transition: transform 0.3s;
    }

    .product-card:hover {
        transform: translateY(-5px);
    }

    .product-image {
        position: relative;
        overflow: hidden;
    }

    .product-image img {
        width: 100%;
        height: 250px;
        object-fit: cover;
    }

    .promo-tag {
        position: absolute;
        top: 10px;
        right: 10px;
        background: #ff4444;
        color: white;
        padding: 5px 10px;
        border-radius: 3px;
    }

    .quick-view-btn {
        position: absolute;
        bottom: -40px;
        left: 0;
        right: 0;
        background: rgba(0,0,0,0.7);
        color: white;
        border: none;
        padding: 10px;
        cursor: pointer;
        transition: bottom 0.3s;
    }

    .product-info {
        padding: 15px;
    }

    .product-rating {
        color: #ffc107;
        margin: 5px 0;
    }

    .product-price {
        margin: 10px 0;
    }

    .current-price {
        font-size: 1.2em;
        font-weight: bold;
        color: #4a90e2;
    }

    .original-price {
        text-decoration: line-through;
        color: #999;
        margin-left: 10px;
    }

    .product-actions {
        margin-top: 15px;
    }

    .add-to-cart {
        width: 100%;
        padding: 10px;
        background: #4a90e2;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.3s;
    }

    .add-to-cart:hover {
        background: #357abd;
    }

    .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        margin: 30px 0;
    }

    .page-numbers {
        display: flex;
        gap: 5px;
    }

    .page-number {
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
    }

    .page-number.active {
        background: #4a90e2;
        color: white;
        border-color: #4a90e2;
    }

    .items-per-page {
        text-align: center;
        margin-bottom: 30px;
    }

    .no-results {
        grid-column: 1 / -1;
        text-align: center;
        padding: 50px;
    }

    .no-results i {
        font-size: 3em;
        color: #999;
        margin-bottom: 20px;
    }

    /* Quick View Modal Styles */
    .modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        z-index: 1000;
        justify-content: center;
        align-items: center;
    }

    .quick-view-product {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px;
        background: white;
        padding: 30px;
        border-radius: 8px;
        max-width: 900px;
        position: relative;
    }

    .close-modal {
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 24px;
        background: none;
        border: none;
        cursor: pointer;
    }

    @media (max-width: 768px) {
        .filter-container {
            flex-direction: column;
        }

        .filter-group {
            width: 100%;
        }

        .quick-view-product {
            grid-template-columns: 1fr;
        }
    }
`;