import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Zap, Clock, CheckCircle, XCircle, RotateCcw, Trophy, ChevronRight, BookOpen, Target } from 'lucide-react'

const sampleQuizzes = [
  { id:1, title:'Biology Cell Division', subject:'Biology', questions:10, difficulty:'Medium', score:null, time:'8 min' },
  { id:2, title:'Physics Forces & Motion', subject:'Physics', questions:15, difficulty:'Hard', score:87, time:'12 min' },
  { id:3, title:'Math Calculus Basics', subject:'Math', questions:8, difficulty:'Easy', score:null, time:'6 min' },
  { id:4, title:'Chemistry Organic Reactions', subject:'Chemistry', questions:12, difficulty:'Hard', score:72, time:'10 min' },
]

const sampleQuestions = [
  { q:'What is the powerhouse of the cell?', options:['Nucleus','Mitochondria','Ribosome','Golgi Body'], answer:1 },
  { q:'During which phase does DNA replication occur?', options:['G1 Phase','S Phase','G2 Phase','M Phase'], answer:1 },
  { q:'Which organelle is responsible for protein synthesis?', options:['Lysosome','Vacuole','Ribosome','Centrosome'], answer:2 },
  { q:'What is the process by which cells divide?', options:['Osmosis','Mitosis','Photosynthesis','Respiration'], answer:1 },
  { q:'The cell membrane is primarily made of?', options:['Proteins','Lipids','Carbohydrates','Phospholipids'], answer:3 },
]

const difficultyColor = { Easy:'text-emerald-400 bg-emerald-400/10', Medium:'text-amber-400 bg-amber-400/10', Hard:'text-red-400 bg-red-400/10' }

function QuizList({ onStart }) {
  return (
    <div className="min-h-screen bg-navy-900 pb-24 md:pb-8 px-4 pt-6 max-w-2xl mx-auto">
      <motion.div className="mb-6" initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}>
        <h1 className="text-2xl font-black text-white">Quiz Engine</h1>
        <p className="text-white/40 text-sm">Test your knowledge</p>
      </motion.div>
      <div className="flex flex-col gap-3">
        {sampleQuizzes.map((quiz, i) => (
          <motion.div key={quiz.id} className="glass-hover p-5 rounded-2xl cursor-pointer"
            initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
            onClick={() => onStart(quiz)}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="font-bold text-white text-sm">{quiz.title}</p>
                <p className="text-white/40 text-xs mt-0.5">{quiz.subject} • {quiz.questions} questions • {quiz.time}</p>
              </div>
              {quiz.score !== null ? (
                <div className={`px-2 py-1 rounded-lg text-xs font-bold ${quiz.score>=80?'bg-emerald-400/10 text-emerald-400':'bg-amber-400/10 text-amber-400'}`}>{quiz.score}%</div>
              ) : (
                <span className="text-primary text-xs font-semibold">Start →</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className={`badge text-xs px-2 py-0.5 rounded-full font-semibold ${difficultyColor[quiz.difficulty]}`}>{quiz.difficulty}</span>
              {quiz.score !== null && <span className="text-white/30 text-xs">Completed</span>}
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div className="card mt-4 p-5 flex items-center gap-4" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.4}}>
        <div className="w-11 h-11 rounded-2xl bg-violet/10 flex items-center justify-center"><Target size={20} className="text-violet"/></div>
        <div className="flex-1">
          <p className="font-bold text-white text-sm">Generate AI Quiz</p>
          <p className="text-white/40 text-xs">From your uploaded documents</p>
        </div>
        <button className="gradient-btn text-xs py-2 px-4">Generate</button>
      </motion.div>
    </div>
  )
}

function ActiveQuiz({ quiz, onFinish }) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [answers, setAnswers] = useState([])
  const [timer, setTimer] = useState(30)

  useEffect(() => {
    if(revealed) return
    setTimer(30)
    const t = setInterval(() => setTimer(v => { if(v<=1){ clearInterval(t); handleReveal(-1); return 0; } return v-1 }), 1000)
    return () => clearInterval(t)
  }, [current, revealed])

  const handleReveal = (idx) => { setSelected(idx); setRevealed(true) }
  const handleNext = () => {
    const newAnswers = [...answers, { selected, correct: sampleQuestions[current].answer }]
    if(current < sampleQuestions.length - 1) {
      setAnswers(newAnswers); setCurrent(c=>c+1); setSelected(null); setRevealed(false)
    } else {
      const score = Math.round((newAnswers.filter(a=>a.selected===a.correct).length / newAnswers.length)*100)
      onFinish(score, newAnswers)
    }
  }
  const q = sampleQuestions[current]
  const timerColor = timer<=10 ? 'text-red-400' : timer<=20 ? 'text-amber-400' : 'text-emerald-400'

  return (
    <div className="min-h-screen bg-navy-900 pb-24 md:pb-8 px-4 pt-6 max-w-lg mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-primary to-violet rounded-full"
            animate={{width:`${((current+1)/sampleQuestions.length)*100}%`}} transition={{duration:0.4}}/>
        </div>
        <span className="text-white/50 text-xs font-semibold">{current+1}/{sampleQuestions.length}</span>
        <div className={`flex items-center gap-1 text-xs font-bold ${timerColor}`}>
          <Clock size={12}/>{timer}s
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-40}} transition={{duration:0.3}}>
          <div className="card p-5 mb-5">
            <p className="text-xs text-primary font-bold uppercase tracking-wider mb-3">Question {current+1}</p>
            <p className="text-white font-bold text-base leading-relaxed">{q.q}</p>
          </div>
          <div className="flex flex-col gap-3">
            {q.options.map((opt, i) => {
              let cls = 'glass-hover'
              if(revealed) {
                if(i===q.answer) cls='bg-emerald-400/15 border-2 border-emerald-400/50'
                else if(i===selected && selected!==q.answer) cls='bg-red-400/15 border-2 border-red-400/50'
              } else if(selected===i) cls='bg-primary/15 border-2 border-primary/50'
              return (
                <motion.button key={i} className={`w-full p-4 rounded-2xl text-left flex items-center gap-3 transition-all ${cls}`}
                  onClick={()=>!revealed&&handleReveal(i)} whileTap={!revealed?{scale:0.98}:{}}>
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black shrink-0 ${revealed&&i===q.answer?'bg-emerald-400 text-white':revealed&&i===selected&&selected!==q.answer?'bg-red-400 text-white':'bg-white/10 text-white/60'}`}>
                    {['A','B','C','D'][i]}
                  </span>
                  <span className={`text-sm font-medium ${revealed&&i===q.answer?'text-emerald-400':revealed&&i===selected&&selected!==q.answer?'text-red-400':'text-white/80'}`}>{opt}</span>
                  {revealed&&i===q.answer&&<CheckCircle size={16} className="text-emerald-400 ml-auto"/>}
                  {revealed&&i===selected&&selected!==q.answer&&<XCircle size={16} className="text-red-400 ml-auto"/>}
                </motion.button>
              )
            })}
          </div>
          {revealed && (
            <motion.button className="gradient-btn w-full mt-5 flex items-center justify-center gap-2"
              onClick={handleNext} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
              {current<sampleQuestions.length-1?<><ChevronRight size={16}/>Next Question</>:<><Trophy size={16}/>See Results</>}
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function ResultScreen({ score, quiz, onRetry, onBack }) {
  const grade = score>=90?'A':score>=80?'B':score>=70?'C':score>=60?'D':'F'
  const color = score>=80?'from-emerald-400 to-teal-400':score>=60?'from-amber-400 to-orange-400':'from-red-400 to-pink-400'
  return (
    <div className="min-h-screen bg-navy-900 pb-24 md:pb-8 px-4 pt-10 max-w-lg mx-auto flex flex-col items-center">
      <motion.div className="text-center mb-8" initial={{scale:0}} animate={{scale:1}} transition={{type:'spring',bounce:0.4}}>
        <div className={`w-32 h-32 rounded-3xl bg-gradient-to-br ${color} flex flex-col items-center justify-center mx-auto mb-4 shadow-2xl`}>
          <span className="text-5xl font-black text-white">{grade}</span>
          <span className="text-white/70 text-sm">{score}%</span>
        </div>
        <h2 className="text-2xl font-black text-white">{score>=80?'Excellent!':score>=60?'Good Job!':'Keep Practising!'}</h2>
        <p className="text-white/50 text-sm mt-1">{quiz.title}</p>
      </motion.div>
      <div className="grid grid-cols-3 gap-3 w-full mb-6">
        {[['Score',score+'%'],['Grade',grade],['Questions',quiz.questions]].map(([l,v])=>(
          <div key={l} className="card text-center p-4">
            <p className="text-xl font-black gradient-text">{v}</p>
            <p className="text-white/40 text-xs">{l}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-3 w-full">
        <button onClick={onRetry} className="flex-1 glass rounded-xl py-3 flex items-center justify-center gap-2 text-white/70 hover:text-white transition-all text-sm font-semibold">
          <RotateCcw size={16}/> Retry
        </button>
        <button onClick={onBack} className="flex-1 gradient-btn text-sm flex items-center justify-center gap-2">
          <BookOpen size={16}/> More Quizzes
        </button>
      </div>
    </div>
  )
}

export default function QuizEngine() {
  const [screen, setScreen] = useState('list')
  const [activeQuiz, setActiveQuiz] = useState(null)
  const [finalScore, setFinalScore] = useState(0)

  if(screen==='active') return <ActiveQuiz quiz={activeQuiz} onFinish={(score)=>{setFinalScore(score);setScreen('result')}}/>
  if(screen==='result') return <ResultScreen score={finalScore} quiz={activeQuiz} onRetry={()=>setScreen('active')} onBack={()=>setScreen('list')}/>
  return <QuizList onStart={q=>{setActiveQuiz(q);setScreen('active')}}/>
}
