Online Examination Portal
A full-featured Online Examination Portal built with React 19 and Vite, supporting separate Student and Admin experiences: account registration with admin approval, exam creation (MCQ + auto-graded coding questions), a timed exam-taking interface with an in-browser code runner, results with per-question breakdowns, and a personal study-notes tool. Data is persisted client-side via localStorage.
The UI follows a premium SaaS design system (Inter typography, indigo/violet palette, soft shadows, glassmorphism sidebar, light/dark theme) inspired by products like Linear, Vercel, and Notion.
✨ Features
Student
Register / sign in (accounts require admin approval before first login)
Browse available exams with open / upcoming / expired status
Take timed exams: multiple-choice questions and coding questions with a live code editor, custom stdin, and "Run Code" test execution
Auto-graded submissions with a detailed results breakdown (per-question pass/fail, test case results)
Personal Study Notes: create, edit, delete (with undo), search, and import/export as JSON
Light / dark theme toggle (persisted)
Admin
Dashboard overview with exam / student / submission stats
Create and edit exams (title, open/close dates, mixed MCQ + coding questions)
Import ready-made coding problems from a built-in question bank, or write your own with custom test cases and allowed languages
Approve pending student registrations
Review recent submissions
🛠 Tech Stack
React 19 + React Router 7
Vite (dev server & build)
react-icons for iconography
Plain CSS with CSS custom properties (no CSS framework) — see style.css
localStorage as the persistence layer (no backend required)
🚀 Getting Started
# install dependencies
npm install

# start the dev server
npm run dev

# build for production
npm run build

# preview the production build locally
npm run preview
The dev server runs on the port Vite assigns (typically http://localhost:5173).
📁 Project Structure
├── index.html              Vite HTML entry point
├── main.jsx                 App root: router and route definitions
├── index.jsx                Login / registration portal (student + admin)
├── admin.jsx                 Admin console (overview, exams, approvals, submissions)
├── student-dashboard.jsx     Student dashboard (home, exams, results, notes)
├── take-exam.jsx             Timed exam-taking screen + code runner UI
├── ExamDetails.jsx           Exam details / pre-start screen
├── StudyNotes.jsx            Student study notes tool
├── NotFound.jsx               404 page
├── useTheme.js                Light/dark theme hook (persists to localStorage)
├── localData.js               localStorage-backed data access (users, exams, results)
├── questionBank.js            Built-in coding question bank
├── codeRunner.js               In-browser code execution / test case runner
├── style.css                   Global styles + design system
└── vite.config.js
🎨 Design System Notes
All custom design tokens live at the top of style.css as CSS variables (--primary, --surface, --border, --radius-*, --shadow-*, etc.) and automatically swap when [data-theme="dark"] is set on <html> by useTheme.js. Component class names were preserved as-is throughout the redesign — no files, components, functions, or routes were renamed.
⚠️ Deployment Notes
style.css imports the Inter font via @import on the first line of the file — CSS requires @import statements to precede all other rules (only @charset may come first). Keep any future edits above that line.
Only one export const useTheme should exist in useTheme.js. If your build reports a "Duplicated export" error for useTheme, check that the committed file doesn't contain leftover duplicate copies of the hook.
📄 License
No license specified.
