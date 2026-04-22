# Implementation Plan: Personal Dashboard

## Overview

Implement a single-page personal dashboard using vanilla HTML, CSS, and JavaScript. The app opens directly in a browser (`index.html`), uses `localStorage` for all persistence, and is structured as exactly three files: `index.html`, `css/style.css`, and `js/app.js`.

## Tasks

- [ ] 1. Scaffold project structure and base HTML
  - Create `index.html` with semantic markup for all four widget sections: Greeting, Focus Timer, To-Do List, Quick Links
  - Add `<link>` to `css/style.css` and `<script defer>` to `js/app.js`
  - Include all required DOM element IDs: `#clock`, `#date`, `#greeting`, `#name-input`, `#name-save`, `#timer-display`, `#timer-start`, `#timer-stop`, `#timer-reset`, `#todo-input`, `#todo-add`, `#todo-list`, `#todo-duplicate-warning`, `#link-label-input`, `#link-url-input`, `#link-add`, `#links-container`, `#link-validation-msg`, `#theme-toggle`
  - Create empty `css/style.css` and `js/app.js` placeholder files
  - _Requirements: 6.1, 6.2, 6.3_

- [ ] 2. Implement CSS theming and base styles
  - [ ] 2.1 Define CSS custom properties for light and dark themes
    - Write `:root` block with `--bg`, `--surface`, `--text`, `--accent`, `--border` variables for light theme
    - Write `[data-theme="dark"]` override block with dark-mode values
    - Add base layout styles: body, widget cards, inputs, buttons using the custom properties
    - _Requirements: 5.1, 5.4, 6.2_

- [ ] 3. Implement theme toggle
  - [ ] 3.1 Write `applyTheme(theme)` and `loadTheme()` functions in `js/app.js`
    - `applyTheme` sets `data-theme` attribute on `<body>` and writes to `localStorage` key `"theme"`
    - `loadTheme` reads `localStorage` key `"theme"`, defaults to `"light"`
    - Wire `#theme-toggle` click handler to flip between `"light"` and `"dark"` and call `applyTheme`
    - Call `applyTheme(loadTheme())` on `DOMContentLoaded`
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [ ]* 3.2 Write property test for theme persistence round-trip
    - **Property 17: Theme persistence round-trip**
    - **Validates: Requirements 5.2, 5.3**

- [ ] 4. Implement Greeting Widget and User Name
  - [ ] 4.1 Write pure helper functions: `formatTime(date)`, `formatDate(date)`, `getGreetingPhrase(hour)`
    - `formatTime` returns zero-padded `"HH:MM"` string
    - `formatDate` returns full human-readable date string (e.g., `"Monday, April 26, 2025"`)
    - `getGreetingPhrase` maps hour [0–23] to the correct greeting phrase per requirements 1.3–1.6
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

  - [ ]* 4.2 Write property test for `formatTime`
    - **Property 1: Time formatting produces valid HH:MM strings**
    - **Validates: Requirements 1.1**

  - [ ]* 4.3 Write property test for `formatDate`
    - **Property 2: Date formatting includes correct weekday, month, day, and year**
    - **Validates: Requirements 1.2**

  - [ ]* 4.4 Write property test for `getGreetingPhrase`
    - **Property 3: Greeting phrase covers all 24 hours correctly**
    - **Validates: Requirements 1.3, 1.4, 1.5, 1.6**

  - [ ] 4.5 Write `updateClock()`, `saveName(name)`, `loadName()` and wire them up
    - `updateClock` reads current `Date`, updates `#clock`, `#date`, `#greeting` (appending name when present)
    - `saveName` trims input, writes to `localStorage` key `"userName"`, calls `updateClock()`
    - `loadName` reads `localStorage` key `"userName"`, returns string or `""`
    - Wire `#name-save` click to `saveName`; call `updateClock()` immediately on load; start `setInterval(updateClock, 60000)`
    - _Requirements: 1.1, 1.2, 1.7, 1.8, 1.9_

  - [ ]* 4.6 Write property test for greeting name inclusion/omission
    - **Property 4: Greeting includes name when present, omits it when absent**
    - **Validates: Requirements 1.7, 1.8**

  - [ ]* 4.7 Write property test for user name persistence round-trip
    - **Property 5: User name persistence round-trip**
    - **Validates: Requirements 1.9**

- [ ] 5. Checkpoint — Greeting and theme working
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement Focus Timer
  - [ ] 6.1 Write `formatTimerDisplay(seconds)` pure function
    - Returns zero-padded `"MM:SS"` string for any integer seconds in [0, 1500]
    - _Requirements: 2.3_

  - [ ]* 6.2 Write property test for `formatTimerDisplay`
    - **Property 6: Timer display formatting produces valid MM:SS strings**
    - **Validates: Requirements 2.3**

  - [ ] 6.3 Implement timer state and control functions
    - Declare module-level variables: `remaining = 1500`, `running = false`, `intervalId = null`
    - Write `startTimer()`: sets `running = true`, disables `#timer-start`, starts `setInterval(tickTimer, 1000)`
    - Write `stopTimer()`: clears interval, sets `running = false`, re-enables `#timer-start`
    - Write `resetTimer()`: calls `stopTimer()`, sets `remaining = 1500`, updates display
    - Write `tickTimer()`: decrements `remaining`, updates `#timer-display`; if `remaining === 0` calls `onTimerComplete()`
    - Write `onTimerComplete()`: calls `stopTimer()`, shows `alert("Focus session complete!")`
    - Wire `#timer-start`, `#timer-stop`, `#timer-reset` click handlers; initialize display to `"25:00"` on load
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

- [ ] 7. Implement To-Do List
  - [ ] 7.1 Write `isDuplicate(text)` pure function and data-layer functions
    - `isDuplicate(text)` checks in-memory `tasks[]` for a case-insensitive match on incomplete tasks
    - Write `persistTasks()`: `JSON.stringify(tasks)` → `localStorage` key `"tasks"`
    - Write `loadTasks()`: `JSON.parse` from `localStorage` key `"tasks"`, returns array (default `[]`)
    - _Requirements: 3.2, 3.7_

  - [ ]* 7.2 Write property test for `isDuplicate` case-insensitivity
    - **Property 8: Duplicate detection is case-insensitive**
    - **Validates: Requirements 3.2**

  - [ ]* 7.3 Write property test for task list serialization round-trip
    - **Property 12: Task list serialization round-trip**
    - **Validates: Requirements 3.7**

  - [ ] 7.4 Implement `addTask(text)`, `deleteTask(id)`, `toggleTask(id)`, `editTask(id, newText)`
    - `addTask`: trims text, rejects empty/whitespace (req 3.8) and duplicates (req 3.2), pushes `{id, text, completed: false}`, persists, renders
    - `deleteTask`: filters `tasks[]` by id, persists, renders
    - `toggleTask`: flips `completed` on matching task, persists, renders
    - `editTask`: updates `text` on matching task, persists, renders
    - IDs generated as `"t_" + Date.now()`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.8_

  - [ ]* 7.5 Write property test for `addTask` growing the list
    - **Property 7: Adding a valid task grows the list and persists it**
    - **Validates: Requirements 3.1**

  - [ ]* 7.6 Write property test for whitespace-only task rejection
    - **Property 13: Whitespace-only task submissions are rejected**
    - **Validates: Requirements 3.8**

  - [ ]* 7.7 Write property test for `editTask` persistence
    - **Property 9: Task edit updates text and persists**
    - **Validates: Requirements 3.4**

  - [ ]* 7.8 Write property test for `toggleTask` involution
    - **Property 10: Task completion toggle is an involution**
    - **Validates: Requirements 3.5**

  - [ ]* 7.9 Write property test for `deleteTask` removal
    - **Property 11: Task deletion removes task and persists**
    - **Validates: Requirements 3.6**

  - [ ] 7.10 Implement `renderTasks()` and wire up DOM interactions
    - `renderTasks` rebuilds `#todo-list` `<ul>` from `tasks[]`; each item has complete, edit, and delete controls
    - Wire `#todo-add` click and Enter keypress on `#todo-input` to `addTask`
    - Use event delegation on `#todo-list` for complete/edit/delete actions
    - Show/clear `#todo-duplicate-warning` on validation errors; clear on input focus
    - Call `loadTasks()` then `renderTasks()` on `DOMContentLoaded`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [ ] 8. Checkpoint — Timer and To-Do List working
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Implement Quick Links
  - [ ] 9.1 Write `normalizeUrl(url)` pure function and data-layer functions
    - `normalizeUrl`: prepends `"https://"` if URL does not start with `"http://"` or `"https://"`, otherwise returns unchanged
    - Write `persistLinks()`: `JSON.stringify(links)` → `localStorage` key `"links"`
    - Write `loadLinks()`: `JSON.parse` from `localStorage` key `"links"`, returns array (default `[]`)
    - _Requirements: 4.4, 4.6_

  - [ ]* 9.2 Write property test for `normalizeUrl`
    - **Property 14: URL normalization prepends https:// when no protocol present**
    - **Validates: Requirements 4.6**

  - [ ]* 9.3 Write property test for link list serialization round-trip
    - **Property 15: Link list serialization round-trip**
    - **Validates: Requirements 4.4**

  - [ ] 9.4 Implement `addLink(label, url)`, `deleteLink(id)`, `renderLinks()` and wire up DOM
    - `addLink`: trims label and url, rejects if either is empty (shows `#link-validation-msg`), calls `normalizeUrl`, pushes `{id, label, url}`, persists, renders
    - `deleteLink`: filters `links[]` by id, persists, renders
    - `renderLinks`: rebuilds `#links-container` from `links[]`; each link is a button opening URL in new tab, plus a delete control
    - Wire `#link-add` click to `addLink`; use event delegation on `#links-container` for delete and link-open actions
    - Clear `#link-validation-msg` on input focus; call `loadLinks()` then `renderLinks()` on `DOMContentLoaded`
    - IDs generated as `"l_" + Date.now()`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [ ]* 9.5 Write property test for invalid link rejection
    - **Property 16: Invalid link submissions are rejected**
    - **Validates: Requirements 4.5**

- [ ] 10. Wrap `app.js` in IIFE and add `localStorage` error handling
  - Wrap all code in an IIFE `(function() { ... })()` so no globals are leaked
  - Wrap all `localStorage` reads and writes in try/catch; on failure emit a one-time `console.warn` and continue in-memory
  - _Requirements: 6.2, 6.3_

- [ ] 11. Final checkpoint — Full integration
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Property tests use [fast-check](https://github.com/dubzzz/fast-check) with a `mockStorage` shim for `localStorage`-dependent properties
- No test setup is required to ship the app (NFR-1); tests are purely additive
