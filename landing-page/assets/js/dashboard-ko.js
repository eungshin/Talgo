// Dashboard functionality (Korean)
class DashboardKO {
  constructor() {
    // Initialize Supabase client
    this.supabase = supabase.createClient(window.SUPABASE_CONFIG.URL, window.SUPABASE_CONFIG.ANON_KEY);
    
    this.user = null;
    this.initializeElements();
    this.checkAuthState();
    this.attachEventListeners();
  }

  initializeElements() {
    this.userEmailElement = document.getElementById('user-email');
    this.signOutBtn = document.getElementById('sign-out-btn');
    this.welcomeMessage = document.getElementById('welcome-message');
    this.usageStats = document.getElementById('usage-stats');
  }

  attachEventListeners() {
    this.signOutBtn.addEventListener('click', () => this.signOut());
  }

  async checkAuthState() {
    const { data: { user }, error } = await this.supabase.auth.getUser();
    
    if (error || !user) {
      // Not authenticated, redirect to auth page
      window.location.href = 'auth-ko.html';
      return;
    }
    
    this.user = user;
    this.updateUI();
    this.loadUserData();
  }

  updateUI() {
    if (this.user) {
      this.userEmailElement.textContent = this.user.email;
      this.welcomeMessage.textContent = `다시 오신 것을 환영합니다! 문서 작성과 개선을 시작해 보세요.`;
    }
  }

  async loadUserData() {
    try {
      // Load user profile
      const { data: profile, error: profileError } = await this.supabase
        .from('user_profiles')
        .select('*')
        .eq('id', this.user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error loading profile:', profileError);
      }

      // Load usage statistics
      await this.loadUsageStats();
      
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  async loadUsageStats() {
    try {
      // This would typically call a Supabase function
      // For now, we'll show a placeholder in Korean
      this.usageStats.textContent = '무료 요금제: 월 100회 수정';
    } catch (error) {
      console.error('Error loading usage stats:', error);
      this.usageStats.textContent = '사용 통계를 불러올 수 없습니다';
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
}

// Additional dashboard styles for Korean content
const dashboardKOStyles = `
  .dashboard-main {
    padding: var(--spacing-xl) 0;
    min-height: 80vh;
  }

  .dashboard-header {
    text-align: center;
    margin-bottom: var(--spacing-xl);
  }

  .dashboard-header h1 {
    font-family: var(--font-heading);
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: var(--spacing-sm);
    color: var(--color-white);
  }

  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-lg);
    margin-top: var(--spacing-xl);
  }

  .dashboard-card {
    background: rgba(15, 23, 42, 0.8);
    border: 1px solid rgba(148, 163, 184, 0.25);
    border-radius: var(--radius);
    padding: var(--spacing-lg);
    backdrop-filter: var(--blur);
    box-shadow: var(--shadow-lg);
  }

  .dashboard-card h3 {
    font-family: var(--font-heading);
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: var(--spacing-sm);
    color: var(--color-white);
  }

  .dashboard-card p {
    color: var(--color-muted);
    margin-bottom: var(--spacing-md);
  }

  .dashboard-features {
    margin-top: var(--spacing-xxl);
  }

  .feature-section h2 {
    font-family: var(--font-heading);
    font-size: 2rem;
    font-weight: 600;
    text-align: center;
    margin-bottom: var(--spacing-lg);
    color: var(--color-white);
  }

  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-lg);
  }

  .feature-item {
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid rgba(148, 163, 184, 0.25);
    border-radius: var(--radius);
    padding: var(--spacing-md);
    backdrop-filter: var(--blur);
  }

  .feature-item h4 {
    font-family: var(--font-heading);
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: var(--spacing-sm);
    color: var(--color-white);
  }

  .feature-item p {
    color: var(--color-muted);
    font-size: 0.9rem;
    line-height: 1.5;
  }

  .user-info {
    color: var(--color-muted);
    font-size: 0.9rem;
    margin-right: 1rem;
  }
`;

// Inject dashboard styles
const styleSheet = document.createElement('style');
styleSheet.textContent = dashboardKOStyles;
document.head.appendChild(styleSheet);

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.dashboard = new DashboardKO();
});

// Export for use in other files
window.DashboardKO = DashboardKO;