import { useState } from 'react'
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
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    setLoading(true)
    const ok = await adminLogin(email.trim(), pass)
    setLoading(false)
    if (ok) {
      nav('/admin')
    } else {
      setErr('Invalid credentials. Access denied.')
    }
  }

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-violet flex items-center justify-center mx-auto mb-3 shadow-lg shadow-red-500/20">
            <Shield size={30} className="text-white" />
          </div>
          <h1 className="text-xl font-black text-white">Admin Access</h1>
          <p className="text-white/40 text-sm mt-0.5">Ngoms AI Control Panel</p>
        </div>

        <form onSubmit={submit} className="glass p-5 rounded-2xl space-y-3">
          {err && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2.5 flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle size={14} /> {err}
            </div>
          )}
          <div>
            <label className="text-white/50 text-xs font-semibold mb-1.5 block">ADMIN EMAIL</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="admin@email.com" className="input-field pl-11" />
            </div>
          </div>
          <div>
            <label className="text-white/50 text-xs font-semibold mb-1.5 block">PASSWORD</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input type={show ? 'text' : 'password'} value={pass} onChange={e => setPass(e.target.value)} required
                placeholder="Enter password" className="input-field pl-11 pr-11" />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30">
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-red-500 to-violet text-white font-bold py-3 rounded-xl shadow-lg shadow-violet/30 active:scale-[0.98] transition-transform disabled:opacity-50">
            {loading ? 'Verifying...' : 'Secure Login'}
          </button>
        </form>
        <p className="text-center text-white/20 text-xs mt-4">Protected by Ngoms AI Security</p>
      </div>
    </div>
  )
}
