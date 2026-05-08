import { useState, useCallback, useContext, useEffect } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

export interface Dog {
  _id: string;
  name: string;
  breed: string;
  ageYears: number;
  ageMonths?: number;
  weightKg: number;
  allergies?: string[];
  activityLevel?: string;
  activePlan?: string;
  // Campos de foto de Cloudinary
  photo?: string;
  photoPublicId?: string;
}

export const useDogs = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useContext(AuthContext);

  const fetchDogs = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/dogs');
      setDogs(res.data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error fetching dogs';
      setError(msg);
      console.error(msg, err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchDogs();
  }, [fetchDogs]);

  const addDog = async (dogData: Omit<Dog, '_id' | 'photo' | 'photoPublicId'>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/dogs', dogData);
      await fetchDogs();
      toast.success('Perro agregado exitosamente ✅');
      return res.data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error adding dog';
      setError(msg);
      toast.error('Error al agregar perro ❌');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateDog = async (dogId: string, dogData: Partial<Dog>) => {
    try {
      const res = await api.put(`/dogs/${dogId}`, dogData);
      // Actualizar el perro en el estado local sin necesidad de refetch
      setDogs((prev) => prev.map((d) => (d._id === dogId ? res.data : d)));
      toast.success('Perro actualizado ✅');
      return true;
    } catch {
      toast.error('Error al actualizar perro ❌');
      return false;
    }
  };

  /**
   * Actualiza solo la foto de un perro en el estado local.
   * Se llama desde useDogPhoto después de una subida exitosa para reflejar
   * el cambio inmediatamente sin necesidad de recargar todos los perros.
   */
  const updateDogPhoto = (dogId: string, updatedDog: Dog) => {
    setDogs((prev) => prev.map((d) => (d._id === dogId ? updatedDog : d)));
  };

  return { dogs, loading, error, fetchDogs, addDog, updateDog, updateDogPhoto };
};

