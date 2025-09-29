// Dashboard functionality
class Dashboard {
  constructor() {
    // Initialize Supabase client
    this.supabase = window.supabase.createClient(
      'https://dbsxwhwwdedfygrfibeh.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRic3h3aHd3ZGVkZnlncmZpYmVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3ODYzOTYsImV4cCI6MjA0ODM2MjM5Nn0.UtWJBBd0h8IplRTPwZFGlhODMoJMEvGEWJMWkPj8iDo'
    );
    
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
      window.location.href = 'auth.html';
      return;
    }
    
    this.user = user;
    this.updateUI();
    this.loadUserData();
  }

  updateUI() {
    if (this.user) {
      this.userEmailElement.textContent = this.user.email;
      this.welcomeMessage.textContent = `Welcome back! Start creating and improving your documents.`;
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
      // For now, we'll show a placeholder
      this.usageStats.textContent = 'Free tier: 100 corrections per month';
    } catch (error) {
      console.error('Error loading usage stats:', error);
      this.usageStats.textContent = 'Unable to load usage statistics';
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
}

// Additional dashboard styles
const dashboardStyles = `
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

  .user-info {
    color: var(--color-muted);
    font-size: 0.9rem;
    margin-right: 1rem;
  }
`;

// Inject dashboard styles
const styleSheet = document.createElement('style');
styleSheet.textContent = dashboardStyles;
document.head.appendChild(styleSheet);

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.dashboard = new Dashboard();
});

// Export for use in other files
window.Dashboard = Dashboard;