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

  // ============================================================
  // Greeting Widget — pure helpers
  // ============================================================

  function formatTime(date) {
    var hh = String(date.getHours()).padStart(2, '0');
    var mm = String(date.getMinutes()).padStart(2, '0');
    return hh + ':' + mm;
  }

  function formatDate(date) {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function getGreetingPhrase(hour) {
    if (hour >= 5 && hour <= 11) return 'Good Morning';
    if (hour >= 12 && hour <= 17) return 'Good Afternoon';
    if (hour >= 18 && hour <= 21) return 'Good Evening';
    return 'Good Night';
  }

  // ============================================================
  // User Name
  // ============================================================

  function loadName() {
    try {
      return localStorage.getItem('userName') || '';
    } catch (e) {
      return '';
    }
  }

  function saveName(name) {
    var trimmed = name.trim();
    if (!trimmed) return;
    try {
      localStorage.setItem('userName', trimmed);
    } catch (e) {
      console.warn('localStorage unavailable; name will not persist.');
    }
    updateClock();
  }

  // ============================================================
  // Clock updater
  // ============================================================

  function updateClock() {
    var now = new Date();
    var clockEl = document.getElementById('clock');
    var dateEl = document.getElementById('date');
    var greetingEl = document.getElementById('greeting');

    if (clockEl) clockEl.textContent = formatTime(now);
    if (dateEl) dateEl.textContent = formatDate(now);
    if (greetingEl) {
      var phrase = getGreetingPhrase(now.getHours());
      var name = loadName();
      greetingEl.textContent = name ? phrase + ', ' + name + '!' : phrase;
    }
  }

  // Wire up name save button and Enter key
  var nameSaveBtn = document.getElementById('name-save');
  var nameInput = document.getElementById('name-input');

  if (nameSaveBtn) {
    nameSaveBtn.addEventListener('click', function () {
      saveName(nameInput ? nameInput.value : '');
    });
  }

  if (nameInput) {
    nameInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') saveName(nameInput.value);
    });
  }

  // Initial clock render and start interval
  updateClock();
  setInterval(updateClock, 60000);

});
