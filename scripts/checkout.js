document.addEventListener('DOMContentLoaded', () => {
  const checkoutManager = new CheckoutManager();
});

class CheckoutManager {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem('cart')) || [];
    this.shippingMethod = 'standard';
    this.paymentMethod = 'card';
    this.mobileMoneyProviders = {
      orangeMoney: { name: 'Orange Money', prefix: '+225' },
      mtnMoney: { name: 'MTN Money', prefix: '+225' },
      moovMoney: { name: 'Moov Money', prefix: '+225' },
      wave: { name: 'Wave', prefix: '+225' }
    };

    this.initializeEventListeners();
    this.loadOrderSummary();
    this.loadUserInfo();
  }

  initializeEventListeners() {
    // Shipping method selection
    document.querySelectorAll('input[name="shipping"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.shippingMethod = e.target.value;
        this.updateTotals();
      });
    });

    // Payment method selection
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.paymentMethod = e.target.value;
        this.togglePaymentDetails();
      });
    });

    // Form validation and submission
    document.getElementById('placeOrderBtn').addEventListener('click', () => {
      this.validateAndSubmitOrder();
    });

    // Card number formatting
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
      cardNumberInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(.{4})/g, '$1 ').trim();
        e.target.value = value;
      });
    }

    // Expiry date formatting
    const expiryDateInput = document.getElementById('expiryDate');
    if (expiryDateInput) {
      expiryDateInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
          value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        e.target.value = value;
      });
    }

    // Phone number formatting
    const phoneNumberInput = document.getElementById('phoneNumber');
    if (phoneNumberInput) {
      phoneNumberInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (!value.startsWith('225')) {
          value = '225' + value;
        }
        e.target.value = this.formatPhoneNumber(value);
      });
    }
  }

  loadOrderSummary() {
    const orderItems = document.getElementById('orderItems');
    orderItems.innerHTML = '';
    
    let subtotal = 0;

    this.cart.forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.classList.add('order-item');
      itemEl.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="item-details">
          <h3>${item.name}</h3>
          <p>Quantité: ${item.quantity}</p>
          <p>${(item.price * item.quantity).toFixed(2)} €</p>
        </div>
      `;
      orderItems.appendChild(itemEl);
      subtotal += item.price * item.quantity;
    });

    this.updateTotals(subtotal);
  }

  updateTotals(subtotal = null) {
    if (subtotal === null) {
      subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    const shippingCost = this.shippingMethod === 'express' ? 9.99 : 0;
    const total = subtotal + shippingCost;

    document.getElementById('subtotal').textContent = `${subtotal.toFixed(2)} €`;
    document.getElementById('shipping').textContent = shippingCost === 0 ? 'Gratuit' : `${shippingCost.toFixed(2)} €`;
    document.getElementById('total').textContent = `${total.toFixed(2)} €`;
  }

  togglePaymentDetails() {
    const cardDetails = document.getElementById('cardDetails');
    const mobileMoneyDetails = document.getElementById('mobileMoneyDetails');

    if (this.paymentMethod === 'card') {
      cardDetails.style.display = 'block';
      mobileMoneyDetails.style.display = 'none';
    } else if (this.isMobileMoneyPayment()) {
      cardDetails.style.display = 'none';
      mobileMoneyDetails.style.display = 'block';
      this.updatePhoneNumberPrefix();
    } else {
      cardDetails.style.display = 'none';
      mobileMoneyDetails.style.display = 'none';
    }
  }

  isMobileMoneyPayment() {
    return ['orangeMoney', 'mtnMoney', 'moovMoney', 'wave'].includes(this.paymentMethod);
  }

  updatePhoneNumberPrefix() {
    const phoneInput = document.getElementById('phoneNumber');
    if (phoneInput && this.mobileMoneyProviders[this.paymentMethod]) {
      phoneInput.placeholder = `${this.mobileMoneyProviders[this.paymentMethod].prefix} XXXXXXXXX`;
    }
  }

  formatPhoneNumber(number) {
    // Format: +225 XX XX XX XX XX
    const cleaned = number.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})?$/);
    if (match) {
      return `+${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}${match[6] ? ' ' + match[6] : ''}`;
    }
    return number;
  }

  async loadUserInfo() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userDetails = users.find(u => u.email === currentUser.email);
      
      if (userDetails) {
        document.getElementById('firstName').value = userDetails.firstName || '';
        document.getElementById('lastName').value = userDetails.lastName || '';
        document.getElementById('address').value = userDetails.address || '';
        document.getElementById('phone').value = userDetails.phone || '';
      }
    }
  }

  validateAndSubmitOrder() {
    if (!this.validateForms()) {
      return;
    }

    const orderData = this.collectOrderData();
    
    try {
      // Simulate order processing
      this.processOrder(orderData);
    } catch (error) {
      alert('Une erreur est survenue lors du traitement de votre commande. Veuillez réessayer.');
      console.error('Order processing error:', error);
    }
  }

  validateForms() {
    // Shipping form validation
    const shippingForm = document.getElementById('shippingForm');
    if (!shippingForm.checkValidity()) {
      alert('Veuillez remplir tous les champs de livraison correctement.');
      return false;
    }

    // Payment validation
    if (this.paymentMethod === 'card') {
      const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
      const expiryDate = document.getElementById('expiryDate').value;
      const cvv = document.getElementById('cvv').value;

      if (!/^\d{16}$/.test(cardNumber)) {
        alert('Numéro de carte invalide');
        return false;
      }

      if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        alert('Date d\'expiration invalide');
        return false;
      }

      if (!/^\d{3}$/.test(cvv)) {
        alert('CVV invalide');
        return false;
      }
    }

    if (this.isMobileMoneyPayment()) {
      const phoneNumber = document.getElementById('phoneNumber').value;
      const accountName = document.getElementById('accountName').value;

      if (!this.validatePhoneNumber(phoneNumber)) {
        alert('Numéro de téléphone invalide');
        return false;
      }

      if (accountName.length < 3) {
        alert('Veuillez entrer un nom de compte valide');
        return false;
      }
    }

    return true;
  }

  validatePhoneNumber(phone) {
    // Validate phone number format for mobile money
    const phoneRegex = /^\+225 \d{2} \d{2} \d{2} \d{2} \d{2}$/;
    return phoneRegex.test(phone);
  }

  collectOrderData() {
    const shippingData = {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      address: document.getElementById('address').value,
      postalCode: document.getElementById('postalCode').value,
      city: document.getElementById('city').value,
      phone: document.getElementById('phone').value
    };

    if (this.paymentMethod === 'card') {
      const paymentData = {
        cardNumber: document.getElementById('cardNumber').value,
        expiryDate: document.getElementById('expiryDate').value,
        cvv: document.getElementById('cvv').value
      };
      return {
        orderItems: this.cart,
        shipping: {
          method: this.shippingMethod,
          address: shippingData
        },
        payment: paymentData,
        total: parseFloat(document.getElementById('total').textContent)
      };
    } else if (this.isMobileMoneyPayment()) {
      const paymentData = {
        phoneNumber: document.getElementById('phoneNumber').value,
        accountName: document.getElementById('accountName').value
      };
      return {
        orderItems: this.cart,
        shipping: {
          method: this.shippingMethod,
          address: shippingData
        },
        payment: paymentData,
        total: parseFloat(document.getElementById('total').textContent)
      };
    } else {
      const paymentData = { paymentMethod: 'paypal' };
      return {
        orderItems: this.cart,
        shipping: {
          method: this.shippingMethod,
          address: shippingData
        },
        payment: paymentData,
        total: parseFloat(document.getElementById('total').textContent)
      };
    }
  }

  processOrder(orderData) {
    // Simulate payment processing
    const processingDelay = this.isMobileMoneyPayment() ? 5000 : 2000; // Longer delay for mobile money

    // Show processing message
    alert(`Traitement de votre paiement via ${this.getPaymentMethodName()}. Veuillez patienter...`);

    setTimeout(() => {
      // Simulate successful payment
      if (this.isMobileMoneyPayment()) {
        alert(`Un message de confirmation a été envoyé à votre numéro ${orderData.payment.phoneNumber}`);
      }

      // Clear cart and save order
      localStorage.removeItem('cart');
      
      const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      const order = {
        id: Date.now(),
        date: new Date().toISOString(),
        ...orderData
      };
      orderHistory.push(order);
      localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

      alert('Commande effectuée avec succès ! Vous allez être redirigé vers la page de confirmation.');
      window.location.href = `order-confirmation.html?orderId=${order.id}`;
    }, processingDelay);
  }

  getPaymentMethodName() {
    if (this.isMobileMoneyPayment()) {
      return this.mobileMoneyProviders[this.paymentMethod].name;
    }
    return this.paymentMethod === 'card' ? 'Carte Bancaire' : 'PayPal';
  }
}

const additionalStyles = `
.mobile-money-icon {
  width: 30px;
  height: 30px;
  margin-right: 10px;
  vertical-align: middle;
}

.payment-method {
  display: flex;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.payment-method:hover {
  border-color: var(--primary-color);
  background-color: #f9f9f9;
}

.payment-method input[type="radio"] {
  margin-right: 15px;
}

.payment-method label {
  display: flex;
  align-items: center;
  width: 100%;
  cursor: pointer;
}

#mobileMoneyDetails {
  margin-top: 20px;
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);