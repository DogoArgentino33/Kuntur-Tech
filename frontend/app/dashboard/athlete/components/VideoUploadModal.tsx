'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { UploadCloud, X, Film, Loader2, Camera, Circle, Square, Check, RefreshCcw } from 'lucide-react';

import type { Video } from '@/types/dashboard';
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
  onSuccess: (newVideo: Video) => void;
  athleteSportId?: number;
}

const generateThumbnail = (file: File): Promise<Blob | null> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    const url = URL.createObjectURL(file);
    video.src = url;

    video.onloadedmetadata = () => {
      // Seek to 1 second or 25% of the video if it's very short
      video.currentTime = Math.min(1, video.duration / 4);
    };

    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          URL.revokeObjectURL(url);
          resolve(blob);
        }, 'image/jpeg', 0.8);
      } else {
        resolve(null);
      }
    };
    
    video.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
  });
};

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

  // Recording states
  const [recordingMode, setRecordingMode] = useState<'upload' | 'record' | 'preview'>('upload');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
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

  // Recording Functions
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const startCamera = async () => {
    try {
      setRecordingMode('record');
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      toast.error('No se pudo acceder a la cámara o micrófono.');
      setRecordingMode('upload');
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(streamRef.current, { mimeType: 'video/webm' });
    mediaRecorderRef.current = mediaRecorder;
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setRecordedUrl(url);
      setRecordingMode('preview');
      stopCamera();
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const discardRecording = () => {
    if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    setRecordedUrl(null);
    startCamera();
  };

  const acceptRecording = () => {
    if (chunksRef.current.length === 0) return;
    const blob = new Blob(chunksRef.current, { type: 'video/webm' });
    const newFile = new File([blob], `grabacion_${new Date().getTime()}.webm`, { type: 'video/webm' });
    setFile(newFile);
    if (!watch('title')) {
      setValue('title', 'Grabación de cámara');
    }
    if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    setRecordedUrl(null);
    setRecordingMode('upload');
  };

  const handleClose = () => {
    stopCamera();
    if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    onClose();
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

      // Generate and append thumbnail
      const thumbnailBlob = await generateThumbnail(file);
      if (thumbnailBlob) {
        formData.append('thumbnail', thumbnailBlob, 'thumbnail.jpg');
      }

      // Upload to backend
      const response = await api.post('/videos/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const newVideo: Video = response.data;
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      toast.success('¡Video subido exitosamente! Ahora está en revisión.');

      // Reset & Close
      setTimeout(() => {
        reset();
        setFile(null);
        setUploadProgress(0);
        setIsUploading(false);
        onSuccess(newVideo);
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
          onClick={handleClose}
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
              onClick={handleClose}
              disabled={isUploading}
              className="text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto custom-scrollbar">
            <form id="upload-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Record Mode View */}
              {recordingMode === 'record' && (
                <div className="relative border-2 border-primary/30 rounded-xl overflow-hidden bg-black aspect-video flex flex-col items-center justify-center">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    muted 
                    playsInline 
                    className="absolute inset-0 w-full h-full object-cover" 
                  />
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 z-10">
                    {!isRecording ? (
                      <Button type="button" onClick={startRecording} className="rounded-full h-14 w-14 bg-red-500 hover:bg-red-600 text-white shadow-lg p-0 flex items-center justify-center border-4 border-white/20">
                        <Circle className="h-6 w-6 fill-current" />
                      </Button>
                    ) : (
                      <Button type="button" onClick={stopRecording} className="rounded-full h-14 w-14 bg-red-500 hover:bg-red-600 text-white shadow-lg p-0 flex items-center justify-center border-4 border-white/20 animate-pulse">
                        <Square className="h-5 w-5 fill-current" />
                      </Button>
                    )}
                  </div>
                  <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 bg-black/50 hover:bg-black/80" onClick={() => { stopCamera(); setRecordingMode('upload'); }}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Preview Mode View */}
              {recordingMode === 'preview' && recordedUrl && (
                <div className="relative border-2 border-primary/30 rounded-xl overflow-hidden bg-black aspect-video flex flex-col items-center justify-center">
                  <video 
                    src={recordedUrl} 
                    controls 
                    className="absolute inset-0 w-full h-full object-contain" 
                  />
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 z-10">
                    <Button type="button" variant="secondary" onClick={discardRecording} className="shadow-lg">
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      Rehacer
                    </Button>
                    <Button type="button" className="bg-green-500 hover:bg-green-600 text-white shadow-lg" onClick={acceptRecording}>
                      <Check className="mr-2 h-4 w-4" />
                      Usar este video
                    </Button>
                  </div>
                </div>
              )}

              {/* Upload Dropzone View */}
              {recordingMode === 'upload' && (
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
                    <div className="flex gap-3 mt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="bg-background"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Explorar archivos
                      </Button>
                      <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={startCamera}
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        Grabar con Cámara
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              )}

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
                <Button type="button" variant="ghost" onClick={handleClose}>
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
