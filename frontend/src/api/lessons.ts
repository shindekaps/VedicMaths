import { api } from '@/api/client';
import { useQuery } from '@tanstack/react-query';

// Sutra defines the data structure for a Vedic Mathematics Sutra
export interface Sutra {
  ID: string;
  Name: string;
  Slug: string;
  Meaning: string;
  Description: string;
  OrderIndex: number;
}

// Lesson defines the data structure for a specific lesson
export interface Lesson {
  id: string;
  sutra_id: string;
  title: string;
  content: string;
  order_index: number;
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
