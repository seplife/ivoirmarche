document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const forgotPasswordLink = document.getElementById('forgotPassword');
  
    loginForm.addEventListener('submit', handleLogin);
    forgotPasswordLink.addEventListener('click', handleForgotPassword);
  
    // Check if "remember me" was previously set
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      document.getElementById('email').value = rememberedEmail;
      document.getElementById('remember').checked = true;
    }
  });
  
  async function handleLogin(event) {
    event.preventDefault();
    
    // Reset error messages
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
  
    // Validate email format
    if (!validateEmail(email)) {
      document.getElementById('emailError').textContent = 'Veuillez entrer une adresse email valide';
      return;
    }
  
    try {
      // In a real application, this would be an API call
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);
  
      if (!user) {
        document.getElementById('emailError').textContent = 'Email ou mot de passe incorrect';
        return;
      }
  
      // Handle "remember me"
      if (remember) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
  
      // Store user session
      localStorage.setItem('currentUser', JSON.stringify({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }));
  
      // Show success message and redirect
      alert('Connexion réussie !');
      window.location.href = 'index.html';
  
    } catch (error) {
      console.error('Error during login:', error);
      alert('Une erreur est survenue lors de la connexion. Veuillez réessayer.');
    }
  }
  
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  function handleForgotPassword(event) {
    event.preventDefault();
    
    const email = prompt('Veuillez entrer votre adresse email pour réinitialiser votre mot de passe :');
    
    if (email) {
      if (!validateEmail(email)) {
        alert('Veuillez entrer une adresse email valide');
        return;
      }
  
      // In a real application, this would trigger a password reset email
      alert('Si un compte existe avec cette adresse email, vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.');
    }
  }