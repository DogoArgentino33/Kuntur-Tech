'use client';

import { motion } from 'framer-motion';
import { Target, Filter, BarChart3, Database, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const benefits = [
  { icon: <Target />, text: "Descubrir talentos a nivel global" },
  { icon: <Filter />, text: "Filtrar por deporte, posición, edad y métricas" },
  { icon: <BarChart3 />, text: "Analytics y reportes de rendimiento" },
  { icon: <Database />, text: "Ahorro significativo en costos de scouting" },
];

export function ForClubs() {
  return (
    <section id="para-clubes" className="py-24 bg-background overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1 relative"
          >
            {/* Abstract decorative elements */}
            <div className="absolute -inset-4 bg-accent/20 blur-3xl rounded-full opacity-50 z-0" />
            
            <div className="relative z-10 rounded-2xl border border-white/10 bg-secondary/50 p-2 shadow-2xl backdrop-blur-sm">
              <img 
                src="https://images.unsplash.com/photo-1543351611-58f69d7c1781?auto=format&fit=crop&q=80&w=800&h=600" 
                alt="Dashboard de Scouts" 
                className="rounded-xl object-cover w-full h-auto aspect-video grayscale hover:grayscale-0 transition-all duration-500"
              />
              
              {/* Floating stat card */}
              <div className="absolute top-6 -right-6 bg-black border border-white/10 rounded-xl p-4 shadow-xl flex items-center gap-4 animate-bounce" style={{ animationDuration: '4s' }}>
                <div className="bg-accent/20 p-3 rounded-lg">
                  <Database className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Base de Datos</p>
                  <p className="text-lg font-bold">10k+ Atletas</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <Badge variant="outline" className="text-accent border-accent/30 bg-accent/10 mb-6 px-4 py-1 text-sm">
              Suscripción desde $199/mes
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Scouting de precisión impulsado por <span className="text-accent">datos e IA</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Optimiza tu presupuesto de captación. Nuestro dashboard inteligente te permite analizar miles de perfiles objetivamente antes de enviar a un ojeador al campo.
            </p>
            
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="text-accent bg-accent/10 p-1 rounded-full">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <span className="text-foreground/90 font-medium">{benefit.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
