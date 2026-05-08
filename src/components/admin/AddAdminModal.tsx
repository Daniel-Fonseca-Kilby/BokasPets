import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';

interface AddAdminModalProps {
  open: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onAdd: (adminData: any) => Promise<any>;
}

const AddAdminModal = ({ open, onClose, onAdd }: AddAdminModalProps) => {
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async () => {
    await onAdd(newAdmin);
    setNewAdmin({ name: '', email: '', password: '' });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Añadir Nuevo Administrador</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField 
            label="Nombre Completo" 
            value={newAdmin.name} 
            onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
            fullWidth 
            required
          />
          <TextField 
            label="Correo Electrónico" 
            type="email"
            value={newAdmin.email} 
            onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
            fullWidth 
            required
          />
          <TextField 
            label="Contraseña" 
            type="password"
            value={newAdmin.password} 
            onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
            fullWidth 
            required
            helperText="Debe tener al menos 8 caracteres, una mayúscula y un número"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="secondary">Crear Administrador</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAdminModal;
