// Simple state management store
class Store {
  constructor() {
    this.state = {
      user: null,
      sessions: [],
      categories: [],
      goals: {
        daily: 240, // 4 hours in minutes
        weekly: 1200 // 20 hours in minutes
      },
      streak: {
        current: 0,
        longest: 0,
        lastActiveDate: null
      },
      settings: {
        defaultWorkDuration: 25,
        defaultBreakDuration: 5,
        soundEnabled: true,
        notificationsEnabled: false
      },
      // Active timer state
      timer: {
        isRunning: false,
        isPaused: false,
        mode: 'focus', // 'focus' or 'break'
        sessionType: 'deep-work', // 'deep-work', 'shallow-work', 'meeting'
        duration: 25 * 60, // seconds
        remaining: 25 * 60, // seconds
        categoryId: null,
        note: '',
        startTime: null
      },
      // UI state
      ui: {
        currentPage: 'dashboard',
        sidebarOpen: false,
        loading: true
      }
    };

    this.listeners = new Set();
  }

  getState() {
    return this.state;
  }

  setState(updates) {
    this.state = this.deepMerge(this.state, updates);
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  deepMerge(target, source) {
    const result = { ...target };
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }

  // Timer helpers
  setTimerRunning(running) {
    this.setState({ timer: { isRunning: running, isPaused: !running && this.state.timer.remaining < this.state.timer.duration } });
  }

  setTimerRemaining(seconds) {
    this.setState({ timer: { remaining: seconds } });
  }

  resetTimer() {
    const duration = this.state.timer.mode === 'focus'
      ? this.state.settings.defaultWorkDuration * 60
      : this.state.settings.defaultBreakDuration * 60;

    this.setState({
      timer: {
        isRunning: false,
        isPaused: false,
        duration: duration,
        remaining: duration,
        startTime: null
      }
    });
  }

  // Get today's stats
  getTodayStats() {
    const today = new Date().toDateString();
    const todaySessions = this.state.sessions.filter(s =>
      new Date(s.startTime).toDateString() === today && s.type === 'focus'
    );

    const totalSeconds = todaySessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const totalMinutes = Math.floor(totalSeconds / 60);

    return {
      sessions: todaySessions,
      totalMinutes,
      totalSeconds,
      sessionCount: todaySessions.length,
      goalProgress: Math.min(100, (totalMinutes / this.state.goals.daily) * 100)
    };
  }

  // Calculate focus score (0-100)
  getFocusScore() {
    const stats = this.getTodayStats();
    const goalProgress = stats.goalProgress;
    const sessionCount = Math.min(stats.sessionCount * 10, 30); // up to 30 points for sessions
    const streakBonus = Math.min(this.state.streak.current * 2, 20); // up to 20 points for streak

    return Math.min(100, Math.round(goalProgress * 0.5 + sessionCount + streakBonus));
  }
}

export const store = new Store();
export default store;
