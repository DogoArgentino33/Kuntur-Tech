'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { DashboardSidebar } from './components/DashboardSidebar';
import { Bell, UserCircle } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';

export default function AthleteDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { token, userType } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);
  const { athlete } = useDashboardData();

  useEffect(() => {
    setIsMounted(true);
    if (!token) {
      router.push('/login');
    } else if (userType !== 'athlete') {
      router.push('/dashboard/club');
    }
  }, [token, userType, router]);

  if (!isMounted || !token || userType !== 'athlete') {
    return null; // Return null while checking auth to prevent hydration errors
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
      <DashboardSidebar />
      
      <main className="flex-1 lg:ml-64 flex flex-col">
        {/* Desktop Header */}
        <header className="hidden lg:flex items-center justify-end h-16 px-8 bg-background border-b border-white/5 sticky top-0 z-20">
          <div className="flex items-center gap-6">
            <button className="relative text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
            </button>
            
            <div className="flex items-center gap-3 border-l border-white/10 pl-6">
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium">
                  {athlete ? `${athlete.first_name} ${athlete.last_name}` : 'Atleta'}
                </span>
                <span className="text-xs text-primary px-2 py-0.5 rounded-full bg-primary/10">
                  Atleta
                </span>
              </div>
              {athlete?.profile_picture_url ? (
                 <img src={athlete.profile_picture_url} alt="Profile" className="h-8 w-8 rounded-full object-cover" />
              ) : (
                <UserCircle className="h-8 w-8 text-muted-foreground" />
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
