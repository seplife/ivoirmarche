document.addEventListener('DOMContentLoaded', () => {
    setupContactForm();
    loadFrequentlyAskedQuestions();
    setupNewsletterSignup();
  });
  
  function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
  
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Reset previous error messages
      document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
  
      let isValid = true;
  
      // Name validation
      if (nameInput.value.trim().length < 2) {
        document.getElementById('nameError').textContent = 'Veuillez saisir un nom valide';
        isValid = false;
      }
  
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value)) {
        document.getElementById('emailError').textContent = 'Veuillez saisir un email valide';
        isValid = false;
      }
  
      // Subject validation
      if (!subjectInput.value) {
        document.getElementById('subjectError').textContent = 'Veuillez sélectionner un sujet';
        isValid = false;
      }
  
      // Message validation
      if (messageInput.value.trim().length < 10) {
        document.getElementById('messageError').textContent = 'Votre message doit contenir au moins 10 caractères';
        isValid = false;
      }
  
      if (isValid) {
        // Simulate form submission
        alert('Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
        contactForm.reset();
      }
    });
  }
  
  function loadFrequentlyAskedQuestions() {
    const faqGrid = document.getElementById('faqGrid');
    const faqs = [
      {
        question: 'Comment puis-je passer une commande ?',
        answer: 'Vous pouvez facilement passer une commande en naviguant dans nos catégories, en sélectionnant un produit et en cliquant sur "Acheter".'
      },
      {
        question: 'Quels sont les délais de livraison ?',
        answer: 'Les délais de livraison varient entre 2 et 5 jours ouvrés selon votre localisation.'
      },
      {
        question: 'Comment puis-je suivre ma commande ?',
        answer: 'Vous recevrez un email de confirmation avec un numéro de suivi dès que votre commande est expédiée.'
      },
      {
        question: 'Puis-je retourner un produit ?',
        answer: 'Oui, vous disposez de 14 jours après réception pour retourner un produit dans son état d\'origine.'
      }
    ];
  
    faqs.forEach(faq => {
      const faqItem = document.createElement('div');
      faqItem.classList.add('faq-item');
      faqItem.innerHTML = `
        <h3>${faq.question}</h3>
        <p>${faq.answer}</p>
      `;
      faqGrid.appendChild(faqItem);
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