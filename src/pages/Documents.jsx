import { useState } from 'react'
import { Upload, Search, FileText, Filter, Eye, Download, Trash2, Tag, Plus, X } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Documents() {
  const { documents, create, remove, loading } = useApp()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [showUpload, setShowUpload] = useState(false)

  const filtered = (documents || []).filter(d => {
    const matchSearch = (d.title || '').toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || d.status === filter
    return matchSearch && matchFilter
  })

  const handleDelete = async (id) => {
    await remove('documents', id)
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-black text-white">Documents</h1>
          <p className="text-white/40 text-sm mt-0.5">Your study library</p>
        </div>
        <button onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-primary to-violet text-white text-sm font-semibold active:scale-95 transition-transform">
          <Plus size={16} /> Upload
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search documents..."
            className="input-field pl-10 text-sm"
          />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="glass rounded-xl px-3 text-sm text-white/70 outline-none">
          <option value="all" className="bg-navy-800">All</option>
          <option value="approved" className="bg-navy-800">Approved</option>
          <option value="pending" className="bg-navy-800">Pending</option>
          <option value="rejected" className="bg-navy-800">Rejected</option>
        </select>
      </div>

      {/* Documents list */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-16 rounded-2xl bg-white/5 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <FileText size={48} className="text-white/10 mx-auto mb-3" />
          <p className="text-white/30 text-sm">No documents found</p>
          <p className="text-white/20 text-xs mt-1">Upload a PDF or DOCX to get started</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((d) => (
            <div key={d.id} className="glass p-3.5 rounded-2xl flex items-center gap-3 active:scale-[0.98] transition-transform">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                d.type === 'pdf' ? 'bg-red-500/20 text-red-400' :
                d.type === 'docx' ? 'bg-blue-500/20 text-blue-400' :
                'bg-emerald-500/20 text-emerald-400'
              }`}>
                <FileText size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{d.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-white/40 text-xs">{d.size || '—'}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                    d.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                    d.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>{d.status}</span>
                </div>
              </div>
              <button onClick={() => handleDelete(d.id)}
                className="p-2 rounded-lg text-white/30 hover:text-red-400 active:scale-90 transition-all">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4"
          onClick={() => setShowUpload(false)}>
          <div className="glass rounded-2xl p-5 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg">Upload Document</h2>
              <button onClick={() => setShowUpload(false)} className="text-white/40"><X size={20} /></button>
            </div>
            <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center mb-3">
              <Upload size={32} className="text-white/20 mx-auto mb-2" />
              <p className="text-white/40 text-sm">Tap to select a file</p>
              <p className="text-white/20 text-xs mt-0.5">PDF, DOCX, images up to 10MB</p>
            </div>
            <button onClick={() => {
              create('documents', { title: 'New Document.pdf', size: '1.2 MB', type: 'pdf', uploadedBy: 'Davie Kuminga', date: new Date().toISOString().split('T')[0], status: 'pending' })
              setShowUpload(false)
            }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-violet text-white font-bold text-sm active:scale-95 transition-transform">
              Upload Now
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
