import store from '../store.js';
import { formatDuration, formatMinutes } from '../utils/format.js';

const categories = [
  { id: 'writing', name: 'Writing', color: '#6b5c7a' },
  { id: 'coding', name: 'Coding', color: '#4a6670' },
  { id: 'research', name: 'Research', color: '#5c6b4a' },
  { id: 'meeting', name: 'Meeting', color: '#7a6b5c' },
  { id: 'admin', name: 'Admin', color: '#6a6a6a' },
  { id: 'learning', name: 'Learning', color: '#5c5a70' }
];

export function renderAnalytics(container) {
  const state = store.getState();
  const sessions = state.sessions.filter(s => s.type === 'focus');

  // Calculate stats
  const totalSeconds = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
  const avgSessionSeconds = sessions.length > 0 ? totalSeconds / sessions.length : 0;

  // Group by category
  const byCategory = {};
  sessions.forEach(s => {
    const cat = s.categoryId || 'uncategorized';
    byCategory[cat] = (byCategory[cat] || 0) + (s.duration || 0);
  });

  // Get last 7 days data
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const daySeconds = sessions
      .filter(s => {
        const sDate = new Date(s.startTime);
        return sDate >= date && sDate < nextDate;
      })
      .reduce((sum, s) => sum + (s.duration || 0), 0);

    last7Days.push({
      date,
      label: date.toLocaleDateString('en-US', { weekday: 'short' }),
      seconds: daySeconds,
      hours: daySeconds / 3600
    });
  }

  const maxHours = Math.max(...last7Days.map(d => d.hours), 1);

  container.innerHTML = `
    <div class="analytics-page fade-in">
      <header class="page-header">
        <h1 class="page-title">Analytics</h1>
        <p class="page-subtitle">Your productivity insights</p>
      </header>

      <!-- Period Selector -->
      <div class="period-selector">
        <button class="period-btn" data-period="today">Today</button>
        <button class="period-btn active" data-period="week">This Week</button>
        <button class="period-btn" data-period="month">This Month</button>
      </div>

      <!-- Bar Chart -->
      <div class="card analytics-chart-card">
        <h3 class="card-title">Focus Time</h3>
        <div class="bar-chart">
          ${last7Days.map(day => `
            <div class="bar-column">
              <div class="bar-wrapper">
                <div class="bar" style="height: ${(day.hours / maxHours) * 100}%"></div>
              </div>
              <span class="bar-label">${day.label}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="analytics-grid">
        <!-- Category Breakdown -->
        <div class="card">
          <h3 class="card-title">By Category</h3>
          <div class="category-list">
            ${Object.entries(byCategory).length > 0
              ? Object.entries(byCategory)
                  .sort((a, b) => b[1] - a[1])
                  .map(([catId, seconds]) => {
                    const cat = categories.find(c => c.id === catId) || { name: 'Other', color: '#8a8683' };
                    const percentage = totalSeconds > 0 ? Math.round((seconds / totalSeconds) * 100) : 0;
                    return `
                      <div class="category-row">
                        <div class="category-info">
                          <span class="category-dot" style="background-color: ${cat.color}"></span>
                          <span class="category-name">${cat.name}</span>
                        </div>
                        <div class="category-bar-wrapper">
                          <div class="category-bar" style="width: ${percentage}%; background-color: ${cat.color}"></div>
                        </div>
                        <span class="category-percent">${percentage}%</span>
                      </div>
                    `;
                  }).join('')
              : '<p class="text-muted">No data yet</p>'
            }
          </div>
        </div>

        <!-- Summary Stats -->
        <div class="card">
          <h3 class="card-title">Summary</h3>
          <div class="summary-stats">
            <div class="summary-row">
              <span class="summary-label">Total time</span>
              <span class="summary-value">${formatDuration(totalSeconds)}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Sessions</span>
              <span class="summary-value">${sessions.length}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Avg / day</span>
              <span class="summary-value">${formatDuration(totalSeconds / 7)}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Avg session</span>
              <span class="summary-value">${formatDuration(Math.round(avgSessionSeconds))}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Best day</span>
              <span class="summary-value">${getBestDay(last7Days)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <style>
      .analytics-page {
        max-width: 900px;
      }

      .period-selector {
        display: flex;
        gap: var(--space-2);
        margin-bottom: var(--space-6);
      }

      .period-btn {
        padding: var(--space-2) var(--space-4);
        border-radius: var(--button-radius);
        font-size: var(--text-sm);
        color: var(--ink-muted);
        transition: all var(--transition-fast);
      }

      .period-btn:hover {
        background-color: var(--paper-aged);
      }

      .period-btn.active {
        background-color: var(--ink);
        color: var(--paper);
      }

      .analytics-chart-card {
        margin-bottom: var(--space-6);
      }

      .bar-chart {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        height: 200px;
        padding-top: var(--space-4);
      }

      .bar-column {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-2);
      }

      .bar-wrapper {
        width: 32px;
        height: 160px;
        background-color: var(--paper-aged);
        border-radius: 4px;
        display: flex;
        align-items: flex-end;
        overflow: hidden;
      }

      .bar {
        width: 100%;
        background-color: var(--shu);
        border-radius: 4px;
        min-height: 4px;
        transition: height var(--transition-base);
      }

      .bar-label {
        font-size: var(--text-xs);
        color: var(--ink-faded);
      }

      .analytics-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-6);
      }

      .category-list {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
      }

      .category-row {
        display: flex;
        align-items: center;
        gap: var(--space-3);
      }

      .category-info {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        min-width: 100px;
      }

      .category-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        flex-shrink: 0;
      }

      .category-name {
        font-size: var(--text-sm);
      }

      .category-bar-wrapper {
        flex: 1;
        height: 8px;
        background-color: var(--paper-aged);
        border-radius: 4px;
        overflow: hidden;
      }

      .category-bar {
        height: 100%;
        border-radius: 4px;
        transition: width var(--transition-base);
      }

      .category-percent {
        font-size: var(--text-sm);
        font-family: var(--font-mono);
        color: var(--ink-muted);
        min-width: 40px;
        text-align: right;
      }

      .summary-stats {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
      }

      .summary-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .summary-label {
        color: var(--ink-faded);
        font-size: var(--text-sm);
      }

      .summary-value {
        font-family: var(--font-mono);
        font-weight: 500;
      }

      @media (max-width: 768px) {
        .analytics-grid {
          grid-template-columns: 1fr;
        }
      }
    </style>
  `;
}

function getBestDay(days) {
  if (days.length === 0) return '—';
  const best = days.reduce((a, b) => a.seconds > b.seconds ? a : b);
  if (best.seconds === 0) return '—';
  return best.date.toLocaleDateString('en-US', { weekday: 'long' });
}
