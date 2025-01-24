import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Santri, Asatidz, User, Payment, Transaction, Alumni } from '../types';

interface DatabaseState {
  santri: Santri[];
  asatidz: Asatidz[];
  users: User[];
  payments: Payment[];
  transactions: Transaction[];
  alumni: Alumni[];
  
  // Santri CRUD
  addSantri: (data: Omit<Santri, 'id'>) => void;
  updateSantri: (id: string, data: Partial<Santri>) => void;
  deleteSantri: (id: string) => void;
  
  // Asatidz CRUD
  addAsatidz: (data: Omit<Asatidz, 'id'>) => void;
  updateAsatidz: (id: string, data: Partial<Asatidz>) => void;
  deleteAsatidz: (id: string) => void;
  
  // User CRUD
  addUser: (data: Omit<User, 'id'>) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  deleteUser: (id: string) => void;
  
  // Payment CRUD
  addPayment: (data: Omit<Payment, 'id'>) => void;
  updatePayment: (id: string, data: Partial<Payment>) => void;
  deletePayment: (id: string) => void;
  
  // Transaction CRUD
  addTransaction: (data: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, data: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // Alumni CRUD
  addAlumni: (data: Omit<Alumni, 'id'>) => void;
  updateAlumni: (id: string, data: Partial<Alumni>) => void;
  deleteAlumni: (id: string) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useDatabase = create<DatabaseState>()(
  persist(
    (set) => ({
      santri: [],
      asatidz: [],
      users: [],
      payments: [],
      transactions: [],
      alumni: [],

      // Santri CRUD
      addSantri: (data) => set((state) => ({
        santri: [...state.santri, { ...data, id: generateId() }]
      })),
      updateSantri: (id, data) => set((state) => ({
        santri: state.santri.map((s) => s.id === id ? { ...s, ...data } : s)
      })),
      deleteSantri: (id) => set((state) => ({
        santri: state.santri.filter((s) => s.id !== id)
      })),

      // Asatidz CRUD
      addAsatidz: (data) => set((state) => ({
        asatidz: [...state.asatidz, { ...data, id: generateId() }]
      })),
      updateAsatidz: (id, data) => set((state) => ({
        asatidz: state.asatidz.map((a) => a.id === id ? { ...a, ...data } : a)
      })),
      deleteAsatidz: (id) => set((state) => ({
        asatidz: state.asatidz.filter((a) => a.id !== id)
      })),

      // User CRUD
      addUser: (data) => set((state) => ({
        users: [...state.users, { ...data, id: generateId() }]
      })),
      updateUser: (id, data) => set((state) => ({
        users: state.users.map((u) => u.id === id ? { ...u, ...data } : u)
      })),
      deleteUser: (id) => set((state) => ({
        users: state.users.filter((u) => u.id !== id)
      })),

      // Payment CRUD
      addPayment: (data) => set((state) => ({
        payments: [...state.payments, { ...data, id: generateId() }]
      })),
      updatePayment: (id, data) => set((state) => ({
        payments: state.payments.map((p) => p.id === id ? { ...p, ...data } : p)
      })),
      deletePayment: (id) => set((state) => ({
        payments: state.payments.filter((p) => p.id !== id)
      })),

      // Transaction CRUD
      addTransaction: (data) => set((state) => ({
        transactions: [...state.transactions, { ...data, id: generateId() }]
      })),
      updateTransaction: (id, data) => set((state) => ({
        transactions: state.transactions.map((t) => t.id === id ? { ...t, ...data } : t)
      })),
      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id)
      })),

      // Alumni CRUD
      addAlumni: (data) => set((state) => ({
        alumni: [...state.alumni, { ...data, id: generateId() }]
      })),
      updateAlumni: (id, data) => set((state) => ({
        alumni: state.alumni.map((a) => a.id === id ? { ...a, ...data } : a)
      })),
      deleteAlumni: (id) => set((state) => ({
        alumni: state.alumni.filter((a) => a.id !== id)
      })),
    }),
    {
      name: 'pesantren-db',
    }
  )
);