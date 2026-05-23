'use client';

import { Suspense } from 'react';
import { LoginForm } from './components/LoginForm';

function LoginPageContent() {
  return <LoginForm />;
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-muted-foreground">
          Cargando...
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
