class ReviewsManager {
    constructor() {
        this.reviews = JSON.parse(localStorage.getItem('reviews')) || [];
        this.currentPage = 1;
        this.itemsPerPage = 9;
        this.filteredReviews = [];
        
        this.initializeEventListeners();
        this.loadProducts();
        this.applyFilters();
    }

    initializeEventListeners() {
        // Filters
        document.getElementById('categoryFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('ratingFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('sortFilter').addEventListener('change', () => this.applyFilters());

        // Write review button
        document.getElementById('writeReviewBtn').addEventListener('click', () => this.openReviewModal());

        // Rating stars
        const stars = document.querySelectorAll('.rating-input i');
        stars.forEach(star => {
            star.addEventListener('click', (e) => this.handleRatingClick(e));
            star.addEventListener('mouseover', (e) => this.handleRatingHover(e));
            star.addEventListener('mouseout', () => this.handleRatingOut());
        });

        // Review form
        document.getElementById('reviewForm').addEventListener('submit', (e) => this.handleReviewSubmit(e));

        // Close modal
        document.querySelector('.close-modal').addEventListener('click', () => {
            document.getElementById('reviewModal').style.display = 'none';
        });

        // Pagination
        document.getElementById('prevPage').addEventListener('click', () => this.changePage(-1));
        document.getElementById('nextPage').addEventListener('click', () => this.changePage(1));
    }

    loadProducts() {
        const products = [
            { id: 1, name: 'Smartphone Pro', category: 'tech' },
            { id: 2, name: 'Écouteurs Sans Fil', category: 'tech' },
            { id: 3, name: 'T-shirt Tendance', category: 'fashion' },
            // Add more products as needed
        ];

        const select = document.getElementById('productSelect');
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = product.name;
            select.appendChild(option);
        });
    }

    applyFilters() {
        const categoryFilter = document.getElementById('categoryFilter').value;
        const ratingFilter = document.getElementById('ratingFilter').value;
        const sortFilter = document.getElementById('sortFilter').value;

        this.filteredReviews = this.reviews.filter(review => {
            const passCategory = !categoryFilter || review.category === categoryFilter;
            const passRating = !ratingFilter || review.rating >= parseInt(ratingFilter);
            return passCategory && passRating;
        });

        this.sortReviews(sortFilter);
        this.currentPage = 1;
        this.renderReviews();
        this.updatePagination();
    }

    sortReviews(sortType) {
        switch(sortType) {
            case 'recent':
                this.filteredReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'rating':
                this.filteredReviews.sort((a, b) => b.rating - a.rating);
                break;
            case 'helpful':
                this.filteredReviews.sort((a, b) => b.helpfulVotes - a.helpfulVotes);
                break;
        }
    }

    renderReviews() {
        const grid = document.getElementById('reviewsGrid');
        grid.innerHTML = '';

        if (this.filteredReviews.length === 0) {
            grid.innerHTML = `
                <div class="no-reviews">
                    <i class="fas fa-comments"></i>
                    <p>Aucun avis pour le moment</p>
                </div>
            `;
            return;
        }

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageReviews = this.filteredReviews.slice(startIndex, endIndex);

        pageReviews.forEach(review => {
            const reviewEl = document.createElement('div');
            reviewEl.classList.add('review-card');
            reviewEl.innerHTML = `
                <div class="review-header">
                    <img src="${review.userAvatar}" alt="${review.userName}" class="user-avatar">
                    <div class="review-meta">
                        <h3>${review.userName}</h3>
                        <div class="rating">
                            ${this.generateStars(review.rating)}
                        </div>
                        <span class="review-date">${new Date(review.date).toLocaleDateString()}</span>
                    </div>
                </div>
                <h4>${review.title}</h4>
                <p>${review.content}</p>
                ${review.photos ? this.generatePhotoGallery(review.photos) : ''}
                <div class="review-footer">
                    <button class="helpful-btn" onclick="window.reviewsManager.voteHelpful('${review.id}')">
                        <i class="far fa-thumbs-up"></i> Utile (${review.helpfulVotes})
                    </button>
                    <button class="report-btn" onclick="window.reviewsManager.reportReview('${review.id}')">
                        <i class="far fa-flag"></i> Signaler
                    </button>
                </div>
            `;
            grid.appendChild(reviewEl);
        });
    }

    generateStars(rating) {
        return Array(5).fill('').map((_, index) => 
            `<i class="fas fa-star${index < rating ? '' : ' empty'}"></i>`
        ).join('');
    }

    generatePhotoGallery(photos) {
        return `
            <div class="review-photos">
                ${photos.map(photo => `
                    <img src="${photo}" alt="Review photo" onclick="window.reviewsManager.openPhotoModal('${photo}')">
                `).join('')}
            </div>
        `;
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredReviews.length / this.itemsPerPage);
        document.getElementById('prevPage').disabled = this.currentPage === 1;
        document.getElementById('nextPage').disabled = this.currentPage === totalPages;
        document.getElementById('currentPage').textContent = `Page ${this.currentPage}`;
    }

    changePage(delta) {
        const newPage = this.currentPage + delta;
        const totalPages = Math.ceil(this.filteredReviews.length / this.itemsPerPage);
        
        if (newPage >= 1 && newPage <= totalPages) {
            this.currentPage = newPage;
            this.renderReviews();
            this.updatePagination();
        }
    }

    openReviewModal() {
        // Check if user is logged in
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            alert('Veuillez vous connecter pour laisser un avis');
            window.location.href = 'login.html';
            return;
        }

        document.getElementById('reviewModal').style.display = 'flex';
    }

    handleRatingClick(event) {
        const rating = parseInt(event.target.dataset.rating);
        this.setRating(rating);
    }

    handleRatingHover(event) {
        const rating = parseInt(event.target.dataset.rating);
        this.highlightStars(rating);
    }

    handleRatingOut() {
        const form = document.getElementById('reviewForm');
        const currentRating = parseInt(form.dataset.rating) || 0;
        this.highlightStars(currentRating);
    }

    setRating(rating) {
        const form = document.getElementById('reviewForm');
        form.dataset.rating = rating;
        this.highlightStars(rating);
    }

    highlightStars(rating) {
        document.querySelectorAll('.rating-input i').forEach((star, index) => {
            star.classList.toggle('fas', index < rating);
            star.classList.toggle('far', index >= rating);
        });
    }

    async handleReviewSubmit(event) {
        event.preventDefault();

        const form = event.target;
        const rating = parseInt(form.dataset.rating);
        if (!rating) {
            alert('Veuillez donner une note');
            return;
        }

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const photos = await this.handlePhotoUpload();

        const review = {
            id: Date.now().toString(),
            productId: document.getElementById('productSelect').value,
            userId: currentUser.id,
            userName: `${currentUser.firstName} ${currentUser.lastName}`,
            userAvatar: currentUser.avatar,
            rating: rating,
            title: document.getElementById('reviewTitle').value,
            content: document.getElementById('reviewContent').value,
            photos: photos,
            date: new Date().toISOString(),
            helpfulVotes: 0,
            reported: false
        };

        this.reviews.unshift(review);
        localStorage.setItem('reviews', JSON.stringify(this.reviews));
        
        document.getElementById('reviewModal').style.display = 'none';
        form.reset();
        this.applyFilters();
        alert('Merci pour votre avis !');
    }

    async handlePhotoUpload() {
        const fileInput = document.getElementById('reviewPhotos');
        const files = Array.from(fileInput.files);
        
        if (files.length === 0) return [];

        try {
            const photos = await Promise.all(files.map(file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            }));
            return photos;
        } catch (error) {
            console.error('Error uploading photos:', error);
            return [];
        }
    }

    voteHelpful(reviewId) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            alert('Veuillez vous connecter pour voter');
            return;
        }

        const reviewIndex = this.reviews.findIndex(r => r.id === reviewId);
        if (reviewIndex !== -1) {
            this.reviews[reviewIndex].helpfulVotes++;
            localStorage.setItem('reviews', JSON.stringify(this.reviews));
            this.applyFilters();
        }
    }

    reportReview(reviewId) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            alert('Veuillez vous connecter pour signaler un avis');
            return;
        }

        if (confirm('Êtes-vous sûr de vouloir signaler cet avis ?')) {
            const reviewIndex = this.reviews.findIndex(r => r.id === reviewId);
            if (reviewIndex !== -1) {
                this.reviews[reviewIndex].reported = true;
                localStorage.setItem('reviews', JSON.stringify(this.reviews));
                alert('Avis signalé. Merci de nous aider à maintenir la qualité des avis.');
                this.applyFilters();
            }
        }
    }

    openPhotoModal(photoUrl) {
        const modalContent = document.createElement('div');
        modalContent.classList.add('photo-modal');
        modalContent.innerHTML = `
            <img src="${photoUrl}" alt="Review photo">
            <button class="close-modal">&times;</button>
        `;
        
        document.body.appendChild(modalContent);
        modalContent.querySelector('.close-modal').onclick = () => modalContent.remove();
    }
}

// Initialize ReviewsManager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.reviewsManager = new ReviewsManager();
});

// Add styles
const additionalStyles = `
.reviews-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.review-card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.review-header {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

.user-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 15px;
}

.rating {
    color: #ffc107;
    margin: 5px 0;
}

.rating .empty {
    color: #e0e0e0;
}

.review-photos {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 10px;
    margin: 15px 0;
}

.review-photos img {
    width: 100%;
    height: 100px;
    object-fit: cover;
    border-radius: 4px;
    cursor: pointer;
}

.review-footer {
    display: flex;
    gap: 15px;
    margin-top: 15px;
}

.helpful-btn, .report-btn {
    border: none;
    background: none;
    color: #666;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
}

.helpful-btn:hover {
    color: var(--primary-color);
}

.report-btn:hover {
    color: #dc3545;
}

.photo-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.photo-modal img {
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
}

.photo-modal .close-modal {
    position: absolute;
    top: 20px;
    right: 20px;
    color: white;
    font-size: 30px;
    cursor: pointer;
    background: none;
    border: none;
}

.no-reviews {
    text-align: center;
    padding: 40px;
    color: #666;
}

.no-reviews i {
    font-size: 48px;
    margin-bottom: 20px;
}

@media (max-width: 768px) {
    .review-footer {
        flex-direction: column;
    }
    
    .review-photos {
        grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    }
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);