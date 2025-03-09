document.addEventListener('DOMContentLoaded', () => {
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    const reorderModal = document.getElementById('reorderModal');
    const downloadPdf = document.getElementById('downloadPdf');
    const downloadCsv = document.getElementById('downloadCsv');
    const startChat = document.getElementById('startChat');
    const clearFilters = document.getElementById('clear-filters');
    const statusFilter = document.getElementById('status-filter');
    const dateFilter = document.getElementById('date-filter');
    const ordersList = document.getElementById('ordersList');
    const pagination = document.querySelector('.pagination');
    const prevPage = pagination.querySelector('#prev-page');
    const nextPage = pagination.querySelector('#next-page');
    const pageInfo = pagination.querySelector('#page-info');
    const confirmReorder = reorderModal.querySelector('#confirmReorder');
    const cancelReorder = reorderModal.querySelector('#cancelReorder');

    // Initialize event listeners
    clearFilters.addEventListener('click', () => {
        statusFilter.value = 'all';
        dateFilter.value = 'all';
        ordersList.innerHTML = '';
        pagination.style.display = 'block';
        pageInfo.textContent = 'Page 1';
        prevPage.disabled = true;
        nextPage.disabled = false;
    });

    // Initialize pagination
    const ordersPerPage = 10;
    let currentPage = 1;
    let totalOrders = orderHistory.length;

    // Display orders
    const displayOrders = (orders) => {
        ordersList.innerHTML = '';
        orders.forEach(order => {
            const orderEl = document.createElement('div');
            orderEl.classList.add('order');
            orderEl.innerHTML = `
                <div class="order-header">
                    <h3>Commande #${order.id}</h3>
                </div>
                <div class="order-info">
                    <p>Statut: ${order.status}</p>
                    <p>Date: ${order.date}</p>
                </div>
                <div class="order-actions">
                    <button class="reorder-btn" onclick="window.location.href='order-confirmation.html?orderId=${order.id}'">Voir la commande</button>
                </div>
            `;
            ordersList.appendChild(orderEl);
        });
    };

    // Load orders
    displayOrders(orderHistory.slice(0, ordersPerPage));

    // Handle pagination
    prevPage.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayOrders(orderHistory.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage));
            pageInfo.textContent = `Page ${currentPage}`;
            prevPage.disabled = false;
            nextPage.disabled = true;
        }
    });

    nextPage.addEventListener('click', () => {
        if (currentPage < Math.ceil(totalOrders / ordersPerPage)) {
            currentPage++;
            displayOrders(orderHistory.slice(currentPage * ordersPerPage, (currentPage + 1) * ordersPerPage));
            pageInfo.textContent = `Page ${currentPage}`;
            prevPage.disabled = false;
            nextPage.disabled = true;
        }
    });

    // Handle reorder modal
    confirmReorder.addEventListener('click', () => {
        reorderModal.style.display = 'none';
    });

    cancelReorder.addEventListener('click', () => {
        reorderModal.style.display = 'none';
    });

    // Handle download
    downloadPdf.addEventListener('click', () => {
        // Simulate PDF download
        alert('Téléchargement du fichier PDF en cours...');
    });

    downloadCsv.addEventListener('click', () => {
        // Simulate CSV download
        alert('Téléchargement du fichier CSV en cours...');
    });

    // Handle support
    startChat.addEventListener('click', () => {
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
    });
});

