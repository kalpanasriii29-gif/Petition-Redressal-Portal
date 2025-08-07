import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function saveToken(token) {
  localStorage.setItem('auth_token', token);
}

export function clearToken() {
  localStorage.removeItem('auth_token');
}

export async function login(role, code) {
  const { data } = await api.post('/auth/login', { role, code });
  saveToken(data.token);
  return data;
}

export async function logout() {
  await api.post('/auth/logout');
  clearToken();
}

export async function submitPetition(payload) {
  const { data } = await api.post('/petitions', payload);
  return data;
}

export async function trackPetition(petitionId) {
  const { data } = await api.get(`/petitions/track/${petitionId}`);
  return data;
}

export async function listPetitions(params) {
  const { data } = await api.get('/petitions', { params });
  return data;
}

export async function getPetition(id) {
  const { data } = await api.get(`/petitions/${id}`);
  return data;
}

export async function updateStatus(id, status) {
  const { data } = await api.put(`/petitions/${id}/status`, { status });
  return data;
}

export async function addResponse(id, payload) {
  const { data } = await api.post(`/petitions/${id}/response`, payload);
  return data;
}

export async function analytics() {
  const { data } = await api.get('/admin/analytics');
  return data;
}

export async function deletePetition(id) {
  const { data } = await api.delete(`/admin/petitions/${id}`);
  return data;
}