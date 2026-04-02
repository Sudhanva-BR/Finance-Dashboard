import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

export const register = (data) => api.post('/auth/register/', data)
export const login    = (data) => api.post('/auth/login/', data)
export const getMe    = ()     => api.get('/auth/me/')

export const getDashboard = () => api.get('/dashboard/')

export const getRecords    = (params = {}) => api.get('/records/', { params })
export const createRecord  = (data)        => api.post('/records/', data)
export const updateRecord  = (id, data)    => api.put(`/records/${id}/`, data)
export const deleteRecord  = (id)          => api.delete(`/records/${id}/`)

export default api