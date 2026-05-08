import { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Box, Typography, Grid, Card, CardContent, Skeleton, LinearProgress,
} from '@mui/material';
import {
  ShoppingCart, Truck, CheckCircle, DollarSign,
  Users, Package, TrendingUp,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Tipos para las métricas devueltas por el backend
interface PlanDistribution {
  name: string;
  count: number;
}

interface Metrics {
  orders: {
    total: number;
    pending: number;
    processing: number;
    delivered: number;
    thisMonth: number;
    revenueThisMonth: number;
  };
  users: {
    total: number;
    newThisWeek: number;
  };
  plans: {
    mostSold: string;
    distribution: PlanDistribution[];
  };
}

/**
 * Tarjeta de métrica reutilizable.
 * El color de acento se define por prop para comunicar el estado visualmente.
 */
interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  accentColor: string;
  loading: boolean;
  subtitle?: string;
}

const MetricCard = ({ title, value, icon, accentColor, loading, subtitle }: MetricCardProps) => (
  <Card elevation={2} sx={{ borderRadius: 3, height: '100%', borderTop: `4px solid ${accentColor}` }}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
            {title}
          </Typography>
          {loading ? (
            <Skeleton variant="text" width={80} height={50} />
          ) : (
            <Typography variant="h3" sx={{ fontWeight: 800, color: accentColor, lineHeight: 1 }}>
              {value}
            </Typography>
          )}
          {subtitle && !loading && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box sx={{ bgcolor: `${accentColor}15`, p: 1.5, borderRadius: 2, color: accentColor }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await api.get('/admin/metrics');
        setMetrics(res.data);
      } catch {
        toast.error('Error cargando métricas del dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  // Calcular el total de planes vendidos para las barras de progreso
  const totalPlansSold = metrics?.plans.distribution.reduce((sum, p) => sum + p.count, 0) || 0;

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Resumen general de la operación de BokasPets
        </Typography>
      </Box>

      {/* Sección 1: Tarjetas principales de órdenes */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Pedidos Pendientes"
            value={metrics?.orders.pending ?? 0}
            icon={<ShoppingCart size={24} />}
            accentColor="#f57c00"
            loading={loading}
            subtitle="Requieren atención"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="En Proceso"
            value={metrics?.orders.processing ?? 0}
            icon={<Truck size={24} />}
            accentColor="#1565c0"
            loading={loading}
            subtitle="En camino al cliente"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Entregados"
            value={metrics?.orders.delivered ?? 0}
            icon={<CheckCircle size={24} />}
            accentColor="#2e7d32"
            loading={loading}
            subtitle="Completados exitosamente"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Ingresos del Mes"
            value={
              metrics
                ? `$${metrics.orders.revenueThisMonth.toLocaleString('es-MX', { minimumFractionDigits: 0 })}`
                : '$0'
            }
            icon={<DollarSign size={24} />}
            accentColor="#4e7a5e"
            loading={loading}
            subtitle="Mes actual"
          />
        </Grid>
      </Grid>

      {/* Sección 2: Tarjetas secundarias */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <MetricCard
            title="Usuarios Nuevos Esta Semana"
            value={metrics?.users.newThisWeek ?? 0}
            icon={<Users size={24} />}
            accentColor="#7b1fa2"
            loading={loading}
            subtitle={`Total de usuarios: ${metrics?.users.total ?? 0}`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <MetricCard
            title="Pedidos Este Mes"
            value={metrics?.orders.thisMonth ?? 0}
            icon={<Package size={24} />}
            accentColor="#00838f"
            loading={loading}
            subtitle={`Total histórico: ${metrics?.orders.total ?? 0}`}
          />
        </Grid>
      </Grid>

      {/* Sección 3: Distribución de planes */}
      <Card elevation={2} sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box sx={{ bgcolor: '#4e7a5e15', p: 1.5, borderRadius: 2, color: '#4e7a5e' }}>
              <TrendingUp size={24} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Distribución de Planes
              </Typography>
              {metrics && !loading && (
                <Typography variant="caption" color="text.secondary">
                  Más vendido: <strong>{metrics.plans.mostSold}</strong>
                </Typography>
              )}
            </Box>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {[1, 2, 3].map((i) => (
                <Box key={i}>
                  <Skeleton width={150} sx={{ mb: 1 }} />
                  <Skeleton variant="rectangular" height={8} sx={{ borderRadius: 4 }} />
                </Box>
              ))}
            </Box>
          ) : metrics?.plans.distribution.length === 0 ? (
            <Typography color="text.secondary">No hay datos de ventas aún.</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {metrics?.plans.distribution.map((plan) => {
                const percentage = totalPlansSold > 0
                  ? Math.round((plan.count / totalPlansSold) * 100)
                  : 0;
                return (
                  <Box key={plan.name}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {plan.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {plan.count} ventas · {percentage}%
                      </Typography>
                    </Box>
                    {/* LinearProgress como barra visual de distribución */}
                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        bgcolor: '#f0f0f0',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 5,
                          bgcolor: '#4e7a5e',
                        },
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminDashboard;
