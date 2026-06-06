import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useDogs } from '../hooks/useDogs';
import { useLoyalty } from '../hooks/useLoyalty';
import { Container, Grid, Box } from '@mui/material';

import LoyaltyCard from '../components/dashboard/LoyaltyCard';
import DogList from '../components/dashboard/DogList';
import AddDogModal from '../components/dashboard/AddDogModal';
import EditDogModal from '../components/dashboard/EditDogModal';
import OrderHistory from '../components/dashboard/OrderHistory';
import SEO from '../components/SEO';
import { useDogPhoto } from '../hooks/useDogPhoto';
import type { Dog } from '../hooks/useDogs';

const Dashboard = () => {
  const { user, loading: userLoading } = useContext(AuthContext);
  const { dogs, loading: dogsLoading, addDog, updateDog, updateDogPhoto } = useDogs();
  const [open, setOpen] = useState(false);
  const [editingDog, setEditingDog] = useState<Dog | null>(null);
  
  const { uploadPhoto } = useDogPhoto(updateDogPhoto);

  // Membership level logic using custom hook
  const membership = useLoyalty(user?.loyaltyPoints || 0);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* noIndex: el dashboard es una página privada, no debe indexarse */}
      <SEO title="Mi Panel" description="" noIndex />
      <Grid container spacing={4}>
        {/* Columna Izquierda: Fidelidad e Historial */}
        <Grid size={{ xs: 12, md: 5 }}>
          <LoyaltyCard 
            membership={membership} 
            points={user?.loyaltyPoints || 0} 
            loading={userLoading} 
          />
          <OrderHistory />
        </Grid>

        {/* Columna Derecha: Perros */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 4, boxShadow: 3 }}>
            <DogList 
              dogs={dogs} 
              loading={dogsLoading} 
              onAddDogClick={() => setOpen(true)} 
              onEditDog={(dog) => setEditingDog(dog)}
              onPhotoUpdated={updateDogPhoto}
            />
          </Box>
        </Grid>
      </Grid>

      <AddDogModal 
        open={open} 
        onClose={() => setOpen(false)} 
        onAdd={addDog} 
        onUploadPhoto={uploadPhoto}
      />

      <EditDogModal
        open={!!editingDog}
        dog={editingDog}
        onClose={() => setEditingDog(null)}
        onUpdate={updateDog}
        onPhotoUpdated={updateDogPhoto}
      />
    </Container>
  );
};

export default Dashboard;
