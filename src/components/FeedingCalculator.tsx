import { useState } from 'react';
import { Box, Typography, Slider, Button, Paper, Grid, MenuItem, Select, FormControl, InputLabel, Chip } from '@mui/material';
import { Calculator } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { calculateDailyGrams, calculateDailyMeals, suggestPlan } from '../utils/calculatorUtils';

const FeedingCalculator = () => {
  const [weight, setWeight] = useState<number>(10);
  const [age, setAge] = useState<number>(3);
  const [activity, setActivity] = useState<string>('moderado');
  const [result, setResult] = useState<{ grams: number; meals: number; suggestedPlan: string } | null>(null);
  const navigate = useNavigate();

  const handleCalculate = () => {
    const gramsPerDay = calculateDailyGrams(weight, activity, age);
    const mealsPerDay = calculateDailyMeals(age);
    const suggestedPlan = suggestPlan(weight, activity, age);

    setResult({ grams: gramsPerDay, meals: mealsPerDay, suggestedPlan });
  };

  const getCustomMessage = () => {
    if (!result) return '';
    let category = 'adulto';
    if (age < 1) category = 'cachorro';
    if (age >= 8) category = 'senior';

    return `Tu perro ${category} de ${age} años con actividad ${activity}, necesita aprox. ${result.grams}g al día divididos en ${result.meals} comidas.`;
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 4, bgcolor: 'background.paper' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Calculator color="#4e7a5e" size={28} />
        <Typography variant="h5" sx={{ ml: 1, fontWeight: 'bold', color: 'primary.main' }}>
          Calculadora de Alimentación
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        Descubre la porción ideal de comida natural para tu perrito.
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Typography id="weight-slider" gutterBottom>
            Peso del perro: {weight} kg
          </Typography>
          <Slider
            value={weight}
            onChange={(_, newValue) => setWeight(newValue as number)}
            aria-labelledby="weight-slider"
            valueLabelDisplay="auto"
            step={0.5}
            marks
            min={1}
            max={50}
            color="primary"
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Typography id="age-slider" gutterBottom>
            Edad del perro: {age} años
          </Typography>
          <Slider
            value={age}
            onChange={(_, newValue) => setAge(newValue as number)}
            aria-labelledby="age-slider"
            valueLabelDisplay="auto"
            step={1}
            marks
            min={0}
            max={15}
            color="primary"
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormControl fullWidth>
            <InputLabel id="activity-label">Nivel de Actividad</InputLabel>
            <Select
              labelId="activity-label"
              value={activity}
              label="Nivel de Actividad"
              onChange={(e) => setActivity(e.target.value as string)}
            >
              <MenuItem value="bajo">Bajo (Paseos cortos, mayormente en casa)</MenuItem>
              <MenuItem value="moderado">Moderado (Paseos diarios, juega regularmente)</MenuItem>
              <MenuItem value="alto">Alto (Muy activo, corre, entrena)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Button 
            variant="contained" 
            fullWidth 
            onClick={handleCalculate}
            sx={{ py: 1.5, fontSize: '1.1rem' }}
          >
            Calcular Porción
          </Button>
        </Grid>
      </Grid>

      {result && (
        <Box sx={{ mt: 4, p: 3, bgcolor: 'primary.light', borderRadius: 2, color: 'primary.contrastText', textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Resultados Estimados:</Typography>
          <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>{result.grams}g / día</Typography>
          <Typography variant="body1" sx={{ mt: 1, fontStyle: 'italic' }}>
            {getCustomMessage()}
          </Typography>
          <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 2, color: 'text.primary' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>Plan más compatible:</Typography>
            <Chip label={result.suggestedPlan} color="secondary" sx={{ fontWeight: 'bold', fontSize: '1rem', py: 2, px: 1 }} />
          </Box>
          <Button 
            variant="contained" 
            color="secondary" 
            sx={{ mt: 3, width: '100%' }}
            onClick={() => navigate('/register')}
          >
            Crear cuenta y empezar este plan
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default FeedingCalculator;
