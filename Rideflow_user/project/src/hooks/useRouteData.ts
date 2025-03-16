import { useQuery } from '@tanstack/react-query';
import { getRouteDetails, getAlternativeRoutes } from '../services/gemini';

export const useRouteData = (pickup: string, dropoff: string) => {
  return useQuery({
    queryKey: ['route', pickup, dropoff],
    queryFn: async () => {
      if (!pickup || !dropoff) return null;

      const [routeDetails, alternatives] = await Promise.all([
        getRouteDetails(pickup, dropoff),
        getAlternativeRoutes(pickup, dropoff)
      ]);

      // Calculate price based on distance and duration
      // Base fare components (in INR)
      const baseFare = 30;           // Minimum fare
      const perKmRate = 12;          // Rate per kilometer
      const perMinRate = 2;          // Rate per minute
      const peakHourMultiplier = 1.2; // 20% increase during peak hours
      const nightChargeMultiplier = 1.25; // 25% increase for night rides

      const calculatePrice = (distance: number, duration: number) => {
        // Convert meters to kilometers and seconds to minutes
        const distanceKm = distance / 1000;
        const durationMin = duration / 60;

        // Calculate base components
        const distanceCharge = distanceKm * perKmRate;
        const timeCharge = durationMin * perMinRate;
        let totalPrice = baseFare + distanceCharge + timeCharge;

        // Apply time-based multipliers
        const hour = new Date().getHours();
        const isPeakHour = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 19);
        const isNightTime = hour >= 22 || hour <= 5;

        if (isPeakHour) {
          totalPrice *= peakHourMultiplier;
        }
        if (isNightTime) {
          totalPrice *= nightChargeMultiplier;
        }

        // Add a variance of ±5% for min/max price
        const variance = totalPrice * 0.05;
        return {
          min: Math.max(Math.round(totalPrice - variance), baseFare),
          max: Math.round(totalPrice + variance)
        };
      };

      const mainPrice = calculatePrice(routeDetails.distance, routeDetails.duration);
      const waitTime = Math.round(routeDetails.duration / 60);

      // Process alternative routes with more accurate savings calculations
      const processedAlternatives = alternatives.map(alt => {
        const altPrice = calculatePrice(alt.distance, alt.duration);
        return {
          location: alt.location,
          savings: Math.max(0, mainPrice.min - altPrice.min),
          timeReduction: Math.max(0, Math.round((routeDetails.duration - alt.duration) / 60)),
          coordinates: alt.coordinates
        };
      }).filter(alt => alt.savings > 0 || alt.timeReduction > 0);

      return {
        price: mainPrice,
        waitTime,
        alternatives: processedAlternatives
      };
    },
    enabled: Boolean(pickup && dropoff),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};