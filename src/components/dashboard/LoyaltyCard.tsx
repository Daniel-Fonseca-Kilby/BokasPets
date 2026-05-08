import { Paper, Box, Typography, LinearProgress, Skeleton } from '@mui/material';
import { Medal } from 'lucide-react';

interface LoyaltyCardProps {
  membership: {
    level: string;
    discount: string;
    progressPercentage: number;
    pointsToNextLevel: number | null;
  };
  points: number;
  loading: boolean;
}

const LoyaltyCard = ({ membership, points, loading }: LoyaltyCardProps) => {
  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 4, bgcolor: 'secondary.main', color: 'secondary.contrastText', mb: 4 }}>
      {loading ? (
        <Box>
          <Skeleton variant="text" sx={{ bgcolor: 'rgba(255,255,255,0.3)', width: '60%', mb: 2 }} />
          <Skeleton variant="rectangular" sx={{ bgcolor: 'rgba(255,255,255,0.3)', width: '100%', height: 10, borderRadius: 5, mb: 1 }} />
          <Skeleton variant="text" sx={{ bgcolor: 'rgba(255,255,255,0.3)', width: '40%' }} />
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Medal size={32} />
              <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold' }}>
                Nivel: {membership.level}
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
              {points} pts
            </Typography>
          </Box>

          <Box sx={{ mt: 3 }}>
            <LinearProgress 
              variant="determinate" 
              value={membership.progressPercentage} 
              sx={{ 
                height: 10, 
                borderRadius: 5, 
                bgcolor: 'rgba(255,255,255,0.3)',
                '& .MuiLinearProgress-bar': { bgcolor: '#fff' } 
              }} 
            />
            {membership.pointsToNextLevel !== null && (
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                ¡Te faltan {membership.pointsToNextLevel} puntos para el siguiente nivel!
              </Typography>
            )}
            <Typography variant="body1" sx={{ mt: 2, fontWeight: 'medium' }}>
              Beneficio actual: {membership.discount}
            </Typography>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default LoyaltyCard;
