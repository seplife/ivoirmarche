document.addEventListener('DOMContentLoaded', () => {
    loadTeamMembers();
    loadTestimonials();
    setupNewsletterSignup();
    setupSocialLinks();
  });
  
  function loadTeamMembers() {
    const teamGrid = document.getElementById('teamMembers');
    const teamMembers = [
      { 
        name: 'Sophie Martin', 
        role: 'Fondatrice & PDG',
        image: 'https://via.placeholder.com/250x250?text=Sophie+Martin'
      },
      { 
        name: 'Lucas Dupont', 
        role: 'Directeur Technique',
        image: 'https://via.placeholder.com/250x250?text=Lucas+Dupont'
      },
      { 
        name: 'Emma Laurent', 
        role: 'Responsable Marketing',
        image: 'https://via.placeholder.com/250x250?text=Emma+Laurent'
      },
      { 
        name: 'Thomas Richard', 
        role: 'Responsable Produit',
        image: 'https://via.placeholder.com/250x250?text=Thomas+Richard'
      }
    ];
  
    teamMembers.forEach(member => {
      const memberEl = document.createElement('div');
      memberEl.classList.add('team-member');
      memberEl.innerHTML = `
        <img src="${member.image}" alt="${member.name}">
        <h3>${member.name}</h3>
        <p>${member.role}</p>
      `;
      teamGrid.appendChild(memberEl);
    });
  }
  
  function loadTestimonials() {
    const testimonialsGrid = document.getElementById('companyTestimonials');
    const testimonials = [
      { 
        text: 'EdenMarket a révolutionné mon expérience d\'achat en ligne !', 
        author: 'Marie D.'
      },
      { 
        text: 'Une plateforme incroyable avec une sélection de produits exceptionnelle.', 
        author: 'Jean P.'
      },
      { 
        text: 'Le service client est vraiment à l\'écoute et professionnel.', 
        author: 'Claire R.'
      }
    ];
  
    testimonials.forEach(testimonial => {
      const testimonialEl = document.createElement('div');
      testimonialEl.classList.add('testimonial');
      testimonialEl.innerHTML = `
        <p>"${testimonial.text}"</p>
        <span>- ${testimonial.author}</span>
      `;
      testimonialsGrid.appendChild(testimonialEl);
    });
  }
  
  function setupNewsletterSignup() {
    const newsletterForm = document.getElementById('newsletterForm');
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterForm.querySelector('input').value;
      if (/\S+@\S+\.\S+/.test(email)) {
        alert(`Merci de vous être inscrit avec l'email : ${email}`);
        newsletterForm.reset();
      } else {
        alert('Veuillez entrer une adresse email valide.');
      }
    });
  }
  
  function setupSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        window.open(link.href, '_blank');
      });
    });
  }
  