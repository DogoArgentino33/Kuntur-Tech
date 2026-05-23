'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-background">
        {/* Gradients */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] opacity-50 mix-blend-screen animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] opacity-50 mix-blend-screen" />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-muted-foreground mb-8">
            <span className="flex h-2 w-2 rounded-full bg-primary"></span>
            Revolucionando el Scouting en LATAM
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
            <span className="block text-foreground mb-2">¿Cuántos talentos</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-accent pb-2">
              nunca fueron descubiertos?
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Simplemente por haber nacido lejos de una gran ciudad. 
            Somos la plataforma de scouting deportivo que democratiza oportunidades usando Inteligencia Artificial.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register?type=athlete" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 bg-primary text-black hover:bg-primary/90 rounded-full">
                Empezar Como Atleta
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Link href="/register?type=club" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full border-white/20 hover:bg-white/5">
                <Search className="mr-2 h-5 w-5" />
                Soy Club / Scout
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Mockup / Visual Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 mx-auto relative max-w-5xl"
        >
          <div className="relative rounded-xl md:rounded-2xl border border-white/10 bg-black/50 backdrop-blur-sm p-2 md:p-4 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10 rounded-xl" />
            <img 
              src="https://images.unsplash.com/photo-1518605368461-1ee7c5108fb8?auto=format&fit=crop&q=80&w=1200&h=600" 
              alt="Dashboard Preview" 
              className="rounded-lg md:rounded-xl opacity-60 w-full object-cover h-[300px] md:h-[400px]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
