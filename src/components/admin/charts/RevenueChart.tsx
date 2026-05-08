import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { Card, CardContent, Typography, Skeleton, Box } from '@mui/material';
import { RevenueMonth } from '../../../hooks/useMetrics';

interface RevenueChartProps {
  data?: RevenueMonth[];
  loading: boolean;
}

// Custom Tooltip para formatear la moneda
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ bgcolor: 'white', p: 1.5, border: '1px solid #e0e0e0', borderRadius: 2, boxShadow: 2 }}>
        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>{label}</Typography>
        <Typography variant="body2" sx={{ color: '#4e7a5e' }}>
          Ingresos: ${payload[0].value?.toLocaleString('es-MX', { minimumFractionDigits: 0 })}
        </Typography>
        <Typography variant="body2" sx={{ color: '#8c6b5d' }}>
          Pedidos: {payload[1].value}
        </Typography>
      </Box>
    );
  }
  return null;
};

const RevenueChart = ({ data, loading }: RevenueChartProps) => {
  return (
    <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
          Ingresos de los últimos 6 meses
        </Typography>
        
        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 2 }} />
        ) : !data || data.length === 0 ? (
          <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography color="text.secondary">Aún no hay datos para mostrar</Typography>
          </Box>
        ) : (
          <Box sx={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart
                data={data}
                margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#666', fontSize: 12 }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <YAxis 
                  yAxisId="left" 
                  tick={{ fill: '#666', fontSize: 12 }} 
                  axisLine={false} 
                  tickLine={false}
                  tickFormatter={(val) => `$${val.toLocaleString('es-MX')}`}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  tick={{ fill: '#666', fontSize: 12 }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  name="Ingresos"
                  stroke="#4e7a5e"
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  isAnimationActive={true}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  name="Órdenes"
                  stroke="#8c6b5d"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
