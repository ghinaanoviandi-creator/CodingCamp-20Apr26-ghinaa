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
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (e) {
      console.warn('localStorage unavailable; tasks will not persist.');
    }
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

});
