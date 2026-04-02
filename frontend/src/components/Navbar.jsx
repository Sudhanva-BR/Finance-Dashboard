import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const s = {
  nav: { background: '#1a1a2e', color: '#fff', padding: '0 2rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  brand: { fontWeight: 700, fontSize: '1.2rem', color: '#fff', textDecoration: 'none' },
  links: { display: 'flex', gap: '1.5rem', alignItems: 'center' },
  link: { color: '#ccc', textDecoration: 'none', fontSize: '0.9rem' },
  badge: { background: '#4f46e5', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', marginLeft: '0.5rem' },
  logoutBtn: { background: 'transparent', border: '1px solid #555', color: '#ccc', padding: '4px 12px', borderRadius: '6px', fontSize: '0.85rem' },
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  if (!user) return null

  return (
    <nav style={s.nav}>
      <Link to="/dashboard" style={s.brand}>💰 FinanceApp</Link>
      <div style={s.links}>
        <Link to="/dashboard" style={s.link}>Dashboard</Link>
        {['analyst', 'admin'].includes(user.role) && (
          <Link to="/records" style={s.link}>Records</Link>
        )}
        <span style={{ color: '#ccc', fontSize: '0.85rem' }}>
          {user.username}<span style={s.badge}>{user.role}</span>
        </span>
        <button style={s.logoutBtn} onClick={() => { logout(); navigate('/login') }}>Logout</button>
      </div>
    </nav>
  )
}