'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/common/FormInput';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';

const clubTypeOptions = [
  { value: 'professional', label: 'Club Profesional' },
  { value: 'academy', label: 'Academia' },
  { value: 'federation', label: 'Federación' },
  { value: 'independent_scout', label: 'Scout Independiente' },
  { value: 'independent_coach', label: 'Entrenador Autónomo' },
];

const clubSchema = z.object({
  // Step 1 — Organización
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  clubType: z.string().min(1, 'Selecciona un tipo de organización'),
  country: z.string().min(2, 'El país es requerido'),
  city: z.string().min(2, 'La ciudad es requerida'),
  phone: z.string().min(7, 'Teléfono requerido'),
  description: z.string().min(10, 'Describe brevemente tu organización (mín. 10 caracteres)').max(500, 'Máximo 500 caracteres'),

  // Responsable
  responsibleName: z.string().min(2, 'El nombre del responsable es requerido'),
  responsiblePosition: z.string().optional(),

  // Step 2 — Credenciales
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Debe tener mínimo 8 caracteres').regex(/[A-Z]/, 'Debe contener una mayúscula').regex(/[0-9]/, 'Debe contener un número'),
  confirmPassword: z.string(),

  terms: z.literal(true, {
    message: 'Debes aceptar los términos y condiciones'
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type ClubFormData = z.infer<typeof clubSchema>;

export function ClubForm({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { setToken, setUserType } = useAuthStore();
  
  const { register, handleSubmit, formState: { errors }, watch, setValue, trigger } = useForm<ClubFormData>({
    resolver: zodResolver(clubSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      clubType: '',
      country: '',
      city: '',
      phone: '',
      description: '',
      responsibleName: '',
      responsiblePosition: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleNextStep = async () => {
    let fieldsToValidate: (keyof ClubFormData)[] = [];
    if (step === 1) {
      fieldsToValidate = ['name', 'clubType', 'country', 'city', 'phone', 'description', 'responsibleName'];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep(prev => prev + 1);
    }
  };

  const onSubmit = async (data: ClubFormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        email: data.email,
        password: data.password,
        name: data.name,
        club_type: data.clubType,
        country: data.country,
        city: data.city,
        phone: data.phone,
        description: data.description,
        responsible_name: data.responsibleName,
        responsible_position: data.responsiblePosition || null,
      };

      const response = await api.post('/auth/register/club', payload);
      
      setToken(response.data.access_token);
      setUserType('club');
      toast.success('¡Organización registrada exitosamente!');
      router.push('/dashboard/club');
      
    } catch (error: any) {
      const detail = error.response?.data?.detail;
      if (typeof detail === 'string') {
        toast.error(detail);
      } else {
        toast.error('Hubo un error al registrar. Revisa los campos.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Registro de Club / Scout</h2>
        <Progress value={(step / 2) * 100} className="h-2 mb-2" />
        <p className="text-sm text-muted-foreground text-right">Paso {step} de 2</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* STEP 1: Datos de la Organización */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <FormInput label="Nombre de la Organización / Club" {...register('name')} error={errors.name?.message} />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Organización</label>
                <Select value={watch('clubType')} onValueChange={(val) => setValue('clubType', val || '', { shouldValidate: true })}>
                  <SelectTrigger className={errors.clubType ? "border-destructive" : ""}>
                    <SelectValue placeholder="Selecciona el tipo">
                      {(value: string | null) => {
                        const opt = clubTypeOptions.find(o => o.value === value);
                        return opt ? opt.label : "Selecciona el tipo";
                      }}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {clubTypeOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.clubType && <p className="text-sm text-destructive">{errors.clubType.message}</p>}
              </div>
              <FormInput label="País" {...register('country')} error={errors.country?.message} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="Ciudad" {...register('city')} error={errors.city?.message} />
              <FormInput label="Teléfono" {...register('phone')} error={errors.phone?.message} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Descripción de la Organización</label>
              <textarea
                {...register('description')}
                rows={3}
                placeholder="Breve descripción de tu club, academia o agencia..."
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormInput label="Nombre del Responsable" {...register('responsibleName')} error={errors.responsibleName?.message} />
              <FormInput label="Cargo (Opcional)" {...register('responsiblePosition')} error={errors.responsiblePosition?.message} />
            </div>
          </motion.div>
        )}

        {/* STEP 2: Credenciales de Acceso */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <FormInput label="Email de Acceso" type="email" {...register('email')} error={errors.email?.message} />
            
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="Contraseña" type="password" {...register('password')} error={errors.password?.message} />
              <FormInput label="Confirmar Contraseña" type="password" {...register('confirmPassword')} error={errors.confirmPassword?.message} />
            </div>

            <div className="mt-6 p-6 bg-secondary rounded-xl border border-white/5">
              <div className="flex items-center space-x-2 bg-background p-4 rounded-lg border border-white/5">
                <Checkbox id="terms_club" onCheckedChange={(val) => setValue('terms', val as true)} />
                <label htmlFor="terms_club" className="text-sm font-medium leading-none">
                  Acepto los términos y condiciones para organizaciones.
                </label>
              </div>
              {errors.terms && <p className="text-sm text-destructive mt-2">{errors.terms.message}</p>}
            </div>
          </motion.div>
        )}

        {/* Botones de Navegación */}
        <div className="flex justify-between pt-4 border-t border-white/5">
          {step === 1 ? (
            <Button type="button" variant="ghost" onClick={onBack}>Volver</Button>
          ) : (
            <Button type="button" variant="outline" onClick={() => setStep(s => s - 1)}>Atrás</Button>
          )}

          {step < 2 ? (
            <Button type="button" className="bg-accent text-black hover:bg-accent/90" onClick={handleNextStep}>Siguiente</Button>
          ) : (
            <Button type="submit" disabled={isSubmitting} className="bg-accent text-black hover:bg-accent/90">
              {isSubmitting ? 'Registrando...' : 'Finalizar Registro'}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
