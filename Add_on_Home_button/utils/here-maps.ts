const BASE_URL = 'https://autocomplete.search.hereapi.com/v1';

export async function searchLocations(query: string) {
  try {
    if (!process.env.EXPO_PUBLIC_HERE_API_KEY) {
      console.error('HERE Maps API key is not configured');
      return [];
    }

    const response = await fetch(
      `${BASE_URL}/autocomplete?q=${encodeURIComponent(query)}&apiKey=${process.env.EXPO_PUBLIC_HERE_API_KEY}&in=countryCode:IND&types=city,place,street,address&limit=5`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.items || !Array.isArray(data.items)) {
      console.error('Invalid response format:', data);
      return [];
    }
    
    return data.items.map((item: any) => ({
      id: item.id,
      title: item.title,
      address: item.address.label,
      position: {
        lat: item.position.lat,
        lng: item.position.lng
      }
    }));
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
}