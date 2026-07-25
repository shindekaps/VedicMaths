import { useMemo } from 'react';

export interface SutraStatus {
  status: 'completed' | 'in_progress' | 'locked';
  percent: number;
}

export type SutraStatusMap = Record<number, SutraStatus>;

export const useSutraStatus = (
  sutras: Array<{ sutraId: number; order: number }> | undefined,
  progress: { sutraProgress?: Array<{ sutraId: number; status: string; completionPercentage?: number }> } | null | undefined
): SutraStatusMap => {
  return useMemo(() => {
    const map: SutraStatusMap = {};
    if (!sutras) return map;

    // First pass: map existing statuses from database progress, but override 'locked' to 'in_progress'
    sutras.forEach((s) => {
      const match = progress?.sutraProgress?.find((p) => p.sutraId === s.sutraId);
      if (match) {
        let status: 'completed' | 'in_progress' | 'locked' = 'in_progress';
        if (match.status.toLowerCase() === 'completed') status = 'completed';
        
        map[s.sutraId] = {
          status,
          percent: match.completionPercentage || 0,
        };
      }
    });

    // Second pass: all sutras without progress records are unlocked (in_progress)
    sutras
      .slice()
      .sort((a, b) => a.order - b.order)
      .forEach((s) => {
        if (!map[s.sutraId]) {
          map[s.sutraId] = { status: 'in_progress', percent: 0 };
        }
      });

    return map;
  }, [sutras, progress]);
};
