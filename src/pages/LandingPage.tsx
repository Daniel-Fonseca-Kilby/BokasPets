import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import FeedingCalculator from '../components/FeedingCalculator';
import { Leaf, ShieldCheck, Heart, Dog } from 'lucide-react';
import SEO from '../components/SEO';

const LandingPage = () => {
  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh', overflowX: 'hidden' }}>
      <SEO
        title="Comida Natural para tu Perro"
        description="Planes de alimentación natural personalizados según el peso, raza y alergias de tu perro. Delivery a domicilio."
      />
      
      {/* Hero Section Centrado y Limpio */}
      <Box 
        sx={{ 
          pt: { xs: 8, md: 10 },
          pb: { xs: 6, md: 8 },
          px: 2,
          textAlign: 'center',
          position: 'relative'
        }}
      >
        <Container maxWidth="lg">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom 
              sx={{ color: 'secondary.dark', mb: 2, fontSize: { xs: '2.5rem', md: '4rem' }, fontWeight: '900' }}
            >
              Amor que se nota, <br/> bienestar que se siente.
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ mb: 5, fontWeight: 500, color: 'text.secondary', maxWidth: '800px', mx: 'auto', fontSize: { xs: '1.1rem', md: '1.4rem' } }}
            >
              Comida 100% natural, formulada para la salud y felicidad de tu perro.
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 8, flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                color="primary" 
                size="large" 
                component={RouterLink} 
                to="/register"
                sx={{ 
                  fontSize: '1.2rem', py: 1.5, px: 5, borderRadius: '30px', 
                  boxShadow: '0 8px 20px rgba(78, 122, 94, 0.4)',
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 12px 25px rgba(78, 122, 94, 0.5)' }
                }}
              >
                Únete a la manada
              </Button>
              <Button 
                variant="outlined" 
                color="secondary"
                component={RouterLink} 
                to="/planes"
                sx={{ 
                  fontSize: '1.2rem', py: 1.5, px: 5, borderRadius: '30px', borderWidth: '2px',
                  transition: 'all 0.3s ease',
                  '&:hover': { borderWidth: '2px', transform: 'translateY(-3px)', bgcolor: 'rgba(140, 107, 93, 0.05)' }
                }}
              >
                Ver Planes
              </Button>
            </Box>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            {/* Contenedor de la imagen con efecto premium */}
            <Box sx={{ 
              position: 'relative', 
              width: '100%', 
              maxWidth: '1000px', 
              borderRadius: '32px',
              p: { xs: 1, md: 2 },
              background: 'linear-gradient(145deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 100%)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 25px 50px -12px rgba(140, 107, 93, 0.2)',
              border: '1px solid rgba(255,255,255,0.6)'
            }}>
              <Box
                component="img"
                src="/setIMG.jpeg"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { 
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; 
                  target.src = "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2069&auto=format&fit=crop"; 
                }}
                alt="BokasPets - Familia de perros"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '24px',
                  display: 'block',
                  boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)'
                }}
              />
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Onda separadora decorativa */}
      <Box sx={{ width: '100%', overflow: 'hidden', lineHeight: 0, bgcolor: 'background.paper' }}>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '60px', transform: 'rotate(180deg)' }}>
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#fbf8f1"></path>
        </svg>
      </Box>

      <Box sx={{ bgcolor: 'background.paper', py: 10 }}>
        <Container maxWidth="lg">
          {/* Features Section */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4, mb: 12 }}>
            {[
              { icon: <Leaf size={56} color="#4e7a5e" strokeWidth={1.5} />, title: 'Ingredientes Naturales', desc: 'Sin conservantes ni químicos, solo comida real.' },
              { icon: <Heart size={56} color="#4e7a5e" strokeWidth={1.5} />, title: 'Hecho con Amor', desc: 'Preparado como si fuera para nuestra propia familia.' },
              { icon: <ShieldCheck size={56} color="#4e7a5e" strokeWidth={1.5} />, title: 'Sistema Inmunológico', desc: 'Nutrición que fortalece sus defensas naturales.' },
              { icon: <Dog size={56} color="#4e7a5e" strokeWidth={1.5} />, title: 'Pelaje Brillante', desc: 'Piel sana y pelaje suave gracias a los omegas.' }
            ].map((feature, idx) => (
              <Box key={idx} sx={{ width: { xs: '100%', sm: 'calc(50% - 32px)', md: 'calc(25% - 32px)' }, maxWidth: '300px' }}>
                <motion.div
                  whileHover={{ y: -10 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  style={{ height: '100%' }}
                >
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      textAlign: 'center', p: 4, height: '100%',
                      bgcolor: 'background.default', borderRadius: 4,
                      transition: 'all 0.3s ease',
                      border: '1px solid rgba(0,0,0,0.03)',
                      '&:hover': { boxShadow: '0 15px 30px rgba(78, 122, 94, 0.1)' }
                    }}
                  >
                    <Box sx={{ bgcolor: 'rgba(78, 122, 94, 0.1)', width: 90, height: 90, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold', color: 'secondary.dark' }}>{feature.title}</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>{feature.desc}</Typography>
                  </Paper>
                </motion.div>
              </Box>
            ))}
          </Box>

          {/* Calculator Section */}
          <Grid container spacing={8} sx={{ alignItems: 'center', bgcolor: 'rgba(140, 107, 93, 0.05)', borderRadius: '40px', p: { xs: 3, md: 8 } }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }}>
                <Typography variant="h3" gutterBottom color="secondary.dark" sx={{ fontSize: { xs: '2rem', md: '3rem' }, fontWeight: '900' }}>
                  ¿Cuánto debe comer <Box component="span" sx={{ color: 'primary.main' }}>tu perro?</Box>
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.2rem', mt: 3, lineHeight: 1.8, mb: 2 }}>
                  Cada perro es único. Utiliza nuestra calculadora interactiva para descubrir la porción diaria exacta que necesita tu mejor amigo según su peso y nivel de actividad.
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.2rem', lineHeight: 1.8 }}>
                  Nuestros planes se adaptan perfectamente a sus requerimientos calóricos, asegurando que mantenga su peso ideal y una salud de hierro.
                </Typography>
              </motion.div>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
               <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                  <FeedingCalculator />
               </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
