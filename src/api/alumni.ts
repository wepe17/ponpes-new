import axios from 'axios';
import { config } from '../config/env';
import { Alumni } from '../types';

const api = axios.create({
  baseURL: `${config.API_URL}/api/alumni`,
  headers: { 'Content-Type': 'application/json' },
});

export const alumniApi = {
  getAll: () => api.get<Alumni[]>('').then(res => res.data),
  getById: (id: string) => api.get<Alumni>(`/${id}`).then(res => res.data),
  create: (data: Omit<Alumni, 'id'>) => api.post<Alumni>('', data).then(res => res.data),
  update: (id: string, data: Partial<Alumni>) => api.put<Alumni>(`/${id}`, data).then(res => res.data),
  delete: (id: string) => api.delete(`/${id}`).then(res => res.data),
};