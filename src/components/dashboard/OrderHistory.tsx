import { useEffect } from 'react';
import { Paper, Typography, Box, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useOrders } from '../../hooks/useOrders';

const OrderHistory = () => {
  const { orders, loading, fetchOrders } = useOrders();

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchOrders]);

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 4, mb: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
        Historial de Compras
      </Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[1, 2, 3].map(i => <Skeleton key={i} variant="rounded" height={50} />)}
        </Box>
      ) : orders.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
          Aún no tienes compras.
        </Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Artículos</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {order.items.map(item => `${item.qty}x ${item.name}`).join(', ')}
                  </TableCell>
                  <TableCell align="right">${order.totalPrice.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default OrderHistory;
