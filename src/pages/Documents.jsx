import { useState } from 'react'
import { FileText, Search, Upload, ExternalLink, Trash2, Plus, ChevronRight, BookOpen } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Documents() {
  const { documents, create, remove } = useApp()
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ title: '', category: '', url: '', description: '' })

  const docs = (documents || []).filter(d =>
    !search || d.title?.toLowerCase().includes(search.toLowerCase()) || d.category?.toLowerCase().includes(search.toLowerCase())
  )

  const save = async () => {
    if (!form.title.trim()) return
    await create('documents', { ...form, status: 'Active', views: 0 })
    setForm({ title: '', category: '', url: '', description: '' }); setShowAdd(false)
  }

  const categories = [...new Set((documents || []).map(d => d.category).filter(Boolean))]

  return (
    <div className="px-5 pt-12 pb-6 max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-black text-ink">Documents</h1>
          <p className="text-sm text-ink-muted">{docs.length} materials</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="w-11 h-11 rounded-2xl bg-brand flex items-center justify-center shadow-btn active:scale-95">
          <Plus size={20} className="text-white" />
        </button>
      </div>

      {/* Search */}
      <div className="search-bar mb-4">
        <Search size={16} className="text-ink-muted shrink-0" />
        <input className="flex-1 bg-transparent text-sm text-ink placeholder-ink-faint focus:outline-none" placeholder="Search documents..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="card mb-5 animate-slide-up">
          <p className="font-bold text-ink mb-3">Add Document</p>
          <div className="space-y-3">
            <input className="input" placeholder="Title *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            <input className="input" placeholder="Category (e.g. Biology, Maths)" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
            <input className="input" placeholder="URL / Link (optional)" value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} />
            <textarea className="input resize-none" rows={2} placeholder="Description (optional)" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            <div className="flex gap-2">
              <button onClick={save} disabled={!form.title.trim()} className="btn-primary flex-1 py-3 text-sm">Add</button>
              <button onClick={() => setShowAdd(false)} className="btn-ghost flex-1 py-3 text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Documents list */}
      {docs.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-soft flex items-center justify-center mb-4">
            <BookOpen size={28} className="text-brand" />
          </div>
          <p className="font-bold text-ink mb-1">No documents yet</p>
          <p className="text-sm text-ink-muted mb-5">Add study materials, links, or resources</p>
          <button onClick={() => setShowAdd(true)} className="btn-primary px-8">Add Document</button>
        </div>
      ) : (
        <div className="space-y-3">
          {docs.map(d => (
            <div key={d.id} className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-surface-border shadow-card">
              <div className="w-11 h-11 rounded-2xl bg-brand-soft flex items-center justify-center shrink-0">
                <FileText size={18} className="text-brand" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-ink truncate">{d.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  {d.category && <span className="chip text-[10px]">{d.category}</span>}
                  {d.description && <span className="text-xs text-ink-muted truncate">{d.description}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {d.url && (
                  <a href={d.url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-xl bg-brand-soft flex items-center justify-center text-brand active:scale-95">
                    <ExternalLink size={14} />
                  </a>
                )}
                <button onClick={() => remove('documents', d.id)} className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-danger active:scale-95">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
