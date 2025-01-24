import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: async (username: string, password: string) => {
    // In a real app, this would make an API call
    if (username === 'admin' && password === 'admin') {
      set({
        user: {
          id: '1',
          username: 'admin',
          role: 'admin',
          name: 'Administrator'
        }
      });
    } else {
      throw new Error('Invalid credentials');
    }
  },
  logout: () => set({ user: null })
}));