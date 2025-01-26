import { create } from "zustand";
import { Payment } from "../types";
import apiClient from "../config/axios";

interface PaymentState {
  payments: Array<any>;
  pagination: {
    total: number;
    currentPage: number;
    totalPages: number;
  };
  loading: boolean;
  error: string | null;
  success: boolean;
  allPayment: (params: any) => Promise<void>;
  addPayment: (data: Omit<Payment, "id">) => Promise<{ statusCode: number }>;
  updatePayment: (
    id: string,
    data: Omit<Payment, "id">,
  ) => Promise<{ statusCode: number }>;
  deletePayment: (id: string) => Promise<void>;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  pagination: {
    total: 0,
    currentPage: 1,
    totalPages: 0,
  },
  payments: [],
  loading: false,
  success: false,
  error: null,
  allPayment: async (params: any) => {
    set({ loading: true });
    try {
      const { page = 1, limit = 10, search = "" } = params || {};
      const resp = await apiClient.get("/api/payments", {
        params: { page, limit, search },
      });
      if (resp.status === 200) {
        const { data, total, page: currentPage, total_pages } = resp.data;
        set({
          payments: data,
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
  addPayment: async (
    data: Omit<Payment, "id">,
  ): Promise<{ statusCode: number }> => {
    set({ loading: true, success: false });
    try {
      const resp = await apiClient.post("/api/payments", data);
      if (resp.status === 200) {
        set({ loading: false, success: true });
        return resp.data;
      }
      return { statusCode: resp.status };
    } catch (error) {
      set({ loading: false, success: false });
      throw new Error("Failed to add payments");
      return { statusCode: 400 };
    }
  },
  updatePayment: async (id, data): Promise<{ statusCode: number }> => {
    set({ loading: true });
    try {
      const resp = await apiClient.put(`/api/payments/${id}`, data);
      if (resp.status === 200) {
        set({ loading: false, success: true });
        return resp.data;
      }
      return { statusCode: resp.status };
    } catch (error) {
      set({ loading: false });
      throw new Error("Failed to update payments");
      return { statusCode: 400 };
    }
  },
  deletePayment: async (id) => {
    set({ loading: true });
    try {
      const resp = await apiClient.delete(`/api/payments/${id}`);
      if (resp.status === 200) {
        set({ loading: false });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      set({ loading: false });
      // toast.error("Failed to delete payments");
      console.error(error);
    }
  },
}));
