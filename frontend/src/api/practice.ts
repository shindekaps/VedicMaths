import { api } from '@/api/client';

export interface Problem {
  question: string;
  answer: string;
  difficulty: number;
}

export interface SubmissionResponse {
  correct: boolean;
  new_difficulty: number;
}

export const startPracticeSession = (sutraID: string): Promise<{ sessionID: string }> => 
  api.post(`/practice/sutras/${sutraID}/start`, {});

export const getNextProblem = (sutraID: string): Promise<Problem> => 
  api.get(`/practice/sutras/${sutraID}/problem`);

export const submitAnswer = (data: {
  user_id: string;
  sutra_id: string;
  session_id: string;
  user_answer: string;
  correct_answer: string;
}): Promise<SubmissionResponse> => 
  api.post('/practice/submit', data);
