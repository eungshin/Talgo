// Supabase configuration and authentication functionality
class SupabaseAuth {
  constructor() {
    // Initialize Supabase client
    this.supabase = window.supabase.createClient(
      'https://dbsxwhwwdedfygrfibeh.supabase.co', // Your Supabase URL
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRic3h3aHd3ZGVkZnlncmZpYmVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3ODYzOTYsImV4cCI6MjA0ODM2MjM5Nn0.UtWJBBd0h8IplRTPwZFGlhODMoJMEvGEWJMWkPj8iDo' // Your anon key
    );
    
    this.isSignUp = true; // Default to sign-up mode
    this.initializeElements();
    this.attachEventListeners();
    this.checkAuthState();
  }

  initializeElements() {
    // Get DOM elements
    this.authForm = document.getElementById('auth-form');
    this.authTitle = document.getElementById('auth-title');
    this.authSubtitle = document.getElementById('auth-subtitle');
    this.emailInput = document.getElementById('email');
    this.passwordInput = document.getElementById('password');
    this.confirmPasswordGroup = document.getElementById('confirm-password-group');
    this.confirmPasswordInput = document.getElementById('confirm-password');
    this.passwordRequirements = document.getElementById('password-requirements');
    this.submitText = document.getElementById('submit-text');
    this.submitSpinner = document.getElementById('submit-spinner');
    this.authSubmit = document.getElementById('auth-submit');
    this.toggleText = document.getElementById('toggle-text');
    this.modeToggle = document.getElementById('mode-toggle');
    this.authMessage = document.getElementById('auth-message');
    this.messageText = document.getElementById('message-text');
  }

  attachEventListeners() {
    // Form submission
    this.authForm.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Mode toggle (Sign Up / Sign In)
    this.modeToggle.addEventListener('click', () => this.toggleMode());
    
    // Password input - show requirements for sign up
    this.passwordInput.addEventListener('focus', () => {
      if (this.isSignUp) {
        this.passwordRequirements.style.display = 'block';
      }
    });
    
    // Real-time password validation
    this.passwordInput.addEventListener('input', () => this.validatePassword());
    this.confirmPasswordInput.addEventListener('input', () => this.validatePasswordMatch());
  }

  toggleMode() {
    this.isSignUp = !this.isSignUp;
    this.updateUI();
    this.clearMessages();
  }

  updateUI() {
    if (this.isSignUp) {
      // Sign Up mode
      this.authTitle.textContent = 'Join L4 Sentence Review';
      this.authSubtitle.textContent = 'Start polishing your writing with AI-powered grammar and expression tools';
      this.confirmPasswordGroup.style.display = 'block';
      this.confirmPasswordInput.required = true;
      this.submitText.textContent = 'Create Account';
      this.toggleText.textContent = 'Already have an account?';
      this.modeToggle.textContent = 'Sign In';
    } else {
      // Sign In mode
      this.authTitle.textContent = 'Welcome Back';
      this.authSubtitle.textContent = 'Sign in to continue improving your writing with L4 Sentence Review';
      this.confirmPasswordGroup.style.display = 'none';
      this.confirmPasswordInput.required = false;
      this.passwordRequirements.style.display = 'none';
      this.submitText.textContent = 'Sign In';
      this.toggleText.textContent = 'Don\'t have an account?';
      this.modeToggle.textContent = 'Sign Up';
    }
  }

  validatePassword() {
    const password = this.passwordInput.value;
    const isValid = password.length >= 8;
    
    if (this.isSignUp) {
      if (password.length > 0) {
        this.passwordRequirements.style.display = 'block';
        this.passwordRequirements.style.color = isValid ? '#4ade80' : '#f87171';
      }
    }
    
    return isValid;
  }

  validatePasswordMatch() {
    if (!this.isSignUp) return true;
    
    const password = this.passwordInput.value;
    const confirmPassword = this.confirmPasswordInput.value;
    const isMatch = password === confirmPassword;
    
    if (confirmPassword.length > 0) {
      this.confirmPasswordInput.style.borderColor = isMatch ? 
        'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)';
    }
    
    return isMatch;
  }

  async handleSubmit(event) {
    event.preventDefault();
    
    const email = this.emailInput.value;
    const password = this.passwordInput.value;
    
    // Validation
    if (!this.validatePassword()) {
      this.showMessage('Password must be at least 8 characters long', 'error');
      return;
    }
    
    if (this.isSignUp && !this.validatePasswordMatch()) {
      this.showMessage('Passwords do not match', 'error');
      return;
    }
    
    // Show loading state
    this.setLoading(true);
    
    try {
      if (this.isSignUp) {
        await this.signUp(email, password);
      } else {
        await this.signIn(email, password);
      }
    } catch (error) {
      console.error('Auth error:', error);
      this.showMessage(error.message || 'An unexpected error occurred', 'error');
    } finally {
      this.setLoading(false);
    }
  }

  async signUp(email, password) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth.html`
      }
    });

    if (error) {
      throw error;
    }

    if (data.user && !data.user.email_confirmed_at) {
      this.showMessage(
        'Please check your email and click the confirmation link to complete your account setup.',
        'success'
      );
    } else if (data.user) {
      this.showMessage('Account created successfully! Welcome to L4 Sentence Review.', 'success');
      setTimeout(() => {
        window.location.href = 'dashboard.html'; // Redirect to dashboard
      }, 2000);
    }
  }

  async signIn(email, password) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw error;
    }

    if (data.user) {
      this.showMessage('Welcome back! Redirecting to your dashboard...', 'success');
      setTimeout(() => {
        window.location.href = 'dashboard.html'; // Redirect to dashboard
      }, 1500);
    }
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
    } else {
      window.location.href = 'index.html';
    }
  }

  async checkAuthState() {
    const { data: { user } } = await this.supabase.auth.getUser();
    
    if (user) {
      // User is already logged in, redirect to dashboard
      window.location.href = 'dashboard.html';
    }
  }

  setLoading(isLoading) {
    this.authSubmit.disabled = isLoading;
    this.submitText.style.display = isLoading ? 'none' : 'inline';
    this.submitSpinner.style.display = isLoading ? 'inline' : 'none';
  }

  showMessage(message, type = 'error') {
    this.messageText.textContent = message;
    this.authMessage.className = `auth-message ${type}`;
    this.authMessage.style.display = 'block';
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        this.clearMessages();
      }, 5000);
    }
  }

  clearMessages() {
    this.authMessage.style.display = 'none';
    this.messageText.textContent = '';
  }

  // Listen for auth state changes
  onAuthStateChange(callback) {
    return this.supabase.auth.onAuthStateChange(callback);
  }
}

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.authManager = new SupabaseAuth();
  
  // Listen for auth state changes
  window.authManager.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event, session);
    
    if (event === 'SIGNED_IN') {
      console.log('User signed in:', session.user);
    } else if (event === 'SIGNED_OUT') {
      console.log('User signed out');
    }
  });
});

// Export for use in other files
window.SupabaseAuth = SupabaseAuth;