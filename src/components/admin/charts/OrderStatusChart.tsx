import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, Typography, Skeleton, Box } from '@mui/material';
import type { OrderStatus } from '../../../hooks/useMetrics';

interface OrderStatusChartProps {
  data?: OrderStatus[];
  loading: boolean;
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const OrderStatusChart = ({ data, loading }: OrderStatusChartProps) => {
  const hasData = data && data.some(d => d.value > 0);

  return (
    <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
          Estado de Órdenes
        </Typography>

        {loading ? (
          <Skeleton variant="circular" width={250} height={250} sx={{ mx: 'auto' }} />
        ) : !hasData ? (
          <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography color="text.secondary">Sin datos de órdenes</Typography>
          </Box>
        ) : (
          <Box sx={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={110}
                  dataKey="value"
                  isAnimationActive={true}
                >
                  {data!.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value as number} órdenes`, name as string]}
                  contentStyle={{ borderRadius: 8, border: '1px solid #e0e0e0' }}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ paddingTop: '12px', fontSize: '13px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderStatusChart;
