export interface ClubProfile {
  id: number;
  user_id: number;
  name: string;
  club_type: string;
  country: string;
  city: string;
  phone?: string | null;
  website?: string | null;
  description?: string | null;
  logo_url?: string | null;
  is_verified: boolean;
  responsible_name: string;
  responsible_position?: string | null;
}

export interface FeedAthleteInfo {
  id: number;
  first_name: string;
  last_name: string;
  country: string;
  profile_picture_url?: string | null;
  primary_sport: { id: number; name: string } | null;
  primary_position: { id: number; name: string } | null;
  height_cm?: number | null;
  weight_kg?: number | null;
  age?: number; // Calculated from date_of_birth
  bio?: string | null;
}

export interface FeedVideo {
  id: number;
  title: string;
  description?: string | null;
  file_url: string;
  thumbnail_url: string;
  duration_seconds: number;
  views_count: number;
  created_at: string;
  athlete: FeedAthleteInfo;
}

export interface FeedFilters {
  sportId: string;
  positionId: string;
  country: string;
  search: string;
}
