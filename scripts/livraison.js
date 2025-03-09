document.addEventListener('DOMContentLoaded', () => {
    const shippingManager = new ShippingManager();
});

class ShippingManager {
    constructor() {
        this.deliveryZones = {
            'zone-1': {
                name: 'Zone 1 - Paris et Île-de-France',
                delay: '24-48h',
                standardPrice: 'Gratuit dès 50€',
                expressPrice: '9.99€'
            },
            'zone-2': {
                name: 'Zone 2 - Grandes Villes',
                delay: '48-72h',
                standardPrice: 'Gratuit dès 75€',
                expressPrice: '12.99€'
            },
            'zone-3': {
                name: 'Zone 3 - Autres Régions',
                delay: '3-5 jours',
                standardPrice: 'Gratuit dès 100€',
                expressPrice: '14.99€'
            }
        };

        this.shippingPartners = [
            {
                name: 'Express Delivery',
                logo: 'https://via.placeholder.com/150x80?text=Express+Delivery',
                description: 'Livraison express 24/48h'
            },
            {
                name: 'EcoTransit',
                logo: 'https://via.placeholder.com/150x80?text=EcoTransit',
                description: 'Transport éco-responsable'
            },
            {
                name: 'SafeShip',
                logo: 'https://via.placeholder.com/150x80?text=SafeShip',
                description: 'Protection maximale des colis'
            },
            {
                name: 'RelaisPlus',
                logo: 'https://via.placeholder.com/150x80?text=RelaisPlus',
                description: 'Réseau de points relais'
            }
        ];

        this.faqItems = [
            {
                question: "Quels sont les délais de livraison ?",
                answer: "Les délais varient selon votre zone : 24-48h pour Paris et IDF, 48-72h pour les grandes villes, et 3-5 jours pour les autres régions."
            },
            {
                question: "Comment suivre ma commande ?",
                answer: "Vous recevrez un email avec un numéro de suivi dès l'expédition. Utilisez ce numéro sur notre page de suivi ou directement sur le site du transporteur."
            },
            {
                question: "La livraison est-elle gratuite ?",
                answer: "La livraison standard est gratuite à partir de 100€ d'achat. Les seuils varient selon votre zone de livraison."
            },
            {
                question: "Que faire en cas d'absence ?",
                answer: "Le livreur laissera un avis de passage. Vous pourrez reprogrammer la livraison ou retirer votre colis en point relais."
            }
        ];

        this.initializeComponents();
        this.initializeEventListeners();
    }

    initializeComponents() {
        this.loadCoverageMap();
        this.loadZonesList();
        this.loadShippingPartners();
        this.loadFAQ();
    }

    initializeEventListeners() {
        const trackingForm = document.getElementById('quickTrackForm');
        if (trackingForm) {
            trackingForm.addEventListener('submit', (e) => this.handleQuickTrack(e));
        }

        const chatButton = document.getElementById('startChat');
        if (chatButton) {
            chatButton.addEventListener('click', () => this.initializeChat());
        }
    }

    loadCoverageMap() {
        const mapContainer = document.getElementById('coverageMap');
        if (!mapContainer) return;

        mapContainer.innerHTML = `
            <div class="map-placeholder">
                <img src="https://via.placeholder.com/800x400?text=Carte+des+Zones+de+Livraison" 
                     alt="Zones de livraison">
                <div class="map-overlay">
                    <div class="zone zone-1" data-zone="zone-1"></div>
                    <div class="zone zone-2" data-zone="zone-2"></div>
                    <div class="zone zone-3" data-zone="zone-3"></div>
                </div>
            </div>
        `;

        // Add hover effects for zones
        document.querySelectorAll('.zone').forEach(zone => {
            zone.addEventListener('mouseenter', (e) => this.showZoneInfo(e.target.dataset.zone));
            zone.addEventListener('mouseleave', () => this.hideZoneInfo());
        });
    }

    loadZonesList() {
        const zonesList = document.getElementById('zonesList');
        if (!zonesList) return;

        Object.entries(this.deliveryZones).forEach(([zoneId, zoneData]) => {
            const zoneEl = document.createElement('div');
            zoneEl.classList.add('zone-item');
            zoneEl.innerHTML = `
                <h4>${zoneData.name}</h4>
                <ul>
                    <li>Délai: ${zoneData.delay}</li>
                    <li>Standard: ${zoneData.standardPrice}</li>
                    <li>Express: ${zoneData.expressPrice}</li>
                </ul>
            `;
            zonesList.appendChild(zoneEl);
        });
    }

    loadShippingPartners() {
        const partnersGrid = document.getElementById('shippingPartners');
        if (!partnersGrid) return;

        this.shippingPartners.forEach(partner => {
            const partnerEl = document.createElement('div');
            partnerEl.classList.add('partner-card');
            partnerEl.innerHTML = `
                <img src="${partner.logo}" alt="${partner.name}">
                <h3>${partner.name}</h3>
                <p>${partner.description}</p>
            `;
            partnersGrid.appendChild(partnerEl);
        });
    }

    loadFAQ() {
        const faqContainer = document.getElementById('shippingFaq');
        if (!faqContainer) return;

        this.faqItems.forEach(item => {
            const faqEl = document.createElement('div');
            faqEl.classList.add('faq-item');
            faqEl.innerHTML = `
                <div class="faq-question">
                    <h3>${item.question}</h3>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="faq-answer">
                    <p>${item.answer}</p>
                </div>
            `;

            faqEl.querySelector('.faq-question').addEventListener('click', () => {
                faqEl.classList.toggle('active');
            });

            faqContainer.appendChild(faqEl);
        });
    }

    showZoneInfo(zoneId) {
        const zoneData = this.deliveryZones[zoneId];
        const tooltip = document.createElement('div');
        tooltip.classList.add('zone-tooltip');
        tooltip.innerHTML = `
            <h4>${zoneData.name}</h4>
            <p>Délai: ${zoneData.delay}</p>
            <p>Standard: ${zoneData.standardPrice}</p>
            <p>Express: ${zoneData.expressPrice}</p>
        `;

        const zone = document.querySelector(`[data-zone="${zoneId}"]`);
        zone.appendChild(tooltip);
    }

    hideZoneInfo() {
        document.querySelectorAll('.zone-tooltip').forEach(tooltip => tooltip.remove());
    }

    handleQuickTrack(event) {
        event.preventDefault();
        const trackingNumber = event.target.querySelector('input').value;
        window.location.href = `track-order.html?tracking=${trackingNumber}`;
    }

    initializeChat() {
        const chatWindow = document.createElement('div');
        chatWindow.classList.add('chat-window');
        chatWindow.innerHTML = `
            <div class="chat-header">
                <h3>Support Livraison</h3>
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

        document.body.appendChild(chatWindow);

        // Chat functionality
        const closeBtn = chatWindow.querySelector('.close-chat');
        const input = chatWindow.querySelector('input');
        const sendBtn = chatWindow.querySelector('.chat-input button');
        const messagesContainer = chatWindow.querySelector('.chat-messages');

        closeBtn.addEventListener('click', () => chatWindow.remove());

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

        sendBtn.addEventListener('click', sendMessage);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
}

// Add styles
const styles = `
    .shipping-options-section {
        padding: 40px 0;
        background-color: #f8f8f8;
    }

    .options-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 30px;
        padding: 20px;
    }

    .shipping-option-card {
        background: white;
        padding: 30px;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        transition: transform 0.3s;
    }

    .shipping-option-card:hover {
        transform: translateY(-5px);
    }

    .shipping-option-card i {
        font-size: 2.5em;
        color: var(--primary-color);
        margin-bottom: 20px;
    }

    .shipping-option-card .price {
        font-size: 1.2em;
        color: var(--primary-color);
        margin: 10px 0;
    }

    .coverage-section {
        padding: 40px 0;
    }

    .coverage-content {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 30px;
        padding: 20px;
    }

    .map-container {
        position: relative;
        background: white;
        border-radius: 8px;
        overflow: hidden;
    }

    .map-placeholder img {
        width: 100%;
        height: auto;
    }

    .zone {
        position: absolute;
        cursor: pointer;
    }

    .zone-tooltip {
        position: absolute;
        background: white;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        z-index: 100;
    }

    .partners-section {
        padding: 40px 0;
        background-color: #f8f8f8;
    }

    .partners-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        padding: 20px;
    }

    .partner-card {
        background: white;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .partner-card img {
        max-width: 150px;
        height: auto;
        margin-bottom: 15px;
    }

    .tracking-widget {
        padding: 40px 0;
        background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
        color: white;
    }

    .tracking-form {
        max-width: 600px;
        margin: 0 auto;
        text-align: center;
    }

    .tracking-form form {
        display: flex;
        gap: 10px;
        margin: 20px 0;
    }

    .tracking-form input {
        flex: 1;
        padding: 12px;
        border: none;
        border-radius: 5px;
    }

    .tracking-form button {
        padding: 12px 30px;
        background: white;
        color: var(--primary-color);
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    .shipping-faq {
        padding: 40px 0;
    }

    .faq-grid {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
    }

    @media (max-width: 768px) {
        .coverage-content {
            grid-template-columns: 1fr;
        }

        .options-grid {
            grid-template-columns: 1fr;
        }

        .tracking-form form {
            flex-direction: column;
        }
    }
`;

// Add the styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);