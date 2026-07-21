# Ngoms AI — Premium AI Education Platform

> **Learn Smarter. Not Harder.**

Ngoms AI is a full-featured, AI-powered education platform built for students who want to learn faster and retain more. Available as a Progressive Web App (PWA) and Android APK via Capacitor.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?logo=firebase)](https://firebase.google.com)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38BDF8?logo=tailwindcss)](https://tailwindcss.com)
[![Capacitor](https://img.shields.io/badge/Capacitor-8-119EFF?logo=capacitor)](https://capacitorjs.com)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 AI Chat Tutor | Ask questions, get explanations, quick-prompt shortcuts |
| 🃏 Flashcards | Create decks, study with spaced repetition |
| 🧠 Quiz Engine | AI-generated & stored quizzes with scoring |
| 📄 Documents | Study material library (upload & browse) |
| 📝 Smart Notes | AI-generated notes in 3 formats |
| 📅 Study Planner | Calendar + scheduled study sessions |
| 📊 Analytics | Progress charts, streaks, stats |
| 🏆 Leaderboard | Top learners with XP and badges |
| 👤 Profile | Achievements, XP, streak tracking |
| 🔔 Notifications | Announcements + push notifications |
| ⚙️ Settings | 7 settings sections, fully configurable |
| 🔧 Maintenance Mode | Admin-controlled maintenance gate |

---

## 🛠 Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS (dark theme, glassmorphism)
- **Backend (Web):** Base44 API (`ngomsApi` backend function)
- **Backend (APK):** Firebase (Firestore, Auth, Storage)
- **Mobile:** Capacitor → Android APK
- **Charts:** Recharts
- **Icons:** Lucide React
- **Notifications:** react-hot-toast

---

## 📁 Project Structure

```
src/
  App.jsx              # Routes + maintenance gate
  main.jsx             # Entry point
  context/
    AppContext.jsx     # Global state + CRUD + user
  lib/
    firebase.js        # Firebase config
    firebaseApi.js     # API layer (Firebase + Base44 dual-mode)
    seedData.js        # First-run Firestore seeding
  pages/
    Dashboard.jsx      # Home: stats, streak, courses
    ChatTutor.jsx      # AI chat with quick prompts
    Flashcards.jsx     # Deck creation + spaced repetition
    QuizEngine.jsx     # AI + stored quizzes with scoring
    Documents.jsx      # Study material library
    SmartNotes.jsx     # AI-generated notes (3 formats)
    StudyPlanner.jsx   # Calendar + study sessions
    Analytics.jsx      # Progress charts and stats
    Leaderboard.jsx    # Top learners with badges
    Profile.jsx        # User profile + achievements
    Settings.jsx       # 7 settings sections
    Notifications.jsx  # Announcements + notifications
    Onboarding.jsx     # Welcome flow
    SplashScreen.jsx   # App launch screen
  components/
    layout/
      Layout.jsx       # Desktop sidebar + mobile bottom nav
  styles/
    globals.css        # Dark theme + glassmorphism utilities
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project (for APK) or Base44 account (for web)

### Installation

```bash
git clone https://github.com/daviekumi-glitch/ngoms-ai.git
cd ngoms-ai
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

### Development

```bash
npm run dev       # Start dev server (localhost:5173)
npm run build     # Production build
npm run preview   # Preview production build
```

---

## 🔥 Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable **Email/Password + Anonymous** authentication
3. Create a Firestore database
4. Copy your config into `src/lib/firebase.js`
5. Deploy Firestore rules: `firebase deploy --only firestore:rules`

### Dual-Mode API
The app detects its environment automatically:
- **APK (Capacitor native):** Uses Firebase directly
- **Web:** Uses Base44 API endpoint

---

## 📱 Android APK Build

GitHub Actions automatically builds the APK on push to `main`.

For manual builds, see `APK_BUILD_INSTRUCTIONS.md`.

```bash
npm run build
npx cap sync android
npx cap open android   # Build in Android Studio
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is private. All rights reserved.

---

*Built with ❤️ by [Davie Kuminga](https://github.com/daviekumi-glitch)*
