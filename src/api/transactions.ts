import axios from 'axios';
import { config } from '../config/env';
import { Transaction } from '../types';

const api = axios.create({
  baseURL: `${config.API_URL}/api/transactions`,
  headers: { 'Content-Type': 'application/json' },
});

export const transactionsApi = {
  getAll: () => api.get<Transaction[]>('').then(res => res.data),
  getById: (id: string) => api.get<Transaction>(`/${id}`).then(res => res.data),
  create: (data: Omit<Transaction, 'id'>) => api.post<Transaction>('', data).then(res => res.data),
  update: (id: string, data: Partial<Transaction>) => api.put<Transaction>(`/${id}`, data).then(res => res.data),
  delete: (id: string) => api.delete(`/${id}`).then(res => res.data),
};