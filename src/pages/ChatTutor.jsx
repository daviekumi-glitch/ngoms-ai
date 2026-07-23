import { useState, useRef, useEffect } from 'react'
import { Send, Brain, FileText, Zap, Lightbulb, BookOpen, ArrowLeft, Sparkles, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { aiChat } from '../lib/api'

const quickPrompts = [
  { icon: Lightbulb, label: 'Explain simply', prompt: 'Explain this like I\'m 12 years old' },
  { icon: FileText, label: 'Give examples', prompt: 'Give me 3 real-world examples' },
  { icon: Zap, label: 'Quiz me', prompt: 'Quiz me on the key points' },
  { icon: BookOpen, label: 'Summarise', prompt: 'Give me a concise bullet-point summary' },
]

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand to-sky-400 flex items-center justify-center shrink-0">
        <Brain size={14} className="text-white" />
      </div>
      <div className="bg-white border border-surface-border rounded-3xl rounded-bl-sm px-4 py-3 shadow-card">
        <div className="flex gap-1 items-center h-4">
          {[0,1,2].map(i => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-brand/50 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

const initMsgs = [
  { role: 'ai', text: 'Hi there! I\'m your Ngoms AI Tutor.\n\nI can explain concepts, quiz you, help with flashcards, or break down any topic you\'re studying. What would you like to learn today?', time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) }
]

export default function ChatTutor() {
  const [msgs, setMsgs] = useState(initMsgs)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  const nav = useNavigate()

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, loading])

  const sendMessage = async (text) => {
    const userMsg = text || input.trim()
    if (!userMsg || loading) return
    setInput('')
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setMsgs(m => [...m, { role: 'user', text: userMsg, time: now }])
    setLoading(true)
    try {
      const history = msgs.slice(-8).map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', text: m.text }))
      const res = await aiChat([...history, { role: 'user', text: userMsg }])
      setMsgs(m => [...m, {
        role: 'ai',
        text: res?.success ? (res.reply || 'I could not get a response. Please try again.') : 'Connection error. Please try again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }])
    } catch {
      setMsgs(m => [...m, { role: 'ai', text: 'Connection error. Please check your internet and try again.', time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) }])
    }
    setLoading(false)
  }

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }

  const clearChat = () => setMsgs(initMsgs)

  return (
    <div className="flex flex-col h-screen bg-surface-soft">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-surface-border px-5 pt-12 pb-4 flex items-center gap-3 shrink-0 sticky top-0 z-10">
        <button onClick={() => nav(-1)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface-soft border border-surface-border md:hidden">
          <ArrowLeft size={17} className="text-ink" />
        </button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-sky-400 flex items-center justify-center shadow-btn">
          <Brain size={18} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-ink">AI Tutor</p>
          <p className="text-xs text-success font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-success rounded-full inline-block animate-pulse" /> Always online
          </p>
        </div>
        <button onClick={clearChat} className="w-9 h-9 rounded-xl bg-surface-soft border border-surface-border flex items-center justify-center text-ink-muted hover:text-danger transition-colors">
          <Trash2 size={15} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {msgs.map((m, i) => (
          <div key={i} className={`flex items-end gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''} animate-slide-up`}>
            {m.role === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand to-sky-400 flex items-center justify-center shrink-0">
                <Brain size={13} className="text-white" />
              </div>
            )}
            <div className={`max-w-[78%] ${m.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
              <div className={`px-4 py-3 rounded-3xl text-sm leading-relaxed whitespace-pre-wrap
                ${m.role === 'user'
                  ? 'bg-brand text-white rounded-br-sm shadow-btn'
                  : 'bg-white text-ink rounded-bl-sm border border-surface-border shadow-card'}`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-ink-muted px-1">{m.time}</span>
            </div>
          </div>
        ))}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide shrink-0">
        {quickPrompts.map(q => (
          <button
            key={q.label}
            onClick={() => sendMessage(q.prompt)}
            className="flex items-center gap-1.5 bg-white border border-surface-border text-ink-secondary text-xs font-semibold px-3 py-2 rounded-full whitespace-nowrap hover:border-brand/30 hover:text-brand transition-colors shadow-card"
          >
            <q.icon size={12} /> {q.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="bg-white/80 backdrop-blur-lg border-t border-surface-border px-4 py-3 shrink-0 safe-pb">
        <div className="flex items-end gap-2.5 max-w-2xl mx-auto">
          <textarea
            className="flex-1 bg-surface-soft border border-surface-border rounded-2xl px-4 py-3 text-sm text-ink placeholder-ink-faint focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 resize-none max-h-28 transition-all"
            placeholder="Ask me anything..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all
              ${input.trim() && !loading ? 'bg-brand text-white shadow-btn active:scale-95' : 'bg-surface-muted text-ink-faint'}`}
          >
            <Send size={17} />
          </button>
        </div>
      </div>
    </div>
  )
}
