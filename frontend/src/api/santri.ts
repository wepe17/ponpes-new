import axios from 'axios';
import { config } from '../config/env';
import { Santri } from '../types';

const api = axios.create({
  baseURL: `${config.API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const santriApi = {
  getAll: async () => {
    const response = await api.get<Santri[]>('/santri');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Santri>(`/santri/${id}`);
    return response.data;
  },

  create: async (data: Omit<Santri, 'id'>) => {
    const response = await api.post<Santri>('/santri', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Santri>) => {
    const response = await api.put<Santri>(`/santri/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/santri/${id}`);
  },
};