import { GoogleGenerativeAI } from '@google/generative-ai';

interface Coordinates {
  lat: number;
  lng: number;
}

interface RouteResponse {
  duration: number; // in seconds
  distance: number; // in meters
}

let genAI: GoogleGenerativeAI;

export const initializeGemini = (apiKey: string) => {
  genAI = new GoogleGenerativeAI(apiKey);
};

export const getRouteDetails = async (from: string, to: string): Promise<RouteResponse> => {
  try {
    if (!genAI) {
      throw new Error('Gemini API not initialized');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are a precise distance and time calculator for Bangalore, India. Calculate the driving distance and estimated duration between ${from} and ${to}.
    Consider:
    1. Current traffic patterns in Bangalore
    2. Typical route taken by cabs
    3. Real-world road conditions
    
    Return only two numbers separated by comma:
    1. Distance in kilometers (with one decimal place)
    2. Duration in minutes (whole number)
    
    Example format: "8.5,25"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    const [distance, duration] = text.split(',').map(Number);

    if (isNaN(distance) || isNaN(duration)) {
      throw new Error('Invalid response format from Gemini API');
    }

    return {
      distance: distance * 1000, // Convert km to meters
      duration: duration * 60    // Convert minutes to seconds
    };
  } catch (error) {
    console.error('Error getting route details:', error);
    throw error;
  }
};

export const getAlternativeRoutes = async (
  from: string,
  to: string
): Promise<Array<{ coordinates: Coordinates; duration: number; distance: number; location: string }>> => {
  try {
    if (!genAI) {
      throw new Error('Gemini API not initialized');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are a Bangalore transportation expert. Suggest 3 alternative drop-off points near ${to} that might have less traffic or shorter routes from ${from}.
    Consider:
    1. Popular landmarks or areas
    2. Areas with better traffic flow
    3. Nearby commercial or residential hubs
    
    For each point, provide three values separated by commas:
    1. Location name (specific and real)
    2. Distance in km from ${from} (with one decimal place)
    3. Estimated duration in minutes (whole number)
    
    Return exactly three lines in this format:
    "LocationName,7.5,20"
    "LocationName,8.2,22"
    "LocationName,7.8,21"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    const alternatives = text.split('\n').map(line => {
      const [location, distance, duration] = line.replace(/"/g, '').trim().split(',');
      return {
        location: location.trim(),
        coordinates: { lat: 0, lng: 0 }, // Placeholder coordinates
        distance: Number(distance) * 1000, // Convert km to meters
        duration: Number(duration) * 60    // Convert minutes to seconds
      };
    });

    return alternatives.filter(alt => 
      !isNaN(alt.distance) && 
      !isNaN(alt.duration) && 
      alt.location.length > 0
    );
  } catch (error) {
    console.error('Error getting alternative routes:', error);
    throw error;
  }
};