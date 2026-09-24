<template>
  <div class="app" :data-theme="currentTheme">
    <header class="app-header">
      <div class="logo">
        <svg v-if="currentTheme === 'night'" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4a8.5 8.5 0 1 0 11.5 11.5Z" fill="var(--md-primary)" />
        </svg>
        <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="4.5" fill="var(--md-primary)" />
          <g stroke="var(--md-primary)" stroke-width="2" stroke-linecap="round">
            <line x1="12" y1="2" x2="12" y2="4.5" />
            <line x1="12" y1="19.5" x2="12" y2="22" />
            <line x1="2" y1="12" x2="4.5" y2="12" />
            <line x1="19.5" y1="12" x2="22" y2="12" />
            <line x1="4.9" y1="4.9" x2="6.7" y2="6.7" />
            <line x1="17.3" y1="17.3" x2="19.1" y2="19.1" />
            <line x1="4.9" y1="19.1" x2="6.7" y2="17.3" />
            <line x1="17.3" y1="6.7" x2="19.1" y2="4.9" />
          </g>
        </svg>
        <h1 class="app-title">Weather</h1>
      </div>
      <p class="app-subtitle">{{ subtitle }}</p>
    </header>

    <main class="app-main">
      <SearchBar :is-loading="isLoading" :initial-city="lastSearchedCity" @search="handleSearch" />

      <div v-if="!weather && !isLoading && !error" class="suggestions">
        <button v-for="city in suggestedCities" :key="city" class="chip" @click="handleSearch(city)">
          {{ city }}
        </button>
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
        <svg v-if="currentTheme === 'night'" width="48" height="48" viewBox="0 0 24 24" fill="none">
          <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4a8.5 8.5 0 1 0 11.5 11.5Z" fill="var(--md-primary)" />
        </svg>
        <svg v-else width="48" height="48" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="5" fill="var(--md-primary)" />
          <g stroke="var(--md-primary)" stroke-width="2" stroke-linecap="round">
            <line x1="12" y1="2" x2="12" y2="4" />
            <line x1="12" y1="20" x2="12" y2="22" />
            <line x1="2" y1="12" x2="4" y2="12" />
            <line x1="20" y1="12" x2="22" y2="12" />
          </g>
        </svg>
        <h2>Welcome</h2>
        <p>Search for a city to see its current weather</p>
      </div>

      <div v-if="searchHistory.length > 0" class="history-section">
        <p class="history-title">Recent searches</p>
        <div class="history-chips">
          <button v-for="(city, index) in searchHistory" :key="index" class="history-chip" @click="handleSearch(city)">
            {{ city }}
          </button>
        </div>
      </div>
    </main>

    <footer class="app-footer">
      <p>Designed by Lioba</p>
    </footer>
  </div>
</template>

<script>
import SearchBar from './components/SearchBar.vue'
import WeatherCard from './components/WeatherCard.vue'
import LoadingMessage from './components/LoadingMessage.vue'
import ErrorMessage from './components/ErrorMessage.vue'
import { geocodeCity, fetchWeather, getWeatherInfo } from './services/weatherService.js'

export default {
  name: 'App',
  components: { SearchBar, WeatherCard, LoadingMessage, ErrorMessage },
  data() {
    return {
      weather: null,
      isLoading: false,
      error: null,
      unit: 'celsius',
      lastSearchedCity: '',
      searchHistory: [],
      suggestedCities: ['Bujumbura', 'Tokyo', 'Nairobi', 'Shanghai', 'Paris'],
      isDayFromApi: 1,
      systemHour: new Date().getHours()
    }
  },
  computed: {
    currentTheme() {
      if (this.weather) return this.isDayFromApi === 1 ? 'day' : 'night'
      return this.systemHour >= 6 && this.systemHour < 18 ? 'day' : 'night'
    },
    subtitle() {
      return this.currentTheme === 'night'
        ? 'Good night — check the weather anywhere'
        : 'Good day — check the weather anywhere'
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
        const current = await fetchWeather(location.latitude, location.longitude)
        this.isDayFromApi = current.is_day ?? 1
        const weatherInfo = getWeatherInfo(current.weather_code)

        this.weather = {
          city: location.name,
          country: location.country,
          temperature: current.temperature_2m,
          humidity: current.relative_humidity_2m,
          windSpeed: current.wind_speed_10m,
          description: weatherInfo.description,
          icon: weatherInfo.icon,
          isDay: this.isDayFromApi === 1
        }

        this.addToHistory(location.name)
      } catch (err) {
        if (err.message === 'CITY_NOT_FOUND') {
          this.error = {
            title: 'City not found',
            message: `We couldn't find "${city}". Please check the spelling and try again.`
          }
        } else if (err.response) {
          this.error = {
            title: 'Network error',
            message: 'Unable to reach the weather service. Please check your connection.'
          }
        } else {
          this.error = {
            title: 'Something went wrong',
            message: 'Please try again.'
          }
        }
      } finally {
        this.isLoading = false
      }
    },
    addToHistory(cityName) {
      const filtered = this.searchHistory.filter((c) => c.toLowerCase() !== cityName.toLowerCase())
      this.searchHistory = [cityName, ...filtered].slice(0, 5)
    },
    retryLastSearch() {
      if (this.lastSearchedCity) this.handleSearch(this.lastSearchedCity)
    }
  },
  mounted() {
    this.hourInterval = setInterval(() => {
      this.systemHour = new Date().getHours()
    }, 60000)
  },
  beforeUnmount() {
    if (this.hourInterval) clearInterval(this.hourInterval)
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; min-height: 100vh; }
#app { min-height: 100vh; }
body { font-family: 'Roboto', -apple-system, 'Segoe UI', sans-serif; }

/* ---- Material 3 design tokens ---- */
[data-theme="day"] {
  --md-primary: #0b57d0;
  --md-on-primary: #ffffff;
  --md-primary-container: #d3e3fd;
  --md-on-primary-container: #041e49;
  --md-secondary-container: #e1e2f5;
  --md-on-secondary-container: #1b1c2c;
  --md-surface: #fef7ff;
  --md-surface-container-low: #f7f2fa;
  --md-surface-container: #f3edf7;
  --md-surface-container-high: #ece6f0;
  --md-on-surface: #1c1b1f;
  --md-on-surface-variant: #49454f;
  --md-outline-variant: #cac4d0;
  --md-error-container: #f9dedc;
  --md-on-error-container: #410e0b;
}
[data-theme="night"] {
  --md-primary: #a8c7fa;
  --md-on-primary: #062e6f;
  --md-primary-container: #0b57d0;
  --md-on-primary-container: #d3e3fd;
  --md-secondary-container: #2e2f42;
  --md-on-secondary-container: #dee0f9;
  --md-surface: #131318;
  --md-surface-container-low: #1d1b20;
  --md-surface-container: #201f26;
  --md-surface-container-high: #2b2930;
  --md-on-surface: #e6e1e9;
  --md-on-surface-variant: #cac4d0;
  --md-outline-variant: #49454f;
  --md-error-container: #8c1d18;
  --md-on-error-container: #f9dedc;
}
</style>

<style scoped>
.app {
  min-height: 100vh;
  padding: 40px 20px;
  background: var(--md-surface);
  color: var(--md-on-surface);
  transition: background 0.4s ease, color 0.4s ease;
}

.app-header {
  text-align: center;
  margin-bottom: 24px;
  max-width: 640px;
  margin-left: auto;
  margin-right: auto;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 4px;
}

.app-title {
  font-size: 1.5rem;
  font-weight: 400;
  margin: 0;
  letter-spacing: -0.3px;
}

.app-subtitle {
  font-size: 0.9rem;
  margin: 0;
  color: var(--md-on-surface-variant);
}

.app-main {
  max-width: 640px;
  margin: 0 auto;
}

.suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-top: 20px;
}

.chip {
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 0.88rem;
  font-weight: 500;
  font-family: inherit;
  border: 1px solid var(--md-outline-variant);
  background: transparent;
  color: var(--md-on-surface-variant);
  cursor: pointer;
  transition: background 0.2s ease;
}
.chip:hover { background: var(--md-surface-container-high); }

.welcome {
  text-align: center;
  padding: 56px 32px;
  border-radius: 28px;
  margin-top: 40px;
  background: var(--md-surface-container);
}
.welcome h2 { font-size: 1.3rem; font-weight: 400; margin: 14px 0 6px 0; }
.welcome p { font-size: 0.92rem; margin: 0; color: var(--md-on-surface-variant); }

.history-section { margin-top: 28px; text-align: center; }
.history-title {
  font-size: 0.8rem;
  margin-bottom: 10px;
  color: var(--md-on-surface-variant);
}
.history-chips { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.history-chip {
  padding: 8px 16px;
  border-radius: 16px;
  font-size: 0.82rem;
  font-weight: 500;
  font-family: inherit;
  border: none;
  background: var(--md-surface-container-high);
  color: var(--md-on-surface-variant);
  cursor: pointer;
  transition: background 0.2s ease;
}
.history-chip:hover { background: var(--md-secondary-container); }

.app-footer {
  text-align: center;
  margin-top: 56px;
  font-size: 0.78rem;
  color: var(--md-on-surface-variant);
  opacity: 0.7;
}

@media (max-width: 520px) {
  .app { padding: 28px 16px; }
  .app-title { font-size: 1.3rem; }
  .welcome { padding: 40px 20px; border-radius: 24px; margin-top: 28px; }
  .app-footer { margin-top: 40px; }
}
</style>