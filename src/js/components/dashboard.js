import store from '../store.js';
import { formatDuration, formatTimeOfDay, getGreeting, formatFullDate } from '../utils/format.js';
import { renderTimer } from './timer.js';

// Default categories
const categories = [
  { id: 'writing', name: 'Writing', color: 'var(--cat-writing)' },
  { id: 'coding', name: 'Coding', color: 'var(--cat-coding)' },
  { id: 'research', name: 'Research', color: 'var(--cat-research)' },
  { id: 'meeting', name: 'Meeting', color: 'var(--cat-meeting)' },
  { id: 'admin', name: 'Admin', color: 'var(--cat-admin)' },
  { id: 'learning', name: 'Learning', color: 'var(--cat-learning)' }
];

export function renderDashboard(container) {
  const state = store.getState();
  const stats = store.getTodayStats();
  const focusScore = store.getFocusScore();
  const userName = state.user?.displayName?.split(' ')[0] || 'there';

  container.innerHTML = `
    <div class="dashboard fade-in">
      <!-- Page Header -->
      <header class="page-header">
        <div class="page-header-content">
          <h1 class="page-title">${getGreeting()}, ${userName}</h1>
          <p class="page-subtitle">${formatFullDate(new Date())}</p>
        </div>
      </header>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <!-- Focus Time Card -->
        <div class="stat-card">
          <div class="stat-value">${formatDuration(stats.totalSeconds)}</div>
          <div class="stat-label">focus time</div>
          <div class="stat-progress">
            <div class="stat-progress-bar" style="width: ${stats.goalProgress}%"></div>
          </div>
          <div class="stat-footer">goal: ${formatDuration(state.goals.daily * 60)}</div>
        </div>

        <!-- Focus Score Card -->
        <div class="stat-card">
          <div class="focus-score">
            <div class="focus-score-circle">
              <svg viewBox="0 0 80 80" width="80" height="80">
                <circle class="bg" cx="40" cy="40" r="36"/>
                <circle class="progress" cx="40" cy="40" r="36" style="stroke-dashoffset: ${226 - (226 * focusScore / 100)}"/>
              </svg>
              <span class="focus-score-value">${focusScore}</span>
            </div>
            <div class="stat-label">focus score</div>
          </div>
        </div>

        <!-- Streak Card -->
        <div class="stat-card">
          <div class="stat-value">
            <span class="streak-display">
              ${state.streak.current > 0 ? '<span class="streak-flame">🔥</span>' : ''}
              ${state.streak.current} day${state.streak.current !== 1 ? 's' : ''}
            </span>
          </div>
          <div class="stat-label">current streak</div>
          <div class="streak-bars">
            ${Array(7).fill(0).map((_, i) => `<div class="streak-bar ${i < state.streak.current % 7 || (state.streak.current >= 7 && i < 7) ? 'active' : ''}"></div>`).join('')}
          </div>
          <div class="stat-footer">best: ${state.streak.longest} days</div>
        </div>
      </div>

      <!-- Timer Card -->
      <div class="timer-card" id="dashboard-timer">
        ${renderTimerContent()}
      </div>

      <!-- Sessions Section -->
      <section class="sessions-section">
        <div class="section-header">
          <h2 class="section-title">Sessions</h2>
          <a href="#/analytics" class="section-link">View all →</a>
        </div>
        <div class="sessions-list" id="sessions-list">
          ${renderSessionsList(stats.sessions)}
        </div>
      </section>
    </div>
  `;

  // Initialize timer controls
  initTimerControls();
}

function renderTimerContent() {
  const state = store.getState();
  const timer = state.timer;
  const minutes = Math.floor(timer.remaining / 60);
  const seconds = timer.remaining % 60;

  const sessionTypes = [
    { id: 'deep-work', name: 'Deep Work' },
    { id: 'shallow-work', name: 'Shallow Work' },
    { id: 'meeting', name: 'Meeting' }
  ];

  return `
    <div class="timer-mode">${sessionTypes.find(t => t.id === timer.sessionType)?.name || 'Deep Work'}</div>
    <div class="timer-display ${timer.isRunning ? 'running' : ''} ${timer.mode === 'break' ? 'break-mode' : ''}">
      <span class="timer-minutes">${minutes.toString().padStart(2, '0')}</span><span class="timer-colon">:</span><span class="timer-seconds">${seconds.toString().padStart(2, '0')}</span>
    </div>

    <div class="timer-controls">
      <div class="timer-adjust">
        <button class="btn-adjust" id="timer-decrease" data-tooltip="-5 min">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14"/>
          </svg>
        </button>
        <button class="btn-adjust" id="timer-increase" data-tooltip="+5 min">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="timer-actions">
      ${timer.isRunning
        ? `<button class="btn btn-secondary" id="timer-pause">Pause</button>
           <button class="btn btn-primary" id="timer-finish">Finish</button>`
        : `<button class="btn btn-primary btn-lg" id="timer-start">
            ${timer.isPaused ? 'Resume' : 'Start Focus'}
           </button>`
      }
      ${(timer.isRunning || timer.isPaused) ? `<button class="btn btn-ghost" id="timer-reset">Reset</button>` : ''}
    </div>

    <div class="timer-meta">
      <div class="timer-category">
        <label for="timer-category-select">Category</label>
        <select id="timer-category-select">
          <option value="">Select...</option>
          ${categories.map(cat => `
            <option value="${cat.id}" ${timer.categoryId === cat.id ? 'selected' : ''}>${cat.name}</option>
          `).join('')}
        </select>
      </div>
      <div class="timer-note">
        <label for="timer-note-input">Note</label>
        <input type="text" id="timer-note-input" placeholder="What are you working on?" value="${timer.note || ''}">
      </div>
    </div>
  `;
}

function renderSessionsList(sessions) {
  if (!sessions || sessions.length === 0) {
    return `
      <div class="sessions-empty">
        <p>No sessions yet today. Start your first focus session!</p>
      </div>
    `;
  }

  return sessions.map(session => {
    const category = categories.find(c => c.id === session.categoryId) || { name: 'Uncategorized', color: 'var(--ink-wash)' };
    const modeLabels = {
      'deep-work': 'Deep Work',
      'shallow-work': 'Shallow Work',
      'meeting': 'Meeting'
    };

    return `
      <div class="session-item">
        <span class="session-time">${formatTimeOfDay(session.startTime)}</span>
        <span class="session-category">
          <span class="session-category-dot" style="background-color: ${category.color}"></span>
          <span class="session-category-name">${category.name}</span>
        </span>
        <span class="session-mode">${modeLabels[session.sessionType] || 'Focus'}</span>
        <span class="session-duration">${formatDuration(session.duration)}</span>
      </div>
    `;
  }).join('');
}

let timerInterval = null;

function initTimerControls() {
  const startBtn = document.getElementById('timer-start');
  const pauseBtn = document.getElementById('timer-pause');
  const finishBtn = document.getElementById('timer-finish');
  const resetBtn = document.getElementById('timer-reset');
  const increaseBtn = document.getElementById('timer-increase');
  const decreaseBtn = document.getElementById('timer-decrease');
  const categorySelect = document.getElementById('timer-category-select');
  const noteInput = document.getElementById('timer-note-input');

  if (startBtn) {
    startBtn.addEventListener('click', startTimer);
  }

  if (pauseBtn) {
    pauseBtn.addEventListener('click', pauseTimer);
  }

  if (finishBtn) {
    finishBtn.addEventListener('click', finishTimer);
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', resetTimer);
  }

  if (increaseBtn) {
    increaseBtn.addEventListener('click', () => adjustTimer(5 * 60));
  }

  if (decreaseBtn) {
    decreaseBtn.addEventListener('click', () => adjustTimer(-5 * 60));
  }

  if (categorySelect) {
    categorySelect.addEventListener('change', (e) => {
      store.setState({ timer: { categoryId: e.target.value || null } });
    });
  }

  if (noteInput) {
    noteInput.addEventListener('input', (e) => {
      store.setState({ timer: { note: e.target.value } });
    });
  }

  // Resume timer if it was running
  const state = store.getState();
  if (state.timer.isRunning && !timerInterval) {
    timerInterval = setInterval(timerTick, 1000);
  }
}

function startTimer() {
  const state = store.getState();

  store.setState({
    timer: {
      isRunning: true,
      isPaused: false,
      startTime: state.timer.startTime || Date.now()
    }
  });

  timerInterval = setInterval(timerTick, 1000);
  updateTimerDisplay();
}

function pauseTimer() {
  store.setState({ timer: { isRunning: false, isPaused: true } });

  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  updateTimerDisplay();
}

function timerTick() {
  const state = store.getState();
  const remaining = state.timer.remaining - 1;

  if (remaining <= 0) {
    finishTimer();
    return;
  }

  store.setState({ timer: { remaining } });
  updateTimerDisplay();
}

async function finishTimer() {
  const state = store.getState();
  const timer = state.timer;

  // Stop the timer
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  // Calculate actual duration
  const duration = timer.duration - timer.remaining;

  // Only save if we actually worked for some time (at least 60 seconds)
  if (duration >= 60) {
    const session = {
      startTime: new Date(timer.startTime),
      endTime: new Date(),
      duration: duration,
      plannedDuration: timer.duration,
      type: 'focus',
      sessionType: timer.sessionType,
      categoryId: timer.categoryId,
      note: timer.note,
      completed: timer.remaining <= 0
    };

    // Save to local state (and Firestore if connected)
    const sessions = [...state.sessions, session];
    store.setState({ sessions });

    // Try to save to Firestore
    try {
      const { saveSession } = await import('../services/sessions.js');
      await saveSession(session);
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }

  // Reset timer
  store.resetTimer();
  updateTimerDisplay();
}

function resetTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  store.resetTimer();
  updateTimerDisplay();
}

function adjustTimer(seconds) {
  const state = store.getState();
  const newDuration = Math.max(60, state.timer.duration + seconds);
  const newRemaining = Math.max(60, state.timer.remaining + seconds);

  store.setState({
    timer: {
      duration: newDuration,
      remaining: newRemaining
    }
  });

  updateTimerDisplay();
}

function updateTimerDisplay() {
  const timerContainer = document.getElementById('dashboard-timer');
  if (timerContainer) {
    timerContainer.innerHTML = renderTimerContent();
    initTimerControls();
  }
}

export function cleanupDashboard() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}
