'use client';

import { motion } from 'framer-motion';
import { UploadCloud, Edit3, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { AthleteProfile } from '@/types/dashboard';

interface HeroSectionProps {
  athlete: AthleteProfile | null;
  profileCompleteness: number;
  onUploadClick: () => void;
}

export function HeroSection({ athlete, profileCompleteness, onUploadClick }: HeroSectionProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-white/10 rounded-3xl p-6 lg:p-8"
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_auto] lg:items-center">
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold">
                ¡Hola, {athlete?.first_name || 'Atleta'}! 👋
              </h1>
              <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                {profileCompleteness === 100 
                  ? 'Tu perfil está completo. ¡Sube nuevos videos para destacar!' 
                  : 'Completa tu perfil para tener más chances de ser descubierto.'}
              </p>
            </div>
            <Button onClick={onUploadClick} className="bg-primary text-black hover:bg-primary/90 whitespace-nowrap">
              <UploadCloud className="mr-2 h-4 w-4" />
              Subir Video
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_auto] lg:grid-cols-[1fr_auto] items-center">
            <Progress value={profileCompleteness} className="h-2 w-full" />
            <span className="text-sm font-medium text-muted-foreground text-right">{profileCompleteness}%</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button variant="outline" className="border-white/10 hover:bg-white/5 text-sm px-4 py-2">
            <Edit3 className="mr-2 h-4 w-4" />
            Editar Perfil
          </Button>
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground text-sm px-4 py-2">
            <ExternalLink className="mr-2 h-4 w-4" />
            Ver Público
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
