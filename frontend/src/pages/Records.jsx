import { useEffect, useState } from 'react'
import { getRecords, createRecord, updateRecord, deleteRecord } from '../services/api'
import { useAuth } from '../context/AuthContext'

const CATS = ['salary','freelance','investment','food','transport','housing','healthcare','entertainment','utilities','education','other']
const EMPTY = { amount: '', type: 'income', category: 'salary', date: '', note: '' }

const s = {
  page: { padding: '2rem', maxWidth: '1000px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  title: { fontSize: '1.8rem', fontWeight: 700 },
  addBtn: { background: '#4f46e5', color: '#fff', border: 'none', padding: '0.65rem 1.25rem', borderRadius: '8px', fontWeight: 600 },
  filters: { display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  sel: { padding: '0.5rem 0.75rem', border: '1px solid #ddd', borderRadius: '8px', background: '#fff' },
  inp: { padding: '0.5rem 0.75rem', border: '1px solid #ddd', borderRadius: '8px' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  th: { padding: '0.75rem 1rem', textAlign: 'left', background: '#f9fafb', fontSize: '0.8rem', fontWeight: 600, color: '#666', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' },
  td: { padding: '0.75rem 1rem', fontSize: '0.9rem', borderBottom: '1px solid #f3f4f6' },
  badge: (t) => ({ padding: '2px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, background: t === 'income' ? '#dcfce7' : '#fef2f2', color: t === 'income' ? '#16a34a' : '#dc2626' }),
  editBtn: { background: '#f3f4f6', border: '1px solid #ddd', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', marginRight: '0.4rem' },
  delBtn: { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: '#fff', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '480px' },
  modalTitle: { fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem' },
  lbl: { display: 'block', marginBottom: '0.3rem', fontWeight: 500, fontSize: '0.85rem', color: '#444' },
  fi: { width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '1rem' },
  row: { display: 'flex', gap: '0.75rem', marginTop: '0.5rem' },
  saveBtn: { flex: 1, padding: '0.65rem', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600 },
  cancelBtn: { flex: 1, padding: '0.65rem', background: '#f3f4f6', border: '1px solid #ddd', borderRadius: '8px', fontWeight: 600 },
  error: { background: '#fef2f2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' },
}

export default function Records() {
  const [records, setRecords] = useState([])
  const [filters, setFilters] = useState({ type: '', category: '', date_from: '', date_to: '' })
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const { user } = useAuth()

  const fetch = async () => {
    const params = Object.fromEntries(Object.entries(filters).filter(([,v]) => v))
    const res = await getRecords(params)
    setRecords(res.data)
  }

  useEffect(() => { fetch() }, [filters])

  const openCreate = () => { setEditing(null); setForm(EMPTY); setFormError(''); setShowModal(true) }
  const openEdit = (r) => { setEditing(r); setForm({ amount: r.amount, type: r.type, category: r.category, date: r.date, note: r.note }); setFormError(''); setShowModal(true) }

  const save = async () => {
    if (!form.amount || !form.date) { setFormError('Amount and date are required.'); return }
    if (parseFloat(form.amount) <= 0) { setFormError('Amount must be positive.'); return }
    setSaving(true)
    try {
      editing ? await updateRecord(editing.id, form) : await createRecord(form)
      setShowModal(false); fetch()
    } catch (err) {
      const d = err.response?.data
      setFormError(d ? Object.values(d).flat().join(' ') : 'Save failed.')
    } finally { setSaving(false) }
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this record?')) return
    await deleteRecord(id); fetch()
  }

  const fmt = (n) => `₹${Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
  const cap = (x) => x.charAt(0).toUpperCase() + x.slice(1)
  const sf = (f) => (e) => setFilters({ ...filters, [f]: e.target.value })
  const ff = (f) => (e) => setForm({ ...form, [f]: e.target.value })

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>Records</h1>
        <button style={s.addBtn} onClick={openCreate}>+ Add Record</button>
      </div>

      <div style={s.filters}>
        <select style={s.sel} value={filters.type} onChange={sf('type')}>
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select style={s.sel} value={filters.category} onChange={sf('category')}>
          <option value="">All Categories</option>
          {CATS.map(c => <option key={c} value={c}>{cap(c)}</option>)}
        </select>
        <input style={s.inp} type="date" value={filters.date_from} onChange={sf('date_from')} />
        <input style={s.inp} type="date" value={filters.date_to} onChange={sf('date_to')} />
        <button style={s.editBtn} onClick={() => setFilters({ type:'', category:'', date_from:'', date_to:'' })}>Clear</button>
      </div>

      <table style={s.table}>
        <thead><tr>
          <th style={s.th}>Date</th><th style={s.th}>Type</th>
          <th style={s.th}>Category</th><th style={s.th}>Amount</th>
          <th style={s.th}>Note</th>
          {['analyst','admin'].includes(user?.role) && <th style={s.th}>Actions</th>}
        </tr></thead>
        <tbody>
          {records.length === 0
            ? <tr><td colSpan={6} style={{...s.td, textAlign:'center', color:'#888', padding:'2rem'}}>No records found.</td></tr>
            : records.map(r => (
              <tr key={r.id}>
                <td style={s.td}>{r.date}</td>
                <td style={s.td}><span style={s.badge(r.type)}>{r.type}</span></td>
                <td style={s.td}>{cap(r.category)}</td>
                <td style={s.td}>{fmt(r.amount)}</td>
                <td style={s.td}>{r.note || '—'}</td>
                {['analyst','admin'].includes(user?.role) && (
                  <td style={s.td}>
                    <button style={s.editBtn} onClick={() => openEdit(r)}>Edit</button>
                    {user.role === 'admin' && <button style={s.delBtn} onClick={() => remove(r.id)}>Delete</button>}
                  </td>
                )}
              </tr>
            ))
          }
        </tbody>
      </table>

      {showModal && (
        <div style={s.overlay} onClick={() => setShowModal(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h2 style={s.modalTitle}>{editing ? 'Edit Record' : 'Add Record'}</h2>
            {formError && <div style={s.error}>{formError}</div>}
            <label style={s.lbl}>Amount (₹)</label>
            <input style={s.fi} type="number" min="0.01" step="0.01" value={form.amount} onChange={ff('amount')} />
            <label style={s.lbl}>Type</label>
            <select style={s.fi} value={form.type} onChange={ff('type')}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <label style={s.lbl}>Category</label>
            <select style={s.fi} value={form.category} onChange={ff('category')}>
              {CATS.map(c => <option key={c} value={c}>{cap(c)}</option>)}
            </select>
            <label style={s.lbl}>Date</label>
            <input style={s.fi} type="date" value={form.date} onChange={ff('date')} />
            <label style={s.lbl}>Note (optional)</label>
            <input style={s.fi} value={form.note} onChange={ff('note')} />
            <div style={s.row}>
              <button style={s.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
              <button style={s.saveBtn} onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}