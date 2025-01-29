import { create } from "zustand";
import apiClient from "../config/axios";

interface ReportState {
  report: Array<any>;
  pagination: {
    total: number;
    currentPage: number;
    totalPages: number;
  };
  loading: boolean;
  error: string | null;
  success: boolean;
  allReport: (params: any) => Promise<void>;
}

export const useReportStore = create<ReportState>((set) => ({
  pagination: {
    total: 0,
    currentPage: 1,
    totalPages: 0,
  },
  report: [],
  loading: false,
  success: false,
  error: null,
  allReport: async (params: any) => {
    set({ loading: true });
    try {
      const { page = 1, limit = 10, search = "" } = params || {};
      const resp = await apiClient.get("/api/reports", {
        params: { page, limit, search },
      });
      if (resp.status === 200) {
        const { data, total, page: currentPage, total_pages } = resp.data;
        set({
          report: data,
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
}));
