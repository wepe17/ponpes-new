import { create } from "zustand";
import { Transaction } from "../types";
import apiClient from "../config/axios";

interface TransactionState {
  transaction: Array<any>;
  pagination: {
    total: number;
    currentPage: number;
    totalPages: number;
  };
  loading: boolean;
  error: string | null;
  success: boolean;
  allTransaction: (params: any) => Promise<void>;
  addTransaction: (
    data: Omit<Transaction, "id">,
  ) => Promise<{ statusCode: number }>;
  updateTransaction: (
    id: string,
    data: Omit<Transaction, "id">,
  ) => Promise<{ statusCode: number }>;
  deleteTransaction: (id: string) => Promise<void>;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  pagination: {
    total: 0,
    currentPage: 1,
    totalPages: 0,
  },
  transaction: [],
  loading: false,
  success: false,
  error: null,
  allTransaction: async (params: any) => {
    set({ loading: true });
    try {
      const { page = 1, limit = 10, search = "" } = params || {};
      const resp = await apiClient.get("/api/transactions", {
        params: { page, limit, search },
      });
      if (resp.status === 200) {
        const { data, total, page: currentPage, total_pages } = resp.data;
        set({
          transaction: data,
          pagination: {
            total,
            currentPage,
            totalPages: total_pages,
          },
          loading: false,
        });
      } else {
        set({ loading: false, success: false });
      }
    } catch (error) {
      set({ loading: false, success: false });
      console.error(error);
    }
  },
  addTransaction: async (
    data: Omit<Transaction, "id">,
  ): Promise<{ statusCode: number }> => {
    set({ loading: true, success: false });
    try {
      const resp = await apiClient.post("/api/transactions", data);
      if (resp.status === 200) {
        set({ loading: false, success: true });
        return resp.data;
      }
      return { statusCode: resp.status };
    } catch (error) {
      set({ loading: false, success: false });
      throw new Error("Failed to add transaction");
      return { statusCode: 400 };
    }
  },
  updateTransaction: async (id, data): Promise<{ statusCode: number }> => {
    set({ loading: true });
    try {
      const resp = await apiClient.put(`/api/transactions/${id}`, data);
      if (resp.status === 200) {
        set({ loading: false, success: true });
        return resp.data;
      }
      return { statusCode: resp.status };
    } catch (error) {
      set({ loading: false });
      throw new Error("Failed to update transaction");
      return { statusCode: 400 };
    }
  },
  deleteTransaction: async (id) => {
    set({ loading: true });
    try {
      const resp = await apiClient.delete(`/api/transactions/${id}`);
      if (resp.status === 200) {
        set({ loading: false });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      set({ loading: false });
      // toast.error("Failed to delete transaction");
      console.error(error);
    }
  },
}));
