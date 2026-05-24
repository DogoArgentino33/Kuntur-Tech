'use client';

import { useState } from 'react';
import type { Video } from '@/types/dashboard';
import { motion } from 'framer-motion';
import { useDashboardData } from '@/hooks/useDashboardData';
import { HeroSection } from './components/HeroSection';
import { StatsSection } from './components/StatsSection';
import { MyVideosSection } from './components/MyVideosSection';
import { InterestSection } from './components/InterestSection';
import { NotificationsSection } from './components/NotificationsSection';
import { VideoUploadModal } from './components/VideoUploadModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';

export default function AthleteDashboardPage() {
  const { 
    athlete, 
    videos, 
    interests, 
    notifications, 
    stats, 
    isLoading, 
    error,
    deleteVideo,
    addVideo,
  } = useDashboardData();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const handleViewVideo = (id: number) => {
    const video = videos.find((item) => item.id === id);
    if (video) {
      setSelectedVideo(video);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
        <div className="bg-destructive/10 text-destructive p-4 rounded-xl mb-4">
          <p className="font-semibold">Error al cargar el dashboard</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="text-primary hover:underline text-sm"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        
        {/* 1. Hero Section */}
        {isLoading ? (
          <div className="h-44 rounded-3xl bg-card border border-white/5 animate-pulse" />
        ) : (
          <HeroSection 
            athlete={athlete} 
            profileCompleteness={stats.profileCompleteness}
            onUploadClick={() => setIsUploadModalOpen(true)}
          />
        )}

        <div className="mt-6 space-y-6">
          
          {/* 2. Stats Section */}
          <section>
            <h2 className="sr-only">Estadísticas</h2>
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
                {[1,2,3,4,5].map(i => <div key={i} className="h-24 rounded-2xl bg-card border border-white/5 animate-pulse" />)}
              </div>
            ) : (
              <StatsSection stats={stats} />
            )}
          </section>

          {/* 3. Layout Grid for Interests & Notifications */}
          <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-6">
            <div>
              {isLoading ? (
                <div className="h-72 rounded-3xl bg-card border border-white/5 animate-pulse" />
              ) : (
                <InterestSection interests={interests} total={interests.length} />
              )}
            </div>
            <div>
              {isLoading ? (
                <div className="h-72 rounded-3xl bg-card border border-white/5 animate-pulse" />
              ) : (
                <NotificationsSection notifications={notifications} />
              )}
            </div>
          </div>

        </div>

        {/* 4. My Videos Section */}
        <section className="relative">
          <MyVideosSection 
            videos={videos}
            isLoading={isLoading}
            onUploadClick={() => setIsUploadModalOpen(true)}
            onEdit={(id) => console.log('Edit video', id)}
            onDelete={deleteVideo}
            onView={handleViewVideo}
          />
        </section>

      </div>

      {/* Modals */}
      {isUploadModalOpen && (
        <VideoUploadModal 
          isOpen={isUploadModalOpen} 
          onClose={() => setIsUploadModalOpen(false)}
          onSuccess={(newVideo) => {
            setIsUploadModalOpen(false);
            addVideo(newVideo);
          }}
          athleteSportId={athlete?.primary_sport?.id}
        />
      )}

      <VideoPlayerModal 
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </>
  );
}
