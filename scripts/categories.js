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
    name: 'Montre connectée', 
    price: 599.99, 
    category: 'tech', 
    image: '/assets/montre.avif', 
    description: 'Une montre intelligente avec des fonctionnalités avancées comme le suivi de l\'activité physique et des notifications en temps réel.'
  },
  { 
    id: 2, 
    name: 'Écouteurs Sans Fil', 
    price: 129.99, 
    category: 'tech', 
    image: '/assets/ecouteur.avif', 
    description: 'Écouteurs sans fil avec un son haute qualité et une autonomie prolongée.'
  },
  { 
    id: 3, 
    name: 'Casque', 
    price: 39.99, 
    category: 'fashion', 
    image: '/assets/casque.avif', 
    description: 'Casque tendance, parfait pour écouter de la musique avec style.'
  },
  { 
    id: 4, 
    name: 'Tableau éducatif', 
    price: 89.99, 
    category: 'fashion', 
    image: '/assets/tab-educatif.avif', 
    description: 'Un tableau éducatif interactif pour apprendre tout en jouant.'
  },
  { 
    id: 5, 
    name: 'Crème Hydratante', 
    price: 29.99, 
    category: 'beauty', 
    image: '/assets/creme.avif', 
    description: 'Crème hydratante pour peau sèche, procure une sensation de douceur et d\'apaisement.'
  },
  { 
    id: 6, 
    name: 'Kit Maquillage', 
    price: 49.99, 
    category: 'beauty', 
    image: '/assets/kit maquillage01.avif', 
    description: 'Kit complet pour un maquillage parfait avec des produits professionnels.'
  },
  { 
    id: 7, 
    name: 'Aspirateur Robot', 
    price: 249.99, 
    category: 'home', 
    image: '/assets/aspirateur robot.webp', 
    description: 'Un aspirateur robot intelligent qui nettoie automatiquement votre maison.'
  },
  { 
    id: 8, 
    name: 'Pc-bureau', 
    price: 129.99, 
    category: 'home', 
    image: '/assets/pc bureau.avif', 
    description: 'Un ordinateur de bureau performant pour toutes vos tâches quotidiennes.'
  },
  { 
    id: 9, 
    name: 'Crème Pommade', 
    price: 59.99, 
    category: 'wellness', 
    image: '/assets/creme01.avif', 
    description: 'Crème pommade nourrissante pour une peau douce et éclatante.'
  },
  { 
    id: 10, 
    name: 'Papier décoratif', 
    price: 79.99, 
    category: 'wellness', 
    image: '/assets/paier paint01.avif', 
    description: 'Papier décoratif pour embellir vos espaces intérieurs avec des designs modernes.'
  },
  { 
    id: 11, 
    name: 'Jouet Éducatif', 
    price: 34.99, 
    category: 'kids', 
    image: '/assets/jouetedu01.avif',
    description: 'Jouet éducatif pour les enfants, conçu pour stimuler leur développement cognitif.'
  },
  { 
    id: 12, 
    name: 'Vêtements Bébé', 
    price: 25.99, 
    category: 'kids', 
    image: '/assets/vet-bebe.avif', 
    description: 'Vêtements bébé en coton doux et confortable, parfaits pour la peau délicate de votre bébé.'
  },
  { 
    id: 13, 
    name: 'Papier décoratif', 
    price: 79.99, 
    category: 'wellness', 
    image: '/assets/papier peint.avif', 
    description: 'Papier peint décoratif pour une ambiance moderne et accueillante.'
  },
  { 
    id: 14, 
    name: 'Jouet Éducatif', 
    price: 34.99, 
    category: 'kids', 
    image: '/assets/jouetedu.avif',
    description: 'Un autre jouet éducatif qui aide les enfants à apprendre tout en jouant.'
  },
  { 
    id: 15, 
    name: 'Vêtements Bébé', 
    price: 25.99, 
    category: 'kids', 
    image: '/assets/vet-bebe01.avif', 
    description: 'Vêtements bébé en tissus respirants et doux, pour le confort de votre enfant.'
  },
  { 
    id: 16, 
    name: 'Jouet Éducatif', 
    price: 34.99, 
    category: 'kids', 
    image: '/assets/jouetedu01.avif',
    description: 'Jouet éducatif pour les enfants, conçu pour stimuler leur développement cognitif.'
  },
  { 
    id: 17, 
    name: 'Vêtements Bébé', 
    price: 25.99, 
    category: 'kids', 
    image: '/assets/vet-bebe.avif', 
    description: 'Vêtements bébé en coton doux et confortable, parfaits pour la peau délicate de votre bébé.'
  },
  { 
    id: 18, 
    name: 'Papier décoratif', 
    price: 79.99, 
    category: 'wellness', 
    image: '/assets/papier peint.avif', 
    description: 'Papier peint décoratif pour une ambiance moderne et accueillante.'
  },
  { 
    id: 19, 
    name: 'Jouet Éducatif', 
    price: 34.99, 
    category: 'kids', 
    image: '/assets/jouetedu.avif',
    description: 'Un autre jouet éducatif qui aide les enfants à apprendre tout en jouant.'
  },
  { 
    id: 20, 
    name: 'Vêtements Bébé', 
    price: 25.99, 
    category: 'kids', 
    image: '/assets/vet-bebe01.avif', 
    description: 'Vêtements bébé en tissus respirants et doux, pour le confort de votre enfant.'
  },
  { 
    id: 21, 
    name: 'Jouet Éducatif', 
    price: 34.99, 
    category: 'kids', 
    image: '/assets/jouetedu01.avif',
    description: 'Jouet éducatif pour les enfants, conçu pour stimuler leur développement cognitif.'
  },
  { 
    id: 22, 
    name: 'Vêtements Bébé', 
    price: 25.99, 
    category: 'kids', 
    image: '/assets/vet-bebe.avif', 
    description: 'Vêtements bébé en coton doux et confortable, parfaits pour la peau délicate de votre bébé.'
  },
  { 
    id: 23, 
    name: 'Papier décoratif', 
    price: 79.99, 
    category: 'wellness', 
    image: '/assets/papier peint.avif', 
    description: 'Papier peint décoratif pour une ambiance moderne et accueillante.'
  },
  { 
    id: 24, 
    name: 'Jouet Éducatif', 
    price: 34.99, 
    category: 'kids', 
    image: '/assets/jouetedu.avif',
    description: 'Un autre jouet éducatif qui aide les enfants à apprendre tout en jouant.'
  },
  { 
    id: 25, 
    name: 'Vêtements Bébé', 
    price: 25.99, 
    category: 'kids', 
    image: '/assets/vet-bebe01.avif', 
    description: 'Vêtements bébé en tissus respirants et doux, pour le confort de votre enfant.'
  }
];

// Fonction principale pour appliquer les filtres et mettre à jour l'affichage des produits
function applyFilters() {
  const priceFilter = document.getElementById('price-filter').value;
  const categoryFilter = document.getElementById('category-filter').value;
  const sortFilter = document.getElementById('sort-filter').value;

  // Filtrer les produits selon la catégorie et la plage de prix
  filteredProducts = products.filter(product => {
    const passCategory = !categoryFilter || product.category === categoryFilter;
    const passPrice = !priceFilter || checkPriceRange(product.price, priceFilter);
    return passCategory && passPrice;
  });

  // Trier les produits et mettre à jour l'affichage
  sortProducts(sortFilter);
  renderProducts();
  updatePagination();
}

// Vérifie si un prix correspond à une plage donnée
function checkPriceRange(price, range) {
  switch(range) {
    case '0-50': return price >= 0 && price <= 50;
    case '50-100': return price > 50 && price <= 100;
    case '100-200': return price > 100 && price <= 200;
    case '200+': return price > 200;
    default: return true;
  }
}

// Trie les produits en fonction du type de tri sélectionné
function sortProducts(sortType) {
  switch(sortType) {
    case 'price-asc':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      filteredProducts.sort((a, b) => b.id - a.id);
      break;
    default:
      filteredProducts.sort(() => Math.random() - 0.5); // Mélange aléatoire
  }
}

// Affiche les produits filtrés dans la grille
function renderProducts() {
  const grid = document.getElementById('categoryProductsGrid');
  grid.innerHTML = '';

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const pageProducts = filteredProducts.slice(startIndex, endIndex);

  pageProducts.forEach(product => {
    const productEl = createProductElement(product);
    grid.appendChild(productEl);
  });
}

// Met à jour l'affichage de la pagination
function updatePagination() {
  const prevBtn = document.getElementById('prev-page');
  const nextBtn = document.getElementById('next-page');
  const currentPageSpan = document.getElementById('current-page');

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
  currentPageSpan.textContent = `Page ${currentPage}`;
}

// Initialise les écouteurs d'événements pour les filtres et la pagination
function initEventListeners() {
  document.getElementById('price-filter').addEventListener('change', applyFilters);
  document.getElementById('category-filter').addEventListener('change', applyFilters);
  document.getElementById('sort-filter').addEventListener('change', applyFilters);

  document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderProducts();
      updatePagination();
    }
  });

  document.getElementById('next-page').addEventListener('click', () => {
    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
    if (currentPage < totalPages) {
      currentPage++;
      renderProducts();
      updatePagination();
    }
  });
}

// Exécute les fonctions après le chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  applyFilters();
  initEventListeners();
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
      const productDescription = product.querySelector(".product-description") 
        ? product.querySelector(".product-description").textContent 
        : "Aucune description disponible.";

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
