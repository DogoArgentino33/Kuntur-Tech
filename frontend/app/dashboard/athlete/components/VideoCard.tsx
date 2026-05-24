'use client';

import { useState } from 'react';
import { Play, Edit2, Trash2, Eye, Calendar, MoreVertical } from 'lucide-react';
import { Video } from '@/types/dashboard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface VideoCardProps {
  video: Video;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
}

export function VideoCard({ video, onEdit, onDelete, onView }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
    approved: 'bg-green-500/20 text-green-500 border-green-500/30',
    rejected: 'bg-red-500/20 text-red-500 border-red-500/30',
    flagged: 'bg-orange-500/20 text-orange-500 border-orange-500/30',
  };

  const statusLabels = {
    pending: 'En Moderación',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    flagged: 'En Revisión',
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div 
      className="bg-secondary rounded-xl overflow-hidden border border-white/5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-white/10 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail Area */}
      <div className="relative aspect-video bg-black cursor-pointer" onClick={onView}>
        <img 
          src={video.thumbnail_url} 
          alt={video.title}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
        />
        
        {/* Play Overlay */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center text-black shadow-lg">
            <Play className="h-5 w-5 ml-1" />
          </div>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-medium backdrop-blur-sm">
          {formatDuration(video.duration_seconds)}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold line-clamp-2 text-sm md:text-base" title={video.title}>
            {video.title}
          </h3>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground hover:text-foreground">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                <Edit2 className="mr-2 h-4 w-4" /> Editar info
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="cursor-pointer text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Eliminar video
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-muted-foreground bg-white/5 px-2 py-0.5 rounded">
            {video.sport_name}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded border ${statusColors[video.status]}`}>
            {statusLabels[video.status]}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
          <div className="flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5" />
            {video.views_count} vistas
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(video.created_at)}
          </div>
        </div>
      </div>
    </div>
  );
}
