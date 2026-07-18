import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { Send, Brain, FileText, Zap, Lightbulb, BookOpen, RotateCcw, Paperclip, Mic } from 'lucide-react'

const quickPrompts = [
  { icon:Lightbulb, label:'Explain simply', prompt:'Explain this like I am 5 years old' },
  { icon:FileText, label:'Give examples', prompt:'Give me 3 real-world examples of this concept' },
  { icon:Zap, label:'Quiz me', prompt:'Quiz me on the key points of this topic' },
  { icon:BookOpen, label:'Summarise', prompt:'Give me a bullet-point summary of the main ideas' },
]

const initMsgs = [
  { role:'ai', text:'Hello! I am your Ngoms AI Tutor. I can answer questions from your uploaded documents, explain difficult concepts, quiz you, or help you create study notes. What would you like to learn today?', time:'10:30 AM' }
]

function TypingIndicator() {
  return (
    <div className="flex items-end gap-3">
      <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-primary to-violet flex items-center justify-center shrink-0">
        <Brain size={14} className="text-white"/>
      </div>
      <div className="glass px-4 py-3 rounded-2xl rounded-bl-sm">
        <div className="flex gap-1 items-center h-4">
          {[0,1,2].map(i=>(
            <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/60"
              animate={{y:[0,-4,0]}} transition={{duration:0.6, repeat:Infinity, delay:i*0.15}}/>
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
  const [activeDoc, setActiveDoc] = useState('Biology Chapter 5')
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({behavior:'smooth'}) }, [msgs, typing])

  const send = (text) => {
    const msg = text || input.trim()
    if(!msg) return
    setInput('')
    setMsgs(m => [...m, { role:'user', text:msg, time:new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) }])
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      const responses = [
        `Great question! Based on your document _"${activeDoc}"_, here is what I found:\n\nThe key concept here involves understanding the fundamental principles. Let me break it down step by step:\n\n1. First, consider the basic definition\n2. Then examine how it applies in context\n3. Finally, connect it to what you already know\n\nWould you like me to quiz you on this, or shall I give you more examples?`,
        `From your uploaded document, I can see this topic is covered in detail. The main points are:\n\n• The core principle involves a systematic approach\n• Key variables include context, application and scope\n• Real-world applications are found in everyday situations\n\nShall I create flashcards for these concepts?`,
        `That is an excellent area to focus on! Here is a simplified explanation:\n\nImagine it like building blocks — each concept supports the next. Your document covers this in Chapter 3, and I can see you have been studying it for 2 hours this week.\n\nReady for a quick 5-question quiz to test your understanding?`
      ]
      setMsgs(m => [...m, {
        role:'ai',
        text:responses[Math.floor(Math.random()*responses.length)],
        time:new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}),
        citation:activeDoc
      }])
    }, 1400)
  }

  return (
    <div className="flex flex-col h-screen bg-navy-900">
      {/* Header */}
      <div className="glass border-b border-white/5 px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-violet flex items-center justify-center shadow-lg shadow-primary/30">
          <Brain size={20} className="text-white"/>
        </div>
        <div className="flex-1">
          <p className="font-bold text-white text-sm">Ngoms AI Tutor</p>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
            <span className="text-white/40 text-xs">Context: {activeDoc}</span>
          </div>
        </div>
        <button className="glass px-3 py-1.5 rounded-xl flex items-center gap-1 text-xs text-white/60 hover:text-white transition-all">
          <FileText size={12}/> Switch Doc
        </button>
      </div>

      {/* Quick prompts */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide border-b border-white/5">
        {quickPrompts.map(q=>(
          <button key={q.label} onClick={()=>send(q.prompt)}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 glass rounded-xl text-xs text-white/60 hover:text-white hover:border-primary/30 transition-all">
            <q.icon size={12}/>{q.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4 pb-6">
        {msgs.map((m, i) => (
          <motion.div key={i} className={`flex items-end gap-3 ${m.role==='user'?'flex-row-reverse':''}`}
            initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.3}}>
            {m.role==='ai' && (
              <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-primary to-violet flex items-center justify-center shrink-0">
                <Brain size={14} className="text-white"/>
              </div>
            )}
            <div className={`max-w-[80%] ${m.role==='user'?'items-end':'items-start'} flex flex-col gap-1`}>
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${m.role==='ai' ? 'glass text-white/80 rounded-bl-sm' : 'bg-gradient-to-r from-primary to-violet text-white rounded-br-sm'}`}>
                {m.text}
              </div>
              {m.citation && (
                <div className="flex items-center gap-1 px-2">
                  <FileText size={10} className="text-white/30"/>
                  <span className="text-[10px] text-white/30">{m.citation}</span>
                </div>
              )}
              <span className="text-[10px] text-white/20 px-1">{m.time}</span>
            </div>
          </motion.div>
        ))}
        {typing && <TypingIndicator/>}
        <div ref={bottomRef}/>
      </div>

      {/* Input bar */}
      <div className="glass border-t border-white/5 px-4 py-3 pb-safe">
        <div className="flex items-end gap-2">
          <button className="glass p-2.5 rounded-xl text-white/40 hover:text-white transition-all">
            <Paperclip size={16}/>
          </button>
          <div className="flex-1 relative">
            <textarea
              className="input-field text-sm py-3 pr-12 resize-none max-h-32 leading-relaxed"
              placeholder="Ask anything about your documents..."
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}}}
              rows={1}
            />
          </div>
          <motion.button
            onClick={()=>send()}
            className={`p-2.5 rounded-xl transition-all ${input.trim() ? 'bg-gradient-to-r from-primary to-violet shadow-lg shadow-primary/30' : 'glass text-white/30'}`}
            whileTap={{scale:0.9}}>
            <Send size={16} className="text-white"/>
          </motion.button>
        </div>
      </div>
    </div>
  )
}
