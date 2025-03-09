document.addEventListener('DOMContentLoaded', () => {
    loadOrderConfirmation();
    setupEventListeners();
    loadRecommendedProducts();
    updateCartCount();
});

function loadOrderConfirmation() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');

    const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
    const order = orderHistory.find(o => o.id.toString() === orderId);

    if (!order) {
        handleInvalidOrder();
        return;
    }

    displayOrderDetails(order);
}

function handleInvalidOrder() {
    const confirmationContainer = document.querySelector('.confirmation-container');
    confirmationContainer.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        <h2>Commande introuvable</h2>
        <p>Nous ne trouvons pas les détails de votre commande.</p>
        <button onclick="window.location.href='index.html'" class="primary-btn">
          Retour à l'accueil
        </button>
      </div>
    `;
}

function displayOrderDetails(order) {
    document.getElementById('orderNumber').textContent = order.id;

    const orderDate = new Date(order.date);
    document.getElementById('orderDate').textContent = orderDate.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('customerEmail').textContent = currentUser.email;
    }

    document.getElementById('shippingAddress').innerHTML = `
      <p>${order.shipping.address.firstName} ${order.shipping.address.lastName}</p>
      <p>${order.shipping.address.address}</p>
      <p>${order.shipping.address.postalCode} ${order.shipping.address.city}</p>
      <p>Tél: ${order.shipping.address.phone}</p>
    `;

    const orderItemsContainer = document.getElementById('orderItems');
    orderItemsContainer.innerHTML = '';

    let subtotal = 0;

    order.orderItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const itemElement = document.createElement('div');
        itemElement.classList.add('order-item');
        itemElement.innerHTML = `
          <img src="${item.image}" alt="${item.name}">
          <div class="item-details">
            <h4>${item.name}</h4>
            <p>Quantité: ${item.quantity}</p>
            <p>Prix unitaire: ${item.price.toFixed(2)} €</p>
          </div>
          <div class="item-total">
            <strong>${itemTotal.toFixed(2)} €</strong>
          </div>
        `;
        orderItemsContainer.appendChild(itemElement);
    });

    document.getElementById('subtotal').textContent = `${subtotal.toFixed(2)} €`;
    const shippingCost = order.shipping.method === 'standard' ? 0 : 9.99;
    document.getElementById('shipping').textContent = shippingCost === 0 ? 'Gratuit' : `${shippingCost.toFixed(2)} €`;
    document.getElementById('total').textContent = `${(subtotal + shippingCost).toFixed(2)} €`;
}

function setupEventListeners() {
    document.getElementById('viewOrderBtn').addEventListener('click', () => {
        window.location.href = 'profile.html?tab=orders';
    });

    document.getElementById('continueShopping').addEventListener('click', () => {
        window.location.href = 'categories.html';
    });

    const newsletterForm = document.getElementById('newsletterForm');
    newsletterForm.addEventListener('submit', handleNewsletterSignup);
}

function loadRecommendedProducts() {
    const recommendedGrid = document.getElementById('recommendedProductsGrid');
    const recommendedProducts = [
        { id: 1, name: 'Produit Recommandé 1', price: 59.99, image: 'path/to/image1.jpg', description: 'Description du produit 1' },
        { id: 2, name: 'Produit Recommandé 2', price: 79.99, image: 'path/to/image2.jpg', description: 'Description du produit 2' },
        { id: 3, name: 'Produit Recommandé 3', price: 49.99, image: 'path/to/image3.jpg', description: 'Description du produit 3' }
    ];

    recommendedProducts.forEach(product => {
        const productEl = document.createElement('div');
        productEl.classList.add('product');
        productEl.innerHTML = `
          <img src="${product.image}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p>${product.price.toFixed(2)} €</p>
          <button onclick="viewProduct(${product.id})">Voir le produit</button>
        `;
        recommendedGrid.appendChild(productEl);
    });
}

function handleNewsletterSignup(event) {
    event.preventDefault();
    const email = event.target.querySelector('input').value;

    if (validateEmail(email)) {
        alert('Merci de votre inscription à notre newsletter !');
        event.target.reset();
    } else {
        alert('Veuillez entrer une adresse email valide.');
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
}

window.viewProduct = function(productId) {
    window.location.href = `products.html?id=${productId}`;
};
