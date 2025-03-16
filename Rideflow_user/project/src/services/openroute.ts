import axios from 'axios';

// This will be replaced with your API key
const API_KEY = '5b3ce3597851110001cf624854750b8fe58a46d5897b080920c4e1ff';
const BASE_URL = 'https://api.openrouteservice.org';

interface Coordinates {
  lat: number;
  lng: number;
}

interface RouteResponse {
  duration: number; // in seconds
  distance: number; // in meters
}

export const getRouteDetails = async (from: Coordinates, to: Coordinates): Promise<RouteResponse> => {
  try {
    const coordinates = [[from.lng, from.lat], [to.lng, to.lat]];
    
    const response = await axios.post(
      `${BASE_URL}/v2/directions/driving-car/geojson`,
      {
        coordinates: coordinates,
        instructions: false,
        units: 'm', // meters
        language: 'en'
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    const route = response.data.features[0].properties.segments[0];
    return {
      duration: route.duration, // in seconds
      distance: route.distance  // in meters
    };
  } catch (error) {
    console.error('Error fetching route details:', error);
    throw error;
  }
};

export const getAlternativeRoutes = async (
  from: Coordinates,
  to: Coordinates,
  radius: number = 1000
): Promise<Array<{ coordinates: Coordinates; duration: number; distance: number }>> => {
  try {
    // Get alternative points within radius of destination
    const response = await axios.post(
      `${BASE_URL}/v2/isochrones/driving-car/geojson`,
      {
        locations: [[to.lng, to.lat]],
        range: [radius],
        attributes: ['area'],
        units: 'm'
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    // Get 3 alternative points from the isochrone polygon
    const polygon = response.data.features[0].geometry.coordinates[0];
    const points = polygon
      .filter((_: any, index: number) => index % Math.floor(polygon.length / 3) === 0)
      .slice(0, 3)
      .map((coord: number[]) => ({
        lng: coord[0],
        lat: coord[1]
      }));

    // Get route details for each alternative point
    const routes = await Promise.all(
      points.map(point => getRouteDetails(from, point))
    );

    return points.map((point, index) => ({
      coordinates: point,
      ...routes[index]
    }));
  } catch (error) {
    console.error('Error fetching alternative routes:', error);
    throw error;
  }
};

export const geocodeLocation = async (locationName: string): Promise<Coordinates> => {
  try {
    const response = await axios.get(`${BASE_URL}/geocode/search/structured`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json'
      },
      params: {
        address: locationName,
        size: 1,
        'boundary.country': 'IND'
      }
    });

    const location = response.data.features[0];
    return {
      lat: location.geometry.coordinates[1],
      lng: location.geometry.coordinates[0]
    };
  } catch (error) {
    console.error('Error geocoding location:', error);
    throw error;
  }
};