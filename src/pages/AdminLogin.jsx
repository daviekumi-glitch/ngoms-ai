import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Shield, Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function AdminLogin() {
  const { adminLogin } = useApp()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [show, setShow] = useState(false)
  const [err, setErr] = useState('')

  const submit = (e) => {
    e.preventDefault()
    setErr('')
    if (adminLogin(email.trim(), pass)) {
      nav('/admin')
    } else {
      setErr('Invalid credentials. Access denied.')
    }
  }

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: 'spring' }}
            className="w-20 h-20 rounded-3xl bg-gradient-to-br from-red-500 to-violet flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-red-500/20">
            <Shield size={36} className="text-white" />
          </motion.div>
          <h1 className="text-2xl font-black text-white">Admin Access</h1>
          <p className="text-white/40 text-sm mt-1">Ngoms AI Control Panel</p>
        </div>

        <form onSubmit={submit} className="glass p-6 rounded-3xl space-y-4">
          {err && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle size={16} /> {err}
            </motion.div>
          )}
          <div>
            <label className="text-white/50 text-xs font-semibold mb-2 block">ADMIN EMAIL</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="admin@email.com" className="input-field pl-11" />
            </div>
          </div>
          <div>
            <label className="text-white/50 text-xs font-semibold mb-2 block">PASSWORD</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input type={show ? 'text' : 'password'} value={pass} onChange={e => setPass(e.target.value)} required
                placeholder="Enter password" className="input-field pl-11 pr-11" />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <motion.button whileTap={{ scale: 0.97 }} type="submit"
            className="w-full bg-gradient-to-r from-red-500 to-violet text-white font-bold py-3.5 rounded-xl shadow-lg shadow-violet/30 hover:scale-[1.02] transition-all">
            Secure Login
          </motion.button>
        </form>
        <p className="text-center text-white/20 text-xs mt-6">Protected by Ngoms AI Security</p>
      </motion.div>
    </div>
  )
}
