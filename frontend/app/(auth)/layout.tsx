import Link from 'next/link';
import { Activity } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md mb-8 flex justify-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <span className="font-bold text-2xl tracking-tight">
            Kuntur<span className="text-primary">-Tech</span>
          </span>
        </Link>
      </div>

      <div className="w-full max-w-2xl bg-card border border-white/5 rounded-2xl shadow-2xl overflow-hidden relative z-10">
        {children}
      </div>
    </div>
  );
}
