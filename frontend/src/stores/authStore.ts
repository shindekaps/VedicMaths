import { create } from 'zustand';
import { authApi } from '../api/auth';

interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  nickName?: string;
  profilePhoto?: string;
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setUser: (user: User | null) => void;
  refresh: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  user: null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authApi.login({ email, password });
      if (res.success && res.data) {
        localStorage.setItem('token', res.data.accessToken || res.data.token || '');
        localStorage.setItem('refreshToken', res.data.refreshToken || '');
        set({
          token: res.data.accessToken || res.data.token || '',
          refreshToken: res.data.refreshToken || '',
          user: {
            userId: res.data.userId || res.data.user?.userId || '',
            email: res.data.email || res.data.user?.email || email,
            firstName: res.data.firstName || res.data.user?.name?.split(' ')[0] || '',
            lastName: res.data.lastName || res.data.user?.name?.split(' ').slice(1).join(' ') || '',
            profilePhoto: res.data.profilePhoto || res.data.user?.profilePhoto || '',
          },
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ error: 'Login failed', isLoading: false });
      }
    } catch (err: any) {
      set({ error: err?.message || 'Login failed', isLoading: false });
    }
  },

  signup: async (name: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authApi.signup({ name, email, password });
      if (res.success && res.data) {
        localStorage.setItem('token', res.data.accessToken || res.data.token || '');
        localStorage.setItem('refreshToken', res.data.refreshToken || '');
        set({
          token: res.data.accessToken || res.data.token || '',
          refreshToken: res.data.refreshToken || '',
          user: {
            userId: res.data.userId || res.data.user?.userId || '',
            email: res.data.email || res.data.user?.email || email,
            firstName: res.data.firstName || res.data.user?.name?.split(' ')[0] || name.split(' ')[0] || '',
            lastName: res.data.lastName || res.data.user?.name?.split(' ').slice(1).join(' ') || name.split(' ').slice(1).join(' ') || '',
            profilePhoto: res.data.profilePhoto || res.data.user?.profilePhoto || '',
          },
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ error: 'Signup failed', isLoading: false });
      }
    } catch (err: any) {
      set({ error: err?.message || 'Signup failed', isLoading: false });
    }
  },

  googleLogin: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await authApi.googleLogin({ googleIdToken: 'google-mock-token' });
      if (res.success && res.data) {
        const token = res.data.accessToken || res.data.token || '';
        const refreshToken = res.data.refreshToken || '';
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        set({
          token,
          refreshToken,
          user: {
            userId: res.data.userId || res.data.user?.userId || '',
            email: res.data.email || res.data.user?.email || '',
            firstName: res.data.firstName || res.data.user?.name?.split(' ')[0] || '',
            lastName: res.data.lastName || res.data.user?.name?.split(' ').slice(1).join(' ') || '',
            profilePhoto: res.data.profilePhoto || res.data.user?.profilePhoto || '',
          },
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ error: 'Google login failed', isLoading: false });
      }
    } catch (err: any) {
      set({ error: err?.message || 'Google login failed', isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    authApi.logout().catch(() => {});
    set({ token: null, refreshToken: null, user: null, isAuthenticated: false });
  },

  clearError: () => set({ error: null }),
  setUser: (user) => set({ user }),
  refresh: async () => {
    const rToken = get().refreshToken;
    if (!rToken) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      set({ token: null, refreshToken: null, user: null, isAuthenticated: false });
      return;
    }
    try {
      const res = await authApi.refresh({ refreshToken: rToken });
      if (res.success && res.data) {
        const newToken = res.data.accessToken || res.data.token || '';
        const newRefreshToken = res.data.refreshToken || rToken;
        localStorage.setItem('token', newToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        set({
          token: newToken,
          refreshToken: newRefreshToken,
          isAuthenticated: true,
        });
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        set({ token: null, refreshToken: null, user: null, isAuthenticated: false });
      }
    } catch (err) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      set({ token: null, refreshToken: null, user: null, isAuthenticated: false });
    }
  },
}));
