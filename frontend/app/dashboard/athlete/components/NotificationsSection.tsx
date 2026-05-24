'use client';

import { motion } from 'framer-motion';
import { Bell, Eye, CheckCircle, XCircle, MessageSquare, Flame, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardNotification } from '@/types/dashboard';

interface NotificationsSectionProps {
  notifications: DashboardNotification[];
}

export function NotificationsSection({ notifications }: NotificationsSectionProps) {
  
  const getIcon = (type: DashboardNotification['type']) => {
    switch (type) {
      case 'view': return <Eye className="h-4 w-4 text-blue-400" />;
      case 'approval': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'rejection': return <XCircle className="h-4 w-4 text-red-400" />;
      case 'message': return <MessageSquare className="h-4 w-4 text-purple-400" />;
      case 'interest': return <Flame className="h-4 w-4 text-accent" />;
      case 'system': default: return <Info className="h-4 w-4 text-primary" />;
    }
  };

  const getBg = (type: DashboardNotification['type']) => {
    switch (type) {
      case 'view': return 'bg-blue-500/10';
      case 'approval': return 'bg-green-500/10';
      case 'rejection': return 'bg-red-500/10';
      case 'message': return 'bg-purple-500/10';
      case 'interest': return 'bg-accent/10';
      case 'system': default: return 'bg-primary/10';
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Hace un momento';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `Hace ${diffInMinutes}m`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Ayer';
    return `Hace ${diffInDays} días`;
  };

  return (
    <div className="bg-card border border-white/5 rounded-2xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notificaciones
        </h3>
      </div>

      <div className="flex-1 flex flex-col gap-1 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground pb-8">
            No tienes notificaciones nuevas
          </div>
        ) : (
          notifications.slice(0, 5).map((notif, i) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-start gap-3 p-3 rounded-xl transition-colors hover:bg-white/5 ${!notif.read ? 'bg-white/5' : ''}`}
            >
              <div className={`mt-0.5 p-2 rounded-full shrink-0 ${getBg(notif.type)}`}>
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{notif.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                  {notif.description}
                </p>
                <p className="text-[10px] text-muted-foreground/70 mt-1">
                  {formatTimeAgo(notif.created_at)}
                </p>
              </div>
              {!notif.read && (
                <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
              )}
            </motion.div>
          ))
        )}
      </div>

      {notifications.length > 0 && (
        <Button variant="ghost" className="w-full mt-2 text-sm text-muted-foreground hover:text-foreground">
          Ver todas
        </Button>
      )}
    </div>
  );
}
