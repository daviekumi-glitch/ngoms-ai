import { useState } from 'react'
import { FileText, List, BookOpen, Download, Plus, X, ChevronRight } from 'lucide-react'

const noteTypes = [
  { id: 'summary', label: 'Summary', icon: FileText, color: 'from-blue-500 to-primary' },
  { id: 'bullet', label: 'Bullet Points', icon: List, color: 'from-emerald-500 to-teal-500' },
  { id: 'cornell', label: 'Cornell', icon: BookOpen, color: 'from-violet to-purple-500' },
]

const sampleNotes = [
  { id: 'n1', title: 'Biology: Cellular Respiration', type: 'summary', subject: 'Biology', date: '2026-07-19' },
  { id: 'n2', title: 'Math: Derivatives Cheat Sheet', type: 'bullet', subject: 'Mathematics', date: '2026-07-17' },
  { id: 'n3', title: 'English: Essay Structure', type: 'cornell', subject: 'English', date: '2026-07-15' },
]

export default function SmartNotes() {
  const [notes] = useState(sampleNotes)
  const [showCreate, setShowCreate] = useState(false)
  const [noteType, setNoteType] = useState('summary')

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
        </div>
      ) : (
        <div className="space-y-2.5">
          {notes.map((n) => {
            const type = noteTypes.find(t => t.id === n.type) || noteTypes[0]
            return (
              <div key={n.id} className="glass p-3.5 rounded-2xl flex items-center gap-3 active:scale-[0.98] transition-transform cursor-pointer">
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

      {showCreate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4"
          onClick={() => setShowCreate(false)}>
          <div className="glass rounded-2xl p-5 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg">Generate Notes</h2>
              <button onClick={() => setShowCreate(false)} className="text-white/40"><X size={20} /></button>
            </div>
            <p className="text-white/40 text-xs mb-3">Select a note format</p>
            <div className="space-y-2 mb-4">
              {noteTypes.map((t) => (
                <button key={t.id} onClick={() => setNoteType(t.id)}
                  className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${noteType === t.id ? 'bg-gradient-to-r from-primary to-violet' : 'glass'}`}>
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center`}>
                    <t.icon size={16} className="text-white" />
                  </div>
                  <span className={`text-sm font-semibold ${noteType === t.id ? 'text-white' : 'text-white/70'}`}>{t.label}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setShowCreate(false)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-violet text-white font-bold text-sm active:scale-95 transition-transform">
              Generate with AI
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
