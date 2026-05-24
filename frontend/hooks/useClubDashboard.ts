'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ClubProfile, FeedVideo, FeedFilters } from '@/types/club-dashboard';
import { useAuthStore } from '@/stores/authStore';
import { api } from '@/lib/api';

// Realistic Mock Data for the feed
const MOCK_FEED: FeedVideo[] = [
  {
    id: 101,
    title: 'Goles y asistencias temporada 2025',
    description: 'Recopilación de mis mejores momentos en el torneo apertura.',
    file_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=400&h=225',
    duration_seconds: 125,
    views_count: 342,
    created_at: '2026-05-20T10:00:00Z',
    athlete: {
      id: 1,
      first_name: 'Mateo',
      last_name: 'García',
      country: 'Argentina',
      profile_picture_url: 'https://i.pravatar.cc/150?u=mateo',
      primary_sport: { id: 1, name: 'Fútbol' },
      primary_position: { id: 7, name: 'Mediapunta' },
      height_cm: 175,
      weight_kg: 70,
      age: 19,
      bio: 'Jugador creativo con buena visión de juego y llegada al área.'
    }
  },
  {
    id: 102,
    title: 'Highlights de defensa y rebotes',
    description: 'Mi desempeño defensivo en el último campeonato regional.',
    file_url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=400&h=225',
    duration_seconds: 180,
    views_count: 215,
    created_at: '2026-05-18T15:30:00Z',
    athlete: {
      id: 2,
      first_name: 'Carlos',
      last_name: 'Restrepo',
      country: 'Colombia',
      profile_picture_url: 'https://i.pravatar.cc/150?u=carlos',
      primary_sport: { id: 2, name: 'Baloncesto' },
      primary_position: { id: 14, name: 'Pívot' },
      height_cm: 205,
      weight_kg: 105,
      age: 21,
      bio: 'Especialista en defensa y control de la pintura. Gran capacidad atlética.'
    }
  },
  {
    id: 103,
    title: 'Compilación de saques',
    description: 'Entrenamiento enfocado en el saque potente y con efecto.',
    file_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=400&h=225',
    duration_seconds: 90,
    views_count: 512,
    created_at: '2026-05-22T09:00:00Z',
    athlete: {
      id: 3,
      first_name: 'Sofía',
      last_name: 'Vargas',
      country: 'Chile',
      profile_picture_url: null,
      primary_sport: { id: 4, name: 'Tenis' },
      primary_position: { id: 25, name: 'General' },
      height_cm: 168,
      weight_kg: 60,
      age: 18,
      bio: 'Tenista agresiva desde el fondo de la cancha. Ranking junior top 50.'
    }
  },
  {
    id: 104,
    title: 'Paradas clave Torneo de Verano',
    description: 'Resumen de atajadas en situaciones 1 vs 1 y tiros de larga distancia.',
    file_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1518605368461-1e12d1825834?auto=format&fit=crop&q=80&w=400&h=225',
    duration_seconds: 210,
    views_count: 890,
    created_at: '2026-05-23T14:20:00Z',
    athlete: {
      id: 4,
      first_name: 'Lucas',
      last_name: 'Mendoza',
      country: 'Perú',
      profile_picture_url: 'https://i.pravatar.cc/150?u=lucas',
      primary_sport: { id: 1, name: 'Fútbol' },
      primary_position: { id: 1, name: 'Portero' },
      height_cm: 188,
      weight_kg: 82,
      age: 20,
      bio: 'Arquero con excelentes reflejos y juego con los pies.'
    }
  }
];

export function useClubDashboard() {
  const { token } = useAuthStore();
  const [clubProfile, setClubProfile] = useState<ClubProfile | null>(null);
  const [feedVideos, setFeedVideos] = useState<FeedVideo[]>([]);
  const [favoriteAthleteIds, setFavoriteAthleteIds] = useState<Set<number>>(new Set());
  const [filters, setFilters] = useState<FeedFilters>({
    sportId: '',
    positionId: '',
    country: '',
    search: '',
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);

    try {
      // Fetch club profile and real videos in parallel
      const [clubRes, feedRes] = await Promise.all([
        api.get('/clubs/me').catch(() => null),
        api.get('/videos/feed').catch(() => ({ data: [] }))
      ]);

      if (clubRes?.data) {
        setClubProfile(clubRes.data);
      } else {
        // Fallback mock if not fully set up
        setClubProfile({
          id: 1,
          user_id: 2,
          name: 'Organización',
          club_type: 'professional',
          country: 'Local',
          city: 'Local',
          is_verified: true,
          responsible_name: 'Admin'
        });
      }

      // Combine real videos with mock videos
      const realVideos = feedRes.data || [];
      const combinedFeed = [...realVideos, ...MOCK_FEED];

      // Filter logic applied on the combined array
      let filtered = combinedFeed;
      
      if (filters.sportId) {
        filtered = filtered.filter(v => v.athlete.primary_sport?.id.toString() === filters.sportId);
      }
      
      if (filters.positionId) {
        filtered = filtered.filter(v => v.athlete.primary_position?.id.toString() === filters.positionId);
      }

      if (filters.country && filters.country !== 'all') {
        filtered = filtered.filter(v => v.athlete.country === filters.country);
      }

      if (filters.search) {
        const query = filters.search.toLowerCase();
        filtered = filtered.filter(v => {
          const fullName = `${v.athlete.first_name} ${v.athlete.last_name}`.toLowerCase();
          return fullName.includes(query) || (v.athlete.bio || '').toLowerCase().includes(query);
        });
      }

      setFeedVideos(filtered);
    } catch (err: any) {
      console.error('Club dashboard fetch error:', err);
      setError('Error al cargar el feed');
    } finally {
      setIsLoading(false);
    }
  }, [token, filters]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  const updateFilters = (newFilters: Partial<FeedFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({ sportId: '', positionId: '', country: '', search: '' });
  };

  const toggleFavorite = (athleteId: number) => {
    setFavoriteAthleteIds(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(athleteId)) {
        newFavorites.delete(athleteId);
      } else {
        newFavorites.add(athleteId);
      }
      return newFavorites;
    });
  };

  return {
    clubProfile,
    feedVideos,
    filters,
    isLoading,
    error,
    favoriteAthleteIds,
    updateFilters,
    clearFilters,
    toggleFavorite,
    refetch: loadData
  };
}
