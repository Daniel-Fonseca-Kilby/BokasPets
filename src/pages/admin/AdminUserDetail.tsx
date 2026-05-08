import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Typography, Paper, Grid, Box, Button, Skeleton, Chip, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar } from '@mui/material';
import { ArrowLeft, MapPin, Phone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import DogCard from '../../components/dashboard/DogCard';

const AdminUserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const res = await api.get(`/admin/users/${id}`);
        setData(res.data);
      } catch (error) {
        toast.error('Error cargando detalle de usuario');
        navigate('/admin/users');
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetail();
  }, [id, navigate]);

  if (loading) {
    return <Box sx={{ p: 4 }}><Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} /></Box>;
  }

  if (!data) return null;

  const { user, dogs, orders } = data;

  return (
    <Box>
      <Button 
        startIcon={<ArrowLeft size={18} />} 
        onClick={() => navigate('/admin/users')}
        sx={{ mb: 3 }}
      >
        Volver a Usuarios
      </Button>

      <Grid container spacing={4}>
        {/* User Profile */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ mr: 2 }}>
                <Avatar 
                  src={user.photo || undefined} 
                  alt={user.name}
                  sx={{ width: 100, height: 100, bgcolor: 'secondary.main', fontSize: '2.5rem', border: '3px solid', borderColor: 'primary.main' }}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </Avatar>
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{user.name}</Typography>
                <Chip size="small" label={user.role} color={user.role === 'admin' ? 'error' : 'default'} sx={{ mt: 0.5 }} />
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Mail size={18} color="gray" /> <Typography>{user.email}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone size={18} color="gray" /> <Typography>{user.phone || 'N/A'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MapPin size={18} color="gray" /> <Typography>{user.address || 'N/A'}</Typography>
              </Box>
            </Box>
            <Box sx={{ mt: 4, p: 2, bgcolor: 'background.default', borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {user.loyaltyPoints}
              </Typography>
              <Typography variant="body2" color="text.secondary">Puntos de Fidelidad</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          {/* Dogs */}
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>Perros Registrados ({dogs.length})</Typography>
            {dogs.length === 0 ? (
              <Typography color="text.secondary">No tiene perros registrados.</Typography>
            ) : (
              <Grid container spacing={2}>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {dogs.map((dog: any) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={dog._id}>
                    <DogCard dog={dog} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>

          {/* Orders */}
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>Historial de Órdenes ({orders.length})</Typography>
            {orders.length === 0 ? (
              <Typography color="text.secondary">No tiene órdenes registradas.</Typography>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Estado</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {orders.map((order: any) => (
                      <TableRow key={order._id}>
                        <TableCell>{order._id.substring(order._id.length - 6)}</TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                        <TableCell>{order.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminUserDetail;
