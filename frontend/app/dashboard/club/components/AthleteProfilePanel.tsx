'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, UserCircle, Activity, Ruler, Weight, Calendar, Star, MessageSquare } from 'lucide-react';
import { FeedAthleteInfo } from '@/types/club-dashboard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AthleteProfilePanelProps {
  athlete: FeedAthleteInfo | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function AthleteProfilePanel({ athlete, isOpen, onClose, isFavorite, onToggleFavorite }: AthleteProfilePanelProps) {
  if (!athlete) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Slide-in Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-card border-l border-white/10 shadow-2xl z-50 overflow-y-auto flex flex-col"
          >
            {/* Header / Actions */}
            <div className="flex items-center justify-between p-4 sticky top-0 bg-card/80 backdrop-blur-md z-10 border-b border-white/5">
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-white/10">
                <X className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className={`rounded-full border-white/10 ${isFavorite ? 'bg-accent/10 text-accent border-accent/20' : 'hover:bg-white/5'}`}
                  onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
                >
                  <Star className={`mr-2 h-4 w-4 ${isFavorite ? 'fill-accent' : ''}`} />
                  {isFavorite ? 'Guardado' : 'Guardar'}
                </Button>
                <Button size="sm" className="rounded-full bg-primary text-black hover:bg-primary/90">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contactar
                </Button>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-6 lg:p-8 flex-1">
              
              {/* Avatar & Name */}
              <div className="flex flex-col items-center text-center mb-8">
                <div className="relative mb-4">
                  {athlete.profile_picture_url ? (
                    <img 
                      src={athlete.profile_picture_url} 
                      alt={athlete.first_name} 
                      className="h-32 w-32 rounded-full object-cover border-4 border-card shadow-xl"
                    />
                  ) : (
                    <div className="h-32 w-32 rounded-full bg-secondary flex items-center justify-center border-4 border-card shadow-xl">
                      <UserCircle className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 bg-primary text-black px-3 py-1 rounded-full text-xs font-bold border-2 border-card">
                    PRO
                  </div>
                </div>

                <h2 className="text-2xl font-bold">
                  {athlete.first_name} {athlete.last_name}
                </h2>
                
                <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-muted-foreground">
                  <Badge variant="secondary" className="bg-white/5 hover:bg-white/10 border-none font-normal text-sm">
                    <Activity className="h-3 w-3 mr-1" />
                    {athlete.primary_sport?.name}
                  </Badge>
                  {athlete.primary_position && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-none hover:bg-primary/20 font-medium text-sm">
                      {athlete.primary_position.name}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="bg-secondary rounded-xl p-4 flex flex-col items-center justify-center border border-white/5">
                  <MapPin className="h-5 w-5 text-muted-foreground mb-1" />
                  <span className="text-xs text-muted-foreground">Ubicación</span>
                  <span className="font-medium text-center">{athlete.country}</span>
                </div>
                <div className="bg-secondary rounded-xl p-4 flex flex-col items-center justify-center border border-white/5">
                  <Calendar className="h-5 w-5 text-muted-foreground mb-1" />
                  <span className="text-xs text-muted-foreground">Edad</span>
                  <span className="font-medium">{athlete.age ? `${athlete.age} años` : 'N/A'}</span>
                </div>
                <div className="bg-secondary rounded-xl p-4 flex flex-col items-center justify-center border border-white/5">
                  <Ruler className="h-5 w-5 text-muted-foreground mb-1" />
                  <span className="text-xs text-muted-foreground">Altura</span>
                  <span className="font-medium">{athlete.height_cm ? `${athlete.height_cm} cm` : 'N/A'}</span>
                </div>
                <div className="bg-secondary rounded-xl p-4 flex flex-col items-center justify-center border border-white/5">
                  <Weight className="h-5 w-5 text-muted-foreground mb-1" />
                  <span className="text-xs text-muted-foreground">Peso</span>
                  <span className="font-medium">{athlete.weight_kg ? `${athlete.weight_kg} kg` : 'N/A'}</span>
                </div>
              </div>

              {/* Bio Section */}
              {athlete.bio && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Acerca de
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground bg-secondary/50 p-4 rounded-xl border border-white/5">
                    {athlete.bio}
                  </p>
                </div>
              )}

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
