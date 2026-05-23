'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/common/FormInput';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

const loginSchema = z.object({
  email: z.string().email('Ingresa un email válido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { setToken, setUserType } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const response = await api.post('/auth/login', {
        email: data.email,
        password: data.password,
      });

      const { access_token, user_type } = response.data;

      setToken(access_token);
      setUserType(user_type as 'athlete' | 'club');

      toast.success('¡Bienvenido de nuevo!');

      // Redirigir según tipo de usuario
      if (user_type === 'athlete') {
        router.push('/dashboard/athlete');
      } else {
        router.push('/dashboard/club');
      }
    } catch (error: any) {
      const detail = error.response?.data?.detail;
      if (detail === 'Email no registrado') {
        toast.error('No existe una cuenta con ese email');
      } else if (detail === 'Contraseña incorrecta') {
        toast.error('La contraseña es incorrecta');
      } else if (detail === 'Cuenta desactivada') {
        toast.error('Tu cuenta ha sido desactivada');
      } else {
        toast.error('Error al iniciar sesión. Intenta de nuevo.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-8 md:p-10"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Bienvenido de vuelta</h2>
        <p className="text-muted-foreground">
          Ingresa tus credenciales para acceder a tu cuenta
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormInput
          label="Email"
          type="email"
          placeholder="tu@email.com"
          autoComplete="email"
          {...register('email')}
          error={errors.email?.message}
        />

        <div className="relative">
          <FormInput
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="current-password"
            {...register('password')}
            error={errors.password?.message}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {/* Forgot Password Link */}
        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-primary hover:underline transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 text-base font-semibold bg-primary text-black hover:bg-primary/90 rounded-xl transition-all"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Ingresando...
            </>
          ) : (
            <>
              Iniciar Sesión
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 text-muted-foreground">¿No tienes cuenta?</span>
        </div>
      </div>

      {/* Register CTA */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/register?type=athlete" className="w-full">
          <Button
            variant="outline"
            className="w-full h-11 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/60 transition-all"
          >
            Soy Atleta
          </Button>
        </Link>
        <Link href="/register?type=club" className="w-full">
          <Button
            variant="outline"
            className="w-full h-11 border-accent/30 text-accent hover:bg-accent/10 hover:border-accent/60 transition-all"
          >
            Soy Club / Scout
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
