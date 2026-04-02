import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { register as registerApi } from '../services/api'

const s = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  card: { background: '#fff', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: '100%', maxWidth: '420px' },
  title: { fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.5rem' },
  subtitle: { color: '#666', marginBottom: '2rem', fontSize: '0.9rem' },
  label: { display: 'block', marginBottom: '0.3rem', fontWeight: 500, fontSize: '0.85rem', color: '#444' },
  input: { width: '100%', padding: '0.65rem 0.9rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', marginBottom: '1rem' },
  btn: { width: '100%', padding: '0.75rem', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 600 },
  error: { background: '#fef2f2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' },
  link: { display: 'block', textAlign: 'center', marginTop: '1.5rem', color: '#4f46e5', fontSize: '0.9rem' },
}

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', password2: '', role: 'viewer' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    if (form.password !== form.password2) { setError('Passwords do not match.'); return }
    setLoading(true)
    try {
      const res = await registerApi(form)
      login(res.data.user, res.data.access)
      navigate('/dashboard')
    } catch (err) {
      const data = err.response?.data
      setError(data ? Object.values(data).flat().join(' ') : 'Registration failed.')
    } finally { setLoading(false) }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h1 style={s.title}>Create account</h1>
        <p style={s.subtitle}>Get started with FinanceApp</p>
        {error && <div style={s.error}>{error}</div>}
        <form onSubmit={submit}>
          <label style={s.label}>Username</label>
          <input style={s.input} name="username" value={form.username} onChange={set('username')} required />
          <label style={s.label}>Email</label>
          <input style={s.input} name="email" type="email" value={form.email} onChange={set('email')} required />
          <label style={s.label}>Role</label>
          <select style={s.input} value={form.role} onChange={set('role')}>
            <option value="viewer">Viewer</option>
            <option value="analyst">Analyst</option>
            <option value="admin">Admin</option>
          </select>
          <label style={s.label}>Password</label>
          <input style={s.input} name="password" type="password" value={form.password} onChange={set('password')} required />
          <label style={s.label}>Confirm Password</label>
          <input style={s.input} name="password2" type="password" value={form.password2} onChange={set('password2')} required />
          <button style={s.btn} type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
        </form>
        <Link to="/login" style={s.link}>Already have an account? Sign in</Link>
      </div>
    </div>
  )
}