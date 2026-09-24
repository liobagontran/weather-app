import axios from 'axios'

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search'
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast'

// Mapping WMO code → description + icon "family".
// The family is resolved to an actual day/night icon by WeatherIcon.vue,
// so a clear night never renders as a sun.
export const weatherCodeMap = {
  0:  { description: 'Clear sky',                     icon: 'clear' },
  1:  { description: 'Mainly clear',                  icon: 'clear' },
  2:  { description: 'Partly cloudy',                 icon: 'partly-cloudy' },
  3:  { description: 'Overcast',                      icon: 'cloudy' },
  45: { description: 'Foggy',                         icon: 'foggy' },
  48: { description: 'Depositing rime fog',           icon: 'foggy' },
  51: { description: 'Light drizzle',                 icon: 'drizzle' },
  53: { description: 'Moderate drizzle',              icon: 'drizzle' },
  55: { description: 'Dense drizzle',                 icon: 'drizzle' },
  56: { description: 'Light freezing drizzle',        icon: 'sleet' },
  57: { description: 'Dense freezing drizzle',        icon: 'sleet' },
  61: { description: 'Slight rain',                   icon: 'rain' },
  63: { description: 'Moderate rain',                 icon: 'rain' },
  65: { description: 'Heavy rain',                    icon: 'rain-heavy' },
  66: { description: 'Light freezing rain',           icon: 'sleet' },
  67: { description: 'Heavy freezing rain',           icon: 'sleet' },
  71: { description: 'Slight snow',                   icon: 'snow' },
  73: { description: 'Moderate snow',                 icon: 'snow' },
  75: { description: 'Heavy snow',                    icon: 'snow-heavy' },
  77: { description: 'Snow grains',                   icon: 'snow' },
  80: { description: 'Slight rain showers',           icon: 'rain' },
  81: { description: 'Moderate rain showers',         icon: 'rain' },
  82: { description: 'Violent rain showers',          icon: 'rain-heavy' },
  85: { description: 'Slight snow showers',           icon: 'snow' },
  86: { description: 'Heavy snow showers',            icon: 'snow-heavy' },
  95: { description: 'Thunderstorm',                  icon: 'thunder' },
  96: { description: 'Thunderstorm with slight hail', icon: 'thunder' },
  99: { description: 'Thunderstorm with heavy hail',  icon: 'thunder' }
}

export async function geocodeCity(cityName) {
  const response = await axios.get(GEOCODING_API, {
    params: { name: cityName, count: 1, language: 'en', format: 'json' }
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
    admin1: result.admin1 || '',
    timezone: result.timezone || 'auto'
  }
}

export async function fetchWeather(latitude, longitude) {
  const response = await axios.get(WEATHER_API, {
    params: {
      latitude,
      longitude,
      current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day',
      timezone: 'auto'
    }
  })

  return response.data.current
}

export function getWeatherInfo(code) {
  return weatherCodeMap[code] || { description: 'Unknown', icon: 'cloudy' }
}