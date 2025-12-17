import store from '../store.js';
import { formatDuration, formatMinutes } from '../utils/format.js';

export function renderGoals(container) {
  const state = store.getState();
  const stats = store.getTodayStats();

  // Calculate week stats
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
  weekStart.setHours(0, 0, 0, 0);

  const weekSessions = state.sessions.filter(s => new Date(s.startTime) >= weekStart);
  const weekSeconds = weekSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
  const weekMinutes = Math.floor(weekSeconds / 60);
  const weekProgress = Math.min(100, (weekMinutes / state.goals.weekly) * 100);

  container.innerHTML = `
    <div class="goals-page fade-in">
      <header class="page-header">
        <h1 class="page-title">Goals</h1>
        <p class="page-subtitle">Track your progress</p>
      </header>

      <!-- Daily Goal -->
      <div class="goal-card card">
        <div class="goal-header">
          <div>
            <h3 class="goal-title">Daily Goal</h3>
            <p class="goal-subtitle">Focus time target for today</p>
          </div>
          <button class="btn btn-ghost btn-sm" id="edit-daily-goal">Edit</button>
        </div>

        <div class="goal-progress-ring">
          <svg viewBox="0 0 120 120" width="120" height="120">
            <circle class="goal-ring-bg" cx="60" cy="60" r="52"/>
            <circle class="goal-ring-progress" cx="60" cy="60" r="52"
                    style="stroke-dashoffset: ${327 - (327 * stats.goalProgress / 100)}"/>
          </svg>
          <div class="goal-progress-text">
            <span class="goal-current">${formatDuration(stats.totalSeconds)}</span>
            <span class="goal-target">of ${formatMinutes(state.goals.daily)}</span>
          </div>
        </div>

        <div class="goal-status ${stats.goalProgress >= 100 ? 'completed' : ''}">
          ${stats.goalProgress >= 100
            ? '<span class="goal-status-icon">✓</span> Daily goal achieved!'
            : `${formatMinutes(state.goals.daily - stats.totalMinutes)} remaining`
          }
        </div>
      </div>

      <!-- Weekly Goal -->
      <div class="goal-card card">
        <div class="goal-header">
          <div>
            <h3 class="goal-title">Weekly Goal</h3>
            <p class="goal-subtitle">Focus time target for this week</p>
          </div>
          <button class="btn btn-ghost btn-sm" id="edit-weekly-goal">Edit</button>
        </div>

        <div class="goal-bar-container">
          <div class="goal-bar-track">
            <div class="goal-bar-fill" style="width: ${weekProgress}%"></div>
          </div>
          <div class="goal-bar-labels">
            <span>${formatDuration(weekSeconds)}</span>
            <span>${formatMinutes(state.goals.weekly)}</span>
          </div>
        </div>

        <div class="goal-status ${weekProgress >= 100 ? 'completed' : ''}">
          ${weekProgress >= 100
            ? '<span class="goal-status-icon">✓</span> Weekly goal achieved!'
            : `${formatMinutes(state.goals.weekly - weekMinutes)} remaining`
          }
        </div>
      </div>

      <!-- Streak -->
      <div class="goal-card card">
        <div class="goal-header">
          <div>
            <h3 class="goal-title">Current Streak</h3>
            <p class="goal-subtitle">Consecutive days meeting daily goal</p>
          </div>
        </div>

        <div class="streak-display-large">
          <span class="streak-number">${state.streak.current}</span>
          <span class="streak-label">day${state.streak.current !== 1 ? 's' : ''}</span>
        </div>

        <div class="streak-week">
          ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
            const today = new Date().getDay();
            const dayIndex = today === 0 ? 6 : today - 1;
            const isActive = i <= dayIndex && state.streak.current > dayIndex - i;
            const isToday = i === dayIndex;

            return `
              <div class="streak-day ${isActive ? 'active' : ''} ${isToday ? 'today' : ''}">
                <span class="streak-day-label">${day}</span>
                <span class="streak-day-dot"></span>
              </div>
            `;
          }).join('')}
        </div>

        <div class="streak-stats">
          <div class="streak-stat">
            <span class="streak-stat-value">${state.streak.longest}</span>
            <span class="streak-stat-label">Best streak</span>
          </div>
        </div>
      </div>

      <!-- Edit Goal Modal -->
      <div class="modal-overlay" id="goal-modal" style="display: none;">
        <div class="modal">
          <h3 class="modal-title" id="modal-title">Edit Goal</h3>
          <div class="modal-content">
            <label for="goal-input">Target (hours)</label>
            <input type="number" id="goal-input" min="0.5" max="24" step="0.5" value="4">
          </div>
          <div class="modal-actions">
            <button class="btn btn-secondary" id="modal-cancel">Cancel</button>
            <button class="btn btn-primary" id="modal-save">Save</button>
          </div>
        </div>
      </div>
    </div>

    <style>
      .goals-page {
        max-width: 600px;
      }

      .goal-card {
        margin-bottom: var(--space-6);
      }

      .goal-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: var(--space-6);
      }

      .goal-title {
        font-family: var(--font-serif);
        font-size: var(--text-lg);
        margin-bottom: var(--space-1);
      }

      .goal-subtitle {
        font-size: var(--text-sm);
        color: var(--ink-faded);
      }

      .goal-progress-ring {
        position: relative;
        width: 120px;
        height: 120px;
        margin: 0 auto var(--space-6);
      }

      .goal-progress-ring svg {
        transform: rotate(-90deg);
      }

      .goal-ring-bg {
        fill: none;
        stroke: var(--paper-shadow);
        stroke-width: 8;
      }

      .goal-ring-progress {
        fill: none;
        stroke: var(--shu);
        stroke-width: 8;
        stroke-linecap: round;
        stroke-dasharray: 327;
        transition: stroke-dashoffset var(--transition-slow);
      }

      .goal-progress-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
      }

      .goal-current {
        display: block;
        font-family: var(--font-mono);
        font-size: var(--text-xl);
        font-weight: 500;
      }

      .goal-target {
        font-size: var(--text-xs);
        color: var(--ink-faded);
      }

      .goal-bar-container {
        margin-bottom: var(--space-4);
      }

      .goal-bar-track {
        height: 12px;
        background-color: var(--paper-shadow);
        border-radius: 6px;
        overflow: hidden;
        margin-bottom: var(--space-2);
      }

      .goal-bar-fill {
        height: 100%;
        background-color: var(--shu);
        border-radius: 6px;
        transition: width var(--transition-slow);
      }

      .goal-bar-labels {
        display: flex;
        justify-content: space-between;
        font-size: var(--text-sm);
        font-family: var(--font-mono);
        color: var(--ink-muted);
      }

      .goal-status {
        text-align: center;
        font-size: var(--text-sm);
        color: var(--ink-faded);
        padding-top: var(--space-4);
        border-top: 1px dashed var(--ink-wash);
      }

      .goal-status.completed {
        color: var(--success);
        font-weight: 500;
      }

      .goal-status-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        background-color: var(--success);
        color: white;
        border-radius: 50%;
        font-size: var(--text-xs);
        margin-right: var(--space-2);
      }

      .streak-display-large {
        text-align: center;
        margin-bottom: var(--space-6);
      }

      .streak-number {
        display: block;
        font-family: var(--font-mono);
        font-size: var(--text-5xl);
        font-weight: 500;
        color: var(--shu);
        line-height: 1;
      }

      .streak-label {
        font-size: var(--text-lg);
        color: var(--ink-faded);
      }

      .streak-week {
        display: flex;
        justify-content: center;
        gap: var(--space-3);
        margin-bottom: var(--space-6);
      }

      .streak-day {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-2);
      }

      .streak-day-label {
        font-size: var(--text-xs);
        color: var(--ink-faded);
      }

      .streak-day-dot {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: var(--paper-shadow);
        transition: all var(--transition-fast);
      }

      .streak-day.active .streak-day-dot {
        background-color: var(--shu);
      }

      .streak-day.today .streak-day-dot {
        box-shadow: 0 0 0 3px var(--shu-fade);
      }

      .streak-stats {
        text-align: center;
        padding-top: var(--space-4);
        border-top: 1px dashed var(--ink-wash);
      }

      .streak-stat-value {
        font-family: var(--font-mono);
        font-size: var(--text-xl);
        font-weight: 500;
      }

      .streak-stat-label {
        display: block;
        font-size: var(--text-sm);
        color: var(--ink-faded);
      }

      /* Modal */
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(26, 24, 22, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }

      .modal {
        background-color: var(--paper);
        border-radius: var(--card-radius);
        padding: var(--space-6);
        width: 100%;
        max-width: 320px;
        box-shadow: var(--shadow-lg);
      }

      .modal-title {
        font-family: var(--font-serif);
        font-size: var(--text-lg);
        margin-bottom: var(--space-4);
      }

      .modal-content {
        margin-bottom: var(--space-6);
      }

      .modal-content label {
        display: block;
        font-size: var(--text-sm);
        color: var(--ink-muted);
        margin-bottom: var(--space-2);
      }

      .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: var(--space-3);
      }
    </style>
  `;

  // Event listeners
  let editingGoal = null;

  document.getElementById('edit-daily-goal')?.addEventListener('click', () => {
    editingGoal = 'daily';
    const input = document.getElementById('goal-input');
    input.value = state.goals.daily / 60;
    document.getElementById('modal-title').textContent = 'Edit Daily Goal';
    document.getElementById('goal-modal').style.display = 'flex';
  });

  document.getElementById('edit-weekly-goal')?.addEventListener('click', () => {
    editingGoal = 'weekly';
    const input = document.getElementById('goal-input');
    input.value = state.goals.weekly / 60;
    document.getElementById('modal-title').textContent = 'Edit Weekly Goal';
    document.getElementById('goal-modal').style.display = 'flex';
  });

  document.getElementById('modal-cancel')?.addEventListener('click', () => {
    document.getElementById('goal-modal').style.display = 'none';
    editingGoal = null;
  });

  document.getElementById('modal-save')?.addEventListener('click', () => {
    const input = document.getElementById('goal-input');
    const hours = parseFloat(input.value) || 4;
    const minutes = Math.round(hours * 60);

    if (editingGoal === 'daily') {
      store.setState({ goals: { daily: minutes } });
    } else if (editingGoal === 'weekly') {
      store.setState({ goals: { weekly: minutes } });
    }

    document.getElementById('goal-modal').style.display = 'none';
    editingGoal = null;
    renderGoals(container);
  });

  // Close modal on overlay click
  document.getElementById('goal-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'goal-modal') {
      document.getElementById('goal-modal').style.display = 'none';
      editingGoal = null;
    }
  });
}
