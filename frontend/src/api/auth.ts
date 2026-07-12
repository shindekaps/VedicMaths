import { api } from './client';

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    userId?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    profilePhoto?: string;
    accessToken?: string;
    token?: string;
    refreshToken?: string;
    expiresIn?: number;
    isNewUser?: boolean;
    user?: {
      userId: string;
      email: string;
      name: string;
      profilePhoto?: string;
    };
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}

export const authApi = {
  login: (data: LoginPayload): Promise<AuthResponse> =>
    api.post('/auth/login', data),

  signup: (data: SignUpPayload): Promise<AuthResponse> =>
    api.post('/auth/signup', data),

  googleLogin: (data: { googleIdToken: string; googleAccessToken?: string }): Promise<AuthResponse> =>
    api.post('/auth/google', data),

  refresh: (data: { refreshToken: string }): Promise<AuthResponse> =>
    api.post('/auth/refresh', data),

  logout: (): Promise<{ success: boolean; message: string }> =>
    api.post('/auth/logout', {}),
};
