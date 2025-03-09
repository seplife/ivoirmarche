document.addEventListener('DOMContentLoaded', () => {
    const securityManager = new SecurityManager();
});

class SecurityManager {
    constructor() {
        this.initializeEventListeners();
        this.loadFAQ();
        this.initializeMethodsInfo();
        this.animateFeatures();
    }

    initializeEventListeners() {
        // Payment method cards hover effects
        document.querySelectorAll('.method-card').forEach(card => {
            card.addEventListener('mouseenter', this.handleMethodHover.bind(this));
            card.addEventListener('mouseleave', this.handleMethodLeave.bind(this));
        });

        // Chat support
        document.getElementById('startChat').addEventListener('click', () => this.initializeChat());

        // Security features animation on scroll
        window.addEventListener('scroll', () => this.handleScroll());
    }

    initializeMethodsInfo() {
        this.methodsInfo = {
            card: {
                title: "Paiement par Carte Bancaire",
                details: [
                    "Transactions cryptées SSL",
                    "Vérification 3D Secure",
                    "Protection contre la fraude",
                    "Pas de frais supplémentaires"
                ]
            },
            mobile: {
                title: "Mobile Money",
                details: [
                    "Paiement instantané",
                    "Confirmation par SMS",
                    "Service disponible 24/7",
                    "Frais de transaction inclus"
                ]
            },
            wave: {
                title: "Wave",
                details: [
                    "Transfert instantané",
                    "Frais réduits",
                    "Application sécurisée",
                    "Support local disponible"
                ]
            },
            paypal: {
                title: "PayPal",
                details: [
                    "Protection des achats",
                    "Paiement en 1 clic",
                    "Service client dédié",
                    "Remboursement facilité"
                ]
            }
        };
    }

    handleMethodHover(event) {
        const methodCard = event.currentTarget;
        const methodType = methodCard.dataset.method;
        const info = this.methodsInfo[methodType];

        if (!info) return;

        const tooltip = document.createElement('div');
        tooltip.classList.add('method-tooltip');
        tooltip.innerHTML = `
            <h4>${info.title}</h4>
            <ul>
                ${info.details.map(detail => `<li>${detail}</li>`).join('')}
            </ul>
        `;

        methodCard.appendChild(tooltip);
        methodCard.style.transform = 'translateY(-5px)';
    }

    handleMethodLeave(event) {
        const methodCard = event.currentTarget;
        const tooltip = methodCard.querySelector('.method-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
        methodCard.style.transform = 'translateY(0)';
    }

    loadFAQ() {
        const faqContainer = document.getElementById('securityFaq');
        const faqs = [
            {
                question: "Comment mes données de paiement sont-elles protégées ?",
                answer: "Nous utilisons un cryptage SSL 256-bits et sommes conformes aux normes PCI DSS. Vos données ne sont jamais stockées sur nos serveurs."
            },
            {
                question: "Qu'est-ce que l'authentification 3D Secure ?",
                answer: "C'est une mesure de sécurité supplémentaire qui nécessite une validation par code SMS ou application bancaire pour les paiements par carte."
            },
            {
                question: "Que faire si je ne reçois pas de confirmation de paiement ?",
                answer: "Vérifiez d'abord vos emails (y compris les spams). Si vous n'avez rien reçu, contactez notre service client avec votre numéro de commande."
            },
            {
                question: "Les paiements mobile sont-ils sécurisés ?",
                answer: "Oui, tous nos partenaires de paiement mobile utilisent des protocoles de sécurité avancés et nécessitent une confirmation par code."
            },
            {
                question: "Que faire en cas de paiement débité deux fois ?",
                answer: "Contactez immédiatement notre service client avec les détails de votre commande et les références des transactions."
            }
        ];

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

            faqContainer.appendChild(faqEl);
        });
    }

    animateFeatures() {
        const features = document.querySelectorAll('.feature-card');
        features.forEach(feature => {
            feature.style.opacity = '0';
            feature.style.transform = 'translateY(20px)';
        });

        // Animate features when they come into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.5 });

        features.forEach(feature => observer.observe(feature));
    }

    handleScroll() {
        const elements = document.querySelectorAll('.security-features, .payment-methods, .security-steps, .security-certifications');
        
        elements.forEach(element => {
            const position = element.getBoundingClientRect();
            
            if (position.top < window.innerHeight * 0.75) {
                element.classList.add('visible');
            }
        });
    }

    initializeChat() {
        const chatWindow = document.createElement('div');
        chatWindow.classList.add('chat-window');
        chatWindow.innerHTML = `
            <div class="chat-header">
                <h3>Support Sécurité</h3>
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
}

// Add these styles to your CSS
const styles = `
    .securite-header {
        background: linear-gradient(to right, #2c3e50, #3498db);
    }

    .security-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 40px 20px;
    }

    .security-features {
        margin-bottom: 60px;
    }

    .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 30px;
        margin-top: 40px;
    }

    .feature-card {
        background: white;
        padding: 30px;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        transition: all 0.5s ease;
    }

    .feature-card i {
        font-size: 2.5em;
        color: #3498db;
        margin-bottom: 20px;
    }

    .payment-methods {
        margin-bottom: 60px;
    }

    .methods-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-top: 40px;
    }

    .method-card {
        background: white;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        position: relative;
        transition: transform 0.3s ease;
    }

    .method-card img {
        max-width: 150px;
        height: auto;
        margin-bottom: 15px;
    }

    .method-tooltip {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: white;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 100;
        width: 200px;
        margin-top: 10px;
    }

    .method-tooltip ul {
        list-style: none;
        padding: 0;
        margin: 10px 0 0;
    }

    .method-tooltip li {
        margin: 5px 0;
        font-size: 0.9em;
        color: #666;
    }

    .security-steps {
        margin-bottom: 60px;
    }

    .steps-timeline {
        margin-top: 40px;
    }

    .step {
        display: flex;
        align-items: center;
        margin-bottom: 30px;
    }

    .step-icon {
        width: 60px;
        height: 60px;
        background: #3498db;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.5em;
        margin-right: 20px;
    }

    .security-certifications {
        margin-bottom: 60px;
    }

    .certifications-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 30px;
        margin-top: 40px;
    }

    .certification-card {
        background: white;
        padding: 30px;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .certification-card img {
        max-width: 150px;
        height: auto;
        margin-bottom: 20px;
    }

    .security-faq {
        margin-bottom: 60px;
    }

    .faq-container {
        max-width: 800px;
        margin: 40px auto 0;
    }

    .faq-item {
        background: white;
        margin-bottom: 10px;
        border-radius: 8px;
        overflow: hidden;
    }

    .faq-question {
        padding: 20px;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .faq-answer {
        padding: 0 20px;
        max-height: 0;
        overflow: hidden;
        transition: all 0.3s ease;
    }

    .faq-item.active .faq-answer {
        padding: 20px;
        max-height: 1000px;
    }

    @media (max-width: 768px) {
        .features-grid,
        .methods-grid,
        .certifications-grid {
            grid-template-columns: 1fr;
        }

        .step {
            flex-direction: column;
            text-align: center;
        }

        .step-icon {
            margin: 0 0 15px 0;
        }
    }
`;

