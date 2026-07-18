import { api } from '@/api/client';

export interface Problem {
  id: string;
  sutraId: number;
  questionText: string;
  difficulty: number;
  answer?: string;
  options?: string[];
}

export interface SubmissionResponse {
  correct: boolean;
  correctAnswer: string | number;
  solutionSteps?: string[];
  new_difficulty?: number;
}

export const startPracticeSession = (sutraID: string): Promise<{ sessionID: string }> => 
  api.post(`/practice/sutras/${sutraID}/start`, {});

export const getNextProblem = (sutraID: string, lessonId?: string, difficulty?: number): Promise<Problem> => {
  const diffParam = difficulty !== undefined ? `&difficulty=${difficulty}` : '';
  return api.get(`/practice/next?sutraID=${sutraID}${lessonId ? `&lessonId=${lessonId}` : ''}${diffParam}&_=${Math.random()}`);
};

export interface SubmissionRequest {
  sessionId: string;
  problemId: string;
  answer: string | number;
  sutraId: string;
}

export const submitAnswer = (data: SubmissionRequest): Promise<SubmissionResponse> => 
  api.post('/practice/submit', data);
