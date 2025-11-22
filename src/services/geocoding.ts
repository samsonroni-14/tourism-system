export interface GeocodingResult {
  lat: string;
  lon: string;
  display_name: string;
  name: string;
}

export const geocodeLocation = async (location: string): Promise<GeocodingResult | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'TourismAIAgent/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Geocoding failed');
    }

    const data = await response.json();

    if (data.length === 0) {
      return null;
    }

    return data[0];
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};