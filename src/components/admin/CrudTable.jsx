import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, X, Save, ChevronDown } from 'lucide-react'

export default function CrudTable({ title, columns, data, fields, onCreate, onUpdate, onDelete, renderCell }) {
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null)
  const [creating, setCreating] = useState(false)
  const [confirmDel, setConfirmDel] = useState(null)

  const filtered = data.filter(d => 
    columns.some(c => String(d[c.key] || '').toLowerCase().includes(search.toLowerCase()))
  )

  const startCreate = () => { setCreating(true); setEditing(null) }
  const startEdit = (item) => { setEditing(item); setCreating(false) }

  const saveEdit = (formData) => {
    if (creating) { onCreate(formData); setCreating(false) }
    else if (editing) { onUpdate(editing.id, formData); setEditing(null) }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${title}...`}
            className="input-field pl-9 py-2 text-sm" />
        </div>
        <motion.button whileTap={{ scale: 0.95 }} onClick={startCreate}
          className="bg-gradient-to-r from-primary to-violet text-white font-semibold px-4 py-2 rounded-xl text-sm flex items-center gap-1.5 hover:scale-105 transition-all">
          <Plus size={16} /> Add
        </motion.button>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/40 text-xs uppercase">
                {columns.map(c => <th key={c.key} className="text-left px-4 py-3 font-semibold">{c.label}</th>)}
                <th className="text-right px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={columns.length + 1} className="text-center text-white/30 py-12">No records found</td></tr>
              ) : filtered.map((item, i) => (
                <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  {columns.map(c => (
                    <td key={c.key} className="px-4 py-3 text-white/80">
                      {renderCell ? renderCell(c.key, item[c.key], item) : String(item[c.key] ?? '—')}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => startEdit(item)} className="p-1.5 rounded-lg hover:bg-primary/20 text-primary/60 hover:text-primary transition-all">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => setConfirmDel(item)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400/60 hover:text-red-400 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-white/30 text-xs mt-3">{filtered.length} of {data.length} records</p>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {(creating || editing) && (
          <EditModal title={creating ? `New ${title}` : `Edit ${title}`} fields={fields}
            initial={editing || {}} onSave={saveEdit} onClose={() => { setCreating(false); setEditing(null) }} />
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {confirmDel && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-6"
            onClick={() => setConfirmDel(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()} className="glass p-6 rounded-3xl max-w-sm w-full">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center mb-4">
                <Trash2 size={24} className="text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Delete this record?</h3>
              <p className="text-white/40 text-sm mb-6">This action cannot be undone. The record will be permanently removed.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDel(null)} className="flex-1 glass py-3 rounded-xl text-white/60 hover:text-white text-sm font-semibold">Cancel</button>
                <button onClick={() => { onDelete(confirmDel.id); setConfirmDel(null) }}
                  className="flex-1 bg-red-500 py-3 rounded-xl text-white font-bold text-sm hover:bg-red-600 transition-colors">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function EditModal({ title, fields, initial, onSave, onClose }) {
  const [form, setForm] = useState(() => {
    const f = {}
    fields.forEach(field => { f[field.key] = initial[field.key] ?? field.default ?? '' })
    return f
  })

  const submit = (e) => { e.preventDefault(); onSave(form) }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-6"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()} className="glass p-6 rounded-3xl max-w-md w-full max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-white/40 hover:text-white"><X size={18} /></button>
      </div>
      <form onSubmit={submit} className="space-y-4">
        {fields.map(field => (
          <div key={field.key}>
            <label className="text-white/50 text-xs font-semibold mb-1.5 block uppercase tracking-wide">{field.label}</label>
            {field.type === 'select' ? (
              <select value={form[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                className="input-field">
                {field.options.map(o => <option key={o} value={o} className="bg-navy-800">{o}</option>)}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea value={form[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                rows={3} className="input-field resize-none" placeholder={field.placeholder || ''} />
            ) : (
              <input type={field.type || 'text'} value={form[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                className="input-field" placeholder={field.placeholder || ''} />
            )}
          </div>
        ))}
        <motion.button whileTap={{ scale: 0.97 }} type="submit"
          className="w-full bg-gradient-to-r from-primary to-violet text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
          <Save size={16} /> Save Changes
        </motion.button>
      </form>
    </motion.div>
    </motion.div>
  )
}
