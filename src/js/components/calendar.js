import store from '../store.js';
import { formatDuration, formatTimeOfDay } from '../utils/format.js';

const categories = [
  { id: 'writing', name: 'Writing', color: '#6b5c7a' },
  { id: 'coding', name: 'Coding', color: '#4a6670' },
  { id: 'research', name: 'Research', color: '#5c6b4a' },
  { id: 'meeting', name: 'Meeting', color: '#7a6b5c' },
  { id: 'admin', name: 'Admin', color: '#6a6a6a' },
  { id: 'learning', name: 'Learning', color: '#5c5a70' }
];

let currentMonth = new Date();

export function renderCalendar(container) {
  const state = store.getState();
  const sessions = state.sessions;

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const today = new Date();

  // Get first and last day of month
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Get day of week for first day (0 = Sunday, adjust for Monday start)
  let startDay = firstDay.getDay() - 1;
  if (startDay < 0) startDay = 6;

  // Calculate sessions per day
  const sessionsByDay = {};
  sessions.forEach(s => {
    const sDate = new Date(s.startTime);
    if (sDate.getMonth() === month && sDate.getFullYear() === year) {
      const day = sDate.getDate();
      if (!sessionsByDay[day]) {
        sessionsByDay[day] = { seconds: 0, sessions: [] };
      }
      sessionsByDay[day].seconds += s.duration || 0;
      sessionsByDay[day].sessions.push(s);
    }
  });

  // Build calendar grid
  const days = [];
  // Add empty cells for days before first
  for (let i = 0; i < startDay; i++) {
    days.push({ empty: true });
  }
  // Add days of month
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dayData = sessionsByDay[d] || { seconds: 0, sessions: [] };
    const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    days.push({
      day: d,
      isToday,
      seconds: dayData.seconds,
      sessions: dayData.sessions,
      intensity: getIntensity(dayData.seconds)
    });
  }

  const monthName = firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  container.innerHTML = `
    <div class="calendar-page fade-in">
      <header class="page-header">
        <h1 class="page-title">Calendar</h1>
        <p class="page-subtitle">Your focus history</p>
      </header>

      <div class="calendar-card card">
        <div class="calendar-header">
          <button class="btn btn-ghost" id="prev-month">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <h2 class="calendar-month">${monthName}</h2>
          <button class="btn btn-ghost" id="next-month">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>

        <div class="calendar-weekdays">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>

        <div class="calendar-grid">
          ${days.map(d => {
            if (d.empty) {
              return '<div class="calendar-day empty"></div>';
            }
            return `
              <div class="calendar-day ${d.isToday ? 'today' : ''} ${d.seconds > 0 ? 'has-sessions' : ''}"
                   data-day="${d.day}" data-intensity="${d.intensity}">
                <span class="day-number">${d.day}</span>
                ${d.seconds > 0 ? `
                  <div class="day-indicator intensity-${d.intensity}"></div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>

        <div class="calendar-legend">
          <span class="legend-item">
            <span class="legend-dot intensity-0"></span>
            <span>No sessions</span>
          </span>
          <span class="legend-item">
            <span class="legend-dot intensity-1"></span>
            <span>&lt; 2h</span>
          </span>
          <span class="legend-item">
            <span class="legend-dot intensity-2"></span>
            <span>2-4h</span>
          </span>
          <span class="legend-item">
            <span class="legend-dot intensity-3"></span>
            <span>4-6h</span>
          </span>
          <span class="legend-item">
            <span class="legend-dot intensity-4"></span>
            <span>6h+</span>
          </span>
        </div>
      </div>

      <div class="day-detail card" id="day-detail" style="display: none;">
        <h3 class="card-title" id="day-detail-title">Sessions</h3>
        <div id="day-detail-content"></div>
      </div>
    </div>

    <style>
      .calendar-page {
        max-width: 700px;
      }

      .calendar-card {
        margin-bottom: var(--space-6);
      }

      .calendar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-6);
      }

      .calendar-month {
        font-family: var(--font-serif);
        font-size: var(--text-xl);
      }

      .calendar-weekdays {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        text-align: center;
        margin-bottom: var(--space-2);
        font-size: var(--text-xs);
        color: var(--ink-faded);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 2px;
      }

      .calendar-day {
        aspect-ratio: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: var(--button-radius);
        cursor: pointer;
        transition: all var(--transition-fast);
        position: relative;
      }

      .calendar-day:not(.empty):hover {
        background-color: var(--paper-aged);
      }

      .calendar-day.empty {
        cursor: default;
      }

      .calendar-day.today {
        background-color: var(--shu-fade);
      }

      .calendar-day.today .day-number {
        color: var(--shu);
        font-weight: 600;
      }

      .day-number {
        font-size: var(--text-sm);
        color: var(--ink-muted);
      }

      .day-indicator {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        margin-top: 4px;
      }

      .intensity-1 { background-color: rgba(214, 73, 51, 0.25); }
      .intensity-2 { background-color: rgba(214, 73, 51, 0.5); }
      .intensity-3 { background-color: rgba(214, 73, 51, 0.75); }
      .intensity-4 { background-color: var(--shu); }

      .calendar-legend {
        display: flex;
        justify-content: center;
        gap: var(--space-4);
        margin-top: var(--space-6);
        padding-top: var(--space-4);
        border-top: 1px dashed var(--ink-wash);
      }

      .legend-item {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        font-size: var(--text-xs);
        color: var(--ink-faded);
      }

      .legend-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: var(--paper-shadow);
      }

      .day-detail {
        animation: fadeIn var(--transition-base) ease-out;
      }

      .day-sessions-list {
        display: flex;
        flex-direction: column;
        gap: var(--space-3);
      }

      .day-session-item {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-3);
        background-color: var(--paper-aged);
        border-radius: var(--button-radius);
      }

      .day-session-time {
        font-family: var(--font-mono);
        font-size: var(--text-sm);
        color: var(--ink-faded);
      }

      .day-session-cat {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        flex: 1;
      }

      .day-session-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
      }

      .day-session-duration {
        font-family: var(--font-mono);
        font-size: var(--text-sm);
        color: var(--ink-muted);
      }

      @media (max-width: 600px) {
        .calendar-legend {
          flex-wrap: wrap;
        }
      }
    </style>
  `;

  // Event listeners
  document.getElementById('prev-month')?.addEventListener('click', () => {
    currentMonth.setMonth(currentMonth.getMonth() - 1);
    renderCalendar(container);
  });

  document.getElementById('next-month')?.addEventListener('click', () => {
    currentMonth.setMonth(currentMonth.getMonth() + 1);
    renderCalendar(container);
  });

  // Day click handlers
  document.querySelectorAll('.calendar-day:not(.empty)').forEach(dayEl => {
    dayEl.addEventListener('click', () => {
      const day = parseInt(dayEl.dataset.day);
      showDayDetail(day, sessionsByDay[day]?.sessions || []);
    });
  });
}

function getIntensity(seconds) {
  const hours = seconds / 3600;
  if (hours === 0) return 0;
  if (hours < 2) return 1;
  if (hours < 4) return 2;
  if (hours < 6) return 3;
  return 4;
}

function showDayDetail(day, sessions) {
  const detailEl = document.getElementById('day-detail');
  const titleEl = document.getElementById('day-detail-title');
  const contentEl = document.getElementById('day-detail-content');

  if (!detailEl) return;

  const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
  const dateStr = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  titleEl.textContent = dateStr;

  if (sessions.length === 0) {
    contentEl.innerHTML = '<p class="text-muted">No sessions on this day</p>';
  } else {
    const totalSeconds = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);

    contentEl.innerHTML = `
      <p class="text-muted" style="margin-bottom: var(--space-4);">
        Total: ${formatDuration(totalSeconds)} across ${sessions.length} session${sessions.length !== 1 ? 's' : ''}
      </p>
      <div class="day-sessions-list">
        ${sessions.map(s => {
          const cat = categories.find(c => c.id === s.categoryId) || { name: 'Other', color: '#8a8683' };
          return `
            <div class="day-session-item">
              <span class="day-session-time">${formatTimeOfDay(s.startTime)}</span>
              <span class="day-session-cat">
                <span class="day-session-dot" style="background-color: ${cat.color}"></span>
                ${cat.name}
              </span>
              <span class="day-session-duration">${formatDuration(s.duration)}</span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  detailEl.style.display = 'block';
}
