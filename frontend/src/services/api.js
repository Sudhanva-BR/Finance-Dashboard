import axios from 'axios'

// remove trailing slash if present
const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

const api = axios.create({
  baseURL: BASE_URL ? `${BASE_URL}/api` : '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Auth
export const register = (data) => api.post('auth/register/', data)
export const login    = (data) => api.post('auth/login/', data)
export const getMe    = ()     => api.get('auth/me/')

// Dashboard
export const getDashboard = () => api.get('dashboard/')

// Records
export const getRecords   = (params = {}) => api.get('records/', { params })
export const createRecord = (data)        => api.post('records/', data)
export const updateRecord = (id, data)    => api.put(`records/${id}/`, data)
export const deleteRecord = (id)          => api.delete(`records/${id}/`)

export default api