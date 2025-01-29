import { create } from "zustand";
import { User } from "../types";
import { getLocalStorage, setLocalStorage } from "../config/local-storage";
import apiClient from "../config/axios";

interface AuthState {
  pagination: {
    total: 0;
    currentPage: 1;
    totalPages: 0;
  };
  loading: boolean;
  users: Array<User>;
  success: boolean;
  currentUser: User;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (
    data: User & { password: string },
  ) => Promise<{ statusCode: number }>;
  initialUser: () => void;
  allUsers: (params: any) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  updateUser: (
    id: string,
    data: Omit<User, "id">,
  ) => Promise<{ statusCode: number }>;
  addUser: (
    data: User & { password: string },
  ) => Promise<{ statusCode: number }>;
}

export const useAuthStore = create<AuthState>((set) => ({
  users: null,
  pagination: {
    total: 0,
    currentPage: 1,
    totalPages: 0,
  },
  loading: false,
  success: false,
  currentUser: null,
  login: async (username: string, password: string) => {
    const resp = await apiClient.post("/api/users/login", {
      username,
      password,
    });
    if (resp.status === 200) {
      const data: { token: string; user: User } = resp.data;
      set({ currentUser: data.user });
      setLocalStorage("accessToken", data.token);
    } else {
      throw new Error("Invalid credentials");
    }
  },
  logout: () => {
    setLocalStorage("accessToken", null);
    set({ currentUser: null });
  },
  register: async (users: User & { password: string }) => {
    const resp = await apiClient.post("/api/users/register", users);
    if (resp.status === 200) {
      set({ currentUser: users });
      return resp.data;
    } else {
      throw new Error("Register failed");
    }
  },
  initialUser: () => {
    const token = getLocalStorage("accessToken");
    const users = getLocalStorage("users");
    if (token && users) {
      set({ users });
    }
  },
  allUsers: async (params: any) => {
    set({ loading: true });
    try {
      const { page = 1, limit = 10, search = "" } = params || {};
      const resp = await apiClient.get("/api/users", {
        params: { page, limit, search },
      });
      if (resp.status === 200) {
        const { data, total, page: currentPage, total_pages } = resp.data;
        set({
          users: data,
          pagination: {
            total,
            currentPage,
            totalPages: total_pages,
          },
          loading: false,
        });
      }
    } catch (error) {
      set({ loading: false, success: false });
      // toast.error("Failed to fetch users");
      console.error(error);
    }
  },
  addUser: async (
    data: User & { password: string },
  ): Promise<{ statusCode: number }> => {
    set({ loading: true, success: false });
    try {
      const resp = await apiClient.post("/api/users/add", data);
      console.log("resp store", resp);
      // if (resp.status === 200) {
      //   set({ loading: false, success: true });
      // return resp;
      // }
      return { statusCode: resp.status };
    } catch (error) {
      set({ loading: false, success: false });
      throw new Error("Failed to add asatidz");
      return { statusCode: 400 };
    }
  },
  updateUser: async (id: string, data: Omit<User, "id">) => {
    set({ loading: true });
    try {
      const resp = await apiClient.put(`/api/users/${id}`, data);
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
  deleteUser: async (id: string) => {
    set({ loading: true });
    try {
      const resp = await apiClient.delete(`/api/users/${id}`);
      if (resp.status === 200) {
        set({ loading: false });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      set({ loading: false });
      // toast.error("Failed to delete users");
      console.error(error);
    }
  },
}));
