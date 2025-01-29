import { create } from "zustand";
import { Settings, Transaction } from "../types";
import apiClient from "../config/axios";

interface SettingState {
  setting: Settings;
  loading: boolean;
  error: string | null;
  success: boolean;
  allSetting: (params: any) => Promise<void>;
  updateSetting: (data: Settings) => Promise<{ statusCode: number }>;
  updateKasSetting: (
    data: Pick<Settings, "kas_amount" | "kas_date" | "kas_description">,
  ) => Promise<{ statusCode: number }>;
}

export const useSettingStore = create<SettingState>((set) => ({
  setting: {},
  loading: false,
  success: false,
  error: null,
  allSetting: async () => {
    set({ loading: true });
    try {
      const resp = await apiClient.get("/api/settings");
      if (resp.status === 200) {
        const data = resp.data;
        set({
          setting: data[0],
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
  updateSetting: async (data): Promise<{ statusCode: number }> => {
    set({ loading: true });
    try {
      const resp = await apiClient.post(`/api/settings`, data);
      if (resp.status === 200) {
        set({ loading: false, success: true });
        return resp.data;
      }
      return { statusCode: resp.status };
    } catch (error) {
      set({ loading: false });
      throw new Error("Failed to update setting");
      return { statusCode: 400 };
    }
  },
  updateKasSetting: async (data): Promise<{ statusCode: number }> => {
    set({ loading: true });
    try {
      const resp = await apiClient.post(`/api/settings/transaction`, data);
      // if (resp.status === 200) {
      set({ loading: false, success: true });
      return resp.data;
      // }
      // return { statusCode: resp.status };
    } catch (error) {
      set({ loading: false });
      throw new Error("Failed to update setting");
      return { statusCode: 400 };
    }
  },
}));
