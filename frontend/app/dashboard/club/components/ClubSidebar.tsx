'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Compass, 
  Star, 
  Search, 
  Building2, 
  Settings, 
  LogOut, 
  Menu,
  X,
  Bell
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Explorar', href: '/dashboard/club', icon: Compass },
  { name: 'Favoritos', href: '/dashboard/club/favorites', icon: Star },
  { name: 'Búsqueda Avanzada', href: '/dashboard/club/search', icon: Search },
  { name: 'Mi Organización', href: '/dashboard/club/profile', icon: Building2 },
  { name: 'Configuración', href: '/dashboard/club/settings', icon: Settings },
];

export function ClubSidebar() {
  const pathname = usePathname();
  const { logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card border-r border-white/5">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold text-xl tracking-tight">
            Kuntur<span className="text-primary">-Tech</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <span
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={() => logout()}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="lg:hidden flex items-center justify-between p-4 bg-card border-b border-white/5 sticky top-0 z-30">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold text-lg tracking-tight">
            Kuntur<span className="text-primary">-Tech</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <button className="text-muted-foreground hover:text-foreground">
            <Bell className="h-5 w-5" />
          </button>
          <button onClick={toggleSidebar} className="text-foreground">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/80 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <motion.div
        className={cn(
          "lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-card shadow-xl transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </motion.div>

      <div className="hidden lg:flex flex-col w-64 fixed inset-y-0 z-30">
        <SidebarContent />
      </div>
    </>
  );
}
