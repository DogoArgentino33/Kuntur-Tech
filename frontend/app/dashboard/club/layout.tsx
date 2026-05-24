'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { ClubSidebar } from './components/ClubSidebar';
import { Bell, UserCircle, Building2 } from 'lucide-react';
import { useClubDashboard } from '@/hooks/useClubDashboard';

export default function ClubDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { token, userType } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);
  const { clubProfile } = useClubDashboard();

  useEffect(() => {
    setIsMounted(true);
    if (!token) {
      router.push('/login');
    } else if (userType !== 'club') {
      router.push('/dashboard/athlete');
    }
  }, [token, userType, router]);

  if (!isMounted || !token || userType !== 'club') {
    return null; // Prevent hydration errors
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
      <ClubSidebar />
      
      <main className="flex-1 lg:ml-64 flex flex-col">
        {/* Desktop Header */}
        <header className="hidden lg:flex items-center justify-end h-16 px-8 bg-background border-b border-white/5 sticky top-0 z-20">
          <div className="flex items-center gap-6">
            <button className="relative text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            
            <div className="flex items-center gap-3 border-l border-white/10 pl-6">
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium">
                  {clubProfile?.name || 'Organización'}
                </span>
                <span className="text-xs text-accent px-2 py-0.5 rounded-full bg-accent/10">
                  {clubProfile?.club_type === 'professional' ? 'Club Profesional' : 
                   clubProfile?.club_type === 'academy' ? 'Academia' : 
                   clubProfile?.club_type === 'independent_scout' ? 'Scout' : 
                   clubProfile?.club_type === 'independent_coach' ? 'Entrenador' : 'Club'}
                </span>
              </div>
              {clubProfile?.logo_url ? (
                 <img src={clubProfile.logo_url} alt="Logo" className="h-8 w-8 rounded-full object-cover bg-white" />
              ) : (
                <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center border border-white/10">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content area */}
        <div className="flex-1 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
