import { create } from 'zustand';
import { login, register } from '@/api/auth';

interface User {
  id: string;
  email: string;
  username: string;
}

// AuthState defines the structure for authentication state
interface AuthState {
  token: string | null;
  user: User | null;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string, grade: number) => Promise<void>;
  refresh: () => Promise<void>;
}

// useAuthStore manages the authentication state (JWT token and user)
export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  user: null,
  setToken: (token) => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
    set({ token });
  },
  setUser: (user) => set({ user }),
  login: async (email, password) => {
    const { token } = await login({ email, password });
    localStorage.setItem('token', token);
    set({ token });
  },
  register: async (email, password, username, grade) => {
    await register({ email, password, username, grade });
  },
  refresh: async () => {
    console.log('Refreshing token...');
  },
}));
