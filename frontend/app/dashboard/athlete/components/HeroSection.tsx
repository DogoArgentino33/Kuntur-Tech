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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-4 flex-1 max-w-2xl">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold">
              ¡Hola, {athlete?.first_name || 'Atleta'}! 👋
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              {profileCompleteness === 100 
                ? 'Tu perfil está completo. ¡Sube nuevos videos para destacar!' 
                : 'Completa tu perfil para tener más chances de ser descubierto.'}
            </p>
          </div>
          
          <div className="grid gap-3 sm:grid-cols-[1fr_auto] lg:grid-cols-[1fr_auto] items-center">
            <Progress value={profileCompleteness} className="h-2 w-full" />
            <span className="text-sm font-medium text-muted-foreground text-right">{profileCompleteness}%</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center lg:justify-end gap-3">
          <Button onClick={onUploadClick} className="bg-primary text-black hover:bg-primary/90 whitespace-nowrap">
            <UploadCloud className="mr-2 h-4 w-4" />
            Subir Video
          </Button>
          <Button variant="outline" className="border-white/10 hover:bg-white/5 whitespace-nowrap">
            <Edit3 className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground whitespace-nowrap">
            <ExternalLink className="mr-2 h-4 w-4" />
            Ver Público
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
