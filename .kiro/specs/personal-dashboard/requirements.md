# Requirements Document

## Introduction

A personal dashboard web app built with vanilla HTML, CSS, and JavaScript. It runs entirely in the browser with no backend, using Local Storage for persistence. The dashboard provides a greeting with time/date, a focus timer, a to-do list, and quick links — all in a clean, minimal interface with light/dark mode support and a customizable user name.

## Glossary

- **Dashboard**: The single-page web application that hosts all widgets.
- **Greeting_Widget**: The component that displays the current time, date, and a time-based greeting with the user's name.
- **Focus_Timer**: The countdown timer component set to 25 minutes.
- **Todo_List**: The component that manages the user's task items.
- **Task**: A single to-do item with a text label and a completion state.
- **Quick_Links**: The component that displays user-defined shortcut buttons to external URLs.
- **Link**: A single quick-link entry consisting of a label and a URL.
- **Local_Storage**: The browser's `localStorage` API used for client-side data persistence.
- **Theme**: The visual color scheme of the Dashboard, either light or dark.
- **User_Name**: A custom name entered by the user, displayed in the greeting.

---

## Requirements

### Requirement 1: Greeting Widget

**User Story:** As a user, I want to see the current time, date, and a personalized greeting, so that I feel welcomed and oriented when I open the dashboard.

#### Acceptance Criteria

1. THE Greeting_Widget SHALL display the current time in HH:MM format, updated every minute.
2. THE Greeting_Widget SHALL display the current date in a human-readable format (e.g., "Monday, April 26, 2025").
3. WHEN the current hour is between 05:00 and 11:59, THE Greeting_Widget SHALL display "Good Morning".
4. WHEN the current hour is between 12:00 and 17:59, THE Greeting_Widget SHALL display "Good Afternoon".
5. WHEN the current hour is between 18:00 and 21:59, THE Greeting_Widget SHALL display "Good Evening".
6. WHEN the current hour is between 22:00 and 04:59, THE Greeting_Widget SHALL display "Good Night".
7. WHEN a User_Name has been saved, THE Greeting_Widget SHALL append the User_Name to the greeting message.
8. WHEN no User_Name has been saved, THE Greeting_Widget SHALL display the greeting without a name.
9. WHEN the user submits a new User_Name, THE Dashboard SHALL save the User_Name to Local_Storage and update the greeting immediately.

---

### Requirement 2: Focus Timer

**User Story:** As a user, I want a 25-minute countdown timer, so that I can track focused work sessions.

#### Acceptance Criteria

1. THE Focus_Timer SHALL initialize with a countdown value of 25 minutes (1500 seconds).
2. WHEN the user activates the start control, THE Focus_Timer SHALL begin counting down one second at a time.
3. WHEN the Focus_Timer is counting down, THE Focus_Timer SHALL display the remaining time in MM:SS format.
4. WHEN the user activates the stop control, THE Focus_Timer SHALL pause the countdown at the current remaining time.
5. WHEN the user activates the reset control, THE Focus_Timer SHALL stop any active countdown and restore the display to 25:00.
6. WHEN the countdown reaches 00:00, THE Focus_Timer SHALL stop automatically and notify the user that the session is complete.
7. WHILE the Focus_Timer is counting down, THE Focus_Timer SHALL disable the start control to prevent duplicate timers.

---

### Requirement 3: To-Do List

**User Story:** As a user, I want to manage a list of tasks, so that I can track what I need to accomplish.

#### Acceptance Criteria

1. WHEN the user submits a new task, THE Todo_List SHALL add the Task to the list and save all tasks to Local_Storage.
2. WHEN the user submits a task whose text exactly matches an existing incomplete Task (case-insensitive), THE Todo_List SHALL reject the submission and display a duplicate warning message.
3. WHEN the user activates the edit control on a Task, THE Todo_List SHALL allow the user to modify the Task's text inline.
4. WHEN the user confirms an edited Task, THE Todo_List SHALL update the Task text and persist the change to Local_Storage.
5. WHEN the user activates the complete control on a Task, THE Todo_List SHALL toggle the Task's completion state and persist the change to Local_Storage.
6. WHEN the user activates the delete control on a Task, THE Todo_List SHALL remove the Task from the list and persist the change to Local_Storage.
7. WHEN the Dashboard loads, THE Todo_List SHALL restore all previously saved tasks from Local_Storage.
8. IF a task submission is empty or contains only whitespace, THEN THE Todo_List SHALL reject the submission without adding a Task.

---

### Requirement 4: Quick Links

**User Story:** As a user, I want to save and access my favorite websites quickly, so that I can navigate to them with a single click.

#### Acceptance Criteria

1. WHEN the user submits a new Link (label and URL), THE Quick_Links SHALL add the Link as a button and save all links to Local_Storage.
2. WHEN the user activates a Link button, THE Dashboard SHALL open the corresponding URL in a new browser tab.
3. WHEN the user activates the delete control on a Link, THE Quick_Links SHALL remove the Link and persist the change to Local_Storage.
4. WHEN the Dashboard loads, THE Quick_Links SHALL restore all previously saved links from Local_Storage.
5. IF a link submission is missing a label or a URL, THEN THE Quick_Links SHALL reject the submission and display a validation message.
6. IF a submitted URL does not begin with "http://" or "https://", THEN THE Quick_Links SHALL prepend "https://" to the URL before saving.

---

### Requirement 5: Light/Dark Mode

**User Story:** As a user, I want to switch between light and dark themes, so that I can use the dashboard comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE Dashboard SHALL provide a toggle control to switch between light and dark Theme.
2. WHEN the user activates the theme toggle, THE Dashboard SHALL switch the active Theme and persist the selection to Local_Storage.
3. WHEN the Dashboard loads, THE Dashboard SHALL restore the previously saved Theme from Local_Storage.
4. WHEN no Theme has been previously saved, THE Dashboard SHALL apply the light Theme by default.

---

### Requirement 6: File and Code Structure

**User Story:** As a developer, I want the project to follow a clean folder structure, so that the codebase is easy to navigate and maintain.

#### Acceptance Criteria

1. THE Dashboard SHALL be implemented using exactly one HTML file, one CSS file located inside a `css/` directory, and one JavaScript file located inside a `js/` directory.
2. THE Dashboard SHALL use only vanilla HTML, CSS, and JavaScript with no external frameworks or libraries.
3. THE Dashboard SHALL require no backend server and SHALL function as a standalone file opened directly in a browser.
4. THE Dashboard SHALL be compatible with current stable versions of Chrome, Firefox, Edge, and Safari.
