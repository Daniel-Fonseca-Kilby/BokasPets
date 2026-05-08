import { useMemo } from 'react';

export const useLoyalty = (points: number = 0) => {
  return useMemo(() => {
    let levelName = '🐾 Cachorro';
    let discount = 'Sin beneficios extra';
    let nextLevelPoints = 200;
    let currentLevelPoints = 0;

    if (points >= 1000) {
      levelName = '👑 Alfa';
      discount = '15% + Envío Gratis';
      nextLevelPoints = 1000;
      currentLevelPoints = 1000;
    } else if (points >= 500) {
      levelName = '⭐ Fiel';
      discount = '10% + Envío Gratis';
      nextLevelPoints = 1000;
      currentLevelPoints = 500;
    } else if (points >= 200) {
      levelName = '🦴 Compañero';
      discount = '5% permanente';
      nextLevelPoints = 500;
      currentLevelPoints = 200;
    }

    let progressPercentage = 100;
    if (points < 1000) {
      const pointsInLevel = points - currentLevelPoints;
      const pointsNeededForLevel = nextLevelPoints - currentLevelPoints;
      progressPercentage = (pointsInLevel / pointsNeededForLevel) * 100;
    }

    return {
      points,
      level: levelName,
      discount,
      nextLevelPoints: points < 1000 ? nextLevelPoints : null,
      progressPercentage: Math.min(100, Math.max(0, progressPercentage)),
      pointsToNextLevel: points < 1000 ? nextLevelPoints - points : 0
    };
  }, [points]);
};
