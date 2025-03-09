class SupportManager {
    constructor() {
        this.tickets = JSON.parse(localStorage.getItem('tickets')) || [];
        this.currentChat = null;
        this.faqCategories = ['all', 'orders', 'shipping', 'returns', 'payment'];
        this.faqData = this.loadFAQData();

        this.initializeEventListeners();
        this.loadFAQ('all');
        this.loadTickets();
        this.setupChat();
    }

    initializeEventListeners() {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.loadFAQ(e.target.dataset.category);
            });
        });

        document.getElementById('ticketForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createTicket();
        });

        document.getElementById('messageInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }

    loadFAQData() {
        return {
            orders: [
                {
                    question: "Comment suivre ma commande ?",
                    answer: "Vous pouvez suivre votre commande en utilisant le numéro de suivi fourni dans l'email de confirmation ou dans la section 'Mes Commandes' de votre compte."
                },
                {
                    question: "Comment modifier ma commande ?",
                    answer: "Vous pouvez modifier votre commande tant qu'elle n'a pas été expédiée. Rendez-vous dans 'Mes Commandes' et cliquez sur 'Modifier' à côté de la commande concernée."
                }
            ],
            shipping: [
                {
                    question: "Quels sont les délais de livraison ?",
                    answer: "Les délais de livraison standard sont de 3-5 jours ouvrés. Pour la livraison express, comptez 1-2 jours ouvrés."
                },
                {
                    question: "Livrez-vous à l'international ?",
                    answer: "Oui, nous livrons dans plusieurs pays d'Afrique. Les délais et frais de livraison varient selon la destination."
                }
            ],
            returns: [
                {
                    question: "Comment retourner un article ?",
                    answer: "Vous disposez de 14 jours pour retourner un article. Connectez-vous à votre compte, sélectionnez la commande concernée et suivez les instructions de retour."
                },
                {
                    question: "Quand serai-je remboursé ?",
                    answer: "Le remboursement est effectué sous 5-10 jours ouvrés après réception et validation de votre retour."
                }
            ],
            payment: [
                {
                    question: "Quels moyens de paiement acceptez-vous ?",
                    answer: "Nous acceptons les cartes bancaires, PayPal, Orange Money, MTN Money, Moov Money et Wave."
                },
                {
                    question: "Mon paiement a échoué, que faire ?",
                    answer: "Vérifiez vos informations de paiement et réessayez. Si le problème persiste, contactez votre banque ou notre service client."
                }
            ]
        };
    }

    loadFAQ(category) {
        const faqList = document.getElementById('faqList');
        faqList.innerHTML = '';

        let faqs = [];
        if (category === 'all') {
            Object.values(this.faqData).forEach(categoryFaqs => {
                faqs = faqs.concat(categoryFaqs);
            });
        } else {
            faqs = this.faqData[category] || [];
        }

        faqs.forEach(faq => {
            const faqItem = document.createElement('div');
            faqItem.classList.add('faq-item');
            faqItem.innerHTML = `
                <div class="faq-question">
                    <h3>${faq.question}</h3>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="faq-answer">
                    <p>${faq.answer}</p>
                </div>
            `;

            faqItem.querySelector('.faq-question').addEventListener('click', () => {
                faqItem.classList.toggle('active');
            });

            faqList.appendChild(faqItem);
        });
    }

    async createTicket() {
        const subject = document.getElementById('ticketSubject').value;
        const orderNumber = document.getElementById('orderNumber').value;
        const description = document.getElementById('ticketDescription').value;
        const attachments = await this.handleAttachments();

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            alert('Veuillez vous connecter pour créer un ticket');
            window.location.href = 'login.html';
            return;
        }

        const ticket = {
            id: Date.now().toString(),
            subject,
            orderNumber,
            description,
            attachments,
            status: 'open',
            createdAt: new Date().toISOString(),
            userId: currentUser.id,
            userEmail: currentUser.email,
            messages: [{
                from: 'user',
                content: description,
                timestamp: new Date().toISOString()
            }]
        };

        this.tickets.push(ticket);
        localStorage.setItem('tickets', JSON.stringify(this.tickets));

        await this.sendTicketConfirmation(ticket);

        alert('Ticket créé avec succès ! Vous recevrez une confirmation par email.');
        document.getElementById('ticketModal').style.display = 'none';
        this.loadTickets();
    }

    async handleAttachments() {
        const fileInput = document.getElementById('ticketAttachments');
        const files = Array.from(fileInput.files);
        
        if (files.length === 0) return [];

        try {
            const attachments = await Promise.all(files.map(file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve({
                        name: file.name,
                        type: file.type,
                        data: e.target.result
                    });
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            }));
            return attachments;
        } catch (error) {
            console.error('Error handling attachments:', error);
            return [];
        }
    }

    async sendTicketConfirmation(ticket) {
        console.log('Sending ticket confirmation email:', {
            to: ticket.userEmail,
            subject: `Ticket #${ticket.id} - Confirmation`,
            content: `
                Cher client,

                Votre ticket a été créé avec succès.
                
                Numéro de ticket: #${ticket.id}
                Sujet: ${ticket.subject}
                ${ticket.orderNumber ? `Numéro de commande: ${ticket.orderNumber}` : ''}
                
                Nous traiterons votre demande dans les plus brefs délais.
                
                Cordialement,
                L'équipe Support EdenMarket
            `
        });

        await new Promise(resolve => setTimeout(resolve, 1000));
        return true;
    }

    loadTickets() {
        const ticketsList = document.getElementById('ticketsList');
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (!currentUser) {
            ticketsList.innerHTML = `
                <div class="no-tickets">
                    <p>Connectez-vous pour voir vos tickets</p>
                    <a href="login.html" class="primary-btn">Se connecter</a>
                </div>
            `;
            return;
        }

        const userTickets = this.tickets.filter(ticket => ticket.userId === currentUser.id);

        if (userTickets.length === 0) {
            ticketsList.innerHTML = `
                <div class="no-tickets">
                    <p>Vous n'avez pas encore de tickets</p>
                </div>
            `;
            return;
        }

        ticketsList.innerHTML = userTickets.map(ticket => `
            <div class="ticket-card">
                <div class="ticket-header">
                    <h3>Ticket #${ticket.id}</h3>
                    <span class="ticket-status ${ticket.status}">${ticket.status}</span>
                </div>
                <div class="ticket-details">
                    <p><strong>Sujet:</strong> ${ticket.subject}</p>
                    <p><strong>Date:</strong> ${new Date(ticket.createdAt).toLocaleDateString()}</p>
                    ${ticket.orderNumber ? `<p><strong>Commande:</strong> ${ticket.orderNumber}</p>` : ''}
                </div>
                <div class="ticket-actions">
                    <button onclick="window.supportManager.viewTicket('${ticket.id}')">
                        Voir les détails
                    </button>
                    ${ticket.status === 'open' ? `
                        <button onclick="window.supportManager.closeTicket('${ticket.id}')">
                            Fermer le ticket
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    viewTicket(ticketId) {
        const ticket = this.tickets.find(t => t.id === ticketId);
        if (!ticket) return;

        const modalContent = document.createElement('div');
        modalContent.classList.add('ticket-details-modal');
        modalContent.innerHTML = `
            <h2>Ticket #${ticket.id}</h2>
            <div class="ticket-info">
                <p><strong>Sujet:</strong> ${ticket.subject}</p>
                <p><strong>Statut:</strong> ${ticket.status}</p>
                <p><strong>Date:</strong> ${new Date(ticket.createdAt).toLocaleDateString()}</p>
                ${ticket.orderNumber ? `<p><strong>Commande:</strong> ${ticket.orderNumber}</p>` : ''}
            </div>
            <div class="ticket-messages">
                ${ticket.messages.map(message => `
                    <div class="message ${message.from}">
                        <div class="message-content">${message.content}</div>
                        <div class="message-time">
                            ${new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                    </div>
                `).join('')}
            </div>
            ${ticket.status === 'open' ? `
                <div class="reply-form">
                    <textarea id="replyMessage" placeholder="Votre réponse..."></textarea>
                    <button onclick="window.supportManager.replyToTicket('${ticket.id}')">
                        Envoyer
                    </button>
                </div>
            ` : ''}
        `;

        document.body.appendChild(modalContent);
    }

    async replyToTicket(ticketId) {
        const replyContent = document.getElementById('replyMessage').value;
        if (!replyContent.trim()) return;

        const ticketIndex = this.tickets.findIndex(t => t.id === ticketId);
        if (ticketIndex === -1) return;

        this.tickets[ticketIndex].messages.push({
            from: 'user',
            content: replyContent,
            timestamp: new Date().toISOString()
        });

        localStorage.setItem('tickets', JSON.stringify(this.tickets));
        this.viewTicket(ticketId); 
    }

    closeTicket(ticketId) {
        if (!confirm('Êtes-vous sûr de vouloir fermer ce ticket ?')) return;

        const ticketIndex = this.tickets.findIndex(t => t.id === ticketId);
        if (ticketIndex === -1) return;

        this.tickets[ticketIndex].status = 'closed';
        localStorage.setItem('tickets', JSON.stringify(this.tickets));
        this.loadTickets();
    }

    setupChat() {
        this.currentChat = {
            messages: [
                {
                    from: 'bot',
                    content: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?'
                }
            ]
        };
        this.updateChatMessages();
    }

    sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();
        
        if (!message) return;

        this.currentChat.messages.push({
            from: 'user',
            content: message
        });

        messageInput.value = '';
        this.updateChatMessages();

        setTimeout(() => {
            this.currentChat.messages.push({
                from: 'bot',
                content: this.generateBotResponse(message)
            });
            this.updateChatMessages();
        }, 1000);
    }

    generateBotResponse(message) {
        const responses = {
            default: "Je vais transférer votre demande à un conseiller. En attendant, vous pouvez consulter notre FAQ ou créer un ticket.",
            shipping: "Les délais de livraison standard sont de 3-5 jours ouvrés. Pour plus de détails, consultez notre page de livraison.",
            payment: "Nous acceptons les cartes bancaires, PayPal, Orange Money, MTN Money, Moov Money et Wave.",
            return: "Vous disposez de 14 jours pour retourner un article. Connectez-vous à votre compte pour initier un retour.",
            tracking: "Vous pouvez suivre votre commande dans la section 'Mes Commandes' de votre compte."
        };

        const keywords = {
            shipping: ['livraison', 'délai', 'expédition'],
            payment: ['paiement', 'payer', 'carte', 'money'],
            return: ['retour', 'rembourser', 'remboursement'],
            tracking: ['suivi', 'tracker', 'commande']
        };

        for (const [key, words] of Object.entries(keywords)) {
            if (words.some(word => message.toLowerCase().includes(word))) {
                return responses[key];
            }
        }

        return responses.default;
    }

    updateChatMessages() {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = this.currentChat.messages.map(message => `
            <div class="chat-message ${message.from}">
                <div class="message-content">
                    ${message.content}
                </div>
            </div>
        `).join('');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    closeChat() {
        document.getElementById('chatBox').classList.remove('active');
        this.setupChat();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.supportManager = new SupportManager();
});

const supportStyles = `
.support-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.quick-actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin: 30px 0;
}

.action-card {
    background: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    cursor: pointer;
    transition: transform 0.3s;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.action-card:hover {
    transform: translateY(-5px);
}

.action-card i {
    font-size: 2em;
    color: var(--primary-color);
    margin-bottom: 10px;
}

.faq-section {
    margin: 40px 0;
}

.faq-categories {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    overflow-x: auto;
    padding-bottom: 10px;
}

.category-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 20px;
    background: #f0f0f0;
    cursor: pointer;
    white-space: nowrap;
}

.category-btn.active {
    background: var(--primary-color);
    color: white;
}

.faq-item {
    background: white;
    margin-bottom: 10px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.faq-question {
    padding: 15px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.faq-answer {
    padding: 0 15px;
    max-height: 0;
    overflow: hidden;
    transition: all 0.3s;
}

.faq-item.active .faq-answer {
    padding: 15px;
    max-height: 500px;
}

.chat-box {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 300px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    transform: translateY(calc(100% - 50px));
    transition: transform 0.3s;
}

.chat-box.active {
    transform: translateY(0);
}

.chat-header {
    padding: 15px;
    background: var(--primary-color);
    color: white;
    border-radius: 10px 10px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.chat-messages {
    height: 300px;
    overflow-y: auto;
    padding: 15px;
}

.chat-message {
    margin-bottom: 10px;
    max-width: 80%;
}

.chat-message.user {
    margin-left: auto;
    text-align: right;
}

.chat-message .message-content {
    display: inline-block;
    padding: 8px 12px;
    border-radius: 15px;
    background: #f0f0f0;
}

.chat-message.user .message-content {
    background: var(--primary-color);
    color: white;
}

.chat-input {
    padding: 15px;
    display: flex;
    gap: 10px;
}

.chat-input input {
    flex: 1;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 20px;
}

.chat-input button {
    padding: 8px 12px;
    border: none;
    border-radius: 20px;
    background: var(--primary-color);
    color: white;
    cursor: pointer;
}

.ticket-card {
    background: white;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 15px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.ticket-status {
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 0.9em;
}

.ticket-status.open { background: #d4edda; color: #155724; }
.ticket-status.closed { background: #f8d7da; color: #721c24; }

.ticket-details-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 2px 20px rgba(0,0,0,0.2);
}

@media (max-width: 768px) {
    .quick-actions {
        grid-template-columns: 1fr 1fr;
    }

    .chat-box {
        width: 100%;
        right: 0;
        bottom: 0;
        border-radius: 10px 10px 0 0;
    }
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = supportStyles;
document.head.appendChild(styleSheet);