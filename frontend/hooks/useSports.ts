'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export interface Sport {
  id: number;
  name: string;
}

export function useSports() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        // En un caso real llamaríamos al backend: await api.get('/sports')
        // Por ahora lo mockeamos
        await new Promise(r => setTimeout(r, 200));
        setSports([
          { id: 1, name: 'Fútbol' },
          { id: 2, name: 'Básquetbol' },
          { id: 3, name: 'Voleibol' },
          { id: 4, name: 'Tenis' },
        ]);
      } catch (error) {
        console.error('Error fetching sports:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSports();
  }, []);

  return { sports, isLoading };
}
