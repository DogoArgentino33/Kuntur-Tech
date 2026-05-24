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
    <div className="bg-card border border-white/5 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Flame className="h-5 w-5 text-accent" />
          {total} clubes están interesados
        </h3>
        <Button variant="ghost" className="text-sm text-muted-foreground hover:text-foreground hidden sm:flex">
          Ver todos <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {interests.slice(0, 3).map((club, i) => (
          <motion.div
            key={club.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-4 p-4 rounded-xl bg-secondary hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
          >
            <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-xl font-bold shrink-0">
              {club.logo_url ? (
                <img src={club.logo_url} alt={club.name} className="h-full w-full rounded-full object-cover" />
              ) : (
                club.name.charAt(0)
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm truncate">{club.name}</h4>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1 truncate">
                <MapPin className="h-3 w-3 shrink-0" />
                {club.city}, {club.country}
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" className="h-7 text-xs px-2 w-full">Perfil</Button>
                <Button size="sm" className="h-7 text-xs px-2 w-full bg-accent text-black hover:bg-accent/90">Mensaje</Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <Button variant="ghost" className="w-full mt-4 text-sm text-muted-foreground hover:text-foreground sm:hidden">
        Ver todos los intereses
      </Button>
    </div>
  );
}
