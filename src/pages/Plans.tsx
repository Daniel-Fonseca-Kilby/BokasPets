import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import toast from 'react-hot-toast';
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, Box } from '@mui/material';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const plans = [
  {
    id: 'res',
    title: 'Bokita de Res',
    description: 'Rico en hierro y proteínas de alta calidad. Ideal para perros activos.',
    price: 5000,
    features: ['Carne magra de res', 'Zanahorias y guisantes', 'Aceite de salmón', 'Sin granos']
  },
  {
    id: 'cerdo',
    title: 'Bokita de Cerdo',
    description: 'Altamente digestible, excelente para estómagos sensibles.',
    price: 4500,
    features: ['Lomo de cerdo magro', 'Calabaza y espinaca', 'Semillas de chía', 'Hipoalergénico']
  },
  {
    id: 'personalizado',
    title: 'Bokita Personalizada',
    description: 'Elaborado según las alergias y gustos de tu perro.',
    price: 6000,
    features: ['Proteína a elección', 'Vegetales seleccionados', 'Exclusión de alérgenos', 'Porción exacta']
  }
];

const Plans = () => {
  const { isAuthenticated, setUser, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { createOrder } = useOrders();

  const handleBuy = async (plan: { title: string; price: number;[key: string]: unknown }) => {
    if (!isAuthenticated) {
      toast.error('Por favor inicia sesión para comprar.');
      navigate('/login');
      return;
    }

    try {
      const orderData = {
        items: [{ name: plan.title, qty: 1, price: plan.price }],
        totalPrice: plan.price
      };

      const result = await createOrder(orderData);
      if (result.success) {
        // Optimistically update loyalty points locally
        if (user && setUser) {
          setUser({ ...user, loyaltyPoints: user.loyaltyPoints + Math.floor(plan.price / 100) });
        }
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error in purchase', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <SEO
        title="Nuestros Planes Alimenticios"
        description="Elige entre Bokita de Res, Bokita de Cerdo o crea un plan personalizado para tu perro."
      />
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" color="primary.main" gutterBottom sx={{ fontWeight: 'bold' }}>
          Nuestros Planes de Comida Natural
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Ingredientes frescos, cocinados a fuego lento y entregados en tu puerta.
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
        {plans.map((plan, index) => (
          <Grid size={{ xs: 12, md: 4 }} key={plan.id}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              style={{ height: '100%' }}
            >
              <Card elevation={4} sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 4, transition: '0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: 10 } }}>
                <CardContent sx={{ flexGrow: 1, p: 4 }}>
                  <Typography variant="h4" component="h2" color="secondary.main" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {plan.title}
                  </Typography>
                  <Typography variant="h3" color="secondary.dark" sx={{ mb: 2, fontWeight: '900' }}>
                    ${plan.price} <Typography component="span" variant="h6" color="text.secondary" sx={{ fontWeight: 'normal' }}>/ comida</Typography>
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    {plan.description}
                  </Typography>
                  <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                    {plan.features.map((feature, idx) => (
                      <Box component="li" key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <Check size={20} color="#4e7a5e" style={{ marginRight: 8 }} />
                        <Typography variant="body2">{feature}</Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 4, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => handleBuy(plan)}
                    sx={{ py: 1.5, fontSize: '1.1rem' }}
                  >
                    Elegir Plan
                  </Button>
                </CardActions>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Plans;
