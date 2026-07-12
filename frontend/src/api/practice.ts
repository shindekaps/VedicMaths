import { api } from '@/api/client';

export interface Problem {
  id: string;
  sutraId: number;
  questionText: string;
  difficulty: number;
  answer?: string;
}

export interface SubmissionResponse {
  correct: boolean;
  correctAnswer: string | number;
  solutionSteps?: string[];
  new_difficulty?: number;
}

export const startPracticeSession = (sutraID: string): Promise<{ sessionID: string }> => 
  api.post(`/practice/sutras/${sutraID}/start`, {});

export const getNextProblem = (sutraID: string): Promise<Problem> => 
  api.get(`/practice/next?sutraID=${sutraID}`);

export const submitAnswer = (data: {
  user_id: string;
  sutra_id: string;
  session_id: string;
  user_answer: string;
  correct_answer: string;
}): Promise<SubmissionResponse> => 
  api.post('/practice/submit', data);
