document.addEventListener('DOMContentLoaded', () => {
    const returnManager = new ReturnManager();
});

class ReturnManager {
    constructor() {
        this.orderData = {
            'ORD-123456789': {
                date: '2025-01-15',
                items: [
                    {
                        id: 1,
                        name: 'Smartphone Pro',
                        price: 599.99,
                        image: 'https://via.placeholder.com/100x100?text=Smartphone',
                        quantity: 1,
                        returnEligible: true,
                        returnDeadline: '2025-01-29'
                    },
                    {
                        id: 2,
                        name: 'Écouteurs Sans Fil',
                        price: 129.99,
                        image: 'https://via.placeholder.com/100x100?text=Écouteurs',
                        quantity: 2,
                        returnEligible: true,
                        returnDeadline: '2025-01-29'
                    }
                ],
                totalAmount: 859.97,
                status: 'delivered'
            }
        };

        this.returnReasons = [
            { id: 'wrong-size', text: 'Taille incorrecte' },
            { id: 'damaged', text: 'Produit endommagé' },
            { id: 'not-as-described', text: 'Ne correspond pas à la description' },
            { id: 'wrong-item', text: 'Mauvais article reçu' },
            { id: 'changed-mind', text: 'Changement d\'avis' },
            { id: 'defective', text: 'Produit défectueux' }
        ];

        this.initializeEventListeners();
        this.loadFAQ();
    }

    initializeEventListeners() {
        const searchBtn = document.getElementById('searchOrder');
        searchBtn.addEventListener('click', () => this.searchOrder());

        const returnForm = document.getElementById('reasonForm');
        returnForm.addEventListener('submit', (e) => this.handleReturnSubmission(e));

        const printLabel = document.getElementById('printLabel');
        printLabel.addEventListener('click', () => this.printReturnLabel());

        const startChat = document.getElementById('startChat');
        startChat.addEventListener('click', () => this.initializeChat());
    }

    searchOrder() {
        const orderNumber = document.getElementById('orderNumber').value;
        const orderDetails = this.orderData[orderNumber];

        if (!orderDetails) {
            alert('Commande non trouvée. Veuillez vérifier le numéro de commande.');
            return;
        }

        this.displayOrderDetails(orderDetails);
    }

    displayOrderDetails(order) {
        const orderDetails = document.getElementById('orderDetails');
        const itemsGrid = document.getElementById('orderItems');
        
        itemsGrid.innerHTML = '';
        order.items.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.classList.add('order-item');
            itemEl.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>Prix: ${item.price.toFixed(2)} €</p>
                    <p>Quantité: ${item.quantity}</p>
                    ${item.returnEligible ? `
                        <div class="return-eligibility">
                            <label class="checkbox-container">
                                <input type="checkbox" name="return-items" value="${item.id}">
                                <span class="checkmark"></span>
                                Retourner cet article
                            </label>
                            <span class="deadline">Retour possible jusqu'au ${item.returnDeadline}</span>
                        </div>
                    ` : '<p class="not-eligible">Non éligible au retour</p>'}
                </div>
            `;
            itemsGrid.appendChild(itemEl);
        });

        orderDetails.style.display = 'block';
        this.initializeReturnForm();
    }

    initializeReturnForm() {
        const returnReasonForm = document.getElementById('returnReasonForm');
        const reasonContainer = document.getElementById('reasonContainer');
        
        document.querySelectorAll('input[name="return-items"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const itemId = e.target.value;
                const reasonField = document.getElementById(`reason-${itemId}`);
                
                if (e.target.checked) {
                    if (!reasonField) {
                        const item = this.findItem(itemId);
                        this.addReasonField(item);
                    }
                } else {
                    if (reasonField) {
                        reasonField.remove();
                    }
                }
                
                const hasCheckedItems = document.querySelectorAll('input[name="return-items"]:checked').length > 0;
                returnReasonForm.style.display = hasCheckedItems ? 'block' : 'none';
            });
        });
    }

    findItem(itemId) {
        const orderNumber = document.getElementById('orderNumber').value;
        const order = this.orderData[orderNumber];
        return order.items.find(item => item.id === parseInt(itemId));
    }

    addReasonField(item) {
        const reasonContainer = document.getElementById('reasonContainer');
        const reasonField = document.createElement('div');
        reasonField.id = `reason-${item.id}`;
        reasonField.classList.add('reason-field');
        
        reasonField.innerHTML = `
            <h4>${item.name}</h4>
            <div class="form-group">
                <label>Motif du retour</label>
                <select name="reason-${item.id}" required>
                    <option value="">Sélectionnez un motif</option>
                    ${this.returnReasons.map(reason => 
                        `<option value="${reason.id}">${reason.text}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>État du produit</label>
                <select name="condition-${item.id}" required>
                    <option value="">Sélectionnez l'état</option>
                    <option value="new">Neuf avec étiquettes</option>
                    <option value="opened">Déballé mais non utilisé</option>
                    <option value="used">Utilisé</option>
                    <option value="damaged">Endommagé</option>
                </select>
            </div>
        `;
        
        reasonContainer.appendChild(reasonField);
    }

    async handleReturnSubmission(event) {
        event.preventDefault();

        const selectedItems = Array.from(document.querySelectorAll('input[name="return-items"]:checked'))
            .map(checkbox => checkbox.value);

        if (selectedItems.length === 0) {
            alert('Veuillez sélectionner au moins un article à retourner.');
            return;
        }

        const returnData = {
            orderNumber: document.getElementById('orderNumber').value,
            items: selectedItems.map(itemId => ({
                id: itemId,
                reason: document.querySelector(`select[name="reason-${itemId}"]`).value,
                condition: document.querySelector(`select[name="condition-${itemId}"]`).value
            })),
            comments: document.getElementById('additionalComments').value
        };

        try {
            // Simulate API call
            await this.submitReturn(returnData);
            
            // Show return instructions
            document.getElementById('returnInstructions').style.display = 'block';
            
            // Scroll to instructions
            document.getElementById('returnInstructions').scrollIntoView({ behavior: 'smooth' });
            
        } catch (error) {
            console.error('Error submitting return:', error);
            alert('Une erreur est survenue lors de la soumission du retour. Veuillez réessayer.');
        }
    }

    async submitReturn(data) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Return submitted:', data);
                resolve({ success: true });
            }, 1000);
        });
    }

    printReturnLabel() {
        const labelContent = `
            <div class="return-label">
                <h2>Étiquette de Retour EdenMarket</h2>
                <p>Commande: ${document.getElementById('orderNumber').value}</p>
                <p>Date: ${new Date().toLocaleDateString()}</p>
                <div class="barcode">
                    |||||||||||||||||||||
                </div>
            </div>
        `;

        const printWindow = window.open('', '', 'width=600,height=600');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Étiquette de Retour</title>
                    <style>
                        .return-label {
                            padding: 20px;
                            border: 1px solid #000;
                            text-align: center;
                        }
                        .barcode {
                            font-family: monospace;
                            font-size: 40px;
                            margin: 20px 0;
                        }
                    </style>
                </head>
                <body>
                    ${labelContent}
                    <script>
                        window.onload = function() {
                            window.print();
                            setTimeout(function() {
                                window.close();
                            }, 500);
                        };
                    </script>
                </body>
            </html>
        `);
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
        closeBtn.addEventListener('click', () => chatWindow.remove());

        const input = chatWindow.querySelector('input');
        const sendBtn = chatWindow.querySelector('.chat-input button');
        const messagesContainer = chatWindow.querySelector('.chat-messages');

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

    loadFAQ() {
        const faqContainer = document.getElementById('retourFaq');
        const faqs = [
            {
                question: "Quel est le délai pour retourner un article ?",
                answer: "Vous disposez de 14 jours à compter de la réception de votre commande pour retourner un article."
            },
            {
                question: "Les frais de retour sont-ils gratuits ?",
                answer: "Oui, les frais de retour sont gratuits. Une étiquette de retour prépayée vous sera fournie."
            },
            {
                question: "Quand serai-je remboursé ?",
                answer: "Le remboursement est effectué sous 5 jours ouvrés après réception et validation de votre retour."
            },
            {
                question: "Puis-je échanger un article ?",
                answer: "Les échanges directs ne sont pas possibles. Nous vous conseillons de retourner l'article et d'en commander un nouveau."
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
}

// Add these styles to your CSS
const styles = `
    .retours-header {
        background: linear-gradient(to right, #ff6b6b, #ffd93d);
    }

    .retour-steps {
        padding: 40px 20px;
        background-color: white;
        margin-bottom: 30px;
    }

    .steps-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-top: 30px;
    }

    .step {
        text-align: center;
        padding: 20px;
    }

    .step i {
        font-size: 2em;
        color: #ff6b6b;
        margin-bottom: 15px;
    }

    .retour-form {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
    }

    .form-group {
        margin-bottom: 20px;
    }

    .order-details {
        background-color: white;
        padding: 20px;
        margin: 20px auto;
        max-width: 800px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .order-item {
        display: flex;
        gap: 20px;
        padding: 20px;
        border-bottom: 1px solid #eee;
    }

    .order-item img {
        width: 100px;
        height: 100px;
        object-fit: cover;
    }

    .return-eligibility {
        margin-top: 10px;
    }

    .checkbox-container {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
    }

    .deadline {
        font-size: 0.9em;
        color: #666;
    }

    .reason-field {
        background-color: #f8f8f8;
        padding: 20px;
        margin-bottom: 20px;
        border-radius: 5px;
    }

    .return-instructions {
        background-color: white;
        padding: 20px;
        margin: 20px auto;
        max-width: 800px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .instruction-step {
        margin-bottom: 20px;
    }

    .print-section {
        text-align: center;
        margin-top: 30px;
    }

    .print-btn {
        background-color: #ff6b6b;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 10px;
    }

    .retour-faq {
        padding: 40px 20px;
        background-color: #f8f8f8;
    }

    .faq-grid {
        max-width: 800px;
        margin: 0 auto;
    }

    .support-section {
        padding: 40px 20px;
        background-color: white;
    }

    .support-options {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-top: 30px;
    }

    .support-option {
        text-align: center;
        padding: 20px;
        background-color: #f8f8f8;
        border-radius: 8px;
    }

    .support-option i {
        font-size: 2em;
        color: #ff6b6b;
        margin-bottom: 15px;
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
        .steps-grid {
            grid-template-columns: 1fr;
        }

        .order-item {
            flex-direction: column;
            text-align: center;
        }

        .support-options {
            grid-template-columns: 1fr;
        }
    }
`;

// Add the styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);