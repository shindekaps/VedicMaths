import { api } from '@/api/client';

export interface LoginResponse {
  token: string;
}

export const login = (data: { email: string; password: string }): Promise<LoginResponse> => 
  api.post('/auth/login', data);

export const register = (data: { email: string; password: string; username: string; grade: number }): Promise<any> => 
  api.post('/auth/register', data);
