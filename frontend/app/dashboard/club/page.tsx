'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SearchX, Loader2 } from 'lucide-react';
import { useClubDashboard } from '@/hooks/useClubDashboard';
import { FeedVideo, FeedAthleteInfo } from '@/types/club-dashboard';
import { FeedFiltersBar } from './components/FeedFilters';
import { FeedVideoCard } from './components/FeedVideoCard';
import { AthleteProfilePanel } from './components/AthleteProfilePanel';
import { FeedVideoPlayerModal } from './components/FeedVideoPlayerModal';
import { Button } from '@/components/ui/button';

export default function ClubDashboardPage() {
  const { 
    feedVideos, 
    filters, 
    isLoading, 
    error,
    favoriteAthleteIds,
    updateFilters,
    clearFilters,
    toggleFavorite
  } = useClubDashboard();

  // State for modals/panels
  const [selectedVideo, setSelectedVideo] = useState<FeedVideo | null>(null);
  const [selectedAthlete, setSelectedAthlete] = useState<FeedAthleteInfo | null>(null);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
        <div className="bg-destructive/10 text-destructive p-4 rounded-xl mb-4">
          <p className="font-semibold">Error al cargar el feed</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explorar Talento</h1>
        <p className="text-muted-foreground">
          Descubre atletas a través de sus videos. Filtra por deporte, posición y país.
        </p>
      </div>

      {/* Filters */}
      <FeedFiltersBar 
        filters={filters} 
        onUpdateFilters={updateFilters} 
        onClearFilters={clearFilters} 
      />

      {/* Feed Content */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : feedVideos.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-card border border-dashed border-white/10 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]"
        >
          <div className="w-16 h-16 bg-secondary text-muted-foreground rounded-full flex items-center justify-center mb-4">
            <SearchX className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">No se encontraron videos</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            No hay videos que coincidan con los filtros actuales. Prueba ampliando tu búsqueda.
          </p>
          <Button onClick={clearFilters} variant="outline">
            Limpiar Filtros
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {feedVideos.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <FeedVideoCard
                video={video}
                isFavorite={favoriteAthleteIds.has(video.athlete.id)}
                onToggleFavorite={(e) => {
                  e.stopPropagation();
                  toggleFavorite(video.athlete.id);
                }}
                onViewVideo={() => setSelectedVideo(video)}
                onViewAthlete={(e) => {
                  e.stopPropagation();
                  setSelectedAthlete(video.athlete);
                }}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Player Modal */}
      <FeedVideoPlayerModal 
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
        onViewAthlete={() => {
          if (selectedVideo) {
            setSelectedAthlete(selectedVideo.athlete);
          }
        }}
      />

      {/* Profile Slide-in Panel */}
      <AthleteProfilePanel 
        athlete={selectedAthlete}
        isOpen={!!selectedAthlete}
        onClose={() => setSelectedAthlete(null)}
        isFavorite={selectedAthlete ? favoriteAthleteIds.has(selectedAthlete.id) : false}
        onToggleFavorite={() => {
          if (selectedAthlete) toggleFavorite(selectedAthlete.id);
        }}
      />
      
    </div>
  );
}
