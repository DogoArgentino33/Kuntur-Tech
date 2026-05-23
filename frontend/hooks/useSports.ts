import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export interface Sport {
  id: number;
  name: string;
  icon_url: string | null;
}

export interface Position {
  id: number;
  name: string;
  sport_id: number;
}

export function useSports() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const response = await api.get('/sports');
        setSports(response.data);
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

export function usePositions(sportId: number | null) {
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPositions = async () => {
      if (!sportId) {
        setPositions([]);
        return;
      }
      setIsLoading(true);
      try {
        const response = await api.get(`/sports/${sportId}/positions`);
        setPositions(response.data);
      } catch (error) {
        console.error('Error fetching positions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPositions();
  }, [sportId]);

  return { positions, isLoading };
}
