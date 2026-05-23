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
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from '@/lib/api';

const clubTypeLabels: Record<string, string> = {
  professional: "Club Profesional",
  academy: "Academia formativa",
  federation: "Federación / Asociación",
  independent_scout: "Scout Independiente",
  independent_coach: "Entrenador Autónomo",
};
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';

const clubSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Debe tener mínimo 8 caracteres').regex(/[A-Z]/, 'Debe contener una mayúscula').regex(/[0-9]/, 'Debe contener un número'),
  confirmPassword: z.string(),
  name: z.string().min(2, 'El nombre de la organización es muy corto'),
  clubType: z.string().min(2, 'El tipo es requerido'),
  country: z.string().min(2, 'El país es requerido'),
  city: z.string().min(2, 'La ciudad es requerida'),
  contactName: z.string().min(2, 'El nombre de contacto es muy corto'),
  contactPhone: z.string().optional(),
  
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
  
  const { register, handleSubmit, formState: { errors }, setValue, trigger, watch } = useForm<ClubFormData>({
    resolver: zodResolver(clubSchema),
    mode: 'onChange',
  });

  const handleNextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1) {
      fieldsToValidate = ['name', 'clubType', 'country', 'city', 'contactName', 'contactPhone'];
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
        contact_name: data.contactName,
        contact_phone: data.contactPhone || null,
      };

      const response = await api.post('/auth/register/club', payload);
      
      setToken(response.data.access_token);
      setUserType('club');
      toast.success('¡Organización registrada exitosamente!');
      router.push('/dashboard/club');
      
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Hubo un error al registrarte');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Registro de Club / Scout / Entrenador</h2>
        <Progress value={(step / 2) * 100} className="h-2 mb-2 bg-accent/20" indicatorClassName="bg-accent" />
        <p className="text-sm text-muted-foreground text-right">Paso {step} de 2</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* STEP 1: Datos de la Organización */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <FormInput label="Nombre de la Organización / Club" {...register('name')} error={errors.name?.message} />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Tipo de Organización / Profesional</label>
                <Select value={watch('clubType')} onValueChange={(val) => setValue('clubType', val || '', { shouldValidate: true })}>
                  <SelectTrigger className={errors.clubType ? "border-destructive" : ""}>
                    <SelectValue placeholder="Selecciona el tipo">
                      {(value: string | null) => value ? clubTypeLabels[value] : "Selecciona el tipo"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent alignItemWithTrigger={false}>
                    <SelectItem value="professional">Club Profesional</SelectItem>
                    <SelectItem value="academy">Academia formativa</SelectItem>
                    <SelectItem value="federation">Federación / Asociación</SelectItem>
                    <SelectItem value="independent_scout">Scout Independiente</SelectItem>
                    <SelectItem value="independent_coach">Entrenador Autónomo</SelectItem>
                  </SelectContent>
                </Select>
                {errors.clubType && <p className="text-sm text-destructive">{errors.clubType.message}</p>}
              </div>
              <FormInput label="País" {...register('country')} error={errors.country?.message} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="Ciudad" {...register('city')} error={errors.city?.message} />
              <FormInput label="Nombre de Contacto" {...register('contactName')} error={errors.contactName?.message} />
            </div>
            
            <FormInput label="Teléfono de Contacto" {...register('contactPhone')} error={errors.contactPhone?.message} />
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
