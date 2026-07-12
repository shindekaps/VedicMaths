import { api } from '@/api/client';
import { useQuery } from '@tanstack/react-query';

export interface Example {
  problem: string;
  solution: string;
  steps: string[];
  explanation: string;
}

// Sutra defines the data structure for a Vedic Mathematics Sutra
export interface Sutra {
  id: string;
  sutraId: number;
  name: string;
  sanskritName: string;
  description: string;
  order: number;
  difficulty: string;
  estimatedHours: number;
  icon: string;
  color: string;
  slug: string;
}

// Lesson defines the data structure for a specific lesson
export interface Lesson {
  id: string;
  lessonId: string;
  sutraId: string;
  sutraNumber: number;
  lessonNumber: number;
  title: string;
  description: string;
  content: string;
  examples: Example[];
  difficulty: string;
  estimatedMinutes: number;
  videoUrl: string;
  order: number;
  isActive: boolean;
}

// fetchSutras calls the backend API to get all sutras
export const fetchSutras = (): Promise<Sutra[]> => api.get('/lessons/sutras');

// useSutras is a React Query hook to fetch and cache sutras
export const useSutras = () => {
  return useQuery({
    queryKey: ['sutras'],
    queryFn: fetchSutras,
  });
};

// fetchLessonsBySutra calls the backend API to get lessons for a sutra
export const fetchLessonsBySutra = (sutraID: string): Promise<Lesson[]> => api.get(`/lessons/sutras/${sutraID}/lessons`);

// useLessonsBySutra is a React Query hook to fetch and cache lessons
export const useLessonsBySutra = (sutraID: string) => {
  return useQuery({
    queryKey: ['lessons', sutraID],
    queryFn: () => fetchLessonsBySutra(sutraID),
    enabled: !!sutraID,
  });
};
