import { useEffect, useState } from 'react'
import { getDashboard } from '../services/api'
import { useAuth } from '../context/AuthContext'

const s = {
  page: { padding: '2rem', maxWidth: '900px', margin: '0 auto' },
  title: { fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.3rem' },
  subtitle: { color: '#666', marginBottom: '2rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' },
  card: (color) => ({ background: '#fff', borderTop: `4px solid ${color}`, borderRadius: '10px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }),
  cardLabel: { color: '#666', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem' },
  cardValue: (color) => ({ fontSize: '1.8rem', fontWeight: 700, color }),
  sectionTitle: { fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  th: { padding: '0.75rem 1rem', textAlign: 'left', background: '#f9fafb', fontSize: '0.8rem', fontWeight: 600, color: '#666', textTransform: 'uppercase', borderBottom: '1px solid #e5e7eb' },
  td: { padding: '0.75rem 1rem', fontSize: '0.9rem', borderBottom: '1px solid #f3f4f6' },
  badge: (type) => ({ padding: '2px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, background: type === 'income' ? '#dcfce7' : '#fef2f2', color: type === 'income' ? '#16a34a' : '#dc2626' }),
  error: { background: '#fef2f2', color: '#dc2626', padding: '1rem', borderRadius: '8px' },
}

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const fmt = (n) => `₹${Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)

  useEffect(() => {
    getDashboard().then(r => setData(r.data)).catch(() => setError('Failed to load dashboard.'))
  }, [])

  return (
    <div style={s.page}>
      <h1 style={s.title}>Dashboard</h1>
      <p style={s.subtitle}>Welcome back, {user?.username}!</p>
      {error && <div style={s.error}>{error}</div>}
      {data && <>
        <div style={s.grid}>
          <div style={s.card('#16a34a')}>
            <div style={s.cardLabel}>Total Income</div>
            <div style={s.cardValue('#16a34a')}>{fmt(data.total_income)}</div>
          </div>
          <div style={s.card('#dc2626')}>
            <div style={s.cardLabel}>Total Expenses</div>
            <div style={s.cardValue('#dc2626')}>{fmt(data.total_expenses)}</div>
          </div>
          <div style={s.card(data.net_balance >= 0 ? '#4f46e5' : '#ea580c')}>
            <div style={s.cardLabel}>Net Balance</div>
            <div style={s.cardValue(data.net_balance >= 0 ? '#4f46e5' : '#ea580c')}>{fmt(data.net_balance)}</div>
          </div>
        </div>
        <h2 style={s.sectionTitle}>Category Breakdown</h2>
        {data.category_totals.length === 0
          ? <p style={{ color: '#888' }}>No records yet. Add some from the Records page.</p>
          : <table style={s.table}>
              <thead><tr>
                <th style={s.th}>Category</th>
                <th style={s.th}>Type</th>
                <th style={s.th}>Total</th>
              </tr></thead>
              <tbody>
                {data.category_totals.map((row, i) => (
                  <tr key={i}>
                    <td style={s.td}>{cap(row.category)}</td>
                    <td style={s.td}><span style={s.badge(row.type)}>{row.type}</span></td>
                    <td style={s.td}>{fmt(row.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
        }
      </>}
    </div>
  )
}