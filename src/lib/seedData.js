import { collection, getDocs, addDoc, doc, setDoc, writeBatch } from 'firebase/firestore'
import { db } from './firebase'

const SEED_VERSION = '1.0.1'
let seeded = false

export async function seedFirestore() {
  if (seeded) return
  try {
    const snap = await getDocs(collection(db, 'app_settings'))
    if (!snap.empty) { seeded = true; return }
  } catch { return } // Firebase not reachable – skip seed

  seeded = true

  // ── App Settings ──
  await setDoc(doc(db, 'app_settings', 'config'), {
    appName: 'Ngoms AI',
    tagline: 'Learn Smarter. Not Harder.',
    primaryColor: '#0F73F7',
    version: SEED_VERSION,
    maintenanceMode: false,
    maintenanceMessage: 'We are upgrading Ngoms AI. Back soon!',
    supportEmail: 'support@ngoms.ai',
  })

  // ── Banner ──
  await setDoc(doc(db, 'app_banner', 'main'), {
    title: 'Welcome to Ngoms AI Premium',
    subtitle: 'Unlock unlimited AI tutoring, flashcards & quizzes',
    actionText: 'Upgrade Now',
    actionRoute: '/settings',
    active: true,
  })

  // ── Features ──
  const feats = [
    { icon: '💬', name: 'AI Chat Tutor',    enabled: true,  key: 'ai_chat' },
    { icon: '🎴', name: 'Flashcard Studio', enabled: true,  key: 'flashcards' },
    { icon: '⚡', name: 'Quiz Engine',      enabled: true,  key: 'quiz' },
    { icon: '📝', name: 'Smart Notes',      enabled: true,  key: 'notes' },
    { icon: '📅', name: 'Study Planner',    enabled: true,  key: 'planner' },
    { icon: '📊', name: 'Analytics',        enabled: true,  key: 'analytics' },
    { icon: '🏆', name: 'Leaderboard',      enabled: true,  key: 'leaderboard' },
  ]
  for (const f of feats) await addDoc(collection(db, 'features'), f)

  // ── Courses ──
  const courses = [
    { title: 'Introduction to Computer Science', category: 'Technology', icon: '💻', lessons: 12, status: 'Active' },
    { title: 'Mathematics for AI',               category: 'Mathematics', icon: '🔢', lessons: 8,  status: 'Active' },
    { title: 'English Literature Essentials',    category: 'Languages',   icon: '📖', lessons: 10, status: 'Active' },
    { title: 'Biology: Human Body Systems',      category: 'Science',     icon: '🧬', lessons: 15, status: 'Active' },
    { title: 'Business Fundamentals',            category: 'Business',    icon: '📈', lessons: 6,  status: 'Active' },
  ]
  for (const c of courses) await addDoc(collection(db, 'courses'), c)

  // ── Flashcard Decks ──
  const decks = [
    { title: 'Python Programming Basics', author: 'Ngoms AI', status: 'Active', cards: [
      { front: 'What is a variable?',      back: 'A named storage location for data in memory' },
      { front: 'What does print() do?',    back: 'Outputs text to the console' },
      { front: 'What is a list?',          back: 'An ordered, mutable collection of items' },
      { front: 'What is a dictionary?',    back: 'A key-value pair data structure' },
    ]},
    { title: 'Cell Biology', author: 'Ngoms AI', status: 'Active', cards: [
      { front: 'Powerhouse of the cell?',  back: 'Mitochondria' },
      { front: 'What is DNA?',             back: 'Deoxyribonucleic acid — the genetic blueprint' },
      { front: 'What is photosynthesis?',  back: 'Plants convert sunlight + CO₂ into glucose' },
    ]},
    { title: 'Algebra Formulas', author: 'Ngoms AI', status: 'Active', cards: [
      { front: 'Quadratic formula',        back: 'x = (-b ± √(b²-4ac)) / 2a' },
      { front: 'Slope formula',            back: 'm = (y₂ - y₁) / (x₂ - x₁)' },
      { front: 'Distance formula',         back: 'd = √((x₂-x₁)² + (y₂-y₁)²)' },
    ]},
  ]
  for (const d of decks) await addDoc(collection(db, 'flashcard_decks'), d)

  // ── Quizzes — FIXED: answer is the string value, not index ──
  const quizzes = [
    { title: 'Python Basics Quiz', difficulty: 'Easy', status: 'Active', questions: [
      { question: 'What symbol starts a Python comment?', options: ['//', '/*', '#', '--'], answer: '#' },
      { question: 'How do you create a variable x with value 5?', options: ['var x=5', 'x = 5', 'let x=5', 'const x=5'], answer: 'x = 5' },
      { question: 'What does len() return?', options: ['The length of an object', 'A boolean', 'A number type', 'None'], answer: 'The length of an object' },
    ]},
    { title: 'Cell Biology Quiz', difficulty: 'Medium', status: 'Active', questions: [
      { question: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi body'], answer: 'Mitochondria' },
      { question: 'What carries genetic information?', options: ['RNA', 'DNA', 'Protein', 'Lipid'], answer: 'DNA' },
      { question: 'What is osmosis?', options: ['Movement of solutes', 'Movement of water across a membrane', 'Cell division', 'Energy production'], answer: 'Movement of water across a membrane' },
    ]},
    { title: 'Algebra Quiz', difficulty: 'Hard', status: 'Active', questions: [
      { question: 'Solve: 2x + 5 = 15', options: ['x=3', 'x=5', 'x=7', 'x=10'], answer: 'x=5' },
      { question: 'What is x² if x = 4?', options: ['8', '12', '16', '20'], answer: '16' },
    ]},
  ]
  for (const q of quizzes) await addDoc(collection(db, 'quizzes'), q)

  // ── Badges ──
  const badges = [
    { name: 'First Steps',   desc: 'Complete your first lesson', icon: '🎯', status: 'Active' },
    { name: 'Quiz Master',   desc: 'Pass 10 quizzes with 80%+',  icon: '🧠', status: 'Active' },
    { name: 'Streak Warrior',desc: '7-day study streak',         icon: '🔥', status: 'Active' },
    { name: 'Scholar',       desc: 'Complete a full course',     icon: '🎓', status: 'Active' },
  ]
  for (const b of badges) await addDoc(collection(db, 'badges'), b)

  // ── Plans ──
  await addDoc(collection(db, 'plans'), { name: 'Free',    price: '0',      period: 'month', status: 'Active', features: ['5 AI queries/day', 'Basic flashcards', 'Community access'] })
  await addDoc(collection(db, 'plans'), { name: 'Premium', price: '15000',  period: 'month', status: 'Active', features: ['Unlimited AI tutoring', 'All courses', 'Quiz engine', 'Analytics'] })
  await addDoc(collection(db, 'plans'), { name: 'Annual',  price: '150000', period: 'year',  status: 'Active', features: ['Everything in Premium', '2 months free', 'Early feature access'] })

  // ── Leaderboard ──
  const leaders = [
    { name: 'Davie Kuminga', xp: 5420, rank: 1, badge: 'Scholar' },
    { name: 'Chisomo Banda', xp: 4890, rank: 2, badge: 'Quiz Master' },
    { name: 'Tadala Mvula',  xp: 4210, rank: 3, badge: 'Streak Warrior' },
    { name: 'Kondwani D.',   xp: 3780, rank: 4, badge: 'First Steps' },
    { name: 'Zione Phiri',   xp: 3210, rank: 5, badge: 'Scholar' },
  ]
  for (const l of leaders) await addDoc(collection(db, 'leaderboard'), l)

  // ── Announcements ──
  await addDoc(collection(db, 'announcements'), {
    title: '🎉 Ngoms AI v1.0 is Live!',
    message: 'Welcome to the new and improved Ngoms AI platform. Explore AI tutoring, flashcards, quizzes and more!',
    createdAt: new Date().toISOString(),
    type: 'announcement',
  })

  console.log('✅ Firestore seeded successfully')
}
