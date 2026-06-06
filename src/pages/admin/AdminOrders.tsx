import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, Badge, Box, Tabs, Tab, Skeleton, IconButton, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Using large limit to simulate no pagination for now, can implement pagination later
      const res = await api.get(`/admin/orders?limit=100`);
      setOrders(res.data.orders);
    } catch {
      toast.error('Error cargando órdenes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/admin/orders/${id}/status`, { status: newStatus });
      toast.success('Estado de la orden actualizado ✅');
      setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
    } catch {
      toast.error('Error al actualizar estado');
    }
  };

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setOrderToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!orderToDelete) return;
    try {
      await api.delete(`/admin/orders/${orderToDelete}`);
      toast.success('Pedido eliminado exitosamente 🗑️');
      setOrders(orders.filter(o => o._id !== orderToDelete));
    } catch {
      toast.error('Error al eliminar pedido');
    } finally {
      setDeleteConfirmOpen(false);
      setOrderToDelete(null);
    }
  };

  const filteredOrders = orders.filter(o => filter === 'all' ? true : o.status === filter);
  const pendingCount = orders.filter(o => o.status === 'pending').length;

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
        Gestión de Órdenes
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={filter} onChange={(_, newValue) => setFilter(newValue)}>
          <Tab value="all" label="Todas" />
          <Tab 
            value="pending" 
            label={
              <Badge badgeContent={pendingCount} color="error" sx={{ pr: pendingCount > 0 ? 2 : 0 }}>
                Pendientes
              </Badge>
            } 
          />
          <Tab value="processing" label="En Proceso" />
          <Tab value="delivered" label="Entregados" />
        </Tabs>
      </Paper>

      <Paper elevation={2}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'background.default' }}>
                <TableCell>ID Corto</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Plan</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from(new Array(5)).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                  </TableRow>
                ))
              ) : filteredOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order._id.substring(order._id.length - 6)}</TableCell>
                  <TableCell>
                    {/* Nombre clickable que navega al perfil completo del cliente */}
                    {order.user?._id ? (
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => navigate(`/admin/users/${order.user._id}`)}
                        sx={{ p: 0, minWidth: 0, textTransform: 'none', fontWeight: 600, color: 'primary.main' }}
                      >
                        {order.user?.name || 'Usuario borrado'}
                      </Button>
                    ) : (
                      <span>{order.user?.name || 'Usuario borrado'}</span>
                    )}
                  </TableCell>
                  <TableCell>{order.items.map((i: { name: string }) => i.name).join(', ')}</TableCell>
                  <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                  <TableCell>
                    <Select
                      size="small"
                      value={order.status || 'pending'}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      sx={{
                        bgcolor: order.status === 'delivered' ? '#e8f5e9' : order.status === 'processing' ? '#e3f2fd' : '#fff3e0',
                        '& .MuiSelect-select': { py: 0.5 }
                      }}
                    >
                      <MenuItem value="pending">🟡 Pendiente</MenuItem>
                      <MenuItem value="processing">🔵 En Proceso</MenuItem>
                      <MenuItem value="delivered">🟢 Entregado</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="error" onClick={() => handleDeleteClick(order._id)}>
                      <Trash2 size={18} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Modal de confirmación de eliminación */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        slotProps={{
          paper: {
            sx: { borderRadius: 4, p: 1 }
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Trash2 size={24} color="#d32f2f" /> ¿Eliminar pedido?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar este pedido permanentemente? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteConfirmOpen(false)} sx={{ color: 'text.secondary' }}>
            Cancelar
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" sx={{ borderRadius: 2 }}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminOrders;
