// Attendre que le DOM soit complètement chargé avant d'exécuter le script
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();      // Initialiser la navigation
  setupModalEvents();     // Initialiser les événements pour les modals
  setupCtaButton();       // Configurer le bouton d'appel à l'action (CTA)
  setupNewsletterSignup();// Configurer le formulaire d'inscription à la newsletter
});

// Configuration des liens de navigation
function setupNavigation() {
  // Sélectionner tous les liens dans la navigation principale
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault(); // Empêcher le comportement par défaut des liens
      const href = link.getAttribute('href'); // Récupérer le lien cible
      window.location.href = href; // Rediriger vers la page cible
    });
  });

  // Gérer les liens dans le footer avec des comportements spécifiques
  const footerLinks = document.querySelectorAll('.footer-content nav a');
  footerLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault(); // Empêcher le comportement par défaut des liens
      const href = link.getAttribute('href'); // Récupérer le lien cible
      window.location.href = href; // Rediriger vers la page cible
      switch(href.split('/').pop()) { // Basculer selon la dernière partie du lien
        case 'about':
          openAboutPage(); // Ouvrir la page "À propos"
          break;
        case 'contact':
          openContactPage(); // Ouvrir la page de contact
          break;
        case 'blog':
          openBlogPage(); // Ouvrir la page du blog
          break;
      }
    });
  });
}

// Configuration des événements pour les boutons modals
function setupModalEvents() {
  const searchBtn = document.querySelector('.search-btn'); // Bouton de recherche
  const cartBtn = document.querySelector('.cart-btn'); // Bouton du panier
  const userBtn = document.querySelector('.user-btn'); // Bouton de connexion utilisateur
  const modalOverlay = document.getElementById('modalOverlay'); // Fond d'écran du modal

  // Ajouter des événements pour ouvrir les différents modals
  searchBtn.addEventListener('click', () => openSearchModal());
  cartBtn.addEventListener('click', () => openCartModal());
  userBtn.addEventListener('click', () => openUserModal());

  // Fermer le modal si on clique en dehors de son contenu
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });
}

// Fonction pour ouvrir le modal de recherche
function openSearchModal() {
  const modalContent = document.querySelector('.modal-content');
  modalContent.innerHTML = `
    <div class="search-modal">
      <span class="close" style="color: orange; font-weight: bold; cursor: pointer;">&times;</span>
      <h2>Rechercher des Produits</h2>
      <input type="text" id="searchInput" placeholder="Entrez votre recherche...">
      <button id="searchButton">Rechercher</button>
    </div>
  `;

  document.getElementById('modalOverlay').style.display = 'flex'; // Afficher la modale

  // Fermer la modale lorsqu'on clique sur la croix
  document.querySelector(".close").addEventListener('click', closeSearchModal);

  // Lancer la recherche lors de la saisie
  document.getElementById("searchInput").addEventListener('keyup', searchProducts);

  // Lancer la recherche et fermer la modale lorsqu'on clique sur "Rechercher"
  document.getElementById("searchButton").addEventListener('click', searchProducts);
}

// Fonction pour fermer la modale
function closeSearchModal() {
  document.getElementById('modalOverlay').style.display = 'none';
}

// Fonction de recherche des produits
function searchProducts() {
  const searchQuery = document.getElementById("searchInput").value.toLowerCase();
  const productsContainer = document.getElementById("bestSellersGrid");
  const allProducts = Array.from(productsContainer.getElementsByClassName("product"));

  let hasResults = false;

  allProducts.forEach(product => {
    const productName = product.querySelector("h3").textContent.toLowerCase();
    if (productName.includes(searchQuery)) {
      product.style.display = "block"; // Afficher le produit correspondant
      hasResults = true;
    } else {
      product.style.display = "none"; // Cacher les autres
    }
  });

  // Afficher un message si aucun produit ne correspond
  if (!hasResults) {
    productsContainer.innerHTML = `<p style="text-align: center; color: red;">Aucun produit trouvé.</p>`;
  }

  // Fermer la modale après la recherche
  closeSearchModal();
}


// Fonction pour ouvrir le modal du panier
function openCartModal() {
  const modalContent = document.querySelector('.modal-content');
  const cart = JSON.parse(localStorage.getItem('cart')) || []; // Récupérer le panier stocké

  if (cart.length === 0) {
    modalContent.innerHTML = `
      <div class="cart-modal">
        <span class="close" style="color: orange; font-weight: bold; cursor: pointer;">&times;</span>
        <h2>Votre Panier</h2>
        <p>Votre panier est actuellement vide.</p>
        <button onclick="closeModal()">Continuer mes achats</button>
      </div>
    `;
  } else {
    let total = 0;

    let cartItemsHTML = cart.map(item => {
      let subtotal = item.price * item.quantity;
      total += subtotal;

      return `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" width="50">
          <p>${item.name}</p>
          <p>Prix : ${item.price} FCFA</p>
          <p>Quantité : ${item.quantity}</p>
          <p>Sous-total : ${subtotal} FCFA</p>
        </div>
      `;
    }).join('');

    modalContent.innerHTML = `
      <div class="cart-modal">
        <span class="close" style="color: orange; font-weight: bold; cursor: pointer;">&times;</span>
        <h2>Votre Panier</h2>
        <div class="cart-items">${cartItemsHTML}</div>
        <h3>Total : ${total} FCFA</h3>
        <button onclick="closeModal()">Fermer</button>
      </div>
    `;
  }

  document.getElementById('modalOverlay').style.display = 'flex'; // Afficher la modale
  setupCloseButton();
}

// Fonction pour ouvrir le modal utilisateur (connexion)
function openUserModal() {
  const modalContent = document.querySelector('.modal-content');
  modalContent.innerHTML = `
    <div class="user-modal">
     <span class="close" style="color: orange; font-weight: bold;">&times;</span>
      <h2>Connexion</h2>
      <form>
        <input type="email" placeholder="Email" required>
        <input type="password" placeholder="Mot de passe" required>
        <button type="submit">Se Connecter</button>
        <p>Pas de compte ? <a href="#">Inscrivez-vous</a></p>
      </form>
    </div>
  `;
  document.getElementById('modalOverlay').style.display = 'flex'; // Afficher le modal
  setupCloseButton(); // Associer le bouton "Fermer" après ouverture du modal
}

// Fonction pour fermer le modal
function closeModal() {
  document.getElementById('modalOverlay').style.display = 'none'; // Cacher le modal
}

// Initialiser les événements pour le bouton "Fermer"
// Fonction pour attacher l'événement de fermeture au bouton "Fermer"
function setupCloseButton() {
  const closeButton = document.querySelector('.modal-content .close'); // Sélectionne le bon bouton "Fermer"
  if (closeButton) {
    closeButton.addEventListener('click', closeModal); // Ferme la modale au clic
  }
}

// Configurer le bouton d'appel à l'action (CTA)
document.addEventListener("DOMContentLoaded", function () {
  const ctaButton = document.querySelector(".cta-button");

  if (ctaButton) {
    ctaButton.addEventListener("click", function () {
      window.location.href = "offres.html"; // Redirige vers offres.html
    });
  }
});
  document.addEventListener("DOMContentLoaded", () => {
    // Obtenez tous les éléments du carrousel
    const carouselItems = document.querySelectorAll(".carousel-item");

    // Map des catégories vers leurs URLs respectives
    const categoryLinks = {
      tech: "technologie.html",
      fashion: "mode.html",
      beauty: "beaute.html",
      home: "maison.html",
      wellness: "bien-etre.html",
      kids: "enfant-bebe.html",
    };

    // Ajoutez un gestionnaire d'événements pour chaque élément
    carouselItems.forEach((item) => {
      item.addEventListener("click", () => {
        const category = item.getAttribute("data-category");
        const targetUrl = categoryLinks[category]; // Obtenez l'URL correspondante
        if (targetUrl) {
          window.location.href = targetUrl; // Redirigez vers l'URL
        }
      });
    });
  });

// Configurer le formulaire d'inscription à la newsletter
function setupNewsletterSignup() {
  const newsletterForm = document.getElementById('newsletterForm');
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Empêcher la soumission par défaut du formulaire
    const email = newsletterForm.querySelector('input').value; // Récupérer l'email

    // Validation basique de l'email
    if (/\S+@\S+\.\S+/.test(email)) {
      alert(`Merci de vous être inscrit avec l'email : ${email}`);
      newsletterForm.reset(); // Réinitialiser le formulaire
    } else {
      alert('Veuillez entrer une adresse email valide.');
    }
  });
}

// Fonctions pour ouvrir des pages spécifiques via des modals
function openAboutPage() {
  const modalContent = document.querySelector('.modal-content');
  modalContent.innerHTML = `
    <div class="about-modal">
      <h2>À Propos d'EdenMarket</h2>
      <p>Découvrez notre mission et nos services.</p>
    </div>
  `;
  document.getElementById('modalOverlay').style.display = 'flex';
}

function openContactPage() {
  const modalContent = document.querySelector('.modal-content');
  modalContent.innerHTML = `
    <div class="contact-modal">
      <h2>Contactez-Nous</h2>
      <form>
        <input type="text" placeholder="Nom" required>
        <input type="email" placeholder="Email" required>
        <textarea placeholder="Votre message" required></textarea>
        <button type="submit">Envoyer</button>
      </form>
    </div>
  `;
  document.getElementById('modalOverlay').style.display = 'flex';
}

function openBlogPage() {
  const modalContent = document.querySelector('.modal-content');
  modalContent.innerHTML = `
    <div class="blog-modal">
      <h2>Blog EdenMarket</h2>
      <p>Découvrez nos derniers articles sur la technologie et plus encore.</p>
    </div>
  `;
  document.getElementById('modalOverlay').style.display = 'flex';
}

document.addEventListener('DOMContentLoaded', () => {
  setupProductModal(); // Initialisation du modal produit
});

// Fonction pour configurer les événements du modal produit
function setupProductModal() {
  const productButtons = document.querySelectorAll('.view-product-btn');
  const modal = document.getElementById('productModal');
  const modalImage = modal.querySelector('.modal-product-image img');
  const modalName = modal.querySelector('.modal-product-name');
  const modalPrice = modal.querySelector('.modal-product-price');
  const modalDescription = modal.querySelector('.modal-product-description');
  const closeButton = modal.querySelector('.close-modal');

  productButtons.forEach(button => {
      button.addEventListener('click', () => {
          const product = button.closest('.product');
          const productName = product.querySelector('.product-name').textContent;
          const productPrice = product.querySelector('.product-price').textContent;
          const productDescription = product.querySelector('.product-description').textContent;
          const productImage = product.querySelector('.product-image').src;

          modalName.textContent = productName;
          modalPrice.textContent = productPrice;
          modalDescription.textContent = productDescription;
          modalImage.src = productImage;

          modal.style.display = 'flex';
      });
  });

  closeButton.addEventListener('click', () => {
      modal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
      if (e.target === modal) {
          modal.style.display = 'none';
      }
  });
}


// Dynamically load products and reviews
async function loadBestSellers() {
  const grid = document.getElementById('bestSellersGrid');
  const products = [
    { name: 'Ceinture en cuir', price: 150.00, image: '/assets/alababa03.avif', description: 'Ceinture élégante en cuir véritable, parfaite pour toutes les occasions.' },
    { name: 'Ceinture en cuir', price: 129.99, image: '/assets/alababa04.avif', description: 'Une ceinture en cuir résistante avec une boucle stylée.' },
    { name: 'Ceinture en cuir noire', price: 100.99, image: '/assets/alibaba03.avif', description: 'Ceinture noire classique en cuir de haute qualité.' },
    { name: 'Ceinture en cuir marron', price: 119.99, image: '/assets/alibaba02.avif', description: 'Une ceinture marron sophistiquée avec une finition premium.' },
    { name: 'Veste Blanche', price: 79.99, image: '/assets/alibabach01.avif', description: 'Veste blanche élégante en tissu de qualité, idéale pour toutes saisons.' },
    { name: 'Veste bleue', price: 79.99, image: '/assets/alibabach02.avif', description: 'Veste tendance de couleur bleue avec une coupe moderne.' },
    { name: 'Veste noire', price: 89.99, image: '/assets/alibabach03.avif', description: 'Veste noire chic et intemporelle, adaptée aux sorties et événements.' },
    { name: 'Veste kaki', price: 95.99, image: '/assets/alibabach04.avif', description: 'Une veste kaki polyvalente, parfaite pour un style casual.' }
  ];

  products.forEach(product => {
    const productEl = createProductElement(product);
    grid.appendChild(productEl);
  });
}

async function loadAffiliatedProducts() {
  const grid = document.getElementById('affiliatedProductsGrid');
  const products = [
    { name: 'Baladeuse blanche', price: 79.99, affiliate: 'AliExpress', link: 'https://aliexpress.com/product', image: '/assets/imgbaladeuse1.jpg', description: 'Lampe baladeuse blanche, idéale pour une ambiance chaleureuse.' },
    { name: 'Baladeuse élégante', price: 26.500, affiliate: 'Amazon', link: 'https://amzn.to/4itmq8n', image: '/assets/baladeuse01.jpg', description: 'Une baladeuse élégante pour éclairer vos soirées.' },
    { name: 'Soulier marron montante', price: 199.99, affiliate: 'Cdiscount', link: 'https://cdiscount.com/product', image: '/assets/imgpairesoulier2.jpg', description: 'Chaussures montantes en cuir marron pour un look raffiné.' },
    { name: 'Soulier noir montante', price: 129.99, affiliate: 'Fnac', link: 'https://fnac.com/product', image: '/assets/imgpairesoulier3.jpg', description: 'Chaussures noires montantes en cuir pour une touche d’élégance.' },
    { name: 'Soulier marron montante', price: 89.99, affiliate: 'Darty', link: 'https://darty.com/product', image: '/assets/imgpairesoulier4.jpg', description: 'Des chaussures montantes marron pour un style intemporel.' },
    { name: 'Paire de tennis', price: 249.99, affiliate: 'Boulanger', link: 'https://boulanger.com/product', image: '/assets/imgpairetennis.jpg', description: 'Des baskets modernes et confortables pour tous les jours.' },
    { name: 'Tennis blanc', price: 59.99, affiliate: 'Amazon', link: 'https://amazon.com/product', image: '/assets/imgpairetennis2.jpg', description: 'Chaussures de tennis blanches légères et respirantes.' },
    { name: 'Soulier noir cuir', price: 179.99, affiliate: 'Cdiscount', link: 'https://cdiscount.com/product', image: '/assets/imgpairesoulier1.jpg', description: 'Soulier noir en cuir véritable, idéal pour les grandes occasions.' }
  ];

  products.forEach(product => {
    const productEl = createAffiliateProductElement(product);
    grid.appendChild(productEl);
  });
}

function createProductElement(product) {
  const el = document.createElement('div');
  el.classList.add('product');

  el.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-image">
      <h3 class="product-name">${product.name}</h3>
      <p class="product-price" style="color:#ff9900;">Prix : ${product.price} FCFA</p>
      <p class="product-description" style="display:none;">${product.description}</p> 
      <button class="view-product">Voir le Produit</button>
  `;

  // Ajouter un événement pour ouvrir la modale
  const button = el.querySelector('.view-product');
  button.addEventListener('click', () => openModal(product));

  return el;
}


// Fonction pour ouvrir la modale avec les détails du produit
function openModal(product) {
  // Vérifie si la modale existe déjà, sinon la crée
  let modal = document.querySelector('.modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close" style="color: orange; font-weight: bold;">&times;</span>
        <div class="modal-body">
          <img src="" alt="" class="modal-img">
          <div class="modal-details">
            <h3 class="modal-title"></h3>
            <p class="modal-price" style="color: orange; font-weight: bold;"></p>
            <p class="modal-description"></p>
            <div class="rating" style="color: orange; font-size: 1.2em;">
              ★★★★☆
            </div>
            <button class="add-to-cart">Ajouter au Panier</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // Mise à jour du contenu de la modale
  modal.querySelector('.modal-img').src = product.image;
  modal.querySelector('.modal-img').alt = product.name;
  modal.querySelector('.modal-title').textContent = product.name;
  modal.querySelector('.modal-price').textContent = `Prix : ${product.price} FCFA`;
  modal.querySelector('.modal-description').textContent = product.description;

  // Affichage de la modale
  modal.style.display = 'flex';

  // Suppression des anciens événements pour éviter les doublons
  let closeButton = modal.querySelector('.close');
  closeButton.replaceWith(closeButton.cloneNode(true));
  closeButton = modal.querySelector('.close');

  // Fermeture de la modale lorsqu'on clique sur (x)
  closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Suppression des anciens événements pour éviter des doublons
  let addToCartButton = modal.querySelector('.add-to-cart');
  addToCartButton.replaceWith(addToCartButton.cloneNode(true));
  addToCartButton = modal.querySelector('.add-to-cart');

  // Ajout du produit au panier
  addToCartButton.addEventListener('click', () => {
    addToCart(product);
  });
}

// Vérifier si le panier existe déjà dans le localStorage, sinon initialiser un tableau vide
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(product) {
  if (!product.price) {
    console.error("Erreur : Le prix du produit est manquant.", product);
    return;
  }

  // Ajouter le produit au panier
  cart.push({
    id: product.id,
            name: product.name,
            price: product.price, // Assurez-vous que price est bien défini ici !
            quantity: 1,
            image: product.image
  });

  // Sauvegarder dans le localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  console.log(`Produit ajouté au panier : ${product.name}, Prix: ${product.price} FCFA`);

  alert(`"${product.name}" a été ajouté au panier !`);
  window.location.href = 'checkout.html';

  // Mettre à jour l'affichage du panier
  updateCartUI();
}

// Fonction pour mettre à jour l'affichage du panier
function updateCartUI() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const cartCount = document.getElementById("cart-count"); // Compteur du panier
  const cartItemsContainer = document.getElementById("cart-items"); // Conteneur des produits
  const totalPriceContainer = document.getElementById("total-price"); // Conteneur du total

  // Mise à jour du compteur d'articles
  if (cartCount) {
    cartCount.textContent = cart.length; 
  }

  // Vérifier si les éléments existent avant de les modifier
  if (!cartItemsContainer || !totalPriceContainer) {
    console.error("Erreur : Les éléments d'affichage du panier ne sont pas trouvés.");
    return;
  }

  // Vider l'affichage actuel
  cartItemsContainer.innerHTML = "";
  let total = 0;

  // Ajouter chaque produit au panier affiché
  cart.forEach((item, index) => {
    let itemElement = document.createElement("div");
    itemElement.classList.add("cart-item");
    itemElement.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-details">
        <p><strong>${item.name}</strong></p>
        <p>Prix: ${item.price.toFixed(2)} FCFA</p>
      </div>
    `;

    cartItemsContainer.appendChild(itemElement);
    total += item.price;
  });

  // Mise à jour de l'affichage du prix total
  totalPriceContainer.innerHTML = `<strong>Total : ${total.toFixed(2)} FCFA</strong>`;
}

// Appel pour s'assurer que l'affichage est mis à jour au chargement de la page
document.addEventListener("DOMContentLoaded", updateCartUI);


function createAffiliateProductElement(product) {
  const el = document.createElement('div');
  el.classList.add('product');
  el.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <h3>${product.name}</h3>
    <p>Prix : ${product.price} €</p>
    <a href="${product.link}" target="_blank">Acheter via ${product.affiliate}</a>
  `;
  return el;
}

function loadCustomerReviews() {
  const carousel = document.getElementById('reviewsCarousel');
  const reviews = [
    { text: 'Super qualité et service rapide !', author: 'Alice' },
    { text: 'Je recommande vivement IvoirMarche.', author: 'Marc' },
    { text: 'Des produits incroyables à des prix compétitifs.', author: 'Sophie' },
    { text: 'Livraison express et produits de qualité.', author: 'Jean' }
  ];

  reviews.forEach(review => {
    const reviewEl = document.createElement('div');
    reviewEl.classList.add('review');
    reviewEl.innerHTML = `
      <p>"${review.text}" - ${review.author}</p>
    `;
    carousel.appendChild(reviewEl);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadBestSellers();
  loadAffiliatedProducts();
  loadCustomerReviews();
});

// Gestion de l'affichage du modal produit
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("productModal");
  const closeModal = document.querySelector(".close");
  const addToCartBtn = document.getElementById("addToCart");
  const buyNowBtn = document.getElementById("buyNow");
  let currentProduct = {}; // Stocke les informations du produit affiché

  // Ouvrir le modal lorsque "Voir le produit" est cliqué
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("view-product")) {
      const product = event.target.closest(".product");
      if (!product) return;

      const productName = product.querySelector("h3").textContent;
      let productPrice = product.querySelector("p").textContent;
      const productImage = product.querySelector("img").src;
      const productDescriptionElement = product.querySelector(".product-description");
      const productDescription = productDescriptionElement ? productDescriptionElement.textContent.trim() : "Description non disponible.";


      // Nettoyage du prix (enlever FCFA et les espaces)
      productPrice = parseFloat(productPrice.replace(/[^\d]/g, ""));
      
      currentProduct = { name: productName, price: productPrice, image: productImage, description: productDescription, quantity: 1 };

      document.getElementById("modalTitle").textContent = productName;
      document.getElementById("modalPrice").textContent = productPrice.toFixed(2) + " FCFA";
      document.getElementById("modalImage").src = productImage;
      document.getElementById("modalDescription").textContent = productDescription;

      modal.style.display = "flex";
    }
  });

  // Ajout au panier
  addToCartBtn.addEventListener("click", function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProduct = cart.find(item => item.name === currentProduct.name);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({ ...currentProduct, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Produit ajouté au panier !");
    updateCartUI();
  });

  // Met à jour l'affichage du panier
  function updateCartUI() {
    const cartCount = document.getElementById("cart-count");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cartCount) {
      cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
  }
  updateCartUI();
  
  // Bouton "Acheter cet article"
  buyNowBtn.addEventListener("click", function () {
    const urlParams = new URLSearchParams();
    Object.keys(currentProduct).forEach(key => urlParams.append(key, currentProduct[key]));

    window.location.href = `checkout.html?${urlParams.toString()}`;
  });

  // Fermeture de la modale
  closeModal.addEventListener("click", function () {
    modal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});

