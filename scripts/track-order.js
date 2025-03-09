document.addEventListener('DOMContentLoaded', () => {
    const trackingManager = new TrackingManager();
});

class TrackingManager {
    constructor() {
        this.trackingForm = document.getElementById('trackingForm');
        this.trackingResults = document.getElementById('trackingResults');
        
        // Simulated order database
        this.orders = {
            'ORD-123456789': {
                email: 'test@example.com',
                date: '2025-01-15',
                status: 'en-transit',
                estimatedDelivery: '2025-01-18',
                tracking: [
                    {
                        status: 'commande-confirmee',
                        date: '2025-01-15 10:30',
                        description: 'Commande confirmée'
                    },
                    {
                        status: 'preparation',
                        date: '2025-01-16 09:15',
                        description: 'En cours de préparation'
                    },
                    {
                        status: 'expedition',
                        date: '2025-01-16 16:45',
                        description: 'Commande expédiée'
                    },
                    {
                        status: 'en-transit',
                        date: '2025-01-17 08:30',
                        description: 'En transit'
                    }
                ],
                items: [
                    {
                        name: 'Smartphone Pro',
                        quantity: 1,
                        price: 599.99,
                        image: 'https://via.placeholder.com/80x80?text=Smartphone'
                    },
                    {
                        name: 'Écouteurs Sans Fil',
                        quantity: 2,
                        price: 129.99,
                        image: 'https://via.placeholder.com/80x80?text=Écouteurs'
                    }
                ],
                delivery: {
                    name: 'Jean Dupont',
                    phone: '+33 6 12 34 56 78',
                    vehicle: 'Utilitaire blanc',
                    currentLocation: {
                        lat: 48.8566,
                        lng: 2.3522
                    }
                }
            }
        };

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.trackingForm.addEventListener('submit', this.handleTracking.bind(this));
        document.getElementById('startChat').addEventListener('click', this.startChat.bind(this));
    }

    handleTracking(event) {
        event.preventDefault();
        
        const orderNumber = document.getElementById('orderNumber').value;
        const email = document.getElementById('email').value;

        const order = this.orders[orderNumber];

        if (order && order.email === email) {
            this.displayTrackingResults(orderNumber, order);
        } else {
            alert('Commande non trouvée. Veuillez vérifier vos informations.');
        }
    }

    displayTrackingResults(orderNumber, order) {
        // Update order info
        document.getElementById('displayOrderNumber').textContent = orderNumber;
        document.getElementById('orderDate').textContent = new Date(order.date).toLocaleDateString('fr-FR');
        document.getElementById('deliveryStatus').textContent = this.getStatusText(order.status);
        document.getElementById('estimatedDelivery').textContent = new Date(order.estimatedDelivery).toLocaleDateString('fr-FR');

        // Create timeline
        this.createTimeline(order.tracking);

        // Display order items
        this.displayOrderItems(order.items);

        // Initialize map
        this.initializeMap(order.delivery.currentLocation);

        // Display delivery contact
        this.displayDeliveryContact(order.delivery);

        // Show results section
        this.trackingResults.style.display = 'block';
    }

    getStatusText(status) {
        const statusMap = {
            'commande-confirmee': 'Commande confirmée',
            'preparation': 'En préparation',
            'expedition': 'Expédiée',
            'en-transit': 'En transit',
            'livree': 'Livrée'
        };
        return statusMap[status] || status;
    }

    createTimeline(trackingSteps) {
        const timelineContainer = document.getElementById('timelineSteps');
        timelineContainer.innerHTML = '';

        trackingSteps.forEach((step, index) => {
            const stepEl = document.createElement('div');
            stepEl.classList.add('timeline-step');
            if (index < trackingSteps.length - 1) stepEl.classList.add('completed');
            if (index === trackingSteps.length - 1) stepEl.classList.add('current');

            stepEl.innerHTML = `
                <div class="step-icon">
                    <i class="fas ${this.getStepIcon(step.status)}"></i>
                </div>
                <div class="step-info">
                    <h4>${this.getStatusText(step.status)}</h4>
                    <p>${new Date(step.date).toLocaleString('fr-FR')}</p>
                    <p>${step.description}</p>
                </div>
            `;

            timelineContainer.appendChild(stepEl);
        });
    }

    getStepIcon(status) {
        const iconMap = {
            'commande-confirmee': 'fa-check-circle',
            'preparation': 'fa-box',
            'expedition': 'fa-warehouse',
            'en-transit': 'fa-truck',
            'livree': 'fa-home'
        };
        return iconMap[status] || 'fa-circle';
    }

    displayOrderItems(items) {
        const itemsContainer = document.getElementById('orderItems');
        itemsContainer.innerHTML = '';

        items.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.classList.add('order-item');
            itemEl.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>Quantité: ${item.quantity}</p>
                    <p>Prix: ${item.price.toFixed(2)} €</p>
                </div>
            `;
            itemsContainer.appendChild(itemEl);
        });
    }

    initializeMap(location) {
        const map = document.getElementById('map');
        map.innerHTML = `
            <div class="mock-map">
                <div class="map-marker" style="left: 50%; top: 50%;">
                    <i class="fas fa-truck"></i>
                </div>
                <p class="map-text">Simulation de carte - Position du livreur</p>
            </div>
        `;
    }

    displayDeliveryContact(delivery) {
        const contactContainer = document.getElementById('deliveryContactInfo');
        contactContainer.innerHTML = `
            <div class="delivery-info">
                <p><i class="fas fa-user"></i> Livreur: ${delivery.name}</p>
                <p><i class="fas fa-phone"></i> Téléphone: ${delivery.phone}</p>
                <p><i class="fas fa-truck"></i> Véhicule: ${delivery.vehicle}</p>
                <button onclick="alert('Appel en cours...')" class="contact-btn">
                    <i class="fas fa-phone"></i> Appeler le livreur
                </button>
            </div>
        `;
    }

    startChat() {
        const chatContent = document.createElement('div');
        chatContent.classList.add('chat-window');
        chatContent.innerHTML = `
            <div class="chat-header">
                <h3>Support Client</h3>
                <button class="close-chat"><i class="fas fa-times"></i></button>
            </div>
            <div class="chat-messages">
                <div class="message system">
                    Un conseiller va vous répondre dans quelques instants...
                </div>
            </div>
            <div class="chat-input">
                <input type="text" placeholder="Tapez votre message...">
                <button><i class="fas fa-paper-plane"></i></button>
            </div>
        `;

        document.body.appendChild(chatContent);

        // Handle chat interactions
        chatContent.querySelector('.close-chat').addEventListener('click', () => {
            chatContent.remove();
        });

        const input = chatContent.querySelector('input');
        const sendButton = chatContent.querySelector('.chat-input button');
        const messagesContainer = chatContent.querySelector('.chat-messages');

        const sendMessage = () => {
            const message = input.value.trim();
            if (message) {
                const messageEl = document.createElement('div');
                messageEl.classList.add('message', 'user');
                messageEl.textContent = message;
                messagesContainer.appendChild(messageEl);
                input.value = '';

                // Simulate response
                setTimeout(() => {
                    const responseEl = document.createElement('div');
                    responseEl.classList.add('message', 'agent');
                    responseEl.textContent = "Un conseiller va vous répondre rapidement.";
                    messagesContainer.appendChild(responseEl);
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }, 1000);
            }
        };

        sendButton.addEventListener('click', sendMessage);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
}

// Add these styles to your CSS
const styles = `
    .tracking-page {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
    }

    .tracking-search {
        background-color: white;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        margin-bottom: 30px;
    }

    .tracking-search form {
        max-width: 600px;
        margin: 0 auto;
    }

    .form-group {
        margin-bottom: 20px;
    }

    .form-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
    }

    .form-group input {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
    }

    .tracking-results {
        background-color: white;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .order-info {
        margin-bottom: 30px;
    }

    .tracking-timeline {
        margin: 40px 0;
    }

    .timeline-steps {
        display: flex;
        justify-content: space-between;
        position: relative;
        margin-bottom: 30px;
    }

    .timeline-step {
        flex: 1;
        text-align: center;
        position: relative;
    }

    .step-icon {
        width: 40px;
        height: 40px;
        background-color: #f0f0f0;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 10px;
    }

    .timeline-step.completed .step-icon {
        background-color: var(--primary-color);
        color: white;
    }

    .timeline-step.current .step-icon {
        background-color: var(--secondary-color);
        color: white;
    }

    .order-items {
        margin: 30px 0;
    }

    .order-item {
        display: flex;
        align-items: center;
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 5px;
        margin-bottom: 10px;
    }

    .order-item img {
        width: 80px;
        height: 80px;
        object-fit: cover;
        margin-right: 15px;
    }

    .mock-map {
        height: 300px;
        background-color: #f0f0f0;
        position: relative;
        border-radius: 8px;
        overflow: hidden;
    }

    .map-marker {
        position: absolute;
        transform: translate(-50%, -50%);
        color: var(--primary-color);
        font-size: 24px;
    }

    .delivery-contact {
        margin-top: 30px;
    }

    .delivery-info {
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
    }

    .contact-btn {
        background-color: var(--primary-color);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 10px;
    }

    .chat-window {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 300px;
        height: 400px;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        display: flex;
        flex-direction: column;
    }

    @media (max-width: 768px) {
        .timeline-steps {
            flex-direction: column;
            align-items: flex-start;
        }

        .timeline-step {
            margin-bottom: 20px;
        }

        .order-item {
            flex-direction: column;
            text-align: center;
        }

        .order-item img {
            margin: 0 0 10px 0;
        }
    }
`;

// Add the styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);