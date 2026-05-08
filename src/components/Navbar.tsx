import { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, Avatar, Tooltip, IconButton } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Dog } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'primary.main' }}>
            <Dog size={32} />
            <Typography variant="h5" sx={{ ml: 1, fontWeight: 'bold' }}>
              BokasPets
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button component={RouterLink} to="/planes" color="inherit">
              Planes
            </Button>
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Button component={RouterLink} to="/admin" color="secondary" variant="outlined" sx={{ mr: 1 }}>
                    Panel Admin
                  </Button>
                )}
                <Tooltip title="Mi Perfil">
                  <IconButton component={RouterLink} to="/perfil" sx={{ p: 0, mx: 1 }}>
                    <Avatar 
                      src={user.photo || undefined} 
                      alt={user.name}
                      sx={{ width: 40, height: 40, bgcolor: 'secondary.main', border: '2px solid', borderColor: 'primary.main' }}
                    >
                      {user.name?.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Button component={RouterLink} to="/dashboard" color="primary">
                  Mi Cuenta
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleLogout} size="small">
                  Salir
                </Button>
              </>
            ) : (
              <>
                <Button component={RouterLink} to="/login" color="primary">
                  Iniciar Sesión
                </Button>
                <Button component={RouterLink} to="/register" variant="contained" color="secondary" disableElevation>
                  Registrarse
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
