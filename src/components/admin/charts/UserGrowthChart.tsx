import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, Typography, Skeleton, Box } from '@mui/material';
import type { UserGrowth } from '../../../hooks/useMetrics';

interface UserGrowthChartProps {
  data?: UserGrowth[];
  loading: boolean;
}

const UserGrowthChart = ({ data, loading }: UserGrowthChartProps) => {
  const hasData = data && data.some(d => d.users > 0);

  return (
    <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
          Crecimiento de Usuarios (8 semanas)
        </Typography>

        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 2 }} />
        ) : !hasData ? (
          <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography color="text.secondary">Sin registros recientes</Typography>
          </Box>
        ) : (
          <Box sx={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart
                data={data}
                margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7b1fa2" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#7b1fa2" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="week"
                  tick={{ fill: '#666', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: '#666', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value) => [`${value as number} usuarios`, 'Nuevos']}
                  contentStyle={{ borderRadius: 8, border: '1px solid #e0e0e0' }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  name="Usuarios Nuevos"
                  stroke="#7b1fa2"
                  strokeWidth={2}
                  fill="url(#colorUsers)"
                  activeDot={{ r: 6 }}
                  isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default UserGrowthChart;
