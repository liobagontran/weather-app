import axios from 'axios'

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search'
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast'

// Weather code mapping (WMO codes)
export const weatherCodeMap = {
  0: { description: 'Clear sky', icon: '☀️' },
  1: { description: 'Mainly clear', icon: '🌤️' },
  2: { description: 'Partly cloudy', icon: '⛅' },
  3: { description: 'Overcast', icon: '☁️' },
  45: { description: 'Foggy', icon: '🌫️' },
  48: { description: 'Depositing rime fog', icon: '🌫️' },
  51: { description: 'Light drizzle', icon: '🌦️' },
  53: { description: 'Moderate drizzle', icon: '🌦️' },
  55: { description: 'Dense drizzle', icon: '🌧️' },
  56: { description: 'Light freezing drizzle', icon: '🌨️' },
  57: { description: 'Dense freezing drizzle', icon: '🌨️' },
  61: { description: 'Slight rain', icon: '🌧️' },
  63: { description: 'Moderate rain', icon: '🌧️' },
  65: { description: 'Heavy rain', icon: '🌧️' },
  66: { description: 'Light freezing rain', icon: '🌨️' },
  67: { description: 'Heavy freezing rain', icon: '🌨️' },
  71: { description: 'Slight snow', icon: '❄️' },
  73: { description: 'Moderate snow', icon: '❄️' },
  75: { description: 'Heavy snow', icon: '❄️' },
  77: { description: 'Snow grains', icon: '❄️' },
  80: { description: 'Slight rain showers', icon: '🌦️' },
  81: { description: 'Moderate rain showers', icon: '🌧️' },
  82: { description: 'Violent rain showers', icon: '⛈️' },
  85: { description: 'Slight snow showers', icon: '🌨️' },
  86: { description: 'Heavy snow showers', icon: '🌨️' },
  95: { description: 'Thunderstorm', icon: '⛈️' },
  96: { description: 'Thunderstorm with slight hail', icon: '⛈️' },
  99: { description: 'Thunderstorm with heavy hail', icon: '⛈️' }
}

export async function geocodeCity(cityName) {
  const response = await axios.get(GEOCODING_API, {
    params: {
      name: cityName,
      count: 1,
      language: 'en',
      format: 'json'
    }
  })

  if (!response.data.results || response.data.results.length === 0) {
    throw new Error('CITY_NOT_FOUND')
  }

  const result = response.data.results[0]
  return {
    name: result.name,
    country: result.country,
    latitude: result.latitude,
    longitude: result.longitude,
    admin1: result.admin1 || ''
  }
}

export async function fetchWeather(latitude, longitude) {
  const response = await axios.get(WEATHER_API, {
    params: {
      latitude,
      longitude,
      current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
      timezone: 'auto'
    }
  })

  return response.data.current
}

export function getWeatherInfo(code) {
  return weatherCodeMap[code] || { description: 'Unknown', icon: '❓' }
}