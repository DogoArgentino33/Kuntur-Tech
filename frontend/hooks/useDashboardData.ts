'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import type {
  AthleteProfile,
  Video,
  ClubInterest,
  DashboardNotification,
  DashboardStats,
} from '@/types/dashboard';

// ── Mock Data ────────────────────────────────────────────────────

const MOCK_VIDEOS: Video[] = [
  {
    id: 1,
    title: 'Entrenamiento de velocidad — Sprint 100m',
    description: 'Sesión de velocidad con cronómetro profesional',
    sport_name: 'Fútbol',
    file_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=400&h=225',
    duration_seconds: 185,
    status: 'approved',
    views_count: 142,
    created_at: '2026-05-20T10:00:00Z',
  },
  {
    id: 2,
    title: 'Highlights — Torneo Regional Sub-20',
    description: 'Mejores momentos del partido semifinal',
    sport_name: 'Fútbol',
    file_url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=400&h=225',
    duration_seconds: 320,
    status: 'approved',
    views_count: 87,
    created_at: '2026-05-18T15:30:00Z',
  },
  {
    id: 3,
    title: 'Práctica de tiros libres',
    description: 'Sesión de tiros libres desde diferentes ángulos',
    sport_name: 'Fútbol',
    file_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail_url: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&q=80&w=400&h=225',
    duration_seconds: 240,
    status: 'pending',
    views_count: 0,
    created_at: '2026-05-22T09:00:00Z',
  },
];

const MOCK_INTERESTS: ClubInterest[] = [
  {
    id: 1,
    name: 'Racing Club',
    logo_url: null,
    city: 'Avellaneda',
    country: 'Argentina',
    club_type: 'professional',
    interested_at: '2026-05-22T18:00:00Z',
  },
  {
    id: 2,
    name: 'Academia Tahuichi',
    logo_url: null,
    city: 'Santa Cruz',
    country: 'Bolivia',
    club_type: 'academy',
    interested_at: '2026-05-21T14:00:00Z',
  },
  {
    id: 3,
    name: 'Deportivo Cali',
    logo_url: null,
    city: 'Cali',
    country: 'Colombia',
    club_type: 'professional',
    interested_at: '2026-05-20T10:00:00Z',
  },
];

const MOCK_NOTIFICATIONS: DashboardNotification[] = [
  { id: 1, type: 'view', title: 'Video visto', description: 'Scout de Racing Club vio tu video "Highlights — Torneo Regional"', read: false, created_at: '2026-05-23T20:30:00Z' },
  { id: 2, type: 'approval', title: 'Video aprobado', description: 'Tu video "Entrenamiento de velocidad" fue aprobado por moderación', read: false, created_at: '2026-05-23T18:00:00Z' },
  { id: 3, type: 'interest', title: 'Nuevo interesado', description: 'Academia Tahuichi se interesó en tu perfil', read: true, created_at: '2026-05-22T14:00:00Z' },
  { id: 4, type: 'message', title: 'Nuevo mensaje', description: 'Deportivo Cali te envió un mensaje', read: true, created_at: '2026-05-21T09:00:00Z' },
  { id: 5, type: 'system', title: 'Completa tu perfil', description: 'Agrega una foto de perfil para mejorar tu visibilidad', read: true, created_at: '2026-05-20T12:00:00Z' },
];

// ── Profile Completeness Calculator ──────────────────────────────

function calculateCompleteness(athlete: AthleteProfile): number {
  const fields = [
    athlete.first_name,
    athlete.last_name,
    athlete.date_of_birth,
    athlete.country,
    athlete.phone,
    athlete.height_cm,
    athlete.weight_kg,
    athlete.primary_sport,
    athlete.primary_position,
    athlete.bio,
    athlete.profile_picture_url,
    athlete.current_team,
    athlete.dominant_side,
    athlete.city,
  ];
  const filled = fields.filter((f) => f !== null && f !== undefined && f !== '').length;
  return Math.round((filled / fields.length) * 100);
}

// ── Main Hook ────────────────────────────────────────────────────

export function useDashboardData() {
  const { token } = useAuthStore();
  const [athlete, setAthlete] = useState<AthleteProfile | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [interests, setInterests] = useState<ClubInterest[]>([]);
  const [notifications, setNotifications] = useState<DashboardNotification[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalViews: 0,
    totalMessages: 0,
    totalFavorites: 0,
    profileCompleteness: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);

    try {
      // ── Real API call for athlete profile
      const athleteRes = await api.get('/athletes/me');
      const athleteData: AthleteProfile = athleteRes.data;
      setAthlete(athleteData);

      // ── Fetch real videos from backend
      try {
        const videosRes = await api.get('/videos/my-videos');
        setVideos(videosRes.data);
      } catch (err) {
        console.error('Error fetching videos:', err);
        // Fall back to empty array
        setVideos([]);
      }

      // ── Mock data for interests and notifications
      await new Promise((r) => setTimeout(r, 300)); // simulate network
      setInterests(MOCK_INTERESTS);
      setNotifications(MOCK_NOTIFICATIONS);

      // ── Calculate stats
      const completeness = calculateCompleteness(athleteData);
      const videosData = await api.get('/videos/my-videos').then(r => r.data).catch(() => []);
      setStats({
        totalViews: videosData.reduce((sum: number, v: any) => sum + v.views_count, 0),
        totalMessages: 4,
        totalFavorites: 8,
        profileCompleteness: completeness,
        rankingPosition: 42,
        rankingCountry: athleteData.country,
      });
    } catch (err: any) {
      console.error('Dashboard fetch error:', err);
      setError(err.response?.data?.detail || 'Error al cargar el dashboard');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const deleteVideo = async (videoId: number) => {
    // Mock: just remove from local state
    setVideos((prev) => prev.filter((v) => v.id !== videoId));
  };

  const addVideo = (video: Video) => {
    setVideos((prev) => [video, ...prev]);
  };

  return {
    athlete,
    videos,
    interests,
    notifications,
    stats,
    isLoading,
    error,
    refetch: fetchData,
    deleteVideo,
    addVideo,
  };
}
