'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { UploadCloud, X, Film, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/common/FormInput';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSports } from '@/hooks/useSports';
import { api } from '@/lib/api'; // Real api client, though for now we mock the success

// Using Dialog manually or from shadcn if available. Let's build a custom modal to ensure it works beautifully
interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (title: string) => void;
  athleteSportId?: number;
}

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/mpeg", "video/webm"];

const videoUploadSchema = z.object({
  title: z.string().min(5, 'Mínimo 5 caracteres').max(100, 'Máximo 100 caracteres'),
  description: z.string().max(500, 'Máximo 500 caracteres').optional(),
  sportId: z.string().min(1, 'Selecciona el deporte'),
  recordedDate: z.string().optional(),
  location: z.string().optional(),
});

type VideoUploadData = z.infer<typeof videoUploadSchema>;

export function VideoUploadModal({ isOpen, onClose, onSuccess, athleteSportId }: VideoUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { sports } = useSports();
  
  const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<VideoUploadData>({
    resolver: zodResolver(videoUploadSchema),
    defaultValues: {
      title: '',
      description: '',
      sportId: athleteSportId ? athleteSportId.toString() : '',
      recordedDate: '',
      location: '',
    }
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (selectedFile: File) => {
    if (!ACCEPTED_VIDEO_TYPES.includes(selectedFile.type)) {
      toast.error('Formato no permitido. Usa MP4, MOV o WebM.');
      return false;
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error('El archivo es muy pesado. Máximo 500MB.');
      return false;
    }
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
        // Auto-fill title with filename
        if (!watch('title')) {
          setValue('title', droppedFile.name.replace(/\.[^/.]+$/, ""));
        }
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        if (!watch('title')) {
          setValue('title', selectedFile.name.replace(/\.[^/.]+$/, ""));
        }
      }
    }
  };

  const onSubmit = async (data: VideoUploadData) => {
    if (!file) {
      toast.error('Debes seleccionar un video para subir');
      return;
    }

    setIsUploading(true);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 5;
      });
    }, 200);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', data.title);
      if (data.description) formData.append('description', data.description);
      formData.append('sport_id', data.sportId);
      if (data.recordedDate) formData.append('recorded_date', data.recordedDate);
      if (data.location) formData.append('location', data.location);

      // In the future: await api.post('/videos', formData, { headers: { 'Content-Type': 'multipart/form-data' }})
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      toast.success('¡Video subido exitosamente! Ahora está en revisión.');
      
      // Reset & Close
      setTimeout(() => {
        reset();
        setFile(null);
        setUploadProgress(0);
        setIsUploading(false);
        onSuccess(data.title);
      }, 500);

    } catch (error) {
      clearInterval(progressInterval);
      setIsUploading(false);
      setUploadProgress(0);
      toast.error('Hubo un error al subir el video. Intenta nuevamente.');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-card border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <UploadCloud className="h-5 w-5 text-primary" />
              Subir Nuevo Video
            </h2>
            <button 
              onClick={onClose}
              disabled={isUploading}
              className="text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto custom-scrollbar">
            <form id="upload-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* File Dropzone */}
              <div 
                className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors ${
                  isDragging 
                    ? 'border-primary bg-primary/5' 
                    : file 
                      ? 'border-green-500/50 bg-green-500/5' 
                      : 'border-white/10 hover:border-white/20 bg-secondary/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input 
                  type="file" 
                  accept="video/mp4,video/quicktime,video/mpeg,video/webm"
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  disabled={isUploading}
                />
                
                {file ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-16 w-16 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                      <Film className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="font-medium text-green-500">{file.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    {!isUploading && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setFile(null)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 mt-2"
                      >
                        Eliminar y seleccionar otro
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <UploadCloud className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="font-medium">Arrastra tu video aquí</p>
                      <p className="text-sm text-muted-foreground mt-1">MP4, MOV, WebM hasta 500MB</p>
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="mt-4 bg-background"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Explorar archivos
                    </Button>
                  </div>
                )}
              </div>

              {/* Form Fields */}
              <div className="grid gap-4">
                <FormInput 
                  label="Título del Video *" 
                  placeholder="Ej: Highlights Torneo Regional 2026"
                  {...register('title')} 
                  error={errors.title?.message}
                  disabled={isUploading} 
                />
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Deporte *</label>
                  <Select 
                    disabled={isUploading}
                    value={watch('sportId')} 
                    onValueChange={(val) => setValue('sportId', val, { shouldValidate: true })}
                  >
                    <SelectTrigger className={errors.sportId ? "border-destructive" : ""}>
                      <SelectValue placeholder="Selecciona el deporte">
                        {(value: string) => {
                          const sport = sports.find(s => s.id.toString() === value);
                          return sport ? sport.name : "Selecciona el deporte";
                        }}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {sports.map(s => (
                        <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.sportId && <p className="text-sm text-destructive">{errors.sportId.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Descripción (Opcional)</label>
                  <textarea
                    disabled={isUploading}
                    {...register('description')}
                    rows={3}
                    placeholder="Describe el contexto del video, rival, competición..."
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  />
                  {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormInput 
                    label="Fecha de Grabación" 
                    type="date"
                    {...register('recordedDate')} 
                    error={errors.recordedDate?.message}
                    disabled={isUploading} 
                  />
                  <FormInput 
                    label="Ubicación" 
                    placeholder="Ciudad, Estadio..."
                    {...register('location')} 
                    error={errors.location?.message}
                    disabled={isUploading} 
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Footer & Progress */}
          <div className="p-6 border-t border-white/5 bg-secondary/30 mt-auto">
            {isUploading ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-primary">Subiendo video...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-muted-foreground text-center">Por favor no cierres esta ventana</p>
              </div>
            ) : (
              <div className="flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit" form="upload-form" className="bg-primary text-black hover:bg-primary/90">
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Comenzar Subida
                </Button>
              </div>
            )}
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
