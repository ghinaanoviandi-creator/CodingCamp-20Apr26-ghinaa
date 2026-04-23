// Personal Dashboard app

document.addEventListener('DOMContentLoaded', function () {

  // ============================================================
  // Theme Toggle
  // ============================================================

  function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      console.warn('localStorage unavailable; theme will not persist.');
    }
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.textContent = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
    }
  }

  function loadTheme() {
    try {
      return localStorage.getItem('theme') || 'light';
    } catch (e) {
      return 'light';
    }
  }

  document.getElementById('theme-toggle').addEventListener('click', function () {
    const current = document.body.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  // Apply saved (or default) theme on load
  applyTheme(loadTheme());

});
