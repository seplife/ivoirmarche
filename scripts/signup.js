document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
  
    signupForm.addEventListener('submit', handleSignup);
    passwordInput.addEventListener('input', validatePassword);
    confirmPasswordInput.addEventListener('input', validatePasswordMatch);
  });
  
  function validatePassword() {
    const password = document.getElementById('password').value;
    const passwordError = document.getElementById('passwordError');
    
    // Password requirements
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
    let errorMessage = '';
    if (password.length < minLength) {
      errorMessage = 'Le mot de passe doit contenir au moins 8 caractères';
    } else if (!hasUpperCase || !hasLowerCase) {
      errorMessage = 'Le mot de passe doit contenir des majuscules et des minuscules';
    } else if (!hasNumbers) {
      errorMessage = 'Le mot de passe doit contenir au moins un chiffre';
    } else if (!hasSpecialChar) {
      errorMessage = 'Le mot de passe doit contenir au moins un caractère spécial';
    }
  
    passwordError.textContent = errorMessage;
    return errorMessage === '';
  }
  
  function validatePasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const confirmPasswordError = document.getElementById('confirmPasswordError');
  
    if (password !== confirmPassword) {
      confirmPasswordError.textContent = 'Les mots de passe ne correspondent pas';
      return false;
    }
  
    confirmPasswordError.textContent = '';
    return true;
  }
  
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  function validatePhone(phone) {
    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    return phoneRegex.test(phone);
  }
  
  async function handleSignup(event) {
    event.preventDefault();
    
    // Reset all error messages
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    
    const formData = new FormData(event.target);
    const userData = Object.fromEntries(formData.entries());
    
    let isValid = true;
  
    // Validate first name
    if (userData.firstName.length < 2) {
      document.getElementById('firstNameError').textContent = 'Le prénom doit contenir au moins 2 caractères';
      isValid = false;
    }
  
    // Validate last name
    if (userData.lastName.length < 2) {
      document.getElementById('lastNameError').textContent = 'Le nom doit contenir au moins 2 caractères';
      isValid = false;
    }
  
    // Validate email
    if (!validateEmail(userData.email)) {
      document.getElementById('emailError').textContent = 'Veuillez entrer une adresse email valide';
      isValid = false;
    }
  
    // Validate password
    if (!validatePassword()) {
      isValid = false;
    }
  
    // Validate password match
    if (!validatePasswordMatch()) {
      isValid = false;
    }
  
    // Validate phone
    if (!validatePhone(userData.phone)) {
      document.getElementById('phoneError').textContent = 'Veuillez entrer un numéro de téléphone valide';
      isValid = false;
    }
  
    // Validate address
    if (userData.address.length < 10) {
      document.getElementById('addressError').textContent = 'Veuillez entrer une adresse complète';
      isValid = false;
    }
  
    // Validate terms acceptance
    if (!userData.terms) {
      document.getElementById('termsError').textContent = 'Vous devez accepter les conditions générales';
      isValid = false;
    }
  
    if (isValid) {
      try {
        // Here we would normally send the data to a server
        // For demo purposes, we'll store it in localStorage
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if email already exists
        if (existingUsers.some(user => user.email === userData.email)) {
          document.getElementById('emailError').textContent = 'Cette adresse email est déjà utilisée';
          return;
        }
  
        // Add user to storage
        existingUsers.push({
          ...userData,
          id: Date.now(),
          createdAt: new Date().toISOString()
        });
        
        localStorage.setItem('users', JSON.stringify(existingUsers));
  
        // Store current user session
        localStorage.setItem('currentUser', JSON.stringify({
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName
        }));
  
        // Show success message and redirect
        alert('Inscription réussie ! Vous allez être redirigé vers la page de connexion.');
        window.location.href = 'login.html';
        
      } catch (error) {
        console.error('Error during signup:', error);
        alert('Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
      }
    }
  }