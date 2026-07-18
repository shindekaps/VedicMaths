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

    // First pass: map existing statuses from database progress
    sutras.forEach((s) => {
      const match = progress?.sutraProgress?.find((p) => p.sutraId === s.sutraId);
      if (match) {
        let status: 'completed' | 'in_progress' | 'locked' = 'locked';
        if (match.status.toLowerCase() === 'completed') status = 'completed';
        else if (match.status.toLowerCase() === 'in_progress') status = 'in_progress';
        
        map[s.sutraId] = {
          status,
          percent: match.completionPercentage || 0,
        };
      }
    });

    // Second pass: apply lock/unlock rules sequentially if records are missing
    sutras
      .slice()
      .sort((a, b) => a.order - b.order)
      .forEach((s, idx, sortedSutras) => {
        if (!map[s.sutraId]) {
          // If it's the very first sutra, it's unlocked by default
          if (idx === 0) {
            map[s.sutraId] = { status: 'in_progress', percent: 0 };
          } else {
            // Check if previous sutra is completed
            const prevSutra = sortedSutras[idx - 1];
            const prevStatus = map[prevSutra.sutraId]?.status;
            if (prevStatus === 'completed') {
              map[s.sutraId] = { status: 'in_progress', percent: 0 };
            } else {
              map[s.sutraId] = { status: 'locked', percent: 0 };
            }
          }
        }
      });

    return map;
  }, [sutras, progress]);
};
