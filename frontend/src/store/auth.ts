import { create } from "zustand";
import { User } from "../types";
import axios from "axios";
import { getLocalStorage, setLocalStorage } from "../config/local-storage";

interface AuthState {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: User & { password: string }) => Promise<void>;
  initialUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: async (username: string, password: string) => {
    const resp = await axios.post("/api/users/login", { username, password });
    if (resp.status === 200) {
      const data: { token: string; user: User } = resp.data;
      set({ user: data.user });
      setLocalStorage("accessToken", data.token);
    } else {
      throw new Error("Invalid credentials");
    }
  },
  logout: () => set({ user: null }),
  register: async (user: User & { password: string }) => {
    const resp = await axios.post("/api/users/register", user);
    if (resp.status === 200) {
      set({ user: user });
    } else {
      throw new Error("Register failed");
    }
  },
  initialUser: () => {
    const token = getLocalStorage("accessToken");
    const user = getLocalStorage("user");
    if (token && user) {
      set({ user });
    }
  },
}));
