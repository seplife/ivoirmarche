import { createProductElement } from './product-utils.js';

class CartManager {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem('cart')) || [];
    this.cartItemsContainer = document.getElementById('cartItems');
    this.subtotalElement = document.getElementById('subtotalValue');
    this.totalElement = document.getElementById('totalValue');
    this.cartCountElement = document.querySelector('.cart-count');
    
    this.initializeEventListeners();
    this.renderCart();
    this.loadRecommendedProducts();
  }

  initializeEventListeners() {
    document.getElementById('continueShoppingBtn').addEventListener('click', () => {
      window.location.href = 'categories.html';
    });

    document.getElementById('proceedToCheckoutBtn').addEventListener('click', this.proceedToCheckout.bind(this));

    document.getElementById('newsletterForm').addEventListener('submit', this.handleNewsletterSignup.bind(this));
  }

  renderCart() {
    this.cartItemsContainer.innerHTML = '';
    let subtotal = 0;

    if (this.cart.length === 0) {
      this.cartItemsContainer.innerHTML = `
        <div class="empty-cart">
          <p>Votre panier est vide</p>
          <a href="categories.html" class="primary-btn">Commencer mes achats</a>
        </div>
      `;
      this.updateTotals(0);
      return;
    }

    this.cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      const cartItemEl = document.createElement('div');
      cartItemEl.classList.add('cart-item');
      cartItemEl.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-details">
          <h3>${item.name}</h3>
          <p>Prix : ${item.price.toFixed(2)} €</p>
          <div class="quantity-control">
            <button onclick="window.cartManager.updateQuantity(${index}, ${item.quantity - 1})">-</button>
            <span>${item.quantity}</span>
            <button onclick="window.cartManager.updateQuantity(${index}, ${item.quantity + 1})">+</button>
          </div>
          <button class="remove-btn" onclick="window.cartManager.removeItem(${index})">Supprimer</button>
        </div>
        <div class="cart-item-total">
          ${itemTotal.toFixed(2)} €
        </div>
      `;
      this.cartItemsContainer.appendChild(cartItemEl);
    });

    this.updateTotals(subtotal);
    this.updateCartCount();
  }

  updateQuantity(index, newQuantity) {
    if (newQuantity < 1) {
      this.removeItem(index);
      return;
    }
    this.cart[index].quantity = newQuantity;
    this.saveCart();
    this.renderCart();
  }

  removeItem(index) {
    this.cart.splice(index, 1);
    this.saveCart();
    this.renderCart();
  }

  updateTotals(subtotal) {
    const shippingValue = subtotal > 100 ? 'Gratuit' : '9.99 €';
    const total = subtotal >= 100 ? subtotal : subtotal + 9.99;

    this.subtotalElement.textContent = `${subtotal.toFixed(2)} €`;
    this.totalElement.textContent = `${total.toFixed(2)} €`;
  }

  updateCartCount() {
    const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
    this.cartCountElement.textContent = totalItems;
  }

  proceedToCheckout() {
    if (this.cart.length === 0) {
      alert('Votre panier est vide');
      return;
    }
    alert('Fonctionnalité de paiement en développement. Merci de votre compréhension.');
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  handleNewsletterSignup(event) {
    event.preventDefault();
    const email = event.target.querySelector('input').value;
    alert(`Merci de vous être inscrit avec l'email : ${email}`);
    event.target.reset();
  }

  loadRecommendedProducts() {
    const recommendedGrid = document.getElementById('recommendedProductsGrid');
    const recommendedProducts = [
      { 
        id: 1, 
        name: 'Smartphone Pro', 
        price: 599.99, 
        image: 'https://via.placeholder.com/250x250?text=Smartphone+Pro' 
      },
      { 
        id: 2, 
        name: 'Écouteurs Sans Fil', 
        price: 129.99, 
        image: 'https://via.placeholder.com/250x250?text=Écouteurs' 
      },
      { 
        id: 3, 
        name: 'Tapis de Yoga', 
        price: 49.99, 
        image: 'https://via.placeholder.com/250x250?text=Tapis+Yoga' 
      }
    ];

    recommendedProducts.forEach(product => {
      const productEl = createProductElement(product);
      recommendedGrid.appendChild(productEl);
    });
  }
}

// Global function to add items to cart
window.addToCart = function(productId, productName, price, image) {
  const existingCartManager = window.cartManager;
  const existingItemIndex = existingCartManager.cart.findIndex(item => item.id === productId);

  if (existingItemIndex > -1) {
    existingCartManager.cart[existingItemIndex].quantity++;
  } else {
    existingCartManager.cart.push({ 
      id: productId, 
      name: productName, 
      price: price, 
      image: image, 
      quantity: 1 
    });
  }

  existingCartManager.saveCart();
  existingCartManager.renderCart();
}

document.addEventListener('DOMContentLoaded', () => {
  window.cartManager = new CartManager();
});