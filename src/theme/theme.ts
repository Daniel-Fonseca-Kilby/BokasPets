import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4e7a5e', // Natural green
      light: '#7ba689',
      dark: '#2d4d3a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#8c6b5d', // Warm brown
      light: '#bc998a',
      dark: '#5e4033',
      contrastText: '#ffffff',
    },
    background: {
      default: '#fbf8f1', // Cream background
      paper: '#ffffff',
    },
    text: {
      primary: '#3e3e3e',
      secondary: '#6b6b6b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      color: '#2d4d3a',
    },
    h2: {
      fontWeight: 600,
      color: '#2d4d3a',
    },
    h3: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '24px',
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 8px 24px rgba(0,0,0,0.05)',
          borderRadius: '16px',
        },
      },
    },
  },
});

export default theme;
