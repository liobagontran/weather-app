<template>
  <div class="app">
    <div class="background-decoration"></div>

    <header class="app-header">
      <div class="logo">
        <span class="logo-icon">🌤️</span>
        <h1 class="app-title">Weather App</h1>
      </div>
      <p class="app-subtitle">Search any city to get real-time weather</p>
    </header>

    <main class="app-main">
      <SearchBar
        :is-loading="isLoading"
        :initial-city="lastSearchedCity"
        @search="handleSearch"
      />

      <div v-if="!weather && !isLoading && !error" class="suggestions">
        <p class="suggestions-label">Try these cities:</p>
        <div class="suggestion-chips">
          <button
            v-for="city in suggestedCities"
            :key="city"
            class="chip"
            @click="handleSearch(city)"
          >
            {{ city }}
          </button>
        </div>
      </div>

      <LoadingMessage v-if="isLoading" />

      <ErrorMessage
        v-else-if="error"
        :title="error.title"
        :message="error.message"
        @retry="retryLastSearch"
      />

      <WeatherCard
        v-else-if="weather"
        :weather="weather"
        :unit="unit"
        @toggle-unit="unit = $event"
      />

      <div v-else class="welcome">
        <div class="welcome-icon">🌍</div>
        <h2>Welcome!</h2>
        <p>Enter a city name above to see its current weather.</p>
      </div>

      <div v-if="searchHistory.length > 0" class="history-section">
        <h3 class="history-title">Recent Searches</h3>
        <div class="history-chips">
          <button
            v-for="(city, index) in searchHistory"
            :key="index"
            class="history-chip"
            @click="handleSearch(city)"
          >
            {{ city }}
          </button>
        </div>
      </div>
    </main>

    <footer class="app-footer">
      <p>Powered by Open-Meteo API</p>
    </footer>
  </div>
</template>

<script>
import SearchBar from './components/SearchBar.vue'
import WeatherCard from './components/WeatherCard.vue'
import LoadingMessage from './components/LoadingMessage.vue'
import ErrorMessage from './components/ErrorMessage.vue'
import {
  geocodeCity,
  fetchWeather,
  getWeatherInfo
} from './services/weatherService.js'

export default {
  name: 'App',
  components: {
    SearchBar,
    WeatherCard,
    LoadingMessage,
    ErrorMessage
  },
  data() {
    return {
      city: '',
      weather: null,
      isLoading: false,
      error: null,
      unit: 'celsius',
      lastSearchedCity: '',
      searchHistory: [],
      suggestedCities: ['Bujumbura', 'Tokyo', 'Nairobi', 'Shanghai', 'Paris']
    }
  },
  methods: {
    async handleSearch(cityName) {
      const city = cityName.trim()
      if (!city) return

      this.isLoading = true
      this.error = null
      this.weather = null
      this.lastSearchedCity = city

      try {
        const location = await geocodeCity(city)
        const current = await fetchWeather(
          location.latitude,
          location.longitude
        )
        const weatherInfo = getWeatherInfo(current.weather_code)

        this.weather = {
          city: location.name,
          country: location.country,
          temperature: current.temperature_2m,
          humidity: current.relative_humidity_2m,
          windSpeed: current.wind_speed_10m,
          description: weatherInfo.description,
          icon: weatherInfo.icon
        }

        this.addToHistory(location.name)
      } catch (err) {
        if (err.message === 'CITY_NOT_FOUND') {
          this.error = {
            title: 'City Not Found',
            message: `We couldn't find "${city}". Please check the spelling and try again.`
          }
        } else if (err.response) {
          this.error = {
            title: 'Network Error',
            message: 'Unable to reach the weather service. Please check your connection and try again.'
          }
        } else {
          this.error = {
            title: 'Something Went Wrong',
            message: 'An unexpected error occurred. Please try again.'
          }
        }
      } finally {
        this.isLoading = false
      }
    },

    addToHistory(cityName) {
      const filtered = this.searchHistory.filter(
        (c) => c.toLowerCase() !== cityName.toLowerCase()
      )
      this.searchHistory = [cityName, ...filtered].slice(0, 5)
    },

    retryLastSearch() {
      if (this.lastSearchedCity) {
        this.handleSearch(this.lastSearchedCity)
      }
    }
  }
}
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    sans-serif;
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 50%, #fae8ff 100%);
  min-height: 100vh;
  color: #1e293b;
}
</style>

<style scoped>
.app {
  min-height: 100vh;
  padding: 40px 20px;
  position: relative;
  overflow-x: hidden;
}

.background-decoration {
  position: fixed;
  top: -100px;
  right: -100px;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
}

.app-header {
  text-align: center;
  margin-bottom: 40px;
  position: relative;
  z-index: 1;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 8px;
}

.logo-icon {
  font-size: 2.5rem;
}

.app-title {
  font-size: 2.25rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.app-subtitle {
  color: #64748b;
  font-size: 1rem;
  margin: 0;
}

.app-main {
  max-width: 640px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.suggestions {
  text-align: center;
  margin-top: 24px;
}

.suggestions-label {
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 12px;
}

.suggestion-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.chip {
  padding: 8px 18px;
  background: white;
  border: 1.5px solid #e2e8f0;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.chip:hover {
  border-color: #6366f1;
  color: #6366f1;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
}

.welcome {
  text-align: center;
  padding: 60px 24px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06);
  animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.welcome-icon {
  font-size: 4rem;
  margin-bottom: 16px;
}

.welcome h2 {
  font-size: 1.5rem;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.welcome p {
  color: #64748b;
  margin: 0;
}

.history-section {
  margin-top: 32px;
  text-align: center;
}

.history-title {
  font-size: 0.85rem;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
  font-weight: 600;
}

.history-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.history-chip {
  padding: 6px 16px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  font-size: 0.85rem;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.history-chip:hover {
  background: white;
  color: #6366f1;
  border-color: #c7d2fe;
}

.app-footer {
  text-align: center;
  margin-top: 60px;
  color: #94a3b8;
  font-size: 0.85rem;
  position: relative;
  z-index: 1;
}
</style>