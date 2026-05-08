import { Grid, Typography, Box, Button, Skeleton } from '@mui/material';
import { Bone, Plus } from 'lucide-react';
import DogCard from './DogCard';
import type { Dog } from '../../hooks/useDogs';

interface DogListProps {
  dogs: Dog[];
  loading: boolean;
  onAddDogClick: () => void;
  onEditDog: (dog: Dog) => void;
  onPhotoUpdated: (dogId: string, updatedDog: Dog) => void;
}

const DogList = ({ dogs, loading, onAddDogClick, onEditDog, onPhotoUpdated }: DogListProps) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Mis Perros
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={onAddDogClick}
        >
          Añadir Perro
        </Button>
      </Box>

      {loading ? (
        <Grid container spacing={3}>
          {[1, 2].map((i) => (
            <Grid size={{ xs: 12, sm: 6 }} key={i}>
              <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      ) : dogs.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4, bgcolor: 'background.default', borderRadius: 2 }}>
          <Bone color="#bc998a" size={48} />
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            Aún no tienes perros registrados. ¡Añade uno para comenzar!
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {dogs.map((dog) => (
            <Grid size={{ xs: 12, sm: 6 }} key={dog._id}>
              <DogCard
                dog={dog}
                onEdit={onEditDog}
                onPhotoUpdated={onPhotoUpdated}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default DogList;
