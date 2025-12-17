import store from '../store.js';
import { formatDuration } from '../utils/format.js';

// Default categories
const categories = [
  { id: 'writing', name: 'Writing', color: 'var(--cat-writing)' },
  { id: 'coding', name: 'Coding', color: 'var(--cat-coding)' },
  { id: 'research', name: 'Research', color: 'var(--cat-research)' },
  { id: 'meeting', name: 'Meeting', color: 'var(--cat-meeting)' },
  { id: 'admin', name: 'Admin', color: 'var(--cat-admin)' },
  { id: 'learning', name: 'Learning', color: 'var(--cat-learning)' }
];

const sessionTypes = [
  { id: 'deep-work', name: 'Deep Work' },
  { id: 'shallow-work', name: 'Shallow Work' },
  { id: 'meeting', name: 'Meeting' }
];

let timerInterval = null;

export function renderTimer(container) {
  const state = store.getState();
  const timer = state.timer;
  const minutes = Math.floor(timer.remaining / 60);
  const seconds = timer.remaining % 60;

  container.innerHTML = `
    <div class="timer-page fade-in">
      <header class="page-header">
        <h1 class="page-title">Timer</h1>
        <p class="page-subtitle">Focus on what matters</p>
      </header>

      <div class="timer-fullscreen-card">
        <!-- Session Type Selector -->
        <div class="session-type-selector">
          ${sessionTypes.map(type => `
            <button class="session-type-btn ${timer.sessionType === type.id ? 'active' : ''}" data-type="${type.id}">
              ${type.name}
            </button>
          `).join('')}
        </div>

        <!-- Mode Toggle -->
        <div class="mode-toggle">
          <button class="mode-btn ${timer.mode === 'focus' ? 'active' : ''}" data-mode="focus">Focus</button>
          <button class="mode-btn ${timer.mode === 'break' ? 'active' : ''}" data-mode="break">Break</button>
        </div>

        <!-- Timer Display -->
        <div class="timer-display-large ${timer.isRunning ? 'running' : ''} ${timer.mode === 'break' ? 'break-mode' : ''}">
          <span class="timer-minutes">${minutes.toString().padStart(2, '0')}</span><span class="timer-colon">:</span><span class="timer-seconds">${seconds.toString().padStart(2, '0')}</span>
        </div>

        <!-- Adjust Buttons -->
        <div class="timer-adjust-large">
          <button class="adjust-btn" id="timer-decrease-5">−5m</button>
          <button class="adjust-btn" id="timer-decrease-1">−1m</button>
          <button class="adjust-btn" id="timer-increase-1">+1m</button>
          <button class="adjust-btn" id="timer-increase-5">+5m</button>
        </div>

        <!-- Main Actions -->
        <div class="timer-actions-large">
          ${timer.isRunning
            ? `<button class="btn btn-secondary btn-lg" id="timer-pause">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1"/>
                  <rect x="14" y="4" width="4" height="16" rx="1"/>
                </svg>
                Pause
               </button>
               <button class="btn btn-primary btn-lg" id="timer-finish">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                Finish
               </button>`
            : `<button class="btn btn-primary btn-xl" id="timer-start">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                ${timer.isPaused ? 'Resume' : 'Start Focus'}
               </button>`
          }
        </div>

        ${(timer.isRunning || timer.isPaused)
          ? `<button class="btn btn-ghost" id="timer-reset">Reset</button>`
          : ''
        }

        <!-- Divider -->
        <div class="timer-divider"></div>

        <!-- Meta Info -->
        <div class="timer-meta-large">
          <div class="meta-field">
            <label for="timer-category">Category</label>
            <select id="timer-category">
              <option value="">Select category...</option>
              ${categories.map(cat => `
                <option value="${cat.id}" ${timer.categoryId === cat.id ? 'selected' : ''}>${cat.name}</option>
              `).join('')}
            </select>
          </div>
          <div class="meta-field meta-field-wide">
            <label for="timer-note">Note</label>
            <input type="text" id="timer-note" placeholder="What are you working on?" value="${timer.note || ''}">
          </div>
        </div>

        ${timer.isRunning || timer.isPaused ? `
          <div class="timer-session-info">
            <span>Started ${new Date(timer.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
            <span>•</span>
            <span>Elapsed: ${formatDuration(timer.duration - timer.remaining)}</span>
          </div>
        ` : ''}
      </div>
    </div>

    <style>
      .timer-page {
        max-width: 600px;
        margin: 0 auto;
      }

      .timer-fullscreen-card {
        background-color: var(--paper);
        border-radius: var(--card-radius);
        box-shadow: var(--shadow-card);
        padding: var(--space-10);
        text-align: center;
      }

      .session-type-selector {
        display: flex;
        justify-content: center;
        gap: var(--space-2);
        margin-bottom: var(--space-6);
      }

      .session-type-btn {
        padding: var(--space-2) var(--space-4);
        border-radius: var(--button-radius);
        font-size: var(--text-sm);
        color: var(--ink-muted);
        transition: all var(--transition-fast);
      }

      .session-type-btn:hover {
        background-color: var(--paper-aged);
      }

      .session-type-btn.active {
        background-color: var(--shu-fade);
        color: var(--shu);
      }

      .mode-toggle {
        display: inline-flex;
        background-color: var(--paper-aged);
        border-radius: var(--button-radius);
        padding: var(--space-1);
        margin-bottom: var(--space-8);
      }

      .mode-btn {
        padding: var(--space-2) var(--space-5);
        border-radius: calc(var(--button-radius) - 2px);
        font-size: var(--text-sm);
        font-weight: 500;
        color: var(--ink-muted);
        transition: all var(--transition-fast);
      }

      .mode-btn.active {
        background-color: var(--paper);
        color: var(--ink);
        box-shadow: var(--shadow-sm);
      }

      .timer-display-large {
        font-family: var(--font-mono);
        font-size: 6rem;
        font-weight: 500;
        color: var(--ink);
        letter-spacing: -0.02em;
        line-height: 1;
        margin-bottom: var(--space-6);
        font-variant-numeric: tabular-nums;
      }

      .timer-display-large.running .timer-colon {
        animation: timerPulse 1s ease-in-out infinite;
      }

      .timer-display-large.break-mode {
        color: var(--ai);
      }

      .timer-adjust-large {
        display: flex;
        justify-content: center;
        gap: var(--space-2);
        margin-bottom: var(--space-8);
      }

      .adjust-btn {
        padding: var(--space-2) var(--space-4);
        border-radius: var(--button-radius);
        font-size: var(--text-sm);
        font-family: var(--font-mono);
        color: var(--ink-muted);
        background-color: var(--paper-aged);
        transition: all var(--transition-fast);
      }

      .adjust-btn:hover {
        background-color: var(--paper-shadow);
        color: var(--ink);
      }

      .timer-actions-large {
        display: flex;
        justify-content: center;
        gap: var(--space-4);
        margin-bottom: var(--space-4);
      }

      .btn-xl {
        padding: var(--space-5) var(--space-10);
        font-size: var(--text-lg);
      }

      .timer-divider {
        height: 1px;
        background: linear-gradient(to right, transparent, var(--ink-wash), transparent);
        margin: var(--space-8) 0;
      }

      .timer-meta-large {
        display: flex;
        justify-content: center;
        gap: var(--space-6);
        flex-wrap: wrap;
      }

      .meta-field {
        text-align: left;
      }

      .meta-field label {
        display: block;
        font-size: var(--text-xs);
        color: var(--ink-faded);
        margin-bottom: var(--space-2);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .meta-field select,
      .meta-field input {
        min-width: 180px;
      }

      .meta-field-wide input {
        min-width: 280px;
      }

      .timer-session-info {
        margin-top: var(--space-6);
        font-size: var(--text-sm);
        color: var(--ink-faded);
        display: flex;
        justify-content: center;
        gap: var(--space-3);
      }

      @media (max-width: 768px) {
        .timer-display-large {
          font-size: 4rem;
        }

        .timer-meta-large {
          flex-direction: column;
          align-items: center;
        }

        .meta-field select,
        .meta-field input,
        .meta-field-wide input {
          min-width: 100%;
          width: 280px;
        }
      }
    </style>
  `;

  initTimerPageControls();
}

function initTimerPageControls() {
  // Session type buttons
  document.querySelectorAll('.session-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      store.setState({ timer: { sessionType: btn.dataset.type } });
      renderTimerPage();
    });
  });

  // Mode toggle
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const state = store.getState();
      const mode = btn.dataset.mode;
      const duration = mode === 'focus'
        ? state.settings.defaultWorkDuration * 60
        : state.settings.defaultBreakDuration * 60;

      store.setState({
        timer: {
          mode,
          duration,
          remaining: duration
        }
      });
      renderTimerPage();
    });
  });

  // Timer controls
  const startBtn = document.getElementById('timer-start');
  const pauseBtn = document.getElementById('timer-pause');
  const finishBtn = document.getElementById('timer-finish');
  const resetBtn = document.getElementById('timer-reset');

  if (startBtn) startBtn.addEventListener('click', startTimer);
  if (pauseBtn) pauseBtn.addEventListener('click', pauseTimer);
  if (finishBtn) finishBtn.addEventListener('click', finishTimer);
  if (resetBtn) resetBtn.addEventListener('click', resetTimer);

  // Adjust buttons
  document.getElementById('timer-decrease-5')?.addEventListener('click', () => adjustTimer(-5 * 60));
  document.getElementById('timer-decrease-1')?.addEventListener('click', () => adjustTimer(-60));
  document.getElementById('timer-increase-1')?.addEventListener('click', () => adjustTimer(60));
  document.getElementById('timer-increase-5')?.addEventListener('click', () => adjustTimer(5 * 60));

  // Meta inputs
  document.getElementById('timer-category')?.addEventListener('change', (e) => {
    store.setState({ timer: { categoryId: e.target.value || null } });
  });

  document.getElementById('timer-note')?.addEventListener('input', (e) => {
    store.setState({ timer: { note: e.target.value } });
  });

  // Resume timer if running
  const state = store.getState();
  if (state.timer.isRunning && !timerInterval) {
    timerInterval = setInterval(timerTick, 1000);
  }
}

function renderTimerPage() {
  const container = document.getElementById('main-content');
  if (container && store.getState().ui.currentPage === 'timer') {
    renderTimer(container);
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
  renderTimerPage();
}

function pauseTimer() {
  store.setState({ timer: { isRunning: false, isPaused: true } });

  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  renderTimerPage();
}

function timerTick() {
  const state = store.getState();
  const remaining = state.timer.remaining - 1;

  if (remaining <= 0) {
    finishTimer();
    return;
  }

  store.setState({ timer: { remaining } });

  // Update display without full re-render
  const minutesEl = document.querySelector('.timer-display-large .timer-minutes');
  const secondsEl = document.querySelector('.timer-display-large .timer-seconds');

  if (minutesEl && secondsEl) {
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    minutesEl.textContent = minutes.toString().padStart(2, '0');
    secondsEl.textContent = seconds.toString().padStart(2, '0');
  }
}

async function finishTimer() {
  const state = store.getState();
  const timer = state.timer;

  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  const duration = timer.duration - timer.remaining;

  if (duration >= 60) {
    const session = {
      startTime: new Date(timer.startTime),
      endTime: new Date(),
      duration,
      plannedDuration: timer.duration,
      type: timer.mode,
      sessionType: timer.sessionType,
      categoryId: timer.categoryId,
      note: timer.note,
      completed: timer.remaining <= 0
    };

    const sessions = [...state.sessions, session];
    store.setState({ sessions });

    try {
      const { saveSession } = await import('../services/sessions.js');
      await saveSession(session);
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }

  store.resetTimer();
  renderTimerPage();
}

function resetTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  store.resetTimer();
  renderTimerPage();
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

  renderTimerPage();
}

export function cleanupTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}
