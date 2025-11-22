export interface WeatherData {
  temperature: number;
  precipitation_probability: number;
  weather_code: number;
  location: string;
}

export const getWeatherData = async (
  latitude: number,
  longitude: number,
  locationName: string
): Promise<WeatherData | null> => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation_probability,weather_code&timezone=auto`
    );

    if (!response.ok) {
      throw new Error('Weather API failed');
    }

    const data = await response.json();

    return {
      temperature: Math.round(data.current.temperature_2m),
      precipitation_probability: data.current.precipitation_probability || 0,
      weather_code: data.current.weather_code,
      location: locationName
    };
  } catch (error) {
    console.error('Weather error:', error);
    return null;
  }
};