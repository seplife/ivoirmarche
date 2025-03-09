export function createProductElement(product) {
  const el = document.createElement('div');
  el.classList.add('product');

  el.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <h3>${product.name}</h3>
    <p>Prix : ${product.price.toFixed(2)} €</p>
    <button class="view-product">Voir le Produit</button>
  `;

  // Ajout d'un événement au bouton pour ouvrir la modale
  el.querySelector('.view-product').addEventListener('click', () => openModal(product));

  return el;
}

// Fonction pour afficher la modale avec les détails du produit
function openModal(product) {
  let modal = document.querySelector('.modal');

  // Si la modale n'existe pas, on la crée et on l'ajoute au DOM
  if (!modal) {
      modal = document.createElement('div');
      modal.classList.add('modal');
      modal.innerHTML = `
        <div class="modal-content">
          <span class="close">&times;</span>
          <div class="modal-body">
            <img src="" alt="" class="modal-img">
            <div class="modal-details">
              <h3 class="modal-title"></h3>
              <p class="modal-price"></p>
              <p class="modal-description"></p>
              <div class="rating" style="color: orange; font-size: 1.2em;">
                ★★★★☆
              </div>
              <label for="quantity">Quantité :</label>
              <input type="number" id="quantity" value="1" min="1" style="width: 50px;">
              <div class="modal-buttons">
                <button class="add-to-cart">Ajouter au Panier</button>
                <button class="buy-now">Acheter cet article</button>
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
  }

  // Remplissage des données du produit
  modal.querySelector('.modal-img').src = product.image;
  modal.querySelector('.modal-img').alt = product.name;
  modal.querySelector('.modal-title').textContent = product.name;
  modal.querySelector('.modal-price').textContent = `Prix : ${product.price.toFixed(2)} €`;
  modal.querySelector('.modal-description').textContent = product.specs;

  // Affichage de la modale
  modal.style.display = 'flex';

  // Fermeture de la modale
  modal.querySelector('.close').addEventListener('click', () => {
      modal.style.display = 'none';
  });

  // Gestion des boutons
  modal.querySelector('.add-to-cart').addEventListener('click', () => {
      addToCart(product.id);
  });

  modal.querySelector('.buy-now').addEventListener('click', () => {
      alert(`Achat du produit : ${product.name}`);
  });
}

// Fonction d'ajout au panier
export function addToCart(productId) {
  alert(`Produit ${productId} ajouté au panier`);
}
