'use client';

import { motion } from 'framer-motion';
import { Eye, MessageSquare, Star, Target, Trophy } from 'lucide-react';
import type { DashboardStats } from '@/types/dashboard';

export function StatsSection({ stats }: { stats: DashboardStats }) {
  const statCards = [
    {
      title: 'Visualizaciones',
      value: stats.totalViews,
      subtitle: 'vistas totales',
      icon: Eye,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      title: 'Mensajes',
      value: stats.totalMessages,
      subtitle: 'mensajes recibidos',
      icon: MessageSquare,
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
    {
      title: 'Favoritas',
      value: stats.totalFavorites,
      subtitle: 'veces guardado',
      icon: Star,
      color: 'text-white',
      bg: 'bg-white/10',
    },
    {
      title: 'Completitud',
      value: `${stats.profileCompleteness}%`,
      subtitle: 'perfil completado',
      icon: Target,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      title: 'Ranking',
      value: `#${stats.rankingPosition || '-'}`,
      subtitle: stats.rankingCountry ? `en ${stats.rankingCountry}` : 'en tu país',
      icon: Trophy,
      color: 'text-muted-foreground',
      bg: 'bg-secondary',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
      {statCards.map((stat, i) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-card rounded-3xl border border-white/5 p-4 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">{stat.title}</span>
            <div className={`p-2 rounded-2xl ${stat.bg}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold leading-tight">{stat.value}</h3>
            <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
