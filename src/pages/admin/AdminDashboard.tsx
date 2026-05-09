import {
  Box, Typography, Grid, Card, CardContent, Skeleton, IconButton, Tooltip,
} from '@mui/material';
import {
  ShoppingCart, Truck, CheckCircle, DollarSign,
  Users, Package, RefreshCw,
} from 'lucide-react';
import { useMetrics } from '../../hooks/useMetrics';
import RevenueChart from '../../components/admin/charts/RevenueChart';
import OrderStatusChart from '../../components/admin/charts/OrderStatusChart';
import PlanDistributionChart from '../../components/admin/charts/PlanDistributionChart';
import UserGrowthChart from '../../components/admin/charts/UserGrowthChart';

// ─── MetricCard ──────────────────────────────────────────────────────────────

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

// ─── AdminDashboard ───────────────────────────────────────────────────────────

const AdminDashboard = () => {
  const { data: metrics, loading, refetch } = useMetrics();

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Resumen general de la operación de BokasPets
          </Typography>
        </Box>
        <Tooltip title="Actualizar datos">
          <IconButton onClick={refetch} disabled={loading}>
            <RefreshCw size={20} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Sección 1: KPIs principales de órdenes */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Pedidos Pendientes"
            value={metrics?.orders.pending ?? 0}
            icon={<ShoppingCart size={24} />}
            accentColor="#f0a500"
            loading={loading}
            subtitle="Requieren atención"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="En Proceso"
            value={metrics?.orders.processing ?? 0}
            icon={<Truck size={24} />}
            accentColor="#2196f3"
            loading={loading}
            subtitle="En camino al cliente"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Entregados"
            value={metrics?.orders.delivered ?? 0}
            icon={<CheckCircle size={24} />}
            accentColor="#4caf50"
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

      {/* Sección 2: KPIs secundarios */}
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

      {/* Sección 3: Gráfica de Ingresos (ancho completo) */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12 }}>
          <RevenueChart data={metrics?.revenueByMonth} loading={loading} />
        </Grid>
      </Grid>

      {/* Sección 4: Estado de órdenes + Distribución de planes */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 5 }}>
          <OrderStatusChart data={metrics?.ordersByStatus} loading={loading} />
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <PlanDistributionChart data={metrics?.planDistribution} loading={loading} />
        </Grid>
      </Grid>

      {/* Sección 5: Crecimiento de usuarios */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <UserGrowthChart data={metrics?.userGrowth} loading={loading} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
