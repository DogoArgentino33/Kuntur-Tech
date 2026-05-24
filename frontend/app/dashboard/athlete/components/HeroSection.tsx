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
      className="bg-card border-b border-white/5 px-6 py-10 lg:px-10"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 max-w-7xl mx-auto">
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">
            ¡Hola, {athlete?.first_name || 'Atleta'}! 👋
          </h1>
          <p className="text-muted-foreground">
            {profileCompleteness === 100 
              ? 'Tu perfil está completo. ¡Sube nuevos videos para destacar!' 
              : 'Completa tu perfil para tener más chances de ser descubierto.'}
          </p>
          
          <div className="flex items-center gap-4 mt-4 max-w-md">
            <Progress value={profileCompleteness} className="h-2 flex-1" />
            <span className="text-sm font-medium">{profileCompleteness}%</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-4 lg:mt-0">
          <Button onClick={onUploadClick} className="bg-primary text-black hover:bg-primary/90">
            <UploadCloud className="mr-2 h-4 w-4" />
            Subir Video
          </Button>
          <Button variant="outline" className="border-white/10 hover:bg-white/5">
            <Edit3 className="mr-2 h-4 w-4" />
            Editar Perfil
          </Button>
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            <ExternalLink className="mr-2 h-4 w-4" />
            Ver Público
          </Button>
        </div>

      </div>
    </motion.div>
  );
}
