import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Container, Box, Typography, Button, Paper, Grid, TextField, Avatar, CircularProgress } from '@mui/material';
import { Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  
  // Profile state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  
  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Photo state
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.put('/auth/profile', profileData);
      setUser(res.data);
      toast.success('Perfil actualizado ✅');
    } catch (err: unknown) {
      let msg = 'Error al actualizar perfil ❌';
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      toast.error(msg);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword.length < 8) {
      return toast.error('La nueva contraseña debe tener mínimo 8 caracteres');
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('Las contraseñas nuevas no coinciden');
    }

    try {
      await api.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Contraseña cambiada ✅');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: unknown) {
      let msg = 'Error al cambiar contraseña ❌';
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      toast.error(msg);
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return toast.error('Solo JPEG, PNG o WebP permitidos.');
    }
    if (file.size > 5 * 1024 * 1024) {
      return toast.error('La imagen no debe superar 5MB.');
    }

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handlePhotoUpload = async () => {
    if (!photoFile) return;
    setIsUploadingPhoto(true);

    try {
      const formData = new FormData();
      formData.append('photo', photoFile);

      const res = await api.post('/auth/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setUser(res.data);
      setPhotoFile(null);
      if (photoPreview) URL.revokeObjectURL(photoPreview);
      setPhotoPreview(null);
      toast.success('¡Foto de perfil actualizada! 📸');
    } catch (err: unknown) {
      let msg = 'Error al subir la foto';
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      toast.error(msg);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
        Mi Perfil
      </Typography>

      {/* User Photo Section */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 6 }}>
        <Avatar
          src={photoPreview || user?.photo || undefined}
          alt={user?.name}
          sx={{
            width: 150,
            height: 150,
            mb: 2,
            bgcolor: 'secondary.main',
            fontSize: '4rem',
            border: '4px solid',
            borderColor: 'secondary.light',
          }}
        >
          {user?.name?.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<Camera size={18} />}
            disabled={isUploadingPhoto}
          >
            {photoFile ? 'Cambiar foto' : 'Seleccionar foto'}
            <input
              type="file"
              hidden
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoSelect}
            />
          </Button>
          {photoFile && (
            <Button
              variant="contained"
              color="primary"
              onClick={handlePhotoUpload}
              disabled={isUploadingPhoto}
              startIcon={isUploadingPhoto ? <CircularProgress size={16} color="inherit" /> : undefined}
            >
              {isUploadingPhoto ? 'Subiendo...' : 'Guardar foto'}
            </Button>
          )}
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Datos Personales
            </Typography>
            <Box component="form" onSubmit={handleProfileSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField 
                label="Nombre completo" 
                value={profileData.name}
                onChange={e => setProfileData({...profileData, name: e.target.value})}
                required
              />
              <TextField 
                label="Teléfono" 
                value={profileData.phone}
                onChange={e => setProfileData({...profileData, phone: e.target.value})}
              />
              <TextField 
                label="Dirección de entrega" 
                value={profileData.address}
                onChange={e => setProfileData({...profileData, address: e.target.value})}
                multiline
                rows={2}
              />
              <Button type="submit" variant="contained" color="primary" sx={{ mt: 1 }}>
                Guardar Cambios
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Cambiar Contraseña
            </Typography>
            <Box component="form" onSubmit={handlePasswordSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField 
                type="password"
                label="Contraseña actual" 
                value={passwordData.currentPassword}
                onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})}
                required
              />
              <TextField 
                type="password"
                label="Nueva contraseña" 
                value={passwordData.newPassword}
                onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                required
                helperText="Mínimo 8 caracteres"
              />
              <TextField 
                type="password"
                label="Confirmar nueva contraseña" 
                value={passwordData.confirmPassword}
                onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                required
              />
              <Button type="submit" variant="contained" color="secondary" sx={{ mt: 1 }}>
                Cambiar Contraseña
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
