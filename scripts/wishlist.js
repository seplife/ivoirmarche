import { createProductElement } from './product-utils.js';

class WishlistManager {
    constructor() {
        this.wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        this.wishlistContainer = document.getElementById('wishlistItems');
        
        this.initializeEventListeners();
        this.renderWishlist();
        this.loadRecommendedProducts();
    }

    initializeEventListeners() {
        document.getElementById('shareWishlistBtn').addEventListener('click', () => this.showShareModal());
        document.getElementById('clearWishlistBtn').addEventListener('click', () => this.clearWishlist());
        document.getElementById('copyLinkBtn').addEventListener('click', () => this.copyShareLink());

        // Share buttons in modal
        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleShare(e.target.dataset.platform));
        });

        // Close modal
        document.querySelector('.close-modal').addEventListener('click', () => {
            document.getElementById('shareModal').style.display = 'none';
        });
    }

    renderWishlist() {
        this.wishlistContainer.innerHTML = '';

        if (this.wishlist.length === 0) {
            this.wishlistContainer.innerHTML = `
                <div class="empty-wishlist">
                    <i class="fas fa-heart-broken"></i>
                    <p>Votre liste de souhaits est vide</p>
                    <a href="categories.html" class="primary-btn">Découvrir des produits</a>
                </div>
            `;
            return;
        }

        this.wishlist.forEach((item, index) => {
            const wishlistItem = document.createElement('div');
            wishlistItem.classList.add('wishlist-item');
            wishlistItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p class="item-price">${item.price.toFixed(2)} €</p>
                    <p class="stock-status ${item.inStock ? 'in-stock' : 'out-of-stock'}">
                        ${item.inStock ? 'En stock' : 'Rupture de stock'}
                    </p>
                </div>
                <div class="item-actions">
                    <button class="add-to-cart-btn" onclick="window.wishlistManager.addToCart(${index})"
                            ${!item.inStock ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart"></i> Ajouter au panier
                    </button>
                    <button class="remove-btn" onclick="window.wishlistManager.removeFromWishlist(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            this.wishlistContainer.appendChild(wishlistItem);
        });
    }

    addToCart(index) {
        const item = this.wishlist[index];
        
        // Add to cart (reusing existing cart functionality)
        window.addToCart(item.id, item.name, item.price, item.image);
        
        // Optionally remove from wishlist after adding to cart
        if (confirm('Article ajouté au panier. Souhaitez-vous le retirer de votre liste de souhaits ?')) {
            this.removeFromWishlist(index);
        }
    }

    removeFromWishlist(index) {
        if (confirm('Êtes-vous sûr de vouloir retirer cet article de votre liste de souhaits ?')) {
            this.wishlist.splice(index, 1);
            this.saveWishlist();
            this.renderWishlist();
        }
    }

    clearWishlist() {
        if (confirm('Êtes-vous sûr de vouloir vider votre liste de souhaits ?')) {
            this.wishlist = [];
            this.saveWishlist();
            this.renderWishlist();
        }
    }

    saveWishlist() {
        localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
    }

    loadRecommendedProducts() {
        const recommendedGrid = document.getElementById('recommendedProductsGrid');
        const recommendedProducts = [
            { 
                id: 1, 
                name: 'Montre Connectée Pro', 
                price: 199.99, 
                image: 'https://via.placeholder.com/250x250?text=Montre+Connectée',
                inStock: true
            },
            { 
                id: 2, 
                name: 'Écouteurs Sans Fil Plus', 
                price: 149.99, 
                image: 'https://via.placeholder.com/250x250?text=Écouteurs',
                inStock: true
            },
            { 
                id: 3, 
                name: 'Tablette Ultra HD', 
                price: 299.99, 
                image: 'https://via.placeholder.com/250x250?text=Tablette',
                inStock: true
            }
        ];

        recommendedProducts.forEach(product => {
            const productEl = createProductElement(product);
            recommendedGrid.appendChild(productEl);
        });
    }

    showShareModal() {
        const shareModal = document.getElementById('shareModal');
        const shareLink = document.getElementById('shareLink');
        
        // Generate share link (in real app, this would be a unique URL)
        const wishlistId = btoa(JSON.stringify(this.wishlist));
        const shareUrl = `${window.location.origin}/shared-wishlist?id=${wishlistId}`;
        
        shareLink.value = shareUrl;
        shareModal.style.display = 'flex';
    }

    copyShareLink() {
        const shareLink = document.getElementById('shareLink');
        shareLink.select();
        document.execCommand('copy');
        
        const copyBtn = document.getElementById('copyLinkBtn');
        copyBtn.textContent = 'Copié !';
        setTimeout(() => {
            copyBtn.textContent = 'Copier le lien';
        }, 2000);
    }

    handleShare(platform) {
        const shareUrl = document.getElementById('shareLink').value;
        const shareText = 'Découvrez ma liste de souhaits EdenMarket !';
        
        let shareLink;
        switch(platform) {
            case 'whatsapp':
                shareLink = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
                break;
            case 'facebook':
                shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
                break;
            case 'twitter':
                shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
                break;
            case 'email':
                shareLink = `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareUrl)}`;
                break;
        }
        
        window.open(shareLink, '_blank');
    }
}

// Initialize wishlist manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.wishlistManager = new WishlistManager();
});

// Add method to window for adding to wishlist from other pages
window.addToWishlist = function(product) {
    const wishlistManager = window.wishlistManager;
    const existingItem = wishlistManager.wishlist.find(item => item.id === product.id);
    
    if (existingItem) {
        alert('Ce produit est déjà dans votre liste de souhaits');
        return;
    }

    wishlistManager.wishlist.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        inStock: true
    });
    
    wishlistManager.saveWishlist();
    alert('Produit ajouté à votre liste de souhaits');
};

// Add this to your existing styles
const additionalStyles = `
.wishlist-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.wishlist-items {
    display: grid;
    gap: 20px;
    margin-bottom: 30px;
}

.wishlist-item {
    display: flex;
    align-items: center;
    gap: 20px;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.wishlist-item img {
    width: 120px;
    height: 120px;
    object-fit: cover;
    border-radius: 4px;
}

.item-details {
    flex: 1;
}

.stock-status {
    font-weight: bold;
    margin-top: 5px;
}

.stock-status.in-stock {
    color: #28a745;
}

.stock-status.out-of-stock {
    color: #dc3545;
}

.item-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.wishlist-actions {
    display: flex;
    gap: 15px;
    margin-bottom: 30px;
}

.empty-wishlist {
    text-align: center;
    padding: 40px;
}

.empty-wishlist i {
    font-size: 48px;
    color: #ccc;
    margin-bottom: 20px;
}

.share-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 15px;
    margin-bottom: 20px;
}

.share-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    color: white;
    transition: opacity 0.3s;
}

.share-btn[data-platform="whatsapp"] { background: #25D366; }
.share-btn[data-platform="facebook"] { background: #1877F2; }
.share-btn[data-platform="twitter"] { background: #1DA1F2; }
.share-btn[data-platform="email"] { background: #EA4335; }

.share-btn:hover {
    opacity: 0.9;
}

.share-link {
    display: flex;
    gap: 10px;
    margin-top: 20px;
}

.share-link input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

#copyLinkBtn {
    padding: 10px 20px;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

@media (max-width: 768px) {
    .wishlist-item {
        flex-direction: column;
        text-align: center;
    }

    .item-actions {
        width: 100%;
    }
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
