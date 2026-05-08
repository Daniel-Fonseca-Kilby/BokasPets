import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Skeleton, Box, TextField, InputAdornment, Button, Avatar } from '@mui/material';
import { Search, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import AddAdminModal from '../../components/admin/AddAdminModal';

const AdminUsers = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/users?limit=100&search=${search}`);
      setUsers(res.data.users);
    } catch (error) {
      toast.error('Error cargando usuarios');
    } finally {
      setLoading(false);
    }
  };
    
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUsers();
    }, 500); // debounce search
    
    return () => clearTimeout(timeoutId);
  }, [search]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAddAdmin = async (adminData: any) => {
    try {
      await api.post('/admin/users', adminData);
      toast.success('Administrador creado exitosamente ✅');
      setOpenModal(false);
      fetchUsers();
    } catch (err: any) {
      const msg = err.response?.data?.details?.[0]?.message || err.response?.data?.message || 'Error al crear administrador';
      toast.error(`Error: ${msg}`);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Usuarios
        </Typography>
        <TextField
          size="small"
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} />
                </InputAdornment>
              ),
            }
          }}
          sx={{ width: 300, bgcolor: 'white' }}
        />
        <Button 
          variant="contained" 
          color="secondary"
          startIcon={<Plus size={18} />}
          onClick={() => setOpenModal(true)}
        >
          Crear Admin
        </Button>
      </Box>

      <Paper elevation={2}>
        <TableContainer>
          <Table sx={{ '& .MuiTableRow-root:hover': { cursor: 'pointer', bgcolor: 'rgba(0,0,0,0.04)' } }}>
            <TableHead>
              <TableRow sx={{ bgcolor: 'background.default' }}>
                <TableCell>Usuario</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Puntos</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Fecha registro</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from(new Array(5)).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell><Skeleton variant="circular" width={40} height={40} /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                  </TableRow>
                ))
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>No se encontraron usuarios</TableCell>
                </TableRow>
              ) : users.map((user) => (
                <TableRow key={user._id} onClick={() => navigate(`/admin/users/${user._id}`)}>
                  <TableCell>
                    <Avatar 
                      src={user.photo || undefined} 
                      alt={user.name}
                      sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}
                    >
                      {user.name?.charAt(0).toUpperCase()}
                    </Avatar>
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.loyaltyPoints}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <AddAdminModal 
        open={openModal} 
        onClose={() => setOpenModal(false)} 
        onAdd={handleAddAdmin} 
      />
    </Box>
  );
};

export default AdminUsers;
