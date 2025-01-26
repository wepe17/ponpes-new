import { create } from "zustand";
import { Santri } from "../types";
import apiClient from "../config/axios";

interface SantriState {
  santri: Array<any>;
  pagination: {
    total: number;
    currentPage: number;
    totalPages: number;
  };
  loading: boolean;
  error: string | null;
  success: boolean;
  allSantri: (params: any) => Promise<void>;
  addSantri: (data: Omit<Santri, "id">) => Promise<{ statusCode: number }>;
  updateSantri: (
    id: string,
    data: Omit<Santri, "id">,
  ) => Promise<{ statusCode: number }>;
  deleteSantri: (id: string) => Promise<void>;
}

export const useSantriStore = create<SantriState>((set) => ({
  pagination: {
    total: 0,
    currentPage: 1,
    totalPages: 0,
  },
  santri: [],
  loading: false,
  success: false,
  error: null,
  allSantri: async (params: any) => {
    set({ loading: true });
    try {
      const { page = 1, limit = 10, search = "" } = params || {};
      const resp = await apiClient.get("/api/santri", {
        params: { page, limit, search },
      });
      if (resp.status === 200) {
        const { data, total, page: currentPage, total_pages } = resp.data;
        set({
          santri: data,
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
  addSantri: async (
    data: Omit<Santri, "id">,
  ): Promise<{ statusCode: number }> => {
    set({ loading: true, success: false });
    try {
      const resp = await apiClient.post("/api/santri", data);
      if (resp.status === 200) {
        set({ loading: false, success: true });
        return resp.data;
      }
      return { statusCode: resp.status };
    } catch (error) {
      set({ loading: false, success: false });
      throw new Error("Failed to add santri");
      return { statusCode: 400 };
    }
  },
  updateSantri: async (id, data): Promise<{ statusCode: number }> => {
    set({ loading: true });
    try {
      const resp = await apiClient.put(`/api/santri/${id}`, data);
      if (resp.status === 200) {
        set({ loading: false, success: true });
        return resp.data;
      }
      return { statusCode: resp.status };
    } catch (error) {
      set({ loading: false });
      throw new Error("Failed to update santri");
      return { statusCode: 400 };
    }
  },
  deleteSantri: async (id) => {
    set({ loading: true });
    try {
      const resp = await apiClient.delete(`/api/santri/${id}`);
      if (resp.status === 200) {
        set({ loading: false });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      set({ loading: false });
      // toast.error("Failed to delete santri");
      console.error(error);
    }
  },
}));
