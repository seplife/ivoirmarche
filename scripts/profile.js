class ProfileManager {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.userDetails = null;
        
        if (!this.currentUser) {
            window.location.href = 'login.html';
            return;
        }

        this.initializeProfile();
        this.initializeEventListeners();
    }

    async initializeProfile() {
        // Load user details
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        this.userDetails = users.find(u => u.email === this.currentUser.email);

        if (!this.userDetails) {
            alert('Erreur lors du chargement du profil');
            window.location.href = 'login.html';
            return;
        }

        // Update profile header
        document.getElementById('userAvatar').src = this.userDetails.avatar || 
            `https://ui-avatars.com/api/?name=${this.userDetails.firstName}+${this.userDetails.lastName}&background=random`;
        document.getElementById('userName').textContent = `${this.userDetails.firstName} ${this.userDetails.lastName}`;
        document.getElementById('userEmail').textContent = this.userDetails.email;

        // Load orders
        this.loadOrders();

        // Load personal info
        this.loadPersonalInfo();

        // Load addresses
        this.loadAddresses();
    }

    initializeEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Forms submission
        document.getElementById('personalInfoForm').addEventListener('submit', (e) => this.updatePersonalInfo(e));
        document.getElementById('passwordForm').addEventListener('submit', (e) => this.updatePassword(e));
        
        // Avatar change
        document.getElementById('changeAvatarBtn').addEventListener('click', () => this.changeAvatar());
        
        // Edit profile
        document.getElementById('editProfileBtn').addEventListener('click', () => this.switchTab('info'));
        
        // Address management
        document.getElementById('addAddressBtn').addEventListener('click', () => this.showAddAddressModal());
    }

    switchTab(tabId) {
        // Update active tab
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabId);
        });

        // Show corresponding section
        document.querySelectorAll('.profile-section').forEach(section => {
            section.classList.toggle('active', section.id === `${tabId}Section`);
        });
    }

    loadOrders() {
        const ordersList = document.getElementById('ordersList');
        const orders = JSON.parse(localStorage.getItem('orders') || '[]')
            .filter(order => order.shipping.address.email === this.currentUser.email)
            .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

        if (orders.length === 0) {
            ordersList.innerHTML = '<p class="no-orders">Aucune commande pour le moment</p>';
            return;
        }

        ordersList.innerHTML = orders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <h3>Commande ${order.orderNumber}</h3>
                        <p>Date: ${new Date(order.orderDate).toLocaleDateString()}</p>
                    </div>
                    <div class="order-status ${this.getStatusClass(order.currentStep)}">
                        ${this.getStatusText(order.currentStep)}
                    </div>
                </div>
                <div class="order-summary">
                    <p>${order.items.length} article(s)</p>
                    <p>Total: ${order.total.toFixed(2)} €</p>
                </div>
                <div class="order-actions">
                    <button class="view-order-btn" onclick="window.profileManager.viewOrder('${order.orderNumber}')">
                        Voir la commande
                    </button>
                    <button class="track-order-btn" onclick="window.location.href='order-tracking.html?tracking=${order.trackingNumber}'">
                        Suivre la livraison
                    </button>
                    ${order.currentStep <= 1 ? `
                        <button class="modify-order-btn" onclick="window.profileManager.modifyOrder('${order.orderNumber}')">
                            Modifier la commande
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    getStatusClass(step) {
        const statusClasses = ['pending', 'preparing', 'shipping', 'delivered'];
        return statusClasses[step] || 'pending';
    }

    getStatusText(step) {
        const statusTexts = [
            'Commande confirmée',
            'En préparation',
            'En transit',
            'Livré'
        ];
        return statusTexts[step] || 'Inconnu';
    }

    viewOrder(orderNumber) {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const order = orders.find(o => o.orderNumber === orderNumber);
        
        if (!order) {
            alert('Commande introuvable');
            return;
        }

        const modal = document.getElementById('orderDetailsModal');
        const content = document.getElementById('orderDetailsContent');
        
        content.innerHTML = `
            <div class="order-details">
                <div class="order-info">
                    <p><strong>Numéro de commande:</strong> ${order.orderNumber}</p>
                    <p><strong>Date:</strong> ${new Date(order.orderDate).toLocaleDateString()}</p>
                    <p><strong>Statut:</strong> ${this.getStatusText(order.currentStep)}</p>
                    <p><strong>Numéro de suivi:</strong> ${order.trackingNumber}</p>
                </div>
                
                <div class="order-items">
                    <h3>Articles</h3>
                    ${order.items.map(item => `
                        <div class="order-item">
                            <img src="${item.image}" alt="${item.name}">
                            <div class="item-details">
                                <h4>${item.name}</h4>
                                <p>Quantité: ${item.quantity}</p>
                                <p>Prix: ${item.price.toFixed(2)} €</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="order-summary">
                    <h3>Récapitulatif</h3>
                    <p><strong>Sous-total:</strong> ${order.total.toFixed(2)} €</p>
                    <p><strong>Livraison:</strong> ${order.shipping.method === 'express' ? '9.99 €' : 'Gratuit'}</p>
                    <p><strong>Total:</strong> ${(order.total + (order.shipping.method === 'express' ? 9.99 : 0)).toFixed(2)} €</p>
                </div>

                <div class="shipping-info">
                    <h3>Adresse de livraison</h3>
                    <p>${order.shipping.address.firstName} ${order.shipping.address.lastName}</p>
                    <p>${order.shipping.address.address}</p>
                    <p>${order.shipping.address.postalCode} ${order.shipping.address.city}</p>
                </div>
            </div>
        `;

        modal.style.display = 'flex';
        
        // Close button functionality
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.onclick = () => modal.style.display = 'none';
        
        // Click outside to close
        modal.onclick = (e) => {
            if (e.target === modal) modal.style.display = 'none';
        };
    }

    modifyOrder(orderNumber) {
        if (confirm('Voulez-vous modifier cette commande ?')) {
            window.location.href = `modify-order.html?orderId=${orderNumber}`;
        }
    }

    loadPersonalInfo() {
        document.getElementById('firstName').value = this.userDetails.firstName || '';
        document.getElementById('lastName').value = this.userDetails.lastName || '';
        document.getElementById('phone').value = this.userDetails.phone || '';
    }

    async updatePersonalInfo(event) {
        event.preventDefault();
        
        const updatedInfo = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            phone: document.getElementById('phone').value
        };

        try {
            // Update user details in localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex(u => u.email === this.currentUser.email);
            
            if (userIndex !== -1) {
                users[userIndex] = { ...users[userIndex], ...updatedInfo };
                localStorage.setItem('users', JSON.stringify(users));
                
                // Update current user
                this.userDetails = users[userIndex];
                
                // Update display
                document.getElementById('userName').textContent = 
                    `${this.userDetails.firstName} ${this.userDetails.lastName}`;
                
                alert('Informations mises à jour avec succès');
            }
        } catch (error) {
            console.error('Error updating personal info:', error);
            alert('Une erreur est survenue lors de la mise à jour des informations');
        }
    }

    async updatePassword(event) {
        event.preventDefault();
        
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (newPassword !== confirmPassword) {
            alert('Les nouveaux mots de passe ne correspondent pas');
            return;
        }

        try {
            // Verify current password
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex(u => 
                u.email === this.currentUser.email && u.password === currentPassword
            );

            if (userIndex === -1) {
                alert('Mot de passe actuel incorrect');
                return;
            }

            // Update password
            users[userIndex].password = newPassword;
            localStorage.setItem('users', JSON.stringify(users));

            alert('Mot de passe mis à jour avec succès');
            document.getElementById('passwordForm').reset();
        } catch (error) {
            console.error('Error updating password:', error);
            alert('Une erreur est survenue lors de la mise à jour du mot de passe');
        }
    }

    changeAvatar() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    const reader = new FileReader();
                    reader.onload = async (e) => {
                        const avatar = e.target.result;
                        
                        // Update user avatar in localStorage
                        const users = JSON.parse(localStorage.getItem('users') || '[]');
                        const userIndex = users.findIndex(u => u.email === this.currentUser.email);
                        
                        if (userIndex !== -1) {
                            users[userIndex].avatar = avatar;
                            localStorage.setItem('users', JSON.stringify(users));
                            
                            // Update display
                            document.getElementById('userAvatar').src = avatar;
                            
                            // Update current user session
                            this.currentUser.avatar = avatar;
                            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                        }
                    };
                    reader.readAsDataURL(file);
                } catch (error) {
                    console.error('Error updating avatar:', error);
                    alert('Une erreur est survenue lors de la mise à jour de l\'avatar');
                }
            }
        };
        
        input.click();
    }
}

// Initialize profile manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.profileManager = new ProfileManager();
});

// Add necessary styles
const additionalStyles = `
.profile-page {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.profile-header {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 30px;
}

.profile-avatar {
    text-align: center;
}

.profile-avatar img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 10px;
}

.profile-nav {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.nav-tab {
    padding: 10px 20px;
    border: none;
    background: none;
    cursor: pointer;
    border-bottom: 2px solid transparent;
}

.nav-tab.active {
    border-bottom-color: var(--primary-color);
    color: var(--primary-color);
}

.profile-section {
    display: none;
}

.profile-section.active {
    display: block;
}

.orders-list {
    display: grid;
    gap: 20px;
}

.order-card {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.order-status {
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 0.9em;
}

.order-status.pending { background: #fff3cd; }
.order-status.preparing { background: #cce5ff; }
.order-status.shipping { background: #d4edda; }
.order-status.delivered { background: #d1e7dd; }

.order-actions {
    display: flex;
    gap: 10px;
    margin-top: 15px;
}

.order-actions button {
    padding: 8px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.view-order-btn { background: var(--primary-color); color: white; }
.track-order-btn { background: #6c757d; color: white; }
.modify-order-btn { background: #ffc107; color: black; }

.info-form, .security-form {
    max-width: 500px;
}

.addresses-list {
    display: grid;
    gap: 15px;
    margin-bottom: 20px;
}

.modal-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 800px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
}

.close-modal {
    float: right;
    border: none;
    background: none;
    font-size: 1.5em;
    cursor: pointer;
}

.order-details {
    margin-top: 20px;
}

.order-item {
    display: flex;
    gap: 15px;
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
}

.order-item img {
    width: 80px;
    height: 80px;
    object-fit: cover;
}

@media (max-width: 768px) {
    .profile-header {
        flex-direction: column;
        text-align: center;
    }

    .profile-nav {
        flex-wrap: wrap;
    }

    .order-actions {
        flex-direction: column;
    }
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);