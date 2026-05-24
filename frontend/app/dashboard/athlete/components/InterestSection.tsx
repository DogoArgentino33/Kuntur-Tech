'use client';

import { motion } from 'framer-motion';
import { Flame, MapPin, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ClubInterest } from '@/types/dashboard';

interface InterestSectionProps {
  interests: ClubInterest[];
  total: number;
}

export function InterestSection({ interests, total }: InterestSectionProps) {
  if (interests.length === 0) return null;

  return (
    <div className="bg-card border border-white/10 rounded-3xl p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-accent" />
          <h3 className="text-lg font-semibold">{total} clubes están interesados</h3>
        </div>
        <Button variant="ghost" className="text-sm text-muted-foreground hover:text-foreground hidden sm:inline-flex">
          Ver todos <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {interests.slice(0, 3).map((club, i) => (
          <motion.div
            key={club.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-3xl border border-white/5 bg-secondary p-4 transition-colors hover:bg-white/5"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-lg font-semibold text-foreground shrink-0 overflow-hidden">
                {club.logo_url ? (
                  <img src={club.logo_url} alt={club.name} className="h-full w-full object-cover" />
                ) : (
                  club.name.charAt(0)
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-semibold leading-tight truncate">{club.name}</h4>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1 truncate">
                  <MapPin className="h-3 w-3 shrink-0" />
                  {club.city}, {club.country}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <Button size="sm" variant="outline" className="h-9 min-w-0 text-xs px-2">
                Perfil
              </Button>
              <Button size="sm" className="h-9 min-w-0 text-xs px-2 bg-accent text-black hover:bg-accent/90">
                Mensaje
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      <Button variant="ghost" className="mt-4 w-full text-sm text-muted-foreground hover:text-foreground sm:hidden">
        Ver todos los intereses
      </Button>
    </div>
  );
}
