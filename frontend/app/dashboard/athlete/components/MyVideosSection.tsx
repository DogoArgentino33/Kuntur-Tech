'use client';

import { motion } from 'framer-motion';
import { UploadCloud, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Video } from '@/types/dashboard';
import { VideoCard } from './VideoCard';

interface MyVideosSectionProps {
  videos: Video[];
  isLoading: boolean;
  onUploadClick: () => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
}

export function MyVideosSection({
  videos,
  isLoading,
  onUploadClick,
  onEdit,
  onDelete,
  onView
}: MyVideosSectionProps) {
  
  if (isLoading) {
    return (
      <div className="p-6 lg:p-10">
        <div className="h-8 w-48 bg-white/5 rounded animate-pulse mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-secondary rounded-xl aspect-[4/3] animate-pulse border border-white/5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Film className="h-6 w-6 text-primary" />
          Mis Videos
        </h2>
        
        {videos.length > 0 && (
          <Button onClick={onUploadClick} size="sm" className="hidden sm:flex bg-white/10 hover:bg-white/20 text-foreground">
            <UploadCloud className="mr-2 h-4 w-4" />
            Subir Nuevo
          </Button>
        )}
      </div>

      {videos.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-card border border-dashed border-white/10 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[300px]"
        >
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
            <UploadCloud className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">Aún no tienes videos</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Los scouts buscan ver tus habilidades en acción. Sube tu primer video para empezar a destacar.
          </p>
          <Button onClick={onUploadClick} className="bg-primary text-black hover:bg-primary/90">
            Subir mi primer video
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <VideoCard
                video={video}
                onEdit={() => onEdit(video.id)}
                onDelete={() => onDelete(video.id)}
                onView={() => onView(video.id)}
              />
            </motion.div>
          ))}
        </div>
      )}
      
      {/* Mobile CTA */}
      {videos.length > 0 && (
        <div className="mt-6 sm:hidden">
          <Button onClick={onUploadClick} className="w-full bg-white/10 hover:bg-white/20 text-foreground">
            <UploadCloud className="mr-2 h-4 w-4" />
            Subir Nuevo Video
          </Button>
        </div>
      )}
    </div>
  );
}
