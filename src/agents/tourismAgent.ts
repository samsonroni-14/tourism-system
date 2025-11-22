import { geocodeLocation } from '../services/geocoding';
import { getWeatherData, WeatherData } from '../services/weather';
import { getTouristPlaces, Place } from '../services/places';
import { supabase, getSessionId } from '../lib/supabase';

export interface TourismResult {
  success: boolean;
  location?: string;
  weather?: WeatherData;
  places?: Place[];
  error?: string;
  message: string;
}

export interface AgentRequest {
  location: string;
  needsWeather: boolean;
  needsPlaces: boolean;
}

const analyzeUserInput = (input: string): AgentRequest => {
  const lowerInput = input.toLowerCase();

  const weatherKeywords = ['weather', 'temperature', 'temp', 'rain', 'climate', 'forecast'];
  const placesKeywords = ['places', 'visit', 'attractions', 'tourist', 'plan', 'trip', 'see', 'go'];

  const needsWeather = weatherKeywords.some(keyword => lowerInput.includes(keyword));
  const needsPlaces = placesKeywords.some(keyword => lowerInput.includes(keyword));

  const locationMatch = input.match(/(?:to|in)\s+([A-Za-z\s]+?)(?:\s*[,.]|\s*$)/i);
  const location = locationMatch ? locationMatch[1].trim() : input.trim();

  return {
    location,
    needsWeather: needsWeather || (!needsWeather && !needsPlaces),
    needsPlaces: needsPlaces || (!needsWeather && !needsPlaces)
  };
};

export const processTourismQuery = async (userInput: string): Promise<TourismResult> => {
  const request = analyzeUserInput(userInput);

  const geocodeResult = await geocodeLocation(request.location);

  if (!geocodeResult) {
    return {
      success: false,
      error: 'location_not_found',
      message: `I don't know if the place "${request.location}" exists. Please try another location.`
    };
  }

  const latitude = parseFloat(geocodeResult.lat);
  const longitude = parseFloat(geocodeResult.lon);
  const locationName = geocodeResult.name || geocodeResult.display_name.split(',')[0];

  let weather: WeatherData | undefined;
  let places: Place[] | undefined;

  if (request.needsWeather) {
    const weatherData = await getWeatherData(latitude, longitude, locationName);
    if (weatherData) {
      weather = weatherData;
    }
  }

  if (request.needsPlaces) {
    const placesData = await getTouristPlaces(latitude, longitude);
    if (placesData.length > 0) {
      places = placesData;
    }
  }

  try {
    await supabase.from('search_history').insert({
      location: locationName,
      latitude,
      longitude,
      weather_data: weather || null,
      places_data: places || null,
      session_id: getSessionId()
    });
  } catch (error) {
    console.error('Failed to save search history:', error);
  }

  let message = '';

  if (weather && places) {
    message = `In ${locationName} it's currently ${weather.temperature}°C with a ${weather.precipitation_probability}% chance of rain. And these are the places you can go:\n${places.map(p => `- ${p.name}`).join('\n')}`;
  } else if (weather) {
    message = `In ${locationName} it's currently ${weather.temperature}°C with a ${weather.precipitation_probability}% chance of rain.`;
  } else if (places) {
    message = `In ${locationName} these are the places you can go:\n${places.map(p => `- ${p.name}`).join('\n')}`;
  } else {
    message = `I found ${locationName}, but couldn't retrieve detailed information at the moment.`;
  }

  return {
    success: true,
    location: locationName,
    weather,
    places,
    message
  };
};