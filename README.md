# Ngoms AI — Premium AI Education Platform

Learn Smarter. Not Harder.

## Tech Stack
- React 18 + Vite + Tailwind CSS
- Firebase (Firestore, Auth, Storage) — APK backend
- Base44 API — Web backend
- Capacitor — Android APK wrapper
- Recharts — Analytics charts

## Project Structure
```
src/
  App.jsx              # Routes + maintenance gate
  main.jsx             # Entry point
  context/
    AppContext.jsx     # Global state + CRUD + user
  lib/
    firebase.js        # Firebase config
    firebaseApi.js     # API layer (Firebase + Base44)
    seedData.js        # First-run Firestore seeding
  pages/
    Dashboard.jsx      # Home with stats, streak, courses
    ChatTutor.jsx      # AI chat with quick prompts
    Flashcards.jsx     # Deck creation + spaced repetition study
    QuizEngine.jsx     # AI + stored quizzes with scoring
    Documents.jsx      # Study material library
    SmartNotes.jsx     # AI-generated notes (3 formats)
    StudyPlanner.jsx   # Calendar + study sessions
    Analytics.jsx      # Progress charts and stats
    Leaderboard.jsx    # Top learners with badges
    Profile.jsx        # User profile + achievements
    Settings.jsx       # 7 settings sections
    Notifications.jsx   # Announcements + notifications
    Onboarding.jsx     # Welcome flow
    SplashScreen.jsx   # App launch screen
  components/
    layout/
      Layout.jsx       # Desktop sidebar + mobile bottom nav
  styles/
    globals.css       # Dark theme + glassmorphism + utilities
```

## Development
```bash
npm install
npm run dev      # Start dev server
npm run build    # Production build
```

## Firebase Setup
1. Project: ngoms-ai-edfa5
2. Enable: Email/Password + Anonymous auth
3. Deploy firestore.rules to Firestore

## APK Build
Add `.github/workflows/build-apk.yml` to trigger APK builds via GitHub Actions.
See APK_BUILD_INSTRUCTIONS.md for the workflow file content.

## Design System
- Base: #0A0F1E (dark navy)
- Glassmorphism: backdrop-blur + translucent surfaces
- Primary: #3B82F6 (blue)
- Accent: #7C3AED (violet)
- Cards: glass class with rounded-2xl/3xl
