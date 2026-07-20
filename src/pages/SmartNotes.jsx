import { useState } from 'react'
import { FileText, List, BookOpen, Plus, X, ChevronRight, Loader, Download } from 'lucide-react'

const API_URL = 'https://vesper-ecdb8354.base44.app/functions/ngomsApi'

const noteTypes = [
  { id: 'summary', label: 'Summary', icon: FileText, color: 'from-blue-500 to-primary' },
  { id: 'bullet', label: 'Bullet Points', icon: List, color: 'from-emerald-500 to-teal-500' },
  { id: 'cornell', label: 'Cornell', icon: BookOpen, color: 'from-violet to-purple-500' },
]

function loadNotes() {
  const saved = localStorage.getItem('ngoms_notes')
  return saved ? JSON.parse(saved) : [
    { id: 'n1', title: 'Biology: Cellular Respiration', type: 'summary', subject: 'Biology', date: '2026-07-19', content: 'Cellular respiration is the process by which cells break down glucose to produce ATP energy.' },
    { id: 'n2', title: 'Math: Derivatives Cheat Sheet', type: 'bullet', subject: 'Mathematics', date: '2026-07-17', content: 'Power rule, Product rule, Quotient rule, Chain rule are the key derivative rules.' },
    { id: 'n3', title: 'English: Essay Structure', type: 'cornell', subject: 'English', date: '2026-07-15', content: 'Introduction, body paragraphs, and conclusion form the basic essay structure.' },
  ]
}

export default function SmartNotes() {
  const [notes, setNotes] = useState(loadNotes)
  const [showCreate, setShowCreate] = useState(false)
  const [noteType, setNoteType] = useState('summary')
  const [topic, setTopic] = useState('')
  const [subject, setSubject] = useState('')
  const [generating, setGenerating] = useState(false)
  const [viewing, setViewing] = useState(null)
  const [error, setError] = useState('')

  const saveNotes = (newNotes) => {
    setNotes(newNotes)
    localStorage.setItem('ngoms_notes', JSON.stringify(newNotes))
  }

  const generateNotes = async () => {
    if (!topic.trim()) return
    setGenerating(true)
    setError('')
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ai_notes', payload: { topic, format: noteType } }),
      })
      const json = await res.json()
      if (json.success && json.content) {
        const newNote = {
          id: `n${Date.now()}`,
          title: topic,
          type: noteType,
          subject: subject || 'General',
          date: new Date().toISOString().split('T')[0],
          content: json.content,
        }
        saveNotes([newNote, ...notes])
        setShowCreate(false)
        setTopic('')
        setSubject('')
      } else {
        setError(json.error || 'Could not generate notes. Try again.')
      }
    } catch {
      setError('Connection error. Try again.')
    }
    setGenerating(false)
  }

  const deleteNote = (id) => {
    saveNotes(notes.filter(n => n.id !== id))
    setViewing(null)
  }

  // View note
  if (viewing) {
    const type = noteTypes.find(t => t.id === viewing.type) || noteTypes[0]
    return (
      <div className="p-4 md:p-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => setViewing(null)} className="glass p-2 rounded-xl text-white/60 active:scale-90 transition-transform">
            <ChevronRight size={18} className="rotate-180" />
          </button>
          <h1 className="text-xl font-black text-white flex-1 truncate">{viewing.title}</h1>
        </div>
        <div className={`glass p-5 rounded-2xl mb-4 border-l-4 ${viewing.type === 'summary' ? 'border-primary' : viewing.type === 'bullet' ? 'border-emerald-400' : 'border-violet'}`}>
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center`}>
              <type.icon size={14} className="text-white" />
            </div>
            <span className="text-white/60 text-xs">{viewing.subject} · {viewing.date}</span>
          </div>
          <p className="text-white/70 text-sm whitespace-pre-line leading-relaxed">{viewing.content}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => deleteNote(viewing.id)}
            className="flex-1 py-2.5 rounded-xl glass text-red-400 text-sm font-semibold active:scale-95 transition-transform">
            Delete
          </button>
          <button onClick={() => { navigator.clipboard?.writeText(viewing.content) }}
            className="flex-1 py-2.5 rounded-xl glass text-white/70 text-sm font-semibold active:scale-95 transition-transform flex items-center justify-center gap-2">
            <Download size={14} /> Copy
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-black text-white">Smart Notes</h1>
          <p className="text-white/40 text-sm mt-0.5">AI-generated study notes</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-primary to-violet text-white text-sm font-semibold active:scale-95 transition-transform">
          <Plus size={16} /> New
        </button>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-20">
          <FileText size={48} className="text-white/10 mx-auto mb-3" />
          <p className="text-white/30 text-sm">No notes yet</p>
          <p className="text-white/20 text-xs mt-1">Generate AI study notes to get started</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {notes.map((n) => {
            const type = noteTypes.find(t => t.id === n.type) || noteTypes[0]
            return (
              <div key={n.id} onClick={() => setViewing(n)}
                className="glass p-3.5 rounded-2xl flex items-center gap-3 active:scale-[0.98] transition-transform cursor-pointer">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center shrink-0`}>
                  <type.icon size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{n.title}</p>
                  <p className="text-white/40 text-xs">{n.subject} · {n.date}</p>
                </div>
                <ChevronRight size={16} className="text-white/30" />
              </div>
            )
          })}
        </div>
      )}

      {/* Generate Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4" onClick={() => !generating && setShowCreate(false)}>
          <div className="glass rounded-2xl p-5 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg">Generate AI Notes</h2>
              {!generating && <button onClick={() => setShowCreate(false)} className="text-white/40 hover:text-white"><X size={20} /></button>}
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-white/50 text-xs font-semibold mb-1.5 block uppercase">Topic</label>
                <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Photosynthesis, World War II..."
                  className="input-field" disabled={generating} />
              </div>
              <div>
                <label className="text-white/50 text-xs font-semibold mb-1.5 block uppercase">Subject (optional)</label>
                <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Biology, History..."
                  className="input-field" disabled={generating} />
              </div>
              <div>
                <p className="text-white/50 text-xs font-semibold mb-2 uppercase">Note Format</p>
                <div className="space-y-2">
                  {noteTypes.map((t) => (
                    <button key={t.id} onClick={() => setNoteType(t.id)} disabled={generating}
                      className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${noteType === t.id ? 'bg-gradient-to-r from-primary to-violet' : 'glass'} ${generating ? 'opacity-50' : ''}`}>
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center`}>
                        <t.icon size={16} className="text-white" />
                      </div>
                      <span className={`text-sm font-semibold ${noteType === t.id ? 'text-white' : 'text-white/70'}`}>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <button onClick={generateNotes} disabled={generating || !topic.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-violet text-white font-bold text-sm active:scale-95 transition-transform disabled:opacity-50 flex items-center justify-center gap-2">
                {generating ? <><Loader size={14} className="animate-spin" /> Generating...</> : 'Generate with AI'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
