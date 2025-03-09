document.addEventListener('DOMContentLoaded', () => {
    const faqManager = new FAQManager();
});

class FAQManager {
    constructor() {
        this.currentCategory = 'all';
        this.searchQuery = '';
        this.faqData = {
            commandes: [
                {
                    question: "Comment passer une commande ?",
                    answer: "Pour passer une commande, il vous suffit de naviguer dans nos catégories, sélectionner les produits qui vous intéressent, les ajouter au panier et suivre le processus de paiement."
                },
                {
                    question: "Comment suivre ma commande ?",
                    answer: "Une fois votre commande confirmée, vous recevrez un email avec un numéro de suivi. Vous pouvez utiliser ce numéro sur notre site ou directement sur le site du transporteur."
                },
                {
                    question: "Puis-je modifier ma commande ?",
                    answer: "Vous pouvez modifier votre commande tant qu'elle n'a pas été expédiée. Contactez notre service client dès que possible."
                }
            ],
            livraison: [
                {
                    question: "Quels sont les délais de livraison ?",
                    answer: "Les délais varient entre 2-5 jours ouvrés pour la livraison standard et 1-2 jours pour la livraison express."
                },
                {
                    question: "Livrez-vous à l'international ?",
                    answer: "Oui, nous livrons dans plusieurs pays. Les délais et frais varient selon la destination."
                },
                {
                    question: "La livraison est-elle gratuite ?",
                    answer: "La livraison est gratuite pour toute commande supérieure à 100€. En dessous, des frais de port s'appliquent."
                }
            ],
            paiement: [
                {
                    question: "Quels moyens de paiement acceptez-vous ?",
                    answer: "Nous acceptons les cartes bancaires, PayPal, Orange Money, MTN Money, Moov Money et Wave."
                },
                {
                    question: "Le paiement est-il sécurisé ?",
                    answer: "Oui, tous nos paiements sont sécurisés avec un cryptage SSL et nous respectons les normes PCI DSS."
                },
                {
                    question: "Puis-je payer en plusieurs fois ?",
                    answer: "Oui, pour les commandes supérieures à 200€, vous pouvez opter pour un paiement en 3 ou 4 fois."
                }
            ],
            retours: [
                {
                    question: "Quelle est votre politique de retour ?",
                    answer: "Vous disposez de 14 jours après réception pour retourner un article dans son état d'origine."
                },
                {
                    question: "Comment effectuer un retour ?",
                    answer: "Connectez-vous à votre compte, sélectionnez la commande concernée et suivez la procédure de retour."
                },
                {
                    question: "Les frais de retour sont-ils gratuits ?",
                    answer: "Les frais de retour sont gratuits en cas de produit défectueux. Dans les autres cas, ils sont à votre charge."
                }
            ],
            compte: [
                {
                    question: "Comment créer un compte ?",
                    answer: "Cliquez sur 'S'inscrire', remplissez le formulaire avec vos informations et validez votre email."
                },
                {
                    question: "J'ai oublié mon mot de passe",
                    answer: "Cliquez sur 'Mot de passe oublié' sur la page de connexion et suivez les instructions envoyées par email."
                },
                {
                    question: "Comment modifier mes informations personnelles ?",
                    answer: "Connectez-vous à votre compte et accédez à la section 'Mes informations' pour effectuer les modifications."
                }
            ]
        };

        this.initializeEventListeners();
        this.loadFAQs();
    }

    initializeEventListeners() {
        // Category buttons
        document.querySelectorAll('.category-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                this.setActiveCategory(e.target.dataset.category);
            });
        });

        // Search functionality
        const searchInput = document.getElementById('faqSearch');
        const searchButton = document.getElementById('searchButton');

        searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            this.filterFAQs();
        });

        searchButton.addEventListener('click', () => {
            this.filterFAQs();
        });

        // Newsletter form
        const newsletterForm = document.getElementById('newsletterForm');
        newsletterForm.addEventListener('submit', this.handleNewsletterSignup.bind(this));

        // Live chat initialization
        this.initializeLiveChat();
    }

    setActiveCategory(category) {
        this.currentCategory = category;
        
        // Update active button styling
        document.querySelectorAll('.category-btn').forEach(button => {
            button.classList.remove('active');
            if (button.dataset.category === category) {
                button.classList.add('active');
            }
        });

        this.filterFAQs();
    }

    loadFAQs() {
        const faqList = document.getElementById('faqList');
        faqList.innerHTML = '';

        Object.entries(this.faqData).forEach(([category, questions]) => {
            questions.forEach(item => {
                const faqItem = this.createFAQElement(item, category);
                faqList.appendChild(faqItem);
            });
        });
    }

    createFAQElement(item, category) {
        const faqItem = document.createElement('div');
        faqItem.classList.add('faq-item');
        faqItem.dataset.category = category;
        
        faqItem.innerHTML = `
            <div class="faq-question">
                <h3>${item.question}</h3>
                <i class="fas fa-chevron-down"></i>
            </div>
            <div class="faq-answer">
                <p>${item.answer}</p>
            </div>
        `;

        // Add click event for expanding/collapsing
        faqItem.querySelector('.faq-question').addEventListener('click', () => {
            faqItem.classList.toggle('active');
        });

        return faqItem;
    }

    filterFAQs() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('h3').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer p').textContent.toLowerCase();
            const category = item.dataset.category;

            const matchesSearch = this.searchQuery === '' || 
                question.includes(this.searchQuery) || 
                answer.includes(this.searchQuery);

            const matchesCategory = this.currentCategory === 'all' || 
                category === this.currentCategory;

            if (matchesSearch && matchesCategory) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    handleNewsletterSignup(event) {
        event.preventDefault();
        const email = event.target.querySelector('input').value;
        alert(`Merci de vous être inscrit avec l'email : ${email}`);
        event.target.reset();
    }

    initializeLiveChat() {
        const chatOption = document.querySelector('.support-option:last-child');
        chatOption.style.cursor = 'pointer';
        chatOption.addEventListener('click', () => {
            this.openChatModal();
        });
    }

    openChatModal() {
        const modalContent = document.createElement('div');
        modalContent.classList.add('chat-modal');
        modalContent.innerHTML = `
            <div class="chat-header">
                <h3>Chat en Direct</h3>
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

        document.body.appendChild(modalContent);

        // Handle chat close
        modalContent.querySelector('.close-chat').addEventListener('click', () => {
            modalContent.remove();
        });

        // Handle message sending
        const input = modalContent.querySelector('input');
        const sendButton = modalContent.querySelector('.chat-input button');
        const messagesContainer = modalContent.querySelector('.chat-messages');

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
    .faq-search {
        padding: 20px;
        background-color: white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .search-container {
        max-width: 600px;
        margin: 0 auto;
        display: flex;
        gap: 10px;
    }

    .search-container input {
        flex: 1;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
    }

    .search-container button {
        padding: 10px 20px;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    .faq-categories {
        padding: 20px;
        text-align: center;
    }

    .categories-list {
        display: flex;
        justify-content: center;
        gap: 10px;
        flex-wrap: wrap;
    }

    .category-btn {
        padding: 10px 20px;
        border: 1px solid var(--primary-color);
        background: none;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s;
    }

    .category-btn.active {
        background-color: var(--primary-color);
        color: white;
    }

    .faq-content {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
    }

    .faq-item {
        background-color: white;
        border-radius: 5px;
        margin-bottom: 10px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .faq-question {
        padding: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
    }

    .faq-answer {
        padding: 0 15px;
        max-height: 0;
        overflow: hidden;
        transition: all 0.3s;
    }

    .faq-item.active .faq-answer {
        padding: 15px;
        max-height: 1000px;
    }

    .support-options {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        padding: 20px;
    }

    .support-option {
        text-align: center;
        padding: 20px;
        background-color: white;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .support-option i {
        font-size: 2em;
        color: var(--primary-color);
        margin-bottom: 10px;
    }

    .chat-modal {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 300px;
        height: 400px;
        background-color: white;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        display: flex;
        flex-direction: column;
    }

    .chat-header {
        padding: 10px;
        background-color: var(--primary-color);
        color: white;
        border-radius: 10px 10px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .chat-messages {
        flex: 1;
        padding: 10px;
        overflow-y: auto;
    }

    .message {
        margin-bottom: 10px;
        padding: 8px;
        border-radius: 5px;
        max-width: 80%;
    }

    .message.system {
        background-color: #f0f0f0;
        text-align: center;
        max-width: 100%;
    }

    .message.user {
        background-color: var(--primary-color);
        color: white;
        margin-left: auto;
    }

    .message.agent {
        background-color: #f0f0f0;
    }

    .chat-input {
        padding: 10px;
        display: flex;
        gap: 10px;
    }

    .chat-input input {
        flex: 1;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 5px;
    }

    .chat-input button {
        padding: 8px 15px;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
`;

// Add the styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);