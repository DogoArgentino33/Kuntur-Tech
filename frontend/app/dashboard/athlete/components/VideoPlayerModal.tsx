'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Video } from '@/types/dashboard';
import { Button } from '@/components/ui/button';

interface VideoPlayerModalProps {
  video: Video | null;
  onClose: () => void;
}

export function VideoPlayerModal({ video, onClose }: VideoPlayerModalProps) {
  useEffect(() => {
    if (!video) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [video, onClose]);

  if (!video) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="relative z-10 w-full max-w-4xl bg-card border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div>
              <h2 className="text-lg font-semibold">Reproduciendo video</h2>
              <p className="text-sm text-muted-foreground">{video.title}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="bg-black">
            <video
              controls
              autoPlay
              className="w-full h-full min-h-[360px] bg-black"
              src={video.file_url}
            >
              Tu navegador no soporta la reproducción de video.
            </video>
          </div>

          <div className="p-6 space-y-3">
            {video.description && (
              <div>
                <h3 className="text-sm font-semibold">Descripción</h3>
                <p className="text-sm text-muted-foreground mt-2">{video.description}</p>
              </div>
            )}
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="px-3 py-2 rounded-xl bg-white/5">Deporte: {video.sport_name}</span>
              <span className="px-3 py-2 rounded-xl bg-white/5">Duración: {Math.floor(video.duration_seconds / 60)}:{(video.duration_seconds % 60).toString().padStart(2, '0')}</span>
              <span className="px-3 py-2 rounded-xl bg-white/5">Estado: {video.status}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
