// Personal Dashboard app
(function () {
  'use strict';

  // ============================================================
  // localStorage availability check
  // ============================================================
  var storageAvailable = true;
  try {
    localStorage.setItem('__test__', '1');
    localStorage.removeItem('__test__');
  } catch (e) {
    storageAvailable = false;
    console.warn('localStorage is unavailable; data will not persist this session.');
  }

  document.addEventListener('DOMContentLoaded', function () {

    // ============================================================
    // Theme Toggle
    // ============================================================

    function applyTheme(theme) {
      document.body.setAttribute('data-theme', theme);
      if (storageAvailable) {
        localStorage.setItem('theme', theme);
      }
      var btn = document.getElementById('theme-toggle');
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
      var current = document.body.getAttribute('data-theme') || 'light';
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
      if (storageAvailable) {
        localStorage.setItem('userName', trimmed);
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

    // ============================================================
    // Focus Timer
    // ============================================================

    // Pure helper — converts total seconds to zero-padded "MM:SS"
    function formatTimerDisplay(seconds) {
      var mm = String(Math.floor(seconds / 60)).padStart(2, '0');
      var ss = String(seconds % 60).padStart(2, '0');
      return mm + ':' + ss;
    }

    // Timer state
    var remaining = 1500;
    var running = false;
    var intervalId = null;

    function startTimer() {
      if (running) return;
      running = true;
      var startBtn = document.getElementById('timer-start');
      if (startBtn) startBtn.disabled = true;
      intervalId = setInterval(tickTimer, 1000);
    }

    function stopTimer() {
      clearInterval(intervalId);
      intervalId = null;
      running = false;
      var startBtn = document.getElementById('timer-start');
      if (startBtn) startBtn.disabled = false;
    }

    function resetTimer() {
      stopTimer();
      remaining = 1500;
      var display = document.getElementById('timer-display');
      if (display) display.textContent = formatTimerDisplay(remaining);
    }

    function tickTimer() {
      if (remaining === 0) return; // defensive guard
      remaining -= 1;
      var display = document.getElementById('timer-display');
      if (display) display.textContent = formatTimerDisplay(remaining);
      if (remaining === 0) onTimerComplete();
    }

    function onTimerComplete() {
      stopTimer();
      alert('Focus session complete!');
    }

    // Wire up timer buttons
    var timerStartBtn = document.getElementById('timer-start');
    var timerStopBtn = document.getElementById('timer-stop');
    var timerResetBtn = document.getElementById('timer-reset');

    if (timerStartBtn) timerStartBtn.addEventListener('click', startTimer);
    if (timerStopBtn) timerStopBtn.addEventListener('click', stopTimer);
    if (timerResetBtn) timerResetBtn.addEventListener('click', resetTimer);

    // Initialize display to "25:00"
    var timerDisplay = document.getElementById('timer-display');
    if (timerDisplay) timerDisplay.textContent = formatTimerDisplay(remaining);

    // ============================================================
    // To-Do List
    // ============================================================

    // In-memory task array
    var tasks = [];

    // --- Data layer ---

    function persistTasks() {
      if (!storageAvailable) return;
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
      try {
        var raw = localStorage.getItem('tasks');
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    }

    // Pure: checks tasks[] for a case-insensitive match on incomplete tasks only
    function isDuplicate(text) {
      var lower = text.trim().toLowerCase();
      return tasks.some(function (t) {
        return !t.completed && t.text.toLowerCase() === lower;
      });
    }

    // --- CRUD operations ---

    function addTask(text) {
      var trimmed = text.trim();
      var warningEl = document.getElementById('todo-duplicate-warning');

      if (!trimmed) {
        if (warningEl) warningEl.textContent = 'Task cannot be empty';
        return;
      }

      if (isDuplicate(trimmed)) {
        if (warningEl) warningEl.textContent = 'Task already exists';
        return;
      }

      if (warningEl) warningEl.textContent = '';

      tasks.push({ id: 't_' + Date.now(), text: trimmed, completed: false });
      persistTasks();
      renderTasks();
    }

    function deleteTask(id) {
      tasks = tasks.filter(function (t) { return t.id !== id; });
      persistTasks();
      renderTasks();
    }

    function toggleTask(id) {
      tasks = tasks.map(function (t) {
        return t.id === id ? { id: t.id, text: t.text, completed: !t.completed } : t;
      });
      persistTasks();
      renderTasks();
    }

    function editTask(id, newText) {
      tasks = tasks.map(function (t) {
        return t.id === id ? { id: t.id, text: newText, completed: t.completed } : t;
      });
      persistTasks();
      renderTasks();
    }

    // --- Render ---

    function renderTasks() {
      var ul = document.getElementById('todo-list');
      if (!ul) return;
      ul.innerHTML = '';

      tasks.forEach(function (task) {
        var li = document.createElement('li');
        if (task.completed) li.classList.add('completed');

        // Toggle button
        var toggleBtn = document.createElement('button');
        toggleBtn.className = 'icon-btn';
        toggleBtn.setAttribute('aria-label', task.completed ? 'Mark incomplete' : 'Mark complete');
        toggleBtn.setAttribute('data-action', 'toggle');
        toggleBtn.setAttribute('data-id', task.id);
        toggleBtn.textContent = task.completed ? '✓' : '○';

        // Text span
        var span = document.createElement('span');
        span.textContent = task.text;

        // Edit button
        var editBtn = document.createElement('button');
        editBtn.className = 'icon-btn';
        editBtn.setAttribute('aria-label', 'Edit task');
        editBtn.setAttribute('data-action', 'edit');
        editBtn.setAttribute('data-id', task.id);
        editBtn.textContent = '✏️';

        // Delete button
        var deleteBtn = document.createElement('button');
        deleteBtn.className = 'icon-btn';
        deleteBtn.setAttribute('aria-label', 'Delete task');
        deleteBtn.setAttribute('data-action', 'delete');
        deleteBtn.setAttribute('data-id', task.id);
        deleteBtn.textContent = '🗑️';

        li.appendChild(toggleBtn);
        li.appendChild(span);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        ul.appendChild(li);
      });
    }

    // --- Event delegation on #todo-list ---

    var todoList = document.getElementById('todo-list');
    if (todoList) {
      todoList.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-action]');
        if (!btn) return;

        var action = btn.getAttribute('data-action');
        var id = btn.getAttribute('data-id');

        if (action === 'toggle') {
          toggleTask(id);
        } else if (action === 'delete') {
          deleteTask(id);
        } else if (action === 'edit') {
          var li = btn.closest('li');
          var span = li.querySelector('span');
          if (!span || li.querySelector('input.edit-input')) return; // already editing

          var input = document.createElement('input');
          input.type = 'text';
          input.className = 'edit-input';
          input.value = span.textContent;
          li.replaceChild(input, span);
          input.focus();

          function confirmEdit() {
            var newText = input.value.trim();
            if (newText) {
              editTask(id, newText);
            } else {
              renderTasks(); // revert if empty
            }
          }

          input.addEventListener('keydown', function (ev) {
            if (ev.key === 'Enter') confirmEdit();
            if (ev.key === 'Escape') renderTasks();
          });

          input.addEventListener('blur', confirmEdit);
        }
      });
    }

    // --- Wire #todo-add and Enter on #todo-input ---

    var todoInput = document.getElementById('todo-input');
    var todoAddBtn = document.getElementById('todo-add');

    if (todoAddBtn) {
      todoAddBtn.addEventListener('click', function () {
        if (todoInput) {
          addTask(todoInput.value);
          todoInput.value = '';
        }
      });
    }

    if (todoInput) {
      todoInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          addTask(todoInput.value);
          todoInput.value = '';
        }
      });

      // Clear warning when input is focused
      todoInput.addEventListener('focus', function () {
        var warningEl = document.getElementById('todo-duplicate-warning');
        if (warningEl) warningEl.textContent = '';
      });
    }

    // --- Init: load persisted tasks and render ---
    tasks = loadTasks();
    renderTasks();

    // ============================================================
    // Quick Links
    // ============================================================

    // In-memory links array
    var links = [];

    // --- Data layer ---

    function persistLinks() {
      if (!storageAvailable) return;
      localStorage.setItem('links', JSON.stringify(links));
    }

    function loadLinks() {
      try {
        var raw = localStorage.getItem('links');
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    }

    // Pure: prepends "https://" if URL has no http(s):// prefix
    function normalizeUrl(url) {
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
      }
      return 'https://' + url;
    }

    // --- CRUD operations ---

    function addLink(label, url) {
      var trimmedLabel = label.trim();
      var trimmedUrl = url.trim();
      var validationEl = document.getElementById('link-validation-msg');

      if (!trimmedLabel || !trimmedUrl) {
        if (validationEl) validationEl.textContent = 'Label and URL are required';
        return;
      }

      if (validationEl) validationEl.textContent = '';

      var normalizedUrl = normalizeUrl(trimmedUrl);
      links.push({ id: 'l_' + Date.now(), label: trimmedLabel, url: normalizedUrl });
      persistLinks();
      renderLinks();
    }

    function deleteLink(id) {
      links = links.filter(function (l) { return l.id !== id; });
      persistLinks();
      renderLinks();
    }

    // --- Render ---

    function renderLinks() {
      var container = document.getElementById('links-container');
      if (!container) return;
      container.innerHTML = '';

      links.forEach(function (link) {
        var linkBtn = document.createElement('button');
        linkBtn.className = 'link-btn';
        linkBtn.textContent = link.label;
        linkBtn.setAttribute('data-action', 'link-open');
        linkBtn.setAttribute('data-url', link.url);

        var deleteBtn = document.createElement('button');
        deleteBtn.className = 'link-delete';
        deleteBtn.setAttribute('data-action', 'link-delete');
        deleteBtn.setAttribute('data-id', link.id);
        deleteBtn.textContent = '🗑️';
        deleteBtn.setAttribute('aria-label', 'Delete link ' + link.label);

        container.appendChild(linkBtn);
        container.appendChild(deleteBtn);
      });
    }

    // --- Event delegation on #links-container ---

    var linksContainer = document.getElementById('links-container');
    if (linksContainer) {
      linksContainer.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-action]');
        if (!btn) return;

        var action = btn.getAttribute('data-action');

        if (action === 'link-open') {
          window.open(btn.getAttribute('data-url'), '_blank');
        } else if (action === 'link-delete') {
          deleteLink(btn.getAttribute('data-id'));
        }
      });
    }

    // --- Wire #link-add click ---

    var linkAddBtn = document.getElementById('link-add');
    var linkLabelInput = document.getElementById('link-label-input');
    var linkUrlInput = document.getElementById('link-url-input');

    if (linkAddBtn) {
      linkAddBtn.addEventListener('click', function () {
        addLink(
          linkLabelInput ? linkLabelInput.value : '',
          linkUrlInput ? linkUrlInput.value : ''
        );
        if (linkLabelInput) linkLabelInput.value = '';
        if (linkUrlInput) linkUrlInput.value = '';
      });
    }

    // Clear validation message when either input is focused
    if (linkLabelInput) {
      linkLabelInput.addEventListener('focus', function () {
        var validationEl = document.getElementById('link-validation-msg');
        if (validationEl) validationEl.textContent = '';
      });
    }

    if (linkUrlInput) {
      linkUrlInput.addEventListener('focus', function () {
        var validationEl = document.getElementById('link-validation-msg');
        if (validationEl) validationEl.textContent = '';
      });
    }

    // --- Init: load persisted links and render ---
    links = loadLinks();
    renderLinks();

  });
})();
