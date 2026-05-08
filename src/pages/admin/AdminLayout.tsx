import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Users, Store, LayoutDashboard } from 'lucide-react';
import SEO from '../../components/SEO';

const drawerWidth = 240;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Orden del sidebar: Inicio | Pedidos | Usuarios
  const menuItems = [
    { text: 'Inicio', icon: <LayoutDashboard />, path: '/admin' },
    { text: 'Órdenes', icon: <ShoppingBag />, path: '/admin/orders' },
    { text: 'Usuarios', icon: <Users />, path: '/admin/users' },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6f8' }}>
      {/* noIndex: el panel admin no debe aparecer en resultados de búsqueda */}
      <SEO title="Panel de Administración" description="" noIndex />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: 'border-box',
            bgcolor: 'secondary.main',
            color: 'secondary.contrastText'
          },
        }}
      >
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Panel Admin</Typography>
        </Box>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton 
                onClick={() => navigate(item.path)}
              selected={location.pathname === item.path ||
                  // 'Órdenes' activo si pathname es /admin/orders o variantes
                  (item.path === '/admin/orders' && location.pathname.startsWith('/admin/orders')) ||
                  // 'Inicio' activo SOLO en /admin exacto (no en subrutas)
                  (item.path === '/admin' && location.pathname === '/admin')}
                sx={{
                  '&.Mui-selected': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.05)',
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'secondary.contrastText' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/dashboard')}>
              <ListItemIcon sx={{ color: 'secondary.contrastText' }}>
                <Store />
              </ListItemIcon>
              <ListItemText primary="Volver a la tienda" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
