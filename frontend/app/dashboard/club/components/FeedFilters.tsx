'use client';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { FeedFilters } from '@/types/club-dashboard';
import { useSports, usePositions } from '@/hooks/useSports';

interface FeedFiltersProps {
  filters: FeedFilters;
  onUpdateFilters: (filters: Partial<FeedFilters>) => void;
  onClearFilters: () => void;
}

export function FeedFiltersBar({ filters, onUpdateFilters, onClearFilters }: FeedFiltersProps) {
  const { sports } = useSports();
  const { positions } = usePositions(filters.sportId ? parseInt(filters.sportId) : null);

  const hasActiveFilters = filters.sportId || filters.positionId || filters.country || filters.search;

  return (
    <div className="bg-card border border-white/5 p-4 rounded-xl mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar atleta por nombre o bio..." 
            className="pl-9 bg-background/50 border-white/10"
            value={filters.search}
            onChange={(e) => onUpdateFilters({ search: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto">
          <Select 
            value={filters.sportId} 
            onValueChange={(val) => onUpdateFilters({ sportId: val === 'all' ? '' : val, positionId: '' })}
          >
            <SelectTrigger className="w-full lg:w-[160px] bg-background/50 border-white/10">
              <SelectValue placeholder="Deporte" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los deportes</SelectItem>
              {sports.map(s => (
                <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={filters.positionId} 
            onValueChange={(val) => onUpdateFilters({ positionId: val === 'all' ? '' : val })}
            disabled={!filters.sportId}
          >
            <SelectTrigger className="w-full lg:w-[160px] bg-background/50 border-white/10">
              <SelectValue placeholder="Posición" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las posiciones</SelectItem>
              {positions.map(p => (
                <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={filters.country} 
            onValueChange={(val) => onUpdateFilters({ country: val === 'all' ? '' : val })}
          >
            <SelectTrigger className="w-full lg:w-[160px] bg-background/50 border-white/10">
              <SelectValue placeholder="País" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los países</SelectItem>
              <SelectItem value="Argentina">Argentina</SelectItem>
              <SelectItem value="Chile">Chile</SelectItem>
              <SelectItem value="Colombia">Colombia</SelectItem>
              <SelectItem value="México">México</SelectItem>
              <SelectItem value="Perú">Perú</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClearFilters}
            className="shrink-0 text-muted-foreground hover:text-destructive hidden lg:flex"
            title="Limpiar filtros"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {hasActiveFilters && (
        <Button 
          variant="ghost" 
          onClick={onClearFilters}
          className="w-full mt-4 text-muted-foreground hover:text-destructive lg:hidden"
        >
          <X className="h-4 w-4 mr-2" /> Limpiar filtros
        </Button>
      )}
    </div>
  );
}
