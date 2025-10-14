// Wait for DOM to load
document.addEventListener("DOMContentLoaded", function() {
  // Show splash screen for 2 seconds
  setTimeout(() => {
    document.getElementById("splash-screen").style.display = "none";
    document.getElementById("auth-container").classList.remove("hidden");
  }, 2000);

  // Form switching
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const showSignup = document.getElementById("show-signup");
  const showLogin = document.getElementById("show-login");

  showSignup?.addEventListener("click", () => {
    loginForm.classList.remove("active");
    signupForm.classList.add("active");
  });

  showLogin?.addEventListener("click", () => {
    signupForm.classList.remove("active");
    loginForm.classList.add("active");
  });

  // Login form submission
  const loginFormElement = document.getElementById("login-form");
  loginFormElement?.addEventListener("submit", async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    try {
      submitButton.textContent = "Logging in...";
      submitButton.disabled = true;

      const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(formData)
      });

      const result = await response.json();
      
      if (result.success) {
        alert("Login successful! Redirecting to dashboard...");
        window.location.href = result.redirectUrl;
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login. Please try again.");
    } finally {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  });

  // Signup form submission
  const signupFormElement = document.getElementById("signup-form");
  signupFormElement?.addEventListener("submit", async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    try {
      submitButton.textContent = "Creating account...";
      submitButton.disabled = true;

      const response = await fetch("/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(formData)
      });

      const result = await response.json();
      
      if (result.success) {
        alert("Registration successful! Please login with your credentials.");
        // Switch to login form and clear it
        signupForm.classList.remove("active");
        loginForm.classList.add("active");
        signupFormElement.reset();
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An error occurred during registration. Please try again.");
    } finally {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  });
});