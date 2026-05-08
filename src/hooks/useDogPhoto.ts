import { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import type { Dog } from './useDogs';

// Tipos de archivo aceptados — coincide con la validación del backend
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

interface UseDogPhotoReturn {
  uploading: boolean;
  error: string | null;
  uploadPhoto: (dogId: string, file: File) => Promise<Dog | null>;
}

/**
 * Hook para gestionar la subida de fotos de perros a Cloudinary.
 * La validación del frontend (MIME + tamaño) es la primera capa de defensa,
 * pero el backend valida de nuevo para no depender solo del cliente.
 */
export const useDogPhoto = (onSuccess: (dogId: string, updatedDog: Dog) => void): UseDogPhotoReturn => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadPhoto = async (dogId: string, file: File): Promise<Dog | null> => {
    // Pre-validación en el frontend para dar feedback inmediato sin esperar la red
    if (!ALLOWED_TYPES.includes(file.type)) {
      const msg = 'Formato no permitido. Solo JPEG, PNG o WebP.';
      setError(msg);
      toast.error(msg);
      return null;
    }

    if (file.size > MAX_SIZE_BYTES) {
      const msg = `La imagen no debe superar ${MAX_SIZE_MB}MB.`;
      setError(msg);
      toast.error(msg);
      return null;
    }

    setUploading(true);
    setError(null);

    try {
      // FormData es necesario para enviar archivos binarios al servidor
      const formData = new FormData();
      formData.append('photo', file);

      const res = await api.post(`/dogs/${dogId}/photo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Notificar al componente padre para actualizar el estado local del perro
      onSuccess(dogId, res.data);
      toast.success('¡Foto del perro actualizada! 🐶');
      return res.data as Dog;
    } catch {
      const msg = 'Error al subir la foto, intenta con una imagen más pequeña';
      setError(msg);
      toast.error(msg);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploading, error, uploadPhoto };
};
