import { supabase, TABLE_MAP, toDbRow, fromDbRow } from './supabaseClient'

// ── Fetch all app config + content in parallel ──
export async function fetchAll() {
  const tables = [
    'app_settings', 'app_banner', 'features', 'announcements',
    'notifications', 'plans', 'leaderboard', 'badges',
    'courses', 'quizzes', 'flashcard_decks', 'documents',
    'faqs', 'testimonials', 'contact_messages', 'system_logs',
  ]

  const results = await Promise.all(
    tables.map((t) =>
      supabase.from(t).select('*').order('created_at', { ascending: false }).limit(200)
        .then(({ data, error }) => {
          if (error) console.warn(`fetchAll: ${t} error`, error.message)
          return (data || []).map(fromDbRow)
        })
        .catch(() => [])
    )
  )

  const [
    appSettingsRows, bannerRows, features, announcements,
    notifications, plans, leaderboard, badges,
    courses, quizzes, flashcardDecks, documents,
    faqs, testimonials, messages, logs,
  ] = results

  return {
    success: true,
    appSettings: appSettingsRows[0] || null,
    banner: bannerRows[0] || null,
    features,
    announcements,
    notifications,
    plans,
    leaderboard,
    badges,
    courses,
    quizzes,
    flashcardDecks,
    documents,
    faqs,
    testimonials,
    messages,
    logs,
  }
}

// ── Generic CRUD ──
export async function createRecord(collectionKey, item) {
  const table = TABLE_MAP[collectionKey] || collectionKey
  const row = toDbRow(item)
  const { data, error } = await supabase.from(table).insert(row).select('*').single()
  if (error) {
    console.error('createRecord error:', error.message)
    return { success: false, error: error.message }
  }
  return { success: true, data: fromDbRow(data) }
}

export async function updateRecord(collectionKey, id, patch) {
  const table = TABLE_MAP[collectionKey] || collectionKey
  const row = toDbRow(patch)
  const { data, error } = await supabase.from(table).update(row).eq('id', id).select('*').single()
  if (error) {
    console.error('updateRecord error:', error.message)
    return { success: false, error: error.message }
  }
  return { success: true, data: fromDbRow(data) }
}

export async function deleteRecord(collectionKey, id) {
  const table = TABLE_MAP[collectionKey] || collectionKey
  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) {
    console.error('deleteRecord error:', error.message)
    return { success: false, error: error.message }
  }
  return { success: true }
}

// ── AI actions via edge function ──
const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ngoms-ai`

function getApiKey() {
  try { return localStorage.getItem('ngoms_openrouter_key') || '' } catch { return '' }
}

async function callAi(action, payload) {
  try {
    const res = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ action, payload, apiKey: getApiKey() }),
    })
    if (!res.ok) {
      console.error('AI action failed:', res.status)
      return { success: false, error: `Request failed (${res.status})` }
    }
    return await res.json()
  } catch (err) {
    console.error('AI action error:', err)
    return { success: false, error: err.message }
  }
}

export const aiChat = (messages) => callAi('chat', { messages })
export const aiQuiz = (topic, difficulty, count) => callAi('quiz', { topic, difficulty, count })
export const aiNotes = (topic, format) => callAi('notes', { topic, format })
