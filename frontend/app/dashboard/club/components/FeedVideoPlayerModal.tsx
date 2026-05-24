'use client';

import { useEffect } from 'react';
import { X, UserCircle, MapPin, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FeedVideo } from '@/types/club-dashboard';
import { getMediaUrl } from '@/lib/api';

interface FeedVideoPlayerModalProps {
  video: FeedVideo | null;
  onClose: () => void;
  onViewAthlete: () => void;
}

export function FeedVideoPlayerModal({ video, onClose, onViewAthlete }: FeedVideoPlayerModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!video) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-6xl bg-card rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col lg:flex-row max-h-[90vh]"
        >
          {/* Close Button (Mobile float, Desktop inside header) */}
          <button 
            onClick={onClose}
            className="lg:hidden absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 backdrop-blur-sm"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Video Section (Left) */}
          <div className="w-full lg:w-[70%] bg-black relative flex flex-col justify-center min-h-[40vh] lg:min-h-[70vh]">
            <video 
              src={getMediaUrl(video.file_url)} 
              controls 
              autoPlay 
              className="w-full max-h-full object-contain"
              poster={getMediaUrl(video.thumbnail_url)}
            >
              Tu navegador no soporta el tag de video.
            </video>
          </div>

          {/* Info Section (Right) */}
          <div className="w-full lg:w-[30%] bg-card flex flex-col border-l border-white/5 overflow-y-auto">
            {/* Header (Desktop Close) */}
            <div className="hidden lg:flex justify-end p-4 border-b border-white/5 sticky top-0 bg-card/80 backdrop-blur-md z-10">
              <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 flex-1 flex flex-col gap-6">
              {/* Athlete Quick Info */}
              <div 
                className="flex items-center gap-4 cursor-pointer group hover:bg-white/5 p-3 -mx-3 rounded-xl transition-colors"
                onClick={() => {
                  onClose();
                  onViewAthlete();
                }}
              >
                {video.athlete.profile_picture_url ? (
                  <img src={video.athlete.profile_picture_url} alt={video.athlete.first_name} className="w-12 h-12 rounded-full object-cover border border-white/10 group-hover:border-primary/50 transition-colors" />
                ) : (
                  <UserCircle className="w-12 h-12 text-muted-foreground" />
                )}
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {video.athlete.first_name} {video.athlete.last_name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center"><MapPin className="h-3 w-3 mr-1"/>{video.athlete.country}</span>
                    <span>•</span>
                    <span className="text-primary/80 font-medium">{video.athlete.primary_sport?.name}</span>
                  </div>
                </div>
              </div>

              {/* Video Info */}
              <div>
                <h2 className="text-xl font-bold mb-2 leading-tight">{video.title}</h2>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1.5"><Play className="h-4 w-4"/> {video.views_count} vistas</span>
                  <span>•</span>
                  <span>{new Date(video.created_at).toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                
                {video.description && (
                  <div className="bg-secondary/50 p-4 rounded-xl border border-white/5 text-sm leading-relaxed">
                    {video.description}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
