'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDashboardData } from '@/hooks/useDashboardData';
import { HeroSection } from './components/HeroSection';
import { StatsSection } from './components/StatsSection';
import { MyVideosSection } from './components/MyVideosSection';
import { InterestSection } from './components/InterestSection';
import { NotificationsSection } from './components/NotificationsSection';
import { VideoUploadModal } from './components/VideoUploadModal';

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
    addMockVideo
  } = useDashboardData();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

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
      <div className="flex flex-col gap-6 pb-20 lg:pb-10">
        
        {/* 1. Hero Section */}
        {isLoading ? (
          <div className="h-48 bg-card border-b border-white/5 animate-pulse" />
        ) : (
          <HeroSection 
            athlete={athlete} 
            profileCompleteness={stats.profileCompleteness}
            onUploadClick={() => setIsUploadModalOpen(true)}
          />
        )}

        <div className="px-6 lg:px-10 flex flex-col gap-8 mt-2">
          
          {/* 2. Stats Section */}
          <section>
            <h2 className="text-xl font-bold mb-4 sr-only">Estadísticas</h2>
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                {[1,2,3,4,5].map(i => <div key={i} className="h-28 bg-card rounded-xl border border-white/5 animate-pulse" />)}
              </div>
            ) : (
              <StatsSection stats={stats} />
            )}
          </section>

          {/* 3. Layout Grid for Interests & Notifications */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {isLoading ? (
                <div className="h-64 bg-card rounded-2xl border border-white/5 animate-pulse" />
              ) : (
                <InterestSection interests={interests} total={interests.length} />
              )}
            </div>
            <div className="lg:col-span-1 h-96 lg:h-auto">
              {isLoading ? (
                <div className="h-full bg-card rounded-2xl border border-white/5 animate-pulse" />
              ) : (
                <NotificationsSection notifications={notifications} />
              )}
            </div>
          </div>

        </div>

        {/* 4. My Videos Section */}
        <section className="bg-background relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 pointer-events-none" />
          <div className="relative">
            <MyVideosSection 
              videos={videos}
              isLoading={isLoading}
              onUploadClick={() => setIsUploadModalOpen(true)}
              onEdit={(id) => console.log('Edit video', id)}
              onDelete={deleteVideo}
              onView={(id) => console.log('View video', id)}
            />
          </div>
        </section>

      </div>

      {/* Modals */}
      {isUploadModalOpen && (
        <VideoUploadModal 
          isOpen={isUploadModalOpen} 
          onClose={() => setIsUploadModalOpen(false)}
          onSuccess={(title) => {
            setIsUploadModalOpen(false);
            addMockVideo(title);
          }}
          athleteSportId={athlete?.primary_sport?.id}
        />
      )}
    </>
  );
}
