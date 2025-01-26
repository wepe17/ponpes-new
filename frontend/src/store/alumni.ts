import { create } from "zustand";
import { Alumni } from "../types";
import apiClient from "../config/axios";

interface AlumniState {
  alumni: Array<any>;
  pagination: {
    total: number;
    currentPage: number;
    totalPages: number;
  };
  loading: boolean;
  error: string | null;
  success: boolean;
  allAlumni: (params: any) => Promise<void>;
  addAlumni: (data: Omit<Alumni, "id">) => Promise<{ statusCode: number }>;
  updateAlumni: (
    id: string,
    data: Omit<Alumni, "id">,
  ) => Promise<{ statusCode: number }>;
  deleteAlumni: (id: string) => Promise<void>;
}

export const useAlumniStore = create<AlumniState>((set) => ({
  pagination: {
    total: 0,
    currentPage: 1,
    totalPages: 0,
  },
  alumni: [],
  loading: false,
  success: false,
  error: null,
  allAlumni: async (params: any) => {
    set({ loading: true });
    try {
      const { page = 1, limit = 10, search = "" } = params || {};
      const resp = await apiClient.get("/api/alumni", {
        params: { page, limit, search },
      });
      if (resp.status === 200) {
        const { data, total, page: currentPage, total_pages } = resp.data;
        set({
          alumni: data,
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
  addAlumni: async (
    data: Omit<Alumni, "id">,
  ): Promise<{ statusCode: number }> => {
    set({ loading: true, success: false });
    try {
      const resp = await apiClient.post("/api/alumni", data);
      if (resp.status === 200) {
        set({ loading: false, success: true });
        return resp.data;
      }
      return { statusCode: resp.status };
    } catch (error) {
      set({ loading: false, success: false });
      throw new Error("Failed to add Alumni");
      return { statusCode: 400 };
    }
  },
  updateAlumni: async (id, data): Promise<{ statusCode: number }> => {
    set({ loading: true });
    try {
      const resp = await apiClient.put(`/api/alumni/${id}`, data);
      if (resp.status === 200) {
        set({ loading: false, success: true });
        return resp.data;
      }
      return { statusCode: resp.status };
    } catch (error) {
      set({ loading: false });
      throw new Error("Failed to update Alumni");
      return { statusCode: 400 };
    }
  },
  deleteAlumni: async (id) => {
    set({ loading: true });
    try {
      const resp = await apiClient.delete(`/api/alumni/${id}`);
      if (resp.status === 200) {
        set({ loading: false });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      set({ loading: false });
      // toast.error("Failed to delete Alumni");
      console.error(error);
    }
  },
}));
