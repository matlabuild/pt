// Simple hash-based router
class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;

    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());
  }

  register(path, handler) {
    this.routes[path] = handler;
  }

  navigate(path) {
    window.location.hash = path;
  }

  handleRoute() {
    const hash = window.location.hash || '#/';
    const path = hash.slice(1) || '/';

    // Find matching route
    let handler = this.routes[path];

    // If no exact match, try to find a partial match
    if (!handler) {
      for (const route in this.routes) {
        if (path.startsWith(route)) {
          handler = this.routes[route];
          break;
        }
      }
    }

    // Default to dashboard
    if (!handler) {
      handler = this.routes['/'];
    }

    if (handler) {
      this.currentRoute = path;
      handler(path);
    }

    // Update active nav item
    this.updateActiveNav(path);
  }

  updateActiveNav(path) {
    const navItems = document.querySelectorAll('.nav-item');
    const pageName = path.slice(1) || 'dashboard';

    navItems.forEach(item => {
      const itemPage = item.dataset.page;
      if (itemPage === pageName || (pageName === '' && itemPage === 'dashboard')) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }
}

export const router = new Router();
export default router;
