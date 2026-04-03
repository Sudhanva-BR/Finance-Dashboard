import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/',
  headers: { 'Content-Type': 'application/json' },
})

export const register = (data) => api.post('api/auth/register/', data)
export const login    = (data) => api.post('api/auth/login/', data)
export const getMe    = ()     => api.get('api/auth/me/')

export const getDashboard = () => api.get('api/dashboard/')

export const getRecords    = (params = {}) => api.get('api/records/', { params })
export const createRecord  = (data)        => api.post('api/records/', data)
export const updateRecord  = (id, data)    => api.put(`api/records/${id}/`, data)
export const deleteRecord  = (id)          => api.delete(`api/records/${id}/`)

export default api