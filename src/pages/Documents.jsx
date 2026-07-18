import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Upload, Search, FileText, Filter, Star, Zap, BookOpen, Eye, Download, Trash2, Tag, ChevronRight, X, Plus } from 'lucide-react'

const sampleDocs = [
  { id:1, title:'Biology Chapter 5', subject:'Biology', pages:45, status:'processed', score:92, summary:'Covers cell biology, mitosis, meiosis and genetic inheritance with detailed diagrams.', tags:['cells','genetics','mitosis'], size:'2.4 MB' },
  { id:2, title:'Physics Past Papers 2023', subject:'Physics', pages:120, status:'processed', score:78, summary:'Collection of exam questions covering mechanics, thermodynamics, optics and electricity.', tags:['exams','mechanics','optics'], size:'8.1 MB' },
  { id:3, title:'Mathematics Calculus Notes', subject:'Math', pages:78, status:'processing', score:0, summary:'Processing...', tags:['calculus','derivatives','integrals'], size:'3.2 MB' },
  { id:4, title:'History of Malawi', subject:'History', pages:210, status:'processed', score:88, summary:'Comprehensive account of Malawian pre-colonial, colonial and post-independence history.', tags:['malawi','colonial','independence'], size:'5.6 MB' },
  { id:5, title:'Chemistry Organic Compounds', subject:'Chemistry', pages:56, status:'processed', score:95, summary:'Detailed study of carbon compounds, functional groups, reactions and nomenclature.', tags:['organic','carbon','reactions'], size:'4.1 MB' },
]

const subjects = ['All','Biology','Physics','Math','History','Chemistry','English']

function ScoreRing({ score }) {
  const color = score>=85?'text-emerald-400':score>=60?'text-amber-400':'text-red-400'
  return (
    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${score>=85?'border-emerald-400/40':score>=60?'border-amber-400/40':'border-red-400/40'}`}>
      <span className={`text-xs font-black ${color}`}>{score||'—'}%</span>
    </div>
  )
}

export default function Documents() {
  const [search, setSearch] = useState('')
  const [subject, setSubject] = useState('All')
  const [selected, setSelected] = useState(null)
  const [dragging, setDragging] = useState(false)

  const filtered = sampleDocs.filter(d =>
    (subject==='All'||d.subject===subject) &&
    (d.title.toLowerCase().includes(search.toLowerCase())||d.subject.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-navy-900 pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 pt-6">
        {/* Header */}
        <motion.div className="flex items-center justify-between mb-6" initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}>
          <div>
            <h1 className="text-2xl font-black text-white">Document Library</h1>
            <p className="text-white/40 text-sm">{sampleDocs.length} documents</p>
          </div>
          <button className="gradient-btn text-sm flex items-center gap-2 py-2.5">
            <Plus size={16}/> Upload
          </button>
        </motion.div>

        {/* Upload drop zone */}
        <motion.div className={`glass border-2 border-dashed rounded-2xl p-8 text-center mb-5 transition-all duration-200 ${dragging ? 'border-primary bg-primary/10' : 'border-white/10 hover:border-primary/40'}`}
          initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.1}}
          onDragOver={e=>{e.preventDefault();setDragging(true)}}
          onDragLeave={()=>setDragging(false)}
          onDrop={e=>{e.preventDefault();setDragging(false)}}>
          <Upload size={28} className="text-primary mx-auto mb-3"/>
          <p className="text-white/70 font-semibold text-sm">Drop PDFs, DOCX or images here</p>
          <p className="text-white/30 text-xs mt-1">or <span className="text-primary cursor-pointer">browse files</span></p>
        </motion.div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"/>
          <input className="input-field pl-11 text-sm" placeholder="Search documents..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>

        {/* Subject filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
          {subjects.map(s=>(
            <button key={s} onClick={()=>setSubject(s)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${subject===s ? 'bg-gradient-to-r from-primary to-violet text-white shadow-lg' : 'glass text-white/50 hover:text-white'}`}>
              {s}
            </button>
          ))}
        </div>

        {/* Document cards */}
        <div className="flex flex-col gap-3">
          {filtered.map((doc,i)=>(
            <motion.div key={doc.id} className="glass-hover p-4 rounded-2xl cursor-pointer"
              initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
              onClick={()=>setSelected(doc)}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText size={22} className="text-primary"/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-white text-sm truncate">{doc.title}</p>
                    <ScoreRing score={doc.score}/>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="badge bg-primary/10 text-primary border border-primary/20">{doc.subject}</span>
                    <span className="text-white/30 text-xs">{doc.pages} pages</span>
                    <span className="text-white/30 text-xs">{doc.size}</span>
                  </div>
                  {doc.status==='processing' ? (
                    <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-violet rounded-full w-2/3 animate-pulse"/>
                    </div>
                  ) : (
                    <p className="text-white/40 text-xs mt-1.5 line-clamp-1">{doc.summary}</p>
                  )}
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {doc.tags.slice(0,3).map(t=>(
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40">#{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {filtered.length===0&&(
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📄</div>
              <p className="text-white/40 text-sm">No documents found</p>
            </div>
          )}
        </div>

        {/* Document detail modal */}
        <AnimatePresence>
          {selected && (
            <motion.div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center p-4"
              initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              onClick={()=>setSelected(null)}>
              <motion.div className="bg-navy-800 rounded-3xl p-6 w-full max-w-lg border border-white/10"
                initial={{y:50,opacity:0}} animate={{y:0,opacity:1}} exit={{y:50,opacity:0}}
                onClick={e=>e.stopPropagation()}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-black text-white">{selected.title}</h2>
                    <span className="badge bg-primary/10 text-primary border border-primary/20 mt-1">{selected.subject}</span>
                  </div>
                  <button onClick={()=>setSelected(null)} className="glass p-2 rounded-xl"><X size={16} className="text-white/60"/></button>
                </div>
                <div className="glass p-4 rounded-2xl mb-4">
                  <p className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-1">AI Summary</p>
                  <p className="text-white/70 text-sm leading-relaxed">{selected.summary}</p>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[['Pages',selected.pages],['Size',selected.size],['Health',selected.score+'%']].map(([l,v])=>(
                    <div key={l} className="card text-center p-3">
                      <p className="font-black text-white">{v}</p>
                      <p className="text-white/40 text-xs">{l}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button className="gradient-btn text-xs py-2.5 flex items-center justify-center gap-1"><Zap size={12}/> Quiz</button>
                  <button className="glass text-xs py-2.5 flex items-center justify-center gap-1 rounded-xl text-white/70 hover:text-white"><BookOpen size={12}/> Notes</button>
                  <button className="glass text-xs py-2.5 flex items-center justify-center gap-1 rounded-xl text-white/70 hover:text-white"><MessageCircle size={12}/> Chat</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function MessageCircle(props) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
}
