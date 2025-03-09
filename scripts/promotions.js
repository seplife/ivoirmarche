import { createProductElement } from './product-utils.js';

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
      <h2>Rechercher des Produits</h2>
      <input type="text" placeholder="Entrez votre recherche...">
      <button>Rechercher</button>
    </div>
  `;
  document.getElementById('modalOverlay').style.display = 'flex'; // Afficher le modal
}

// Fonction pour ouvrir le modal du panier
function openCartModal() {
  const modalContent = document.querySelector('.modal-content');
  modalContent.innerHTML = `
    <div class="cart-modal">
      <h2>Votre Panier</h2>
      <p>Votre panier est actuellement vide.</p>
      <button>Continuer mes achats</button>
    </div>
  `;
  document.getElementById('modalOverlay').style.display = 'flex'; // Afficher le modal
}

// Fonction pour ouvrir le modal utilisateur (connexion)
function openUserModal() {
  const modalContent = document.querySelector('.modal-content');
  modalContent.innerHTML = `
    <div class="user-modal">
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
}

// Fonction pour fermer le modal
function closeModal() {
  document.getElementById('modalOverlay').style.display = 'none'; // Cacher le modal
}

// Configurer le bouton d'appel à l'action (CTA)
function setupCtaButton() {
  const ctaButton = document.querySelector('.cta-button');
  ctaButton.addEventListener('click', () => {
    window.location.href = 'promotions.html'; // Rediriger vers la page des promotions
  });
}
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

const PRODUCTS_PER_PAGE = 10;
let currentPage = 1;
let filteredProducts = [];

const products = [
  { 
    id: 1, 
    name: 'Aspirateur robot', 
    price: 599.99, 
    originalPrice: 799.99,
    discount: 25,
    category: 'tech', 
    image: '/assets/aspirateur robot.webp' 
  },
  { 
    id: 2, 
    name: 'Écouteurs Sans Fil', 
    price: 89.99, 
    originalPrice: 129.99,
    discount: 30,
    category: 'tech', 
    image: '/assets/ecouteur.avif' 
  },
  { 
    id: 3, 
    name: 'T-shirt Tendance', 
    price: 24.99, 
    originalPrice: 49.99,
    discount: 50,
    category: 'fashion', 
    image: '/assets/tee-shirt01.webp' 
  },
  { 
    id: 4, 
    name: 'Robe Élégante', 
    price: 59.99, 
    originalPrice: 99.99,
    discount: 40,
    category: 'fashion', 
    image: '/assets/imgmodefemme.jpg' 
  },
  { 
    id: 5, 
    name: 'Crème Hydratante', 
    price: 19.99, 
    originalPrice: 34.99,
    discount: 43,
    category: 'beauty', 
    image: '/assets/creme01.avif' 
  },
  { 
    id: 6, 
    name: 'Kit Maquillage', 
    price: 34.99, 
    originalPrice: 59.99,
    discount: 42,
    category: 'beauty', 
    image: '/assets/kit maquillage01.avif' 
  },
  { 
    id: 7, 
    name: 'Aspirateur Robot', 
    price: 199.99, 
    originalPrice: 299.99,
    discount: 33,
    category: 'home', 
    image: '/assets/aspirateur robot01.webp' 
  },
  { 
    id: 8, 
    name: 'Machine à Café', 
    price: 89.99, 
    originalPrice: 129.99,
    discount: 30,
    category: 'home', 
    image: '/assets/casque.avif' 
  },
  { 
    id: 9, 
    name: 'Lampe de Relaxation', 
    price: 39.99, 
    originalPrice: 59.99,
    discount: 33,
    category: 'wellness', 
    image: 'https://via.placeholder.com/250x250?text=Lampe' 
  },
  { 
    id: 10, 
    name: 'Kit de Yoga', 
    price: 49.99, 
    originalPrice: 79.99,
    discount: 37,
    category: 'wellness', 
    image: 'https://via.placeholder.com/250x250?text=Yoga' 
  },
  { 
    id: 11, 
    name: 'Jouet Éducatif', 
    price: 24.99, 
    originalPrice: 39.99,
    discount: 38,
    category: 'kids', 
    image: 'https://via.placeholder.com/250x250?text=Jouet' 
  },
  { 
    id: 12, 
    name: 'Vêtements Bébé', 
    price: 19.99, 
    originalPrice: 34.99,
    discount: 43,
    category: 'kids', 
    image: 'https://via.placeholder.com/250x250?text=Bébé' 
  },
  { 
    id: 13, 
    name: 'Kit de Yoga', 
    price: 49.99, 
    originalPrice: 79.99,
    discount: 37,
    category: 'wellness', 
    image: 'https://via.placeholder.com/250x250?text=Yoga' 
  },
  { 
    id: 14, 
    name: 'Jouet Éducatif', 
    price: 24.99, 
    originalPrice: 39.99,
    discount: 38,
    category: 'kids', 
    image: 'https://via.placeholder.com/250x250?text=Jouet' 
  },
  { 
    id: 15, 
    name: 'Vêtements Bébé', 
    price: 19.99, 
    originalPrice: 34.99,
    discount: 43,
    category: 'kids', 
    image: 'https://via.placeholder.com/250x250?text=Bébé' 
  }
];

// Fonction pour créer un élément de produit en promotion
function createPromotionProductElement(product) {
  const el = document.createElement('div');
  el.classList.add('product');
  el.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <h3>${product.name}</h3>
    <div class="product-price">
      <p class="original-price">${product.originalPrice.toFixed(2)} €</p>
      <p class="discounted-price">${product.price.toFixed(2)} €</p>
      <span class="discount-tag">-${product.discount}%</span>
    </div>
    <button id="buy-now-${product.id}" class="buy-now-btn">Acheter Maintenant</button>
  `;

  // Ajout d'un eventListener sur le bouton "Acheter Maintenant"
  el.querySelector('.buy-now-btn').addEventListener('click', () => buyNow(product));

  return el;
}

// Fonction appelée lorsqu'on clique sur "Acheter Maintenant"
function buyNow(product) {
  if (!product || !product.id) {
    console.error("Erreur : produit invalide", product);
    return;
  }

  console.log("Bouton cliqué pour le produit :", product);

  // Ajout du produit au panier
  addToCart(product);

  // Redirection vers la page de paiement
  window.location.href = 'checkout.html';
}

// Fonction pour ajouter un produit au panier
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const existingProduct = cart.find(p => p.id === product.id);
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  console.log(`Produit ${product.name} ajouté au panier.`);
}

// Fonction pour appliquer les filtres
function applyFilters() {
  const discountFilter = document.getElementById('discount-filter')?.value;
  const categoryFilter = document.getElementById('category-filter')?.value;
  const sortFilter = document.getElementById('sort-filter')?.value;

  filteredProducts = products.filter(product => {
    const passCategory = !categoryFilter || product.category === categoryFilter;
    const passDiscount = !discountFilter || checkDiscountRange(product.discount, discountFilter);
    return passCategory && passDiscount;
  });

  sortProducts(sortFilter);
  renderProducts();
  updatePagination();
}

// Vérifie si un produit est dans une plage de remise donnée
function checkDiscountRange(discount, range) {
  switch (range) {
    case '10-30': return discount >= 10 && discount <= 30;
    case '30-50': return discount > 30 && discount <= 50;
    case '50+': return discount > 50;
    default: return true;
  }
}

// Trie les produits selon l'option sélectionnée
function sortProducts(sortType) {
  switch (sortType) {
    case 'discount-desc':
      filteredProducts.sort((a, b) => b.discount - a.discount);
      break;
    case 'price-asc':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
  }
}

// Affiche les produits filtrés
function renderProducts() {
  const grid = document.getElementById('promotionProductsGrid');
  if (!grid) {
    console.error("Erreur : l'élément #promotionProductsGrid n'existe pas.");
    return;
  }

  grid.innerHTML = '';

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const pageProducts = filteredProducts.slice(startIndex, endIndex);

  pageProducts.forEach(product => {
    grid.appendChild(createPromotionProductElement(product));
  });
}

// Met à jour les boutons de pagination
function updatePagination() {
  const prevBtn = document.getElementById('prev-page');
  const nextBtn = document.getElementById('next-page');
  const currentPageSpan = document.getElementById('current-page');

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  if (prevBtn && nextBtn && currentPageSpan) {
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    currentPageSpan.textContent = `Page ${currentPage}`;
  }
}


// Initialise les écouteurs d'événements
function initEventListeners() {
  document.getElementById('discount-filter')?.addEventListener('change', applyFilters);
  document.getElementById('category-filter')?.addEventListener('change', applyFilters);
  document.getElementById('sort-filter')?.addEventListener('change', applyFilters);

  document.getElementById('prev-page')?.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderProducts();
      updatePagination();
    }
  });

  document.getElementById('next-page')?.addEventListener('click', () => {
    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
    if (currentPage < totalPages) {
      currentPage++;
      renderProducts();
      updatePagination();
    }
  });

  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', handleNewsletterSignup);
  }
}

// Gestion de l'inscription à la newsletter
function handleNewsletterSignup(event) {
  event.preventDefault();
  const email = event.target.querySelector('input')?.value;
  if (email) {
    alert(`Merci de vous être inscrit avec l'email : ${email}`);
  }
}

// Chargement des produits et initialisation des événements après le chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  if (!products || products.length === 0) {
    console.error("La liste des produits est vide ou non définie !");
    return;
  }

  applyFilters();
  initEventListeners();
});

