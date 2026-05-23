'use client';

import { motion } from 'framer-motion';
import { UserCircle, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface UserTypeSelectorProps {
  onSelect: (type: 'athlete' | 'club') => void;
}

export function UserTypeSelector({ onSelect }: UserTypeSelectorProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="p-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">¿Quién Eres?</h2>
        <p className="text-muted-foreground">Selecciona el tipo de cuenta que deseas crear</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <Card 
          className="relative overflow-hidden cursor-pointer group hover:border-primary/50 transition-all duration-300"
          onClick={() => onSelect('athlete')}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <UserCircle className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Atleta / Jugador</h3>
            <p className="text-sm text-muted-foreground">
              Soy deportista buscando oportunidades para ser descubierto.
            </p>
          </div>
        </Card>

        <Card 
          className="relative overflow-hidden cursor-pointer group hover:border-accent/50 transition-all duration-300"
          onClick={() => onSelect('club')}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Club / Scout</h3>
            <p className="text-sm text-muted-foreground">
              Represento una organización y busco talentos globales.
            </p>
          </div>
        </Card>

      </div>
    </motion.div>
  );
}
