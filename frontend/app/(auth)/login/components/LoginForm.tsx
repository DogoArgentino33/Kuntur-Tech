'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Eye,
  EyeOff,
  LogIn,
  Loader2,
  Mail,
  Lock,
  ArrowRight,
  UserCircle,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/common/FormInput';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

// ── Validation Schemas ───────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().min(1, 'El email es requerido').email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'El email es requerido').email('Email inválido'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

// ── Login States ─────────────────────────────────────────────────

type LoginStatus = 'idle' | 'loading' | 'success' | 'error';

// ── Component ────────────────────────────────────────────────────

export function LoginForm() {
  const router = useRouter();
  const { setToken, setUserType } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [loginStatus, setLoginStatus] = useState<LoginStatus>('idle');
  const [serverError, setServerError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const {
    register: registerForgot,
    handleSubmit: handleForgotSubmit,
    formState: { errors: forgotErrors },
    reset: resetForgot,
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  // ── Login Handler ────────────────────────────────────────────

  const onSubmit = async (data: LoginFormData) => {
    setLoginStatus('loading');
    setServerError('');

    try {
      const response = await api.post('/auth/login', {
        email: data.email,
        password: data.password,
      });

      setLoginStatus('success');
      setToken(response.data.access_token);
      setUserType(response.data.user_type);

      toast.success('¡Bienvenido de vuelta!', {
        description: 'Redirigiendo a tu panel de control...',
      });

      // Brief pause to show success state, then redirect
      setTimeout(() => {
        if (response.data.user_type === 'athlete') {
          router.push('/dashboard/athlete');
        } else {
          router.push('/dashboard/club');
        }
      }, 800);
    } catch (error: any) {
      setLoginStatus('error');

      const detail = error.response?.data?.detail;

      if (error.response?.status === 401) {
        setServerError(detail || 'Credenciales inválidas');
      } else if (error.response?.status === 403) {
        setServerError(detail || 'Tu cuenta está desactivada');
      } else if (error.response?.status === 429) {
        setServerError('Demasiados intentos. Intenta de nuevo en 15 minutos.');
      } else {
        setServerError('Error de conexión. Verifica tu internet e intenta de nuevo.');
      }

      // Reset status after 3 seconds so user can try again
      setTimeout(() => setLoginStatus('idle'), 3000);
    }
  };

  // ── Forgot Password Handler ──────────────────────────────────

  const onForgotPassword = async (data: ForgotPasswordData) => {
    setForgotPasswordLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: data.email });
      setForgotPasswordSent(true);
    } catch {
      // The backend always returns success to prevent email enumeration,
      // so if we get an actual network error, show a generic message
      toast.error('Error de conexión. Intenta de nuevo.');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleCloseForgotPassword = () => {
    setForgotPasswordOpen(false);
    setForgotPasswordSent(false);
    resetForgot();
  };

  // ── Button Content By State ──────────────────────────────────

  const getButtonContent = () => {
    switch (loginStatus) {
      case 'loading':
        return (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Verificando...
          </>
        );
      case 'success':
        return (
          <>
            <CheckCircle2 className="h-4 w-4" />
            ¡Bienvenido!
          </>
        );
      case 'error':
        return (
          <>
            <AlertCircle className="h-4 w-4" />
            Error al iniciar sesión
          </>
        );
      default:
        return (
          <>
            <LogIn className="h-4 w-4" />
            Iniciar Sesión
          </>
        );
    }
  };

  const getButtonClass = () => {
    switch (loginStatus) {
      case 'success':
        return 'bg-emerald-500 text-white hover:bg-emerald-600';
      case 'error':
        return 'bg-destructive text-white hover:bg-destructive/90';
      default:
        return 'bg-primary text-black hover:bg-primary/90';
    }
  };

  // ── Render ───────────────────────────────────────────────────

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold mb-2">Iniciar Sesión</h2>
            <p className="text-muted-foreground text-sm">
              Ingresa tus credenciales para acceder a tu cuenta
            </p>
          </motion.div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Field */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="relative">
              <FormInput
                label="Email"
                type="email"
                placeholder="tu@email.com"
                autoComplete="email"
                {...register('email')}
                error={errors.email?.message}
              />
              <Mail className="absolute right-3 top-9 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </motion.div>

          {/* Password Field with Toggle */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
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
                className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </motion.div>

          {/* Remember Me + Forgot Password */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember-me"
                checked={rememberMe}
                onCheckedChange={(val) => setRememberMe(val as boolean)}
              />
              <label
                htmlFor="remember-me"
                className="text-sm text-muted-foreground cursor-pointer select-none"
              >
                Recuérdame
              </label>
            </div>

            <button
              type="button"
              onClick={() => setForgotPasswordOpen(true)}
              className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </motion.div>

          {/* Server Error Message */}
          <AnimatePresence>
            {serverError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{serverError}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              type="submit"
              disabled={loginStatus === 'loading' || loginStatus === 'success'}
              className={`w-full h-11 text-sm font-semibold gap-2 transition-all duration-300 ${getButtonClass()}`}
            >
              {getButtonContent()}
            </Button>
          </motion.div>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-3 text-muted-foreground">
              ¿No tienes cuenta?
            </span>
          </div>
        </div>

        {/* Register CTA Cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          <Link href="/register?type=athlete" className="block">
            <Card className="group relative overflow-hidden cursor-pointer hover:border-primary/50 transition-all duration-300 h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <UserCircle className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">Como Atleta</p>
                  <p className="text-xs text-muted-foreground truncate">
                    Muestra tu talento
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Card>
          </Link>

          <Link href="/register?type=club" className="block">
            <Card className="group relative overflow-hidden cursor-pointer hover:border-accent/50 transition-all duration-300 h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">Como Club</p>
                  <p className="text-xs text-muted-foreground truncate">
                    Descubre talentos
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Card>
          </Link>
        </motion.div>
      </motion.div>

      {/* ── Forgot Password Modal ───────────────────────────────── */}
      <Dialog open={forgotPasswordOpen} onOpenChange={handleCloseForgotPassword}>
        <DialogContent className="bg-card border-white/5 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {forgotPasswordSent ? 'Revisa tu email' : 'Recuperar Contraseña'}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {forgotPasswordSent
                ? 'Si el email está registrado, recibirás un enlace para restablecer tu contraseña.'
                : 'Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.'}
            </DialogDescription>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {!forgotPasswordSent ? (
              <motion.form
                key="forgot-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleForgotSubmit(onForgotPassword)}
                className="space-y-4 mt-2"
              >
                <div className="relative">
                  <FormInput
                    label="Email registrado"
                    type="email"
                    placeholder="tu@email.com"
                    {...registerForgot('email')}
                    error={forgotErrors.email?.message}
                  />
                  <Mail className="absolute right-3 top-9 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={handleCloseForgotPassword}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={forgotPasswordLoading}
                    className="flex-1 bg-primary text-black hover:bg-primary/90 gap-2"
                  >
                    {forgotPasswordLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      'Enviar enlace'
                    )}
                  </Button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="forgot-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8" />
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  El enlace de recuperación es válido por <strong>1 hora</strong>.
                  <br />
                  Si no lo ves, revisa tu carpeta de spam.
                </p>
                <Button
                  onClick={handleCloseForgotPassword}
                  className="bg-primary text-black hover:bg-primary/90"
                >
                  Entendido
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
}
