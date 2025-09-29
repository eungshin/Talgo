// Supabase configuration and authentication functionality (Korean)
class SupabaseAuthKO {
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
      this.authTitle.textContent = 'L4 문장 리뷰에 가입하세요';
      this.authSubtitle.textContent = 'AI 기반 문법 및 표현 도구로 글쓰기를 완성해 보세요';
      this.confirmPasswordGroup.style.display = 'block';
      this.confirmPasswordInput.required = true;
      this.submitText.textContent = '계정 만들기';
      this.toggleText.textContent = '이미 계정이 있으신가요?';
      this.modeToggle.textContent = '로그인';
    } else {
      // Sign In mode
      this.authTitle.textContent = '다시 오신 것을 환영합니다';
      this.authSubtitle.textContent = 'L4 문장 리뷰로 계속해서 글쓰기를 개선해 보세요';
      this.confirmPasswordGroup.style.display = 'none';
      this.confirmPasswordInput.required = false;
      this.passwordRequirements.style.display = 'none';
      this.submitText.textContent = '로그인';
      this.toggleText.textContent = '계정이 없으신가요?';
      this.modeToggle.textContent = '회원가입';
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
      this.showMessage('비밀번호는 최소 8자 이상이어야 합니다', 'error');
      return;
    }
    
    if (this.isSignUp && !this.validatePasswordMatch()) {
      this.showMessage('비밀번호가 일치하지 않습니다', 'error');
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
      this.showMessage(this.translateError(error.message) || '예상치 못한 오류가 발생했습니다', 'error');
    } finally {
      this.setLoading(false);
    }
  }

  translateError(errorMessage) {
    const errorTranslations = {
      'Invalid login credentials': '잘못된 로그인 정보입니다',
      'User already registered': '이미 등록된 사용자입니다',
      'Email not confirmed': '이메일 인증이 완료되지 않았습니다',
      'Password should be at least 6 characters': '비밀번호는 최소 6자 이상이어야 합니다',
      'Email rate limit exceeded': '이메일 전송 한도가 초과되었습니다',
      'Invalid email': '유효하지 않은 이메일 주소입니다'
    };
    
    return errorTranslations[errorMessage] || errorMessage;
  }

  async signUp(email, password) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth-ko.html`
      }
    });

    if (error) {
      throw error;
    }

    if (data.user && !data.user.email_confirmed_at) {
      this.showMessage(
        '이메일을 확인하시고 인증 링크를 클릭하여 계정 설정을 완료해 주세요.',
        'success'
      );
    } else if (data.user) {
      this.showMessage('계정이 성공적으로 생성되었습니다! L4 문장 리뷰에 오신 것을 환영합니다.', 'success');
      setTimeout(() => {
        window.location.href = 'dashboard-ko.html'; // Redirect to Korean dashboard
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
      this.showMessage('다시 오신 것을 환영합니다! 대시보드로 이동 중...', 'success');
      setTimeout(() => {
        window.location.href = 'dashboard-ko.html'; // Redirect to Korean dashboard
      }, 1500);
    }
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
    } else {
      window.location.href = 'index-ko.html';
    }
  }

  async checkAuthState() {
    const { data: { user } } = await this.supabase.auth.getUser();
    
    if (user) {
      // User is already logged in, redirect to dashboard
      window.location.href = 'dashboard-ko.html';
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
  window.authManager = new SupabaseAuthKO();
  
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
window.SupabaseAuthKO = SupabaseAuthKO;