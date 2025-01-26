import { create } from "zustand";
import axios from "axios";
import { Asatidz } from "../types";

interface AsatidzState {
  asatidz: Array<any>;
  pagination: {
    total: number;
    currentPage: number;
    totalPages: number;
  };
  loading: boolean;
  error: string | null;
  success: boolean;
  allAsatidz: (params: any) => Promise<void>;
  addAsatidz: (data: Omit<Asatidz, "id">) => Promise<{ statusCode: number }>;
  updateAsatidz: (
    id: string,
    data: Omit<Asatidz, "id">,
  ) => Promise<{ statusCode: number }>;
  deleteAsatidz: (id: string) => Promise<void>;
}

export const useAsatidzStore = create<AsatidzState>((set) => ({
  pagination: {
    total: 0,
    currentPage: 1,
    totalPages: 0,
  },
  asatidz: [],
  loading: false,
  success: false,
  error: null,
  allAsatidz: async (params: any) => {
    set({ loading: true });
    try {
      const { page = 1, limit = 10, search = "" } = params || {};
      const resp = await axios.get("/api/asatidz", {
        params: { page, limit, search },
      });
      if (resp.status === 200) {
        const { data, total, page: currentPage, total_pages } = resp.data;
        set({
          asatidz: data,
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
      // toast.error("Failed to fetch asatidz");
      console.error(error);
    }
  },
  addAsatidz: async (
    data: Omit<Asatidz, "id">,
  ): Promise<{ statusCode: number }> => {
    set({ loading: true, success: false });
    try {
      const resp = await axios.post("/api/asatidz", data);
      if (resp.status === 200) {
        set({ loading: false, success: true });
        return resp.data;
      }
      return { statusCode: resp.status };
    } catch (error) {
      set({ loading: false, success: false });
      throw new Error("Failed to add asatidz");
      return { statusCode: 400 };
    }
  },
  updateAsatidz: async (id, data): Promise<{ statusCode: number }> => {
    set({ loading: true });
    try {
      const resp = await axios.put(`/api/asatidz/${id}`, data);
      if (resp.status === 200) {
        set({ loading: false, success: true });
        return resp.data;
      }
      return { statusCode: resp.status };
    } catch (error) {
      set({ loading: false });
      throw new Error("Failed to update asatidz");
      return { statusCode: 400 };
    }
  },
  deleteAsatidz: async (id) => {
    set({ loading: true });
    try {
      const resp = await axios.delete(`/api/asatidz/${id}`);
      if (resp.status === 200) {
        set({ loading: false });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      set({ loading: false });
      // toast.error("Failed to delete asatidz");
      console.error(error);
    }
  },
}));
