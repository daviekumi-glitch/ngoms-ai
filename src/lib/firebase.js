import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            || "AIzaSyDeNJkAj-KwnoYp0danbKjR64M9RIV9Oho",
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || "ngoms-ai-edfa5.firebaseapp.com",
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         || "ngoms-ai-edfa5",
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || "ngoms-ai-edfa5.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "271468761263",
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             || "1:271468761263:web:82e8bf0b4bd66403fcc45a",
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID     || "G-C075J4HC5N",
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export { app }

export const COLLECTION_MAP = {
  courses:'courses', flashcardDecks:'flashcard_decks', flashcards:'flashcard_decks',
  quizzes:'quizzes', documents:'documents', plans:'plans', payments:'payments',
  coupons:'coupons', badges:'badges', leaderboard:'leaderboard', faqs:'faqs',
  testimonials:'testimonials', announcements:'announcements', notifications:'notifications',
  features:'features', messages:'contact_messages', logs:'system_logs',
  banner:'app_banner', settings:'app_settings',
}
