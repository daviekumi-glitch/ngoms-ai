import { useState, useRef } from 'react'
import { Upload, Search, FileText, Eye, Trash2, Plus, X, File } from 'lucide-react'
import { useApp } from '../context/AppContext'

const typeColors = {
  PDF: 'bg-red-500/20 text-red-400',
  DOCX: 'bg-blue-500/20 text-blue-400',
  PPTX: 'bg-orange-500/20 text-orange-400',
  XLSX: 'bg-emerald-500/20 text-emerald-400',
  Image: 'bg-violet/20 text-violet-300',
  Video: 'bg-pink-500/20 text-pink-400',
  Audio: 'bg-cyan-500/20 text-cyan-400',
}

const fileTypes = ['PDF', 'DOCX', 'PPTX', 'XLSX', 'Image', 'Video', 'Audio']

export default function Documents() {
  const { documents, create, remove, loading, user } = useApp()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [showUpload, setShowUpload] = useState(false)
  const [uploadData, setUploadData] = useState({ title: '', type: 'PDF', size: '', fileUrl: '' })
  const [creating, setCreating] = useState(false)
  const fileRef = useRef(null)

  const filtered = (documents || []).filter(d => {
    const matchSearch = (d.title || '').toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || (d.type || '').toUpperCase() === filter.toUpperCase()
    return matchSearch && matchFilter
  })

  const handleCreate = async () => {
    if (!uploadData.title.trim()) return
    setCreating(true)
    await create('documents', {
      title: uploadData.title,
      type: uploadData.type,
      size: uploadData.size || '—',
      fileUrl: uploadData.fileUrl || '',
      date: new Date().toISOString().split('T')[0],
      uploadedBy: user?.name || 'User',
      status: 'approved',
    })
    setUploadData({ title: '', type: 'PDF', size: '', fileUrl: '' })
    setCreating(false)
    setShowUpload(false)
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this document?')) {
      await remove('documents', id)
    }
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

      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search documents..." className="input-field pl-10 text-sm" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="glass rounded-xl px-3 text-sm text-white/70 outline-none">
          <option value="all" className="bg-navy-800">All Types</option>
          {fileTypes.map(t => <option key={t} value={t} className="bg-navy-800">{t}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-16 rounded-2xl bg-white/5 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <FileText size={48} className="text-white/10 mx-auto mb-3" />
          <p className="text-white/30 text-sm">No documents found</p>
          <p className="text-white/20 text-xs mt-1">Upload a file to get started</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((d) => (
            <div key={d.id} className="glass p-3.5 rounded-2xl flex items-center gap-3 active:scale-[0.98] transition-transform">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${typeColors[(d.type || 'PDF').toUpperCase()] || 'bg-emerald-500/20 text-emerald-400'}`}>
                <FileText size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{d.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-white/40 text-xs">{d.size || '—'}</span>
                  <span className="text-white/20 text-xs">·</span>
                  <span className="text-white/40 text-xs">{d.type || 'File'}</span>
                  {d.uploadedBy && (<><span className="text-white/20 text-xs">·</span><span className="text-white/40 text-xs">{d.uploadedBy}</span></>)}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {d.fileUrl && (
                  <a href={d.fileUrl} target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-primary/20 text-primary/60 hover:text-primary transition-all">
                    <Eye size={16} />
                  </a>
                )}
                <button onClick={() => handleDelete(d.id)}
                  className="p-2 rounded-lg hover:bg-red-500/20 text-red-400/60 hover:text-red-400 transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4" onClick={() => setShowUpload(false)}>
          <div className="glass rounded-2xl p-5 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg">Upload Document</h2>
              <button onClick={() => setShowUpload(false)} className="text-white/40 hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-white/50 text-xs font-semibold mb-1.5 block uppercase">Document Title</label>
                <input value={uploadData.title} onChange={e => setUploadData({ ...uploadData, title: e.target.value })}
                  placeholder="e.g. Biology Chapter 1" className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/50 text-xs font-semibold mb-1.5 block uppercase">Type</label>
                  <select value={uploadData.type} onChange={e => setUploadData({ ...uploadData, type: e.target.value })} className="input-field">
                    {fileTypes.map(t => <option key={t} value={t} className="bg-navy-800">{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-white/50 text-xs font-semibold mb-1.5 block uppercase">Size</label>
                  <input value={uploadData.size} onChange={e => setUploadData({ ...uploadData, size: e.target.value })}
                    placeholder="e.g. 2.5 MB" className="input-field" />
                </div>
              </div>
              <div>
                <label className="text-white/50 text-xs font-semibold mb-1.5 block uppercase">File URL (optional)</label>
                <input value={uploadData.fileUrl} onChange={e => setUploadData({ ...uploadData, fileUrl: e.target.value })}
                  placeholder="https://..." className="input-field" />
              </div>
              <button onClick={handleCreate} disabled={creating || !uploadData.title.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-violet text-white font-bold text-sm active:scale-95 transition-transform disabled:opacity-50">
                {creating ? 'Uploading...' : 'Add Document'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
