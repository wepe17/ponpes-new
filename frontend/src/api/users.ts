import axios from 'axios';
import { config } from '../config/env';
import { User } from '../types';

const api = axios.create({
  baseURL: `${config.API_URL}/api/users`,
  headers: { 'Content-Type': 'application/json' },
});

export const usersApi = {
  getAll: () => api.get<User[]>('').then(res => res.data),
  getById: (id: string) => api.get<User>(`/${id}`).then(res => res.data),
  create: (data: Omit<User, 'id'>) => api.post<User>('', data).then(res => res.data),
  update: (id: string, data: Partial<User>) => api.put<User>(`/${id}`, data).then(res => res.data),
  delete: (id: string) => api.delete(`/${id}`).then(res => res.data),
};