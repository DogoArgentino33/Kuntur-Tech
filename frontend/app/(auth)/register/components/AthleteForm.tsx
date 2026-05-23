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
import { useSports, usePositions } from '@/hooks/useSports';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';

const athleteSchema = z.object({
  firstName: z.string().min(2, 'El nombre es muy corto'),
  lastName: z.string().min(2, 'El apellido es muy corto'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Debe tener mínimo 8 caracteres').regex(/[A-Z]/, 'Debe contener una mayúscula').regex(/[0-9]/, 'Debe contener un número'),
  confirmPassword: z.string(),
  dateOfBirth: z.string().min(1, 'La fecha de nacimiento es requerida'),
  country: z.string().min(2, 'El país es requerido'),
  phone: z.string().optional(),
  
  sportId: z.string().min(1, 'Selecciona un deporte'),
  positionId: z.string().min(1, 'Selecciona una posición'),
  height: z.string().min(1, 'Requerido').refine(val => parseInt(val) >= 100 && parseInt(val) <= 250, 'Altura irreal'),
  weight: z.string().min(1, 'Requerido').refine(val => parseInt(val) >= 30 && parseInt(val) <= 200, 'Peso irreal'),
  dominantSide: z.string().optional(),
  experienceYears: z.string().min(1, 'Requerido'),
  currentTeam: z.string().optional(),
  bio: z.string().max(500, 'Máximo 500 caracteres').optional(),
  
  terms: z.literal(true, {
    message: 'Debes aceptar los términos y condiciones'
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type AthleteFormData = z.infer<typeof athleteSchema>;

export function AthleteForm({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { sports } = useSports();
  const router = useRouter();
  const { setToken, setUserType } = useAuthStore();
  
  const { register, handleSubmit, formState: { errors }, watch, setValue, trigger } = useForm<AthleteFormData>({
    resolver: zodResolver(athleteSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      dateOfBirth: '',
      country: '',
      phone: '',
      sportId: '',
      positionId: '',
      height: '',
      weight: '',
      dominantSide: '',
      experienceYears: '',
      currentTeam: '',
      bio: '',
    },
  });

  const selectedSportId = watch('sportId');
  const { positions } = usePositions(selectedSportId ? parseInt(selectedSportId) : null);

  const handleNextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1) {
      fieldsToValidate = ['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'dateOfBirth', 'country'];
    } else if (step === 2) {
      fieldsToValidate = ['sportId', 'positionId', 'height', 'weight', 'experienceYears'];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep(prev => prev + 1);
    }
  };

  const onSubmit = async (data: AthleteFormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        email: data.email,
        password: data.password,
        first_name: data.firstName,
        last_name: data.lastName,
        date_of_birth: data.dateOfBirth,
        country: data.country,
        phone: data.phone || null,
        sport_id: parseInt(data.sportId),
        position_id: parseInt(data.positionId),
        height_cm: parseInt(data.height),
        weight_kg: parseInt(data.weight),
        dominant_side: data.dominantSide || null,
        years_experience: parseInt(data.experienceYears),
        current_team: data.currentTeam || null,
        bio: data.bio || "",
      };

      const response = await api.post('/auth/register/athlete', payload);
      
      setToken(response.data.access_token);
      setUserType('athlete');
      toast.success('¡Cuenta creada exitosamente!');
      router.push('/dashboard/athlete');
      
    } catch (error: any) {
      const detail = error.response?.data?.detail;
      if (typeof detail === 'string') {
        toast.error(detail);
      } else {
        toast.error('Hubo un error al registrarte. Revisa los campos.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Registro de Atleta</h2>
        <Progress value={(step / 3) * 100} className="h-2 mb-2" />
        <p className="text-sm text-muted-foreground text-right">Paso {step} de 3</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* STEP 1: Datos Personales */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="Nombres" {...register('firstName')} error={errors.firstName?.message} />
              <FormInput label="Apellidos" {...register('lastName')} error={errors.lastName?.message} />
            </div>
            
            <FormInput label="Email" type="email" {...register('email')} error={errors.email?.message} />
            
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="Contraseña" type="password" {...register('password')} error={errors.password?.message} />
              <FormInput label="Confirmar Contraseña" type="password" {...register('confirmPassword')} error={errors.confirmPassword?.message} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="Fecha de Nacimiento" type="date" {...register('dateOfBirth')} error={errors.dateOfBirth?.message} />
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">País</label>
                <Select value={watch('country')} onValueChange={(val) => setValue('country', val || '', { shouldValidate: true })}>
                  <SelectTrigger className={errors.country ? "border-destructive" : ""}>
                    <SelectValue placeholder="Selecciona un país">
                      {(value: string | null) => value || "Selecciona un país"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent alignItemWithTrigger={false}>
                    <SelectItem value="Argentina">Argentina</SelectItem>
                    <SelectItem value="Chile">Chile</SelectItem>
                    <SelectItem value="Colombia">Colombia</SelectItem>
                    <SelectItem value="México">México</SelectItem>
                    <SelectItem value="Perú">Perú</SelectItem>
                  </SelectContent>
                </Select>
                {errors.country && <p className="text-sm text-destructive">{errors.country.message}</p>}
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Datos Deportivos */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Deporte Principal</label>
                <Select value={watch('sportId')} onValueChange={(val) => setValue('sportId', val || '', { shouldValidate: true })}>
                  <SelectTrigger className={errors.sportId ? "border-destructive" : ""}>
                    <SelectValue placeholder="Selecciona...">
                      {(value: string | null) => {
                        const sport = sports.find(s => s.id.toString() === value);
                        return sport ? sport.name : "Selecciona...";
                      }}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent alignItemWithTrigger={false}>
                    {sports.map(s => (
                      <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.sportId && <p className="text-sm text-destructive">{errors.sportId.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Posición</label>
                <Select disabled={!selectedSportId} value={watch('positionId')} onValueChange={(val) => setValue('positionId', val || '', { shouldValidate: true })}>
                  <SelectTrigger className={errors.positionId ? "border-destructive" : ""}>
                    <SelectValue placeholder="Selecciona...">
                      {(value: string | null) => {
                        const pos = positions.find(p => p.id.toString() === value);
                        return pos ? pos.name : "Selecciona...";
                      }}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent alignItemWithTrigger={false}>
                    {positions.map(p => (
                      <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.positionId && <p className="text-sm text-destructive">{errors.positionId.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormInput label="Altura (cm)" type="number" {...register('height')} error={errors.height?.message} />
              <FormInput label="Peso (kg)" type="number" {...register('weight')} error={errors.weight?.message} />
              <FormInput label="Años Exp." type="number" {...register('experienceYears')} error={errors.experienceYears?.message} />
            </div>

            <FormInput label="Equipo Actual (Opcional)" {...register('currentTeam')} error={errors.currentTeam?.message} />
          </motion.div>
        )}

        {/* STEP 3: Confirmación */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 text-center">
            <div className="p-6 bg-secondary rounded-xl border border-white/5">
              <h3 className="text-xl font-bold mb-2">¡Casi listo!</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Revisa que tus datos sean correctos. Podrás subir tu foto de perfil e información adicional desde tu panel de control una vez que ingreses.
              </p>
              
              <div className="flex items-center space-x-2 bg-background p-4 rounded-lg border border-white/5 text-left mb-4">
                <Checkbox id="terms" onCheckedChange={(val) => setValue('terms', val as true)} />
                <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Acepto los términos, condiciones y la política de privacidad de IA.
                </label>
              </div>
              {errors.terms && <p className="text-sm text-destructive text-left">{errors.terms.message}</p>}
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

          {step < 3 ? (
            <Button type="button" className="bg-primary text-black hover:bg-primary/90" onClick={handleNextStep}>Siguiente</Button>
          ) : (
            <Button type="submit" disabled={isSubmitting} className="bg-primary text-black hover:bg-primary/90">
              {isSubmitting ? 'Creando cuenta...' : 'Confirmar y Crear Perfil'}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
