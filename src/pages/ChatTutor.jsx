import { useState, useRef, useEffect } from 'react'
import { Send, Brain, FileText, Zap, Lightbulb, BookOpen, Paperclip } from 'lucide-react'

const API_URL = 'https://vesper-ecdb8354.base44.app/functions/ngomsApi'

const quickPrompts = [
  { icon: Lightbulb, label: 'Explain simply', prompt: 'Explain this like I am 5 years old' },
  { icon: FileText, label: 'Examples', prompt: 'Give me 3 real-world examples of this concept' },
  { icon: Zap, label: 'Quiz me', prompt: 'Quiz me on the key points of this topic' },
  { icon: BookOpen, label: 'Summarise', prompt: 'Give me a bullet-point summary of the main ideas' },
]

const initMsgs = [
  { role: 'ai', text: 'Hello! I am your Ngoms AI Tutor. I can explain concepts, quiz you, and help with study notes. What would you like to learn today?', time: '10:30 AM' }
]

function TypingIndicator() {
  return (
    <div className="flex items-end gap-3">
      <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-primary to-violet flex items-center justify-center shrink-0">
        <Brain size={14} className="text-white" />
      </div>
      <div className="glass px-4 py-3 rounded-2xl rounded-bl-sm">
        <div className="flex gap-1 items-center h-4">
          {[0,1,2].map(i => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ChatTutor() {
  const [msgs, setMsgs] = useState(initMsgs)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, typing])

  const send = async (text) => {
    const msg = text || input.trim()
    if (!msg || typing) return
    setInput('')
    const userMsg = { role: 'user', text: msg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    setMsgs(m => [...m, userMsg])
    setTyping(true)

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ai_chat', payload: { messages: [...msgs, userMsg] } }),
      })
      const json = await res.json()
      setTyping(false)
      setMsgs(m => [...m, {
        role: 'ai',
        text: json.reply || json.error || 'Sorry, I could not process that. Please try again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: json.model,
      }])
    } catch (err) {
      setTyping(false)
      setMsgs(m => [...m, {
        role: 'ai',
        text: 'Connection error. Please check your internet and try again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }])
    }
  }

  return (
    <div className="flex flex-col h-screen bg-navy-900">
      {/* Header - fixed */}
      <div className="glass border-b border-white/5 px-4 py-3 flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-violet flex items-center justify-center shadow-lg shadow-primary/30">
          <Brain size={20} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-white text-sm">Ngoms AI Tutor</p>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-white/40 text-xs">Online</span>
          </div>
        </div>
      </div>

      {/* Quick prompts - fixed */}
      <div className="flex gap-2 px-4 py-2.5 overflow-x-auto scrollbar-hide border-b border-white/5 shrink-0">
        {quickPrompts.map(q => (
          <button key={q.label} onClick={() => send(q.prompt)}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 glass rounded-xl text-xs text-white/60 hover:text-white active:scale-95 transition-all">
            <q.icon size={12} />{q.label}
          </button>
        ))}
      </div>

      {/* Messages - scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3.5">
        {msgs.map((m, i) => (
          <div key={i} className={`flex items-end gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {m.role === 'ai' && (
              <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-primary to-violet flex items-center justify-center shrink-0">
                <Brain size={14} className="text-white" />
              </div>
            )}
            <div className={`max-w-[80%] flex flex-col gap-1`}>
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${m.role === 'ai' ? 'glass text-white/80 rounded-bl-sm' : 'bg-gradient-to-r from-primary to-violet text-white rounded-br-sm'}`}>
                {m.text}
              </div>
              <span className="text-[10px] text-white/20 px-1">{m.time}</span>
            </div>
          </div>
        ))}
        {typing && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input - fixed bottom */}
      <div className="glass border-t border-white/5 px-4 py-3 pb-4 shrink-0">
        <div className="flex items-end gap-2">
          <button className="glass p-2.5 rounded-xl text-white/40 active:scale-90 transition-transform">
            <Paperclip size={16} />
          </button>
          <div className="flex-1 relative">
            <textarea
              className="input-field text-sm py-3 px-4 resize-none max-h-32 leading-relaxed"
              placeholder="Ask anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
              rows={1}
            />
          </div>
          <button
            onClick={() => send()}
            className={`p-2.5 rounded-xl transition-transform active:scale-90 ${input.trim() ? 'bg-gradient-to-r from-primary to-violet shadow-lg shadow-primary/30' : 'glass text-white/30'}`}
          >
            <Send size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
