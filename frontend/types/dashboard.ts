// ── Athlete Dashboard Types ──────────────────────────────────────

export interface AthleteProfile {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  country: string;
  city?: string | null;
  phone?: string | null;
  height_cm?: number | null;
  weight_kg?: number | null;
  dominant_side?: string | null;
  years_experience?: number | null;
  current_team?: string | null;
  bio?: string | null;
  profile_picture_url?: string | null;
  primary_sport?: { id: number; name: string; icon_url?: string | null } | null;
  primary_position?: { id: number; name: string; sport_id: number } | null;
  email?: string | null;
  is_email_verified?: boolean | null;
  created_at: string;
  updated_at: string;
}

export type VideoStatus = 'pending' | 'approved' | 'rejected' | 'flagged';

export interface Video {
  id: number;
  title: string;
  description?: string | null;
  sport_name: string;
  file_url: string;
  thumbnail_url: string;
  duration_seconds: number;
  status: VideoStatus;
  views_count: number;
  created_at: string;
  rejection_reason?: string | null;
}

export interface ClubInterest {
  id: number;
  name: string;
  logo_url?: string | null;
  city: string;
  country: string;
  club_type: string;
  interested_at: string;
}

export interface DashboardNotification {
  id: number;
  type: 'view' | 'message' | 'approval' | 'rejection' | 'interest' | 'system';
  title: string;
  description: string;
  read: boolean;
  created_at: string;
  link?: string | null;
}

export interface DashboardStats {
  totalViews: number;
  totalMessages: number;
  totalFavorites: number;
  profileCompleteness: number;
  rankingPosition?: number;
  rankingCountry?: string;
}
