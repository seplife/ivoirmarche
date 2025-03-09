document.addEventListener('DOMContentLoaded', () => {
    applyFilters();
    initEventListeners();
    loadFeaturedArticles();
  });
  
  const POSTS_PER_PAGE = 9;
  let currentPage = 1;
  let filteredPosts = [];
  
  const blogPosts = [
    { 
      id: 1, 
      title: 'Les Dernières Tendances Tech', 
      excerpt: 'Découvrez les innovations technologiques qui vont transformer votre quotidien...', 
      category: 'tech',
      image: 'https://via.placeholder.com/350x200?text=Tendances+Tech',
      date: new Date('2023-07-15'),
      views: 1245
    },
    { 
      id: 2, 
      title: 'Mode Éco-Responsable', 
      excerpt: 'Comment adopter un style vestimentaire durable et élégant', 
      category: 'mode',
      image: 'https://via.placeholder.com/350x200?text=Mode+Éco',
      date: new Date('2023-07-10'),
      views: 987
    },
    { 
      id: 3, 
      title: 'Bien-Être et Routine Matinale', 
      excerpt: 'Conseils pour commencer la journée du bon pied', 
      category: 'bien-etre',
      image: 'https://via.placeholder.com/350x200?text=Routine+Bien-Être',
      date: new Date('2023-07-05'),
      views: 1567
    },
    { 
      id: 4, 
      title: 'Maison Connectée : Le Guide Complet', 
      excerpt: 'Transformez votre habitat avec les dernières technologies', 
      category: 'maison',
      image: 'https://via.placeholder.com/350x200?text=Maison+Connectée',
      date: new Date('2023-06-28'),
      views: 1102
    },
    { 
      id: 5, 
      title: 'Soins de Beauté Naturels', 
      excerpt: 'Des solutions simples pour prendre soin de votre peau', 
      category: 'beaute',
      image: 'https://via.placeholder.com/350x200?text=Soins+Beauté',
      date: new Date('2023-06-22'),
      views: 876
    },
    { 
      id: 6, 
      title: 'Jeux Éducatifs pour Enfants', 
      excerpt: 'Comment stimuler l\'apprentissage de manière ludique', 
      category: 'enfants',
      image: 'https://via.placeholder.com/350x200?text=Jeux+Éducatifs',
      date: new Date('2023-06-15'),
      views: 654
    },
    { 
      id: 7, 
      title: 'Intelligence Artificielle et Quotidien', 
      excerpt: 'Comment l\'IA transforme nos habitudes', 
      category: 'tech',
      image: 'https://via.placeholder.com/350x200?text=IA+Quotidien',
      date: new Date('2023-06-10'),
      views: 1789
    },
    { 
      id: 8, 
      title: 'Nutrition et Bien-Être', 
      excerpt: 'Conseils pour une alimentation équilibrée', 
      category: 'bien-etre',
      image: 'https://via.placeholder.com/350x200?text=Nutrition',
      date: new Date('2023-06-05'),
      views: 943
    },
    { 
      id: 9, 
      title: 'Créer un Intérieur Minimaliste', 
      excerpt: 'L\'art de simplifier et d\'optimiser votre espace', 
      category: 'maison',
      image: 'https://via.placeholder.com/350x200?text=Intérieur+Minimaliste',
      date: new Date('2023-05-28'),
      views: 1356
    }
  ];
  
  function applyFilters() {
    const categoryFilter = document.getElementById('category-filter').value;
    const sortFilter = document.getElementById('sort-filter').value;
  
    filteredPosts = blogPosts.filter(post => 
      !categoryFilter || post.category === categoryFilter
    );
  
    sortPosts(sortFilter);
    renderPosts();
    updatePagination();
  }
  
  function sortPosts(sortType) {
    switch(sortType) {
      case 'popular':
        filteredPosts.sort((a, b) => b.views - a.views);
        break;
      default:
        filteredPosts.sort((a, b) => b.date - a.date);
    }
  }
  
  function renderPosts() {
    const grid = document.getElementById('blogPostsGrid');
    grid.innerHTML = '';
  
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    const pagePosts = filteredPosts.slice(startIndex, endIndex);
  
    pagePosts.forEach(post => {
      const postEl = document.createElement('article');
      postEl.classList.add('blog-post');
      postEl.innerHTML = `
        <img src="${post.image}" alt="${post.title}">
        <div class="post-content">
          <h3>${post.title}</h3>
          <p>${post.excerpt}</p>
          <div class="post-meta">
            <span>${post.date.toLocaleDateString('fr-FR')}</span>
            <span><i class="fas fa-eye"></i> ${post.views} vues</span>
            <a href="#" class="read-more" data-id="${post.id}">Lire Plus</a>
          </div>
        </div>
      `;
      grid.appendChild(postEl);
    });
  
    // Add event listeners for read more links
    const readMoreLinks = grid.querySelectorAll('.read-more');
    readMoreLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const postId = e.target.getAttribute('data-id');
        openBlogPostModal(postId);
      });
    });
  }
  
  function openBlogPostModal(postId) {
    const post = blogPosts.find(p => p.id === parseInt(postId));
    const modalContent = document.querySelector('.modal-content');
    
    modalContent.innerHTML = `
      <div class="blog-post-modal">
        <img src="${post.image}" alt="${post.title}">
        <h2>${post.title}</h2>
        <div class="post-meta">
          <span>${post.date.toLocaleDateString('fr-FR')}</span>
          <span><i class="fas fa-eye"></i> ${post.views} vues</span>
        </div>
        <div class="post-full-content">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </div>
      </div>
    `;
    
    document.getElementById('modalOverlay').style.display = 'flex';
  }
  
  function updatePagination() {
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const currentPageSpan = document.getElementById('current-page');
  
    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    currentPageSpan.textContent = `Page ${currentPage}`;
  }
  
  function loadFeaturedArticles() {
    const featuredGrid = document.getElementById('featuredArticles');
    const featuredPosts = blogPosts
      .sort((a, b) => b.views - a.views)
      .slice(0, 3);
  
    featuredPosts.forEach(post => {
      const articleEl = document.createElement('article');
      articleEl.classList.add('featured-article');
      articleEl.innerHTML = `
        <img src="${post.image}" alt="${post.title}">
        <div class="article-content">
          <h3>${post.title}</h3>
          <div class="article-meta">
            <span>${post.date.toLocaleDateString('fr-FR')}</span>
            <span><i class="fas fa-eye"></i> ${post.views} vues</span>
          </div>
        </div>
      `;
      featuredGrid.appendChild(articleEl);
    });
  }
  
  function initEventListeners() {
    document.getElementById('category-filter').addEventListener('change', applyFilters);
    document.getElementById('sort-filter').addEventListener('change', applyFilters);
  
    document.getElementById('prev-page').addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderPosts();
        updatePagination();
      }
    });
  
    document.getElementById('next-page').addEventListener('click', () => {
      const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
      if (currentPage < totalPages) {
        currentPage++;
        renderPosts();
        updatePagination();
      }
    });
  
    const newsletterForm = document.getElementById('newsletterForm');
    newsletterForm.addEventListener('submit', handleNewsletterSignup);
  }
  
  function handleNewsletterSignup(event) {
    event.preventDefault();
    const email = event.target.querySelector('input').value;
    alert(`Merci de vous être inscrit avec l'email : ${email}`);
    event.target.reset();
  }