export interface User {
  id: string;
  username: string;
  role: 'admin' | 'staff';
  name: string;
}

export interface Santri {
  id: string;
  name: string;
  nis: string;
  dateOfBirth: string;
  address: string;
  parentName: string;
  phoneNumber: string;
  enrollmentDate: string;
  class: string;
  status: 'active' | 'inactive';
}

export interface Alumni {
  id: string;
  name: string;
  nis: string;
  graduationYear: string;
  address: string;
  phoneNumber: string;
  occupation: string;
  email: string;
}

export interface Asatidz {
  id: string;
  name: string;
  nip: string;
  subject: string;
  phoneNumber: string;
  address: string;
  joinDate: string;
  status: 'active' | 'inactive';
}

export interface Payment {
  id: string;
  santriId: string;
  amount: number;
  date: string;
  type: 'SPP' | 'Registration' | 'Other';
  status: 'paid' | 'pending';
  description?: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
}