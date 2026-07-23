import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
})

// Maps the collection keys used across the app to Supabase table names.
export const TABLE_MAP = {
  appSettings: 'app_settings',
  banner: 'app_banner',
  courses: 'courses',
  flashcardDecks: 'flashcard_decks',
  flashcards: 'flashcard_decks',
  quizzes: 'quizzes',
  documents: 'documents',
  plans: 'plans',
  payments: 'payments',
  coupons: 'coupons',
  badges: 'badges',
  leaderboard: 'leaderboard',
  faqs: 'faqs',
  testimonials: 'testimonials',
  announcements: 'announcements',
  notifications: 'notifications',
  features: 'features',
  messages: 'contact_messages',
  logs: 'system_logs',
}

// Field-name normalization between the app's camelCase keys and the DB's snake_case.
// We keep this minimal — only fields that differ are listed.
const FIELD_TO_DB = {
  appName: 'app_name',
  maintenanceMode: 'maintenance_mode',
  maintenanceMessage: 'maintenance_message',
  supportEmail: 'support_email',
  primaryColor: 'primary_color',
  actionText: 'action_text',
  actionRoute: 'action_route',
  created_date: 'created_at',
  updated_date: 'created_at',
}

const FIELD_FROM_DB = {
  app_name: 'appName',
  maintenance_mode: 'maintenanceMode',
  maintenance_message: 'maintenanceMessage',
  support_email: 'supportEmail',
  primary_color: 'primaryColor',
  action_text: 'actionText',
  action_route: 'actionRoute',
  created_at: 'createdAt',
}

export function toDbRow(obj) {
  if (!obj || typeof obj !== 'object') return obj
  const out = {}
  for (const [k, v] of Object.entries(obj)) {
    const key = FIELD_TO_DB[k] || k
    out[key] = v
  }
  // Drop reserved/derived keys that don't exist as columns
  delete out.id
  return out
}

export function fromDbRow(row) {
  if (!row || typeof row !== 'object') return row
  const out = { id: row.id }
  for (const [k, v] of Object.entries(row)) {
    if (k === 'id') continue
    const key = FIELD_FROM_DB[k] || k
    out[key] = v
  }
  return out
}
