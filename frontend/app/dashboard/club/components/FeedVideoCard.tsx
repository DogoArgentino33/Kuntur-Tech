'use client';

import { useState } from 'react';
import { Play, MapPin, UserCircle, Star } from 'lucide-react';
import { FeedVideo } from '@/types/club-dashboard';
import { getMediaUrl } from '@/lib/api';
import { Button } from '@/components/ui/button';

interface FeedVideoCardProps {
  video: FeedVideo;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onViewVideo: () => void;
  onViewAthlete: (e: React.MouseEvent) => void;
}

export function FeedVideoCard({ video, isFavorite, onToggleFavorite, onViewVideo, onViewAthlete }: FeedVideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { athlete } = video;

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="bg-card rounded-xl overflow-hidden border border-white/5 transition-all duration-300 hover:border-white/10 group flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Video Thumbnail Area */}
      <div 
        className="relative aspect-[4/5] bg-black cursor-pointer overflow-hidden" 
        onClick={onViewVideo}
      >
        <img 
          src={getMediaUrl(video.thumbnail_url)} 
          alt={video.title}
          className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Play Overlay */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100 bg-black/20' : 'opacity-0'}`}>
          <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center text-black shadow-lg backdrop-blur-sm transform transition-transform group-hover:scale-110">
            <Play className="h-6 w-6 ml-1" />
          </div>
        </div>

        {/* Top Right: Favorite Button */}
        <button 
          onClick={onToggleFavorite}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm transition-colors z-10"
        >
          <Star className={`h-5 w-5 transition-colors ${isFavorite ? 'fill-accent text-accent' : 'text-white'}`} />
        </button>

        {/* Bottom Area: Duration & Title */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 pt-12">
          <div className="flex justify-between items-end gap-2">
            <h3 className="font-semibold text-white line-clamp-2 text-sm leading-snug">
              {video.title}
            </h3>
            <span className="bg-black/60 text-white px-1.5 py-0.5 rounded text-xs font-medium backdrop-blur-sm shrink-0">
              {formatDuration(video.duration_seconds)}
            </span>
          </div>
        </div>
      </div>

      {/* Athlete Info Area */}
      <div 
        className="p-4 flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={onViewAthlete}
      >
        <div className="shrink-0">
          {athlete.profile_picture_url ? (
             <img src={athlete.profile_picture_url} alt={athlete.first_name} className="h-10 w-10 rounded-full object-cover border border-white/10" />
          ) : (
            <UserCircle className="h-10 w-10 text-muted-foreground" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground truncate">
              {athlete.first_name} {athlete.last_name} {athlete.age && <span className="text-muted-foreground font-normal">, {athlete.age}</span>}
            </p>
          </div>
          
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs text-primary font-medium truncate">
              {athlete.primary_sport?.name} {athlete.primary_position ? `· ${athlete.primary_position.name}` : ''}
            </p>
          </div>
          
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{athlete.country}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
