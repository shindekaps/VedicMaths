import { api } from '@/api/client';
import { useQuery } from '@tanstack/react-query';

// Sutra defines the data structure for a Vedic Mathematics Sutra
export interface Sutra {
  id: string;
  name: string;
  slug: string;
  meaning: string;
  description: string;
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
