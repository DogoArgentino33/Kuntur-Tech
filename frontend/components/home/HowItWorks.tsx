'use client';

import { motion } from 'framer-motion';
import { UserPlus, Activity, Network } from 'lucide-react';

const steps = [
  {
    icon: <UserPlus className="h-8 w-8" />,
    title: "1. Crear Perfil",
    description: "Sube tu perfil y videos de tu desempeño. Es rápido, fácil y 100% gratuito para atletas."
  },
  {
    icon: <Activity className="h-8 w-8" />,
    title: "2. IA Analiza",
    description: "Nuestro sistema evalúa tu potencial, métricas y habilidades automáticamente."
  },
  {
    icon: <Network className="h-8 w-8" />,
    title: "3. Conecta",
    description: "Scouts, clubes y academias te descubren basados en tu talento real, no en tu ubicación."
  }
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24 bg-background relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Cómo Funciona?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Un proceso simple diseñado para eliminar barreras y conectar el talento con las oportunidades.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Conecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-primary/10 via-primary/50 to-primary/10 z-0" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              <div className="w-24 h-24 rounded-full bg-secondary border border-white/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300 shadow-lg">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
