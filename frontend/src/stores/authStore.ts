import { create } from 'zustand';

// AuthState defines the structure for authentication state
interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;
  refresh: () => Promise<void>;
}

// useAuthStore manages the authentication state (JWT token)
export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  setToken: (token) => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
    set({ token });
  },
  refresh: async () => {
    // Logic for token refresh would go here
    console.log('Refreshing token...');
  },
}));
