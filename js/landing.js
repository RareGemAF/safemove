// ===== Splash Screen Timer =====
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const splash = document.getElementById('splash-screen');
    const auth = document.getElementById('auth-container');

    splash.style.opacity = '0';
    splash.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
      splash.style.display = 'none';
      auth.classList.remove('hidden');
    }, 500); // fade out splash
  }, 2000); // splash stays for 4 seconds
});

// ===== Form Switch =====
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const showSignup = document.getElementById('show-signup');
const showLogin = document.getElementById('show-login');

showSignup.addEventListener('click', () => {
  loginForm.classList.remove('active');
  signupForm.classList.add('active');
});

showLogin.addEventListener('click', () => {
  signupForm.classList.remove('active');
  loginForm.classList.add('active');
});
