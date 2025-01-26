import axios from 'axios';
import { config } from '../config/env';
import { Asatidz } from '../types';

const api = axios.create({
  baseURL: `${config.API_URL}/api/asatidz`,
  headers: { 'Content-Type': 'application/json' },
});

export const asatidzApi = {
  getAll: () => api.get<Asatidz[]>('').then(res => res.data),
  getById: (id: string) => api.get<Asatidz>(`/${id}`).then(res => res.data),
  create: (data: Omit<Asatidz, 'id'>) => api.post<Asatidz>('', data).then(res => res.data),
  update: (id: string, data: Partial<Asatidz>) => api.put<Asatidz>(`/${id}`, data).then(res => res.data),
  delete: (id: string) => api.delete(`/${id}`).then(res => res.data),
};