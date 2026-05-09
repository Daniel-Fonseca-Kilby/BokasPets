import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, Typography, Skeleton, Box } from '@mui/material';
import type { PlanDistribution } from '../../../hooks/useMetrics';

interface PlanDistributionChartProps {
  data?: PlanDistribution[];
  loading: boolean;
}

const PlanDistributionChart = ({ data, loading }: PlanDistributionChartProps) => {
  const hasData = data && data.length > 0 && data.some(d => d.value > 0);

  return (
    <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
          Distribución de Planes
        </Typography>

        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 2 }} />
        ) : !hasData ? (
          <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography color="text.secondary">Sin ventas registradas</Typography>
          </Box>
        ) : (
          <Box sx={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart
                data={data}
                margin={{ top: 5, right: 10, left: 0, bottom: 20 }}
                barCategoryGap="35%"
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#666', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: '#666', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value) => [`${value as number} ventas`, 'Total']}
                  cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                  contentStyle={{ borderRadius: 8, border: '1px solid #e0e0e0' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {data!.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PlanDistributionChart;
