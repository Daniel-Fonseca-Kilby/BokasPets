import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Link, Paper, Grid } from '@mui/material';
import { Dog } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (error: unknown) {
      console.error('Registration failed', error);
      let errorMsg = 'Error en el registro. Por favor verifica tus datos.';
      if (axios.isAxiosError(error)) {
        errorMsg = error.response?.data?.details?.[0]?.message 
          || error.response?.data?.message 
          || errorMsg;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      toast.error(errorMsg);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 8 }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ bgcolor: 'secondary.main', p: 2, borderRadius: '50%', mb: 2 }}>
             <Dog color="white" size={32} />
          </Box>
          <Typography component="h1" variant="h5" color="secondary" sx={{ fontWeight: 'bold' }}>
            Crear cuenta en BokasPets
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="Nombre Completo"
                  name="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Correo Electrónico"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  id="phone"
                  label="Teléfono"
                  name="phone"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  id="address"
                  label="Dirección de Envío"
                  name="address"
                  autoComplete="street-address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              sx={{ mt: 4, mb: 2, py: 1.5 }}
            >
              Registrarse
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Link component={RouterLink} to="/login" variant="body2" color="primary.main">
                {"¿Ya tienes una cuenta? Inicia sesión"}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
