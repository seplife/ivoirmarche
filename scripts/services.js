document.addEventListener('DOMContentLoaded', () => {
    const servicesManager = new ServicesManager();
});

class ServicesManager {
    constructor() {
        this.initializeEventListeners();
        this.loadTestimonials();
        this.loadFAQ();
        this.initSubscriptionSystem();
    }

    initializeEventListeners() {
        // Service card hover effects
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('mouseenter', this.handleServiceCardHover);
            card.addEventListener('mouseleave', this.handleServiceCardLeave);
        });

        // Chat buttons
        document.getElementById('startChat').addEventListener('click', () => this.initializeChat());
        document.getElementById('startSupportChat').addEventListener('click', () => this.initializeChat());

        // Subscription buttons
        document.querySelectorAll('.subscribe-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleSubscription(e.target.dataset.plan));
        });

        // Newsletter form
        document.getElementById('newsletterForm').addEventListener('submit', this.handleNewsletterSignup.bind(this));
    }

    handleServiceCardHover(e) {
        const card = e.currentTarget;
        card.style.transform = 'translateY(-10px)';
        card.querySelector('i').classList.add('bounce');
    }

    handleServiceCardLeave(e) {
        const card = e.currentTarget;
        card.style.transform = 'translateY(0)';
        card.querySelector('i').classList.remove('bounce');
    }

    loadTestimonials() {
        const testimonials = [
            {
                name: "Marie D.",
                role: "Client Plus",
                text: "Le programme Plus a complètement changé ma façon de faire mes achats. La livraison gratuite est un vrai plus !",
                image: "https://via.placeholder.com/100x100?text=MD"
            },
            {
                name: "Thomas B.",
                role: "Client Pro",
                text: "Le service client est exceptionnel. Mes questions reçoivent toujours des réponses rapides et précises.",
                image: "https://via.placeholder.com/100x100?text=TB"
            },
            {
                name: "Sophie M.",
                role: "Client Famille",
                text: "L'abonnement famille nous permet de faire de belles économies. Les remises exclusives sont substantielles.",
                image: "https://via.placeholder.com/100x100?text=SM"
            }
        ];

        const container = document.getElementById('testimonials');
        testimonials.forEach(testimonial => {
            const testimonialEl = document.createElement('div');
            testimonialEl.classList.add('testimonial-card');
            testimonialEl.innerHTML = `
                <img src="${testimonial.image}" alt="${testimonial.name}">
                <div class="testimonial-content">
                    <p class="quote">"${testimonial.text}"</p>
                    <h4>${testimonial.name}</h4>
                    <span class="role">${testimonial.role}</span>
                </div>
            `;
            container.appendChild(testimonialEl);
        });
    }

    loadFAQ() {
        const faqs = [
            {
                question: "Comment fonctionne le programme de fidélité ?",
                answer: "Notre programme de fidélité vous permet de gagner des points sur chaque achat. Ces points peuvent être échangés contre des réductions ou des cadeaux exclusifs."
            },
            {
                question: "Quels sont les délais de livraison ?",
                answer: "Les délais varient selon votre zone : 24-48h pour Paris et IDF, 48-72h pour les grandes villes, et 3-5 jours pour les autres régions."
            },
            {
                question: "Comment puis-je devenir partenaire ?",
                answer: "Pour devenir partenaire, rendez-vous sur notre page Partenariats et remplissez le formulaire de candidature. Notre équipe vous contactera sous 48h."
            }
        ];

        const container = document.getElementById('servicesFaq');
        faqs.forEach(faq => {
            const faqEl = document.createElement('div');
            faqEl.classList.add('faq-item');
            faqEl.innerHTML = `
                <div class="faq-question">
                    <h3>${faq.question}</h3>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="faq-answer">
                    <p>${faq.answer}</p>
                </div>
            `;

            faqEl.querySelector('.faq-question').addEventListener('click', () => {
                faqEl.classList.toggle('active');
            });

            container.appendChild(faqEl);
        });
    }

    initSubscriptionSystem() {
        this.subscriptionPlans = {
            plus: {
                name: 'EdenMarket Plus',
                price: 9.99,
                features: ['Livraison gratuite illimitée', 'Points fidélité x2', 'Support prioritaire', 'Offres exclusives']
            },
            pro: {
                name: 'EdenMarket Pro',
                price: 19.99,
                features: ['Tous les avantages Plus', 'Livraison express gratuite', 'Points fidélité x3', 'Retours gratuits illimités', 'Accès early aux ventes']
            },
            family: {
                name: 'EdenMarket Famille',
                price: 29.99,
                features: ['Tous les avantages Pro', 'Jusqu\'à 5 comptes', 'Points fidélité x4', 'Remises famille exclusives']
            }
        };
    }

    async handleSubscription(plan) {
        // Check if user is logged in
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            alert('Veuillez vous connecter pour souscrire à un abonnement');
            window.location.href = 'login.html';
            return;
        }

        const subscription = this.subscriptionPlans[plan];
        try {
            // Simulate subscription process
            const result = await this.processSubscription(plan, currentUser);
            if (result.success) {
                this.showSubscriptionConfirmation(subscription);
            }
        } catch (error) {
            console.error('Subscription error:', error);
            alert('Une erreur est survenue lors de la souscription. Veuillez réessayer.');
        }
    }

    async processSubscription(plan, user) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ 
                    success: true, 
                    message: 'Subscription processed successfully' 
                });
            }, 1000);
        });
    }

    showSubscriptionConfirmation(subscription) {
        const modal = document.createElement('div');
        modal.classList.add('subscription-modal');
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Félicitations !</h3>
                <p>Vous êtes maintenant abonné à ${subscription.name}</p>
                <div class="subscription-details">
                    <p>Votre abonnement inclut :</p>
                    <ul>
                        ${subscription.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                <button class="close-modal">Fermer</button>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
    }

    initializeChat() {
        const chatWindow = document.createElement('div');
        chatWindow.classList.add('chat-window');
        chatWindow.innerHTML = `
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

        document.body.appendChild(chatWindow);

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

    handleNewsletterSignup(event) {
        event.preventDefault();
        const email = event.target.querySelector('input').value;
        alert(`Merci de vous être inscrit avec l'email : ${email}`);
        event.target.reset();
    }
}

// Add these styles to your CSS
const styles = `
    .services-header {
        background: linear-gradient(to right, #4a90e2, #357abd);
    }

    .services-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 30px;
        padding: 40px 20px;
        max-width: 1200px;
        margin: 0 auto;
    }

    .service-card {
        background: white;
        padding: 30px;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
    }

    .service-card i {
        font-size: 2.5em;
        color: #4a90e2;
        margin-bottom: 20px;
    }

    .service-card h3 {
        margin-bottom: 15px;
    }

    .service-card p {
        color: #666;
        margin-bottom: 20px;
    }

    .service-btn {
        display: inline-block;
        padding: 10px 20px;
        background: #4a90e2;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        text-decoration: none;
        transition: background 0.3s;
    }

    .service-btn:hover {
        background: #357abd;
    }

    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }

    .bounce {
        animation: bounce 0.5s ease;
    }

    .premium-services {
        background: #f8f8f8;
        padding: 60px 20px;
    }

    .premium-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 30px;
        max-width: 1200px;
        margin: 40px auto 0;
    }

    .premium-card {
        background: white;
        padding: 40px;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        position: relative;
    }

    .premium-card.featured {
        transform: scale(1.05);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    .badge {
        position: absolute;
        top: -15px;
        right: -15px;
        background: #ff4444;
        color: white;
        padding: 8px 15px;
        border-radius: 20px;
        font-size: 0.9em;
    }

    .price {
        font-size: 2em;
        color: #4a90e2;
        margin: 20px 0;
    }

    .premium-card ul {
        list-style: none;
        padding: 0;
        margin: 20px 0;
    }

    .premium-card li {
        margin: 10px 0;
        color: #666;
    }

    .premium-card li i {
        color: #4CAF50;
        margin-right: 10px;
    }

    .subscribe-btn {
        width: 100%;
        padding: 15px;
        background: #4a90e2;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background 0.3s;
    }

    .subscribe-btn:hover {
        background: #357abd;
    }

    .service-testimonials {
        padding: 60px 20px;
    }

    .testimonials-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 30px;
        max-width: 1200px;
        margin: 40px auto 0;
    }

    .testimonial-card {
        background: white;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        display: flex;
        align-items: center;
        gap: 20px;
    }

    .testimonial-card img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
    }

    .testimonial-content {
        flex: 1;
    }

    .quote {
        font-style: italic;
        margin-bottom: 15px;
        color: #666;
    }

    .role {
        color: #999;
        font-size: 0.9em;
    }

    .services-faq {
        background: #f8f8f8;
        padding: 60px 20px;
    }

    .faq-accordion {
        max-width: 800px;
        margin: 40px auto 0;
    }

    .faq-more {
        text-align: center;
        margin-top: 30px;
    }

    .more-btn {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        color: #4a90e2;
        text-decoration: none;
    }

    .more-btn:hover {
        text-decoration: underline;
    }

    .subscription-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .subscription-modal .modal-content {
        background: white;
        padding: 30px;
        border-radius: 8px;
        max-width: 500px;
        text-align: center;
    }

    .subscription-details {
        margin: 20px 0;
        text-align: left;
    }

    .subscription-details ul {
        list-style: none;
        padding: 0;
        margin: 10px 0;
    }

    .subscription-details li {
        margin: 5px 0;
        padding-left: 20px;
        position: relative;
    }

    .subscription-details li:before {
        content: "✓";
        position: absolute;
        left: 0;
        color: #4CAF50;
    }

    @media (max-width: 768px) {
        .services-grid,
        .premium-grid,
        .testimonials-grid {
            grid-template-columns: 1fr;
        }

        .premium-card.featured {
            transform: none;
        }
    }
`;