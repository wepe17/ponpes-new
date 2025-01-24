import axios from 'axios';
import { config } from '../config/env';
import { Payment } from '../types';

const api = axios.create({
  baseURL: `${config.API_URL}/api/payments`,
  headers: { 'Content-Type': 'application/json' },
});

export const paymentsApi = {
  getAll: () => api.get<Payment[]>('').then(res => res.data),
  getById: (id: string) => api.get<Payment>(`/${id}`).then(res => res.data),
  create: (data: Omit<Payment, 'id'>) => api.post<Payment>('', data).then(res => res.data),
  update: (id: string, data: Partial<Payment>) => api.put<Payment>(`/${id}`, data).then(res => res.data),
  delete: (id: string) => api.delete(`/${id}`).then(res => res.data),
};