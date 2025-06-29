
import { useMemo } from 'react';
import { Researcher } from '@/types/researcher';

export function useResearcherFilters(researchers: Researcher[]) {
  const activeResearchers = useMemo(() => {
    const active = researchers.filter(r => r.status === 'active');
    console.log('activeResearchers calculado:', active.length);
    return active;
  }, [researchers]);

  const inactiveResearchers = useMemo(() => {
    const inactive = researchers.filter(r => r.status === 'inactive');
    console.log('inactiveResearchers calculado:', inactive.length);
    return inactive;
  }, [researchers]);

  const dismissedResearchers = useMemo(() => {
    const dismissed = researchers.filter(r => r.status === 'dismissed');
    console.log('dismissedResearchers calculado:', dismissed.length);
    return dismissed;
  }, [researchers]);

  return {
    activeResearchers,
    inactiveResearchers,
    dismissedResearchers
  };
}
