// Focus App - Main Entry Point
import store from './store.js';
import router from './router.js';
import { initAuthListener, signInWithGoogle, logOut } from './services/auth.js';
import { loadTodaySessions } from './services/sessions.js';
import { renderDashboard, cleanupDashboard } from './components/dashboard.js';
import { renderAnalytics } from './components/analytics.js';
import { renderCalendar } from './components/calendar.js';
import { renderGoals } from './components/goals.js';
import { renderSettings } from './components/settings.js';

// DOM Elements
const authScreen = document.getElementById('auth-screen');
const mainApp = document.getElementById('main-app');
const mainContent = document.getElementById('main-content');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userAvatar = document.getElementById('user-avatar');
const userName = document.getElementById('user-name');

// Page cleanup functions
const cleanupFunctions = {
  dashboard: cleanupDashboard
};

// Initialize auth
initAuthListener(async (user) => {
  if (user) {
    showMainApp();
    updateUserUI();
    await loadUserData();
    router.handleRoute();
  } else {
    showAuthScreen();
  }
});

// Auth event listeners
loginBtn?.addEventListener('click', async () => {
  loginBtn.disabled = true;
  loginBtn.textContent = 'Signing in...';

  try {
    await signInWithGoogle();
  } catch (error) {
    console.error('Login failed:', error);
    alert('Failed to sign in. Please try again.');
  } finally {
    loginBtn.disabled = false;
    loginBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      Sign in with Google
    `;
  }
});

logoutBtn?.addEventListener('click', logOut);

// Register routes
router.register('/', (path) => renderPage('dashboard', renderDashboard));
router.register('/analytics', (path) => renderPage('analytics', renderAnalytics));
router.register('/calendar', (path) => renderPage('calendar', renderCalendar));
router.register('/goals', (path) => renderPage('goals', renderGoals));
router.register('/settings', (path) => renderPage('settings', renderSettings));

// Render page with cleanup
function renderPage(pageName, renderFn) {
  // Cleanup previous page
  const state = store.getState();
  const prevPage = state.ui.currentPage;
  if (prevPage && cleanupFunctions[prevPage]) {
    cleanupFunctions[prevPage]();
  }

  // Update current page
  store.setState({ ui: { currentPage: pageName } });

  // Render new page
  if (mainContent && renderFn) {
    renderFn(mainContent);
  }
}

// Load user data
async function loadUserData() {
  try {
    await loadTodaySessions();
  } catch (error) {
    console.error('Error loading user data:', error);
  }
}

// Update user UI
function updateUserUI() {
  const state = store.getState();
  const user = state.user;

  if (user) {
    if (userAvatar && user.photoURL) {
      userAvatar.style.backgroundImage = `url(${user.photoURL})`;
    }
    if (userName) {
      userName.textContent = user.displayName?.split(' ')[0] || user.email?.split('@')[0] || 'User';
    }
  }
}

// Show/hide screens
function showAuthScreen() {
  authScreen?.classList.remove('hidden');
  mainApp?.classList.add('hidden');
}

function showMainApp() {
  authScreen?.classList.add('hidden');
  mainApp?.classList.remove('hidden');
}

// Subscribe to store changes for reactive updates
store.subscribe((state) => {
  // Update any global UI based on state changes
  updateUserUI();
});

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Space to start/pause timer (when not in input)
  if (e.code === 'Space' && !isInputFocused()) {
    e.preventDefault();
    const state = store.getState();
    const startBtn = document.getElementById('timer-start');
    const pauseBtn = document.getElementById('timer-pause');

    if (state.timer.isRunning && pauseBtn) {
      pauseBtn.click();
    } else if (!state.timer.isRunning && startBtn) {
      startBtn.click();
    }
  }

  // Escape to reset timer
  if (e.code === 'Escape') {
    const resetBtn = document.getElementById('timer-reset');
    if (resetBtn) {
      resetBtn.click();
    }
  }

  // Navigation shortcuts
  if (e.altKey) {
    switch (e.code) {
      case 'Digit1':
        router.navigate('/');
        break;
      case 'Digit2':
        router.navigate('/analytics');
        break;
      case 'Digit3':
        router.navigate('/calendar');
        break;
      case 'Digit4':
        router.navigate('/goals');
        break;
    }
  }
});

function isInputFocused() {
  const active = document.activeElement;
  return active && (
    active.tagName === 'INPUT' ||
    active.tagName === 'TEXTAREA' ||
    active.tagName === 'SELECT' ||
    active.isContentEditable
  );
}

// Page visibility handling - pause timer when tab is hidden
document.addEventListener('visibilitychange', () => {
  // We don't pause the timer, but we could show a notification
  // when the timer completes while the tab is hidden
});

// PWA: Service worker registration (disabled for now)
// TODO: Set up proper service worker for production builds

// Console welcome message
console.log(
  '%c Focus %c Ink & Paper ',
  'background: #d64933; color: white; padding: 4px 8px; border-radius: 4px 0 0 4px;',
  'background: #1a1816; color: #faf9f7; padding: 4px 8px; border-radius: 0 4px 4px 0;'
);
console.log('Keyboard shortcuts:');
console.log('  Space - Start/Pause timer');
console.log('  Escape - Reset timer');
console.log('  Alt+1-4 - Navigate pages');
