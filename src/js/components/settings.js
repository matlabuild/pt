import store from '../store.js';

export function renderSettings(container) {
  const state = store.getState();
  const settings = state.settings;

  container.innerHTML = `
    <div class="settings-page fade-in">
      <header class="page-header">
        <h1 class="page-title">Settings</h1>
        <p class="page-subtitle">Customize your experience</p>
      </header>

      <!-- Timer Settings -->
      <section class="settings-section card">
        <h3 class="settings-section-title">Timer</h3>

        <div class="setting-row">
          <div class="setting-info">
            <span class="setting-label">Default focus duration</span>
            <span class="setting-description">How long your focus sessions last by default</span>
          </div>
          <div class="setting-control">
            <select id="setting-work-duration">
              ${[15, 20, 25, 30, 45, 60, 90].map(m => `
                <option value="${m}" ${settings.defaultWorkDuration === m ? 'selected' : ''}>${m} min</option>
              `).join('')}
            </select>
          </div>
        </div>

        <div class="setting-row">
          <div class="setting-info">
            <span class="setting-label">Default break duration</span>
            <span class="setting-description">How long your breaks last by default</span>
          </div>
          <div class="setting-control">
            <select id="setting-break-duration">
              ${[5, 10, 15, 20, 30].map(m => `
                <option value="${m}" ${settings.defaultBreakDuration === m ? 'selected' : ''}>${m} min</option>
              `).join('')}
            </select>
          </div>
        </div>
      </section>

      <!-- Notifications -->
      <section class="settings-section card">
        <h3 class="settings-section-title">Notifications</h3>

        <div class="setting-row">
          <div class="setting-info">
            <span class="setting-label">Sound effects</span>
            <span class="setting-description">Play sounds when timer completes</span>
          </div>
          <div class="setting-control">
            <label class="toggle">
              <input type="checkbox" id="setting-sound" ${settings.soundEnabled ? 'checked' : ''}>
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div class="setting-row">
          <div class="setting-info">
            <span class="setting-label">Browser notifications</span>
            <span class="setting-description">Show notifications when timer completes</span>
          </div>
          <div class="setting-control">
            <label class="toggle">
              <input type="checkbox" id="setting-notifications" ${settings.notificationsEnabled ? 'checked' : ''}>
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </section>

      <!-- Data -->
      <section class="settings-section card">
        <h3 class="settings-section-title">Data</h3>

        <div class="setting-row">
          <div class="setting-info">
            <span class="setting-label">Export data</span>
            <span class="setting-description">Download all your session data as JSON</span>
          </div>
          <div class="setting-control">
            <button class="btn btn-secondary btn-sm" id="export-data">Export</button>
          </div>
        </div>
      </section>

      <!-- Account -->
      <section class="settings-section card">
        <h3 class="settings-section-title">Account</h3>

        <div class="setting-row">
          <div class="setting-info">
            <span class="setting-label">Signed in as</span>
            <span class="setting-description">${state.user?.email || 'Not signed in'}</span>
          </div>
          <div class="setting-control">
            <button class="btn btn-secondary btn-sm" id="sign-out-btn">Sign out</button>
          </div>
        </div>
      </section>

      <!-- About -->
      <section class="settings-section card">
        <h3 class="settings-section-title">About</h3>
        <p class="about-text">
          Focus is a productivity tracker inspired by Rize, designed with the
          "Ink & Paper" aesthetic. Track your focused work sessions, set goals,
          and build better work habits.
        </p>
        <p class="about-version">Version 1.0.0</p>
      </section>
    </div>

    <style>
      .settings-page {
        max-width: 600px;
      }

      .settings-section {
        margin-bottom: var(--space-6);
      }

      .settings-section-title {
        font-family: var(--font-serif);
        font-size: var(--text-lg);
        margin-bottom: var(--space-5);
        padding-bottom: var(--space-3);
        border-bottom: 1px solid var(--paper-shadow);
      }

      .setting-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--space-4) 0;
        border-bottom: 1px dashed var(--paper-shadow);
      }

      .setting-row:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }

      .setting-row:first-of-type {
        padding-top: 0;
      }

      .setting-info {
        flex: 1;
      }

      .setting-label {
        display: block;
        font-weight: 500;
        margin-bottom: var(--space-1);
      }

      .setting-description {
        display: block;
        font-size: var(--text-sm);
        color: var(--ink-faded);
      }

      .setting-control {
        flex-shrink: 0;
        margin-left: var(--space-4);
      }

      .setting-control select {
        min-width: 100px;
      }

      /* Toggle switch */
      .toggle {
        position: relative;
        display: inline-block;
        width: 48px;
        height: 26px;
      }

      .toggle input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .toggle-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: var(--ink-wash);
        border-radius: 26px;
        transition: all var(--transition-fast);
      }

      .toggle-slider::before {
        position: absolute;
        content: "";
        height: 20px;
        width: 20px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        border-radius: 50%;
        transition: all var(--transition-fast);
        box-shadow: var(--shadow-sm);
      }

      .toggle input:checked + .toggle-slider {
        background-color: var(--shu);
      }

      .toggle input:checked + .toggle-slider::before {
        transform: translateX(22px);
      }

      .toggle input:focus + .toggle-slider {
        box-shadow: 0 0 0 3px var(--shu-fade);
      }

      .about-text {
        color: var(--ink-muted);
        line-height: 1.6;
        margin-bottom: var(--space-3);
      }

      .about-version {
        font-size: var(--text-sm);
        color: var(--ink-faded);
        font-family: var(--font-mono);
      }
    </style>
  `;

  // Event listeners
  document.getElementById('setting-work-duration')?.addEventListener('change', (e) => {
    const value = parseInt(e.target.value);
    store.setState({
      settings: { defaultWorkDuration: value },
      timer: {
        duration: value * 60,
        remaining: store.getState().timer.isRunning ? store.getState().timer.remaining : value * 60
      }
    });
  });

  document.getElementById('setting-break-duration')?.addEventListener('change', (e) => {
    store.setState({ settings: { defaultBreakDuration: parseInt(e.target.value) } });
  });

  document.getElementById('setting-sound')?.addEventListener('change', (e) => {
    store.setState({ settings: { soundEnabled: e.target.checked } });
  });

  document.getElementById('setting-notifications')?.addEventListener('change', async (e) => {
    if (e.target.checked) {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        e.target.checked = false;
        return;
      }
    }
    store.setState({ settings: { notificationsEnabled: e.target.checked } });
  });

  document.getElementById('export-data')?.addEventListener('click', () => {
    const state = store.getState();
    const data = {
      sessions: state.sessions,
      goals: state.goals,
      streak: state.streak,
      settings: state.settings,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focus-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('sign-out-btn')?.addEventListener('click', async () => {
    const { logOut } = await import('../services/auth.js');
    await logOut();
  });
}
