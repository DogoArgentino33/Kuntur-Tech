'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Trophy, Globe, TrendingUp, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const benefits = [
  { icon: <Globe />, text: "Exposición global sin límites geográficos" },
  { icon: <TrendingUp />, text: "Evaluación objetiva por Inteligencia Artificial" },
  { icon: <Shield />, text: "Portafolio deportivo profesional verificado" },
  { icon: <Trophy />, text: "Acceso directo a oportunidades en academias" },
];

export function ForAthletes() {
  return (
    <section id="para-atletas" className="py-24 bg-[#0a0a0a] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="text-primary border-primary/30 bg-primary/10 mb-6 px-4 py-1 text-sm">
              Gratis para crear perfil
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Tu talento merece ser <span className="text-primary">visto por el mundo</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              No dejes que tu ubicación o recursos limiten tu futuro. Crea tu perfil, sube tus videos y deja que nuestra IA y los clubes te encuentren a ti.
            </p>
            
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="text-primary bg-primary/10 p-1 rounded-full">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <span className="text-foreground/90 font-medium">{benefit.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Abstract decorative elements */}
            <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-50 z-0" />
            
            <div className="relative z-10 rounded-2xl border border-white/10 bg-secondary/50 p-2 shadow-2xl backdrop-blur-sm">
              <img 
                src="https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&q=80&w=800&h=600" 
                alt="Atleta en entrenamiento" 
                className="rounded-xl object-cover w-full h-auto aspect-video grayscale hover:grayscale-0 transition-all duration-500"
              />
              
              {/* Floating stat card */}
              <div className="absolute -bottom-6 -left-6 bg-black border border-white/10 rounded-xl p-4 shadow-xl flex items-center gap-4 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="bg-primary/20 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Métrica IA</p>
                  <p className="text-lg font-bold">Potencial Alto</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
