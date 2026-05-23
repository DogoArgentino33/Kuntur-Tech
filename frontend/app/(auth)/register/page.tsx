'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { UserTypeSelector } from './components/UserTypeSelector';
import { AthleteForm } from './components/AthleteForm';
import { ClubForm } from './components/ClubForm';

export default function RegisterPage() {
  const [selectedType, setSelectedType] = useState<'athlete' | 'club' | null>(null);
  const searchParams = useSearchParams();

  // Permite pre-seleccionar el tipo basado en la URL (?type=athlete)
  useEffect(() => {
    const typeQuery = searchParams.get('type');
    if (typeQuery === 'athlete' || typeQuery === 'club') {
      setSelectedType(typeQuery);
    }
  }, [searchParams]);

  return (
    <>
      {!selectedType && (
        <UserTypeSelector onSelect={setSelectedType} />
      )}

      {selectedType === 'athlete' && (
        <AthleteForm onBack={() => setSelectedType(null)} />
      )}

      {selectedType === 'club' && (
        <ClubForm onBack={() => setSelectedType(null)} />
      )}
    </>
  );
}
