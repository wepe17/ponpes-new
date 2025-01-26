export interface User {
  id?: string;
  username: string;
  role: "admin" | "staff";
  name: string;
}

export interface Santri {
  id: string;
  name: string;
  nis: string;
  date_of_birth: string;
  address: string;
  parent_name: string;
  phone_number: string;
  enrollment_date: string;
  class: string;
  status: "active" | "inactive";
}

export interface Alumni {
  id: string;
  name: string;
  nis: string;
  graduation_year: string;
  address: string;
  phone_number: string;
  occupation: string;
  email: string;
}

export interface Asatidz {
  id: string;
  name: string;
  nip: string;
  subject: string;
  phone_number: string;
  address: string;
  join_date: string;
  status: "active" | "inactive";
}

export interface Payment {
  id: string;
  santriId: string;
  amount: number;
  date: string;
  type: "SPP" | "Registration" | "Other";
  status: "paid" | "pending";
  description?: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  description: string;
}
