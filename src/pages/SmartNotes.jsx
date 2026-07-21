import { useState } from 'react'
import { FileText, Sparkles, Copy, Check, Wand2, ArrowLeft } from 'lucide-react'
const API_URL = 'https://vesper-ecdb8354.base44.app/functions/ngomsApi'

const formats = [
  { id: 'bullet', label: '📋 Bullet Points', desc: 'Key points at a glance' },
  { id: 'cornell', label: '📓 Cornell Notes', desc: 'Cues, notes & summary' },
  { id: 'mindmap', label: '🕸️ Mind Map', desc: 'Visual concept web' },
]

export default function SmartNotes() {
  const [topic, setTopic] = useState('')
  const [format, setFormat] = useState('bullet')
  const [notes, setNotes] = useState(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const generate = async () => {
    if (!topic.trim() || loading) return
    setLoading(true); setNotes(null)
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_notes', topic, format }),
      })
      const data = await res.json()
      setNotes(data.notes || data.content || 'Could not generate notes. Please try again.')
    } catch { setNotes('Error generating notes. Please check your connection.') }
    setLoading(false)
  }

  const copy = () => {
    navigator.clipboard.writeText(notes || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="px-5 pt-12 pb-6 max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-ink">Smart Notes</h1>
        <p className="text-sm text-ink-muted">AI-generated study notes in seconds</p>
      </div>

      {/* Topic input */}
      <div className="card mb-5">
        <label className="block text-sm font-bold text-ink mb-2">Topic or Concept</label>
        <textarea
          className="input resize-none"
          rows={3}
          placeholder="e.g. Photosynthesis, The French Revolution, Newton's Laws of Motion..."
          value={topic}
          onChange={e => setTopic(e.target.value)}
        />
      </div>

      {/* Format picker */}
      <div className="mb-5">
        <p className="section-title mb-3">Note Format</p>
        <div className="space-y-2">
          {formats.map(f => (
            <button
              key={f.id}
              onClick={() => setFormat(f.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 text-left transition-all
                ${format === f.id ? 'border-brand bg-brand-soft' : 'border-surface-border bg-white hover:border-brand/30'}`}
            >
              <div className="flex-1">
                <p className={`font-semibold text-sm ${format === f.id ? 'text-brand' : 'text-ink'}`}>{f.label}</p>
                <p className="text-xs text-ink-muted">{f.desc}</p>
              </div>
              {format === f.id && <div className="w-5 h-5 rounded-full bg-brand flex items-center justify-center"><Check size={11} className="text-white" /></div>}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={generate}
        disabled={!topic.trim() || loading}
        className={`w-full py-4 rounded-3xl font-bold text-base flex items-center justify-center gap-2 mb-5 transition-all
          ${topic.trim() && !loading ? 'bg-brand text-white shadow-btn active:scale-95' : 'bg-surface-muted text-ink-faint cursor-not-allowed'}`}
      >
        <Wand2 size={18} />
        {loading ? 'Generating...' : 'Generate Notes'}
      </button>

      {/* Loading shimmer */}
      {loading && (
        <div className="space-y-3 animate-pulse">
          {[1,2,3,4].map(i => <div key={i} className="skeleton h-4 rounded" style={{ width: `${70 + Math.random()*30}%` }} />)}
        </div>
      )}

      {/* Notes output */}
      {notes && !loading && (
        <div className="card animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <p className="font-bold text-ink">{formats.find(f => f.id === format)?.label}</p>
            <button onClick={copy} className="flex items-center gap-1.5 text-xs font-semibold text-brand bg-brand-soft px-3 py-1.5 rounded-xl active:scale-95">
              {copied ? <><Check size={12} />Copied!</> : <><Copy size={12} />Copy</>}
            </button>
          </div>
          <div className="text-sm text-ink leading-relaxed whitespace-pre-wrap bg-surface-soft rounded-2xl p-4 border border-surface-border font-mono">
            {notes}
          </div>
        </div>
      )}
    </div>
  )
}
