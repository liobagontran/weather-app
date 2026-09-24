<template>
  <div class="weather-card">
    <WeatherIcon :name="weather.icon" :is-day="weather.isDay" :size="cardIconSize" class="hero-svg" />

    <div class="temperature-display">
      <span class="temperature">{{ displayTemp }}</span>
      <span class="degree-unit">°</span>
    </div>

    <div class="location-block">
      <h2 class="city-name">{{ weather.city }}</h2>
      <p class="condition">{{ weather.description }}</p>
    </div>

    <div class="details-row">
      <div class="detail-pill">
        <svg class="detail-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 3C12 3 5 11 5 15.5C5 19.09 8.13 22 12 22C15.87 22 19 19.09 19 15.5C19 11 12 3 12 3Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
        </svg>
        <div class="detail-text">
          <span class="detail-value">{{ weather.humidity }}%</span>
          <span class="detail-label">Humidity</span>
        </div>
      </div>

      <div class="detail-pill">
        <svg class="detail-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M3 8H14C15.66 8 17 6.66 17 5C17 3.34 15.66 2 14 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M3 12H18C19.66 12 21 13.34 21 15C21 16.66 19.66 18 18 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <div class="detail-text">
          <span class="detail-value">{{ weather.windSpeed }} km/h</span>
          <span class="detail-label">Wind</span>
        </div>
      </div>
    </div>

    <div class="unit-toggle">
      <button :class="['unit-btn', { active: unit === 'celsius' }]" @click="$emit('toggle-unit', 'celsius')">°C</button>
      <button :class="['unit-btn', { active: unit === 'fahrenheit' }]" @click="$emit('toggle-unit', 'fahrenheit')">°F</button>
    </div>
  </div>
</template>

<script>
import WeatherIcon from './WeatherIcon.vue'

export default {
  name: 'WeatherCard',
  components: { WeatherIcon },
  props: {
    weather: { type: Object, required: true },
    unit: { type: String, default: 'celsius' }
  },
  emits: ['toggle-unit'],
  data() {
    return { cardIconSize: 96, resizeHandler: null }
  },
  computed: {
    displayTemp() {
      if (this.unit === 'fahrenheit') {
        return Math.round((this.weather.temperature * 9) / 5 + 32)
      }
      return Math.round(this.weather.temperature)
    }
  },
  mounted() {
    this.updateIconSize()
    this.resizeHandler = () => this.updateIconSize()
    window.addEventListener('resize', this.resizeHandler)
  },
  beforeUnmount() {
    if (this.resizeHandler) window.removeEventListener('resize', this.resizeHandler)
  },
  methods: {
    updateIconSize() {
      const w = window.innerWidth
      if (w < 380) this.cardIconSize = 76
      else if (w < 520) this.cardIconSize = 86
      else this.cardIconSize = 96
    }
  }
}
</script>

<style scoped>
.weather-card {
  background: var(--md-surface-container);
  border-radius: 32px;
  padding: 40px 32px 32px;
  max-width: 480px;
  margin: 40px auto 0;
  text-align: center;
}

.hero-svg { margin-bottom: 8px; }

.temperature-display {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin: 4px 0 8px;
  color: var(--md-on-surface);
}

.temperature {
  font-size: 6rem;
  font-weight: 300;
  line-height: 1;
  letter-spacing: -3px;
}

.degree-unit {
  font-size: 2.4rem;
  font-weight: 300;
  margin-top: 4px;
}

.location-block { margin-bottom: 28px; }

.city-name {
  font-size: 1.4rem;
  font-weight: 500;
  margin: 0 0 4px 0;
  color: var(--md-on-surface);
}

.condition {
  font-size: 0.95rem;
  margin: 0;
  text-transform: capitalize;
  color: var(--md-on-surface-variant);
}

.details-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 24px;
}

.detail-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-radius: 20px;
  background: var(--md-secondary-container);
  color: var(--md-on-secondary-container);
}

.detail-icon { flex-shrink: 0; }

.detail-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  min-width: 0;
}

.detail-value { font-size: 1rem; font-weight: 600; line-height: 1.2; }
.detail-label { font-size: 0.7rem; font-weight: 500; opacity: 0.75; margin-top: 2px; }

.unit-toggle {
  display: inline-flex;
  padding: 4px;
  border-radius: 20px;
  background: var(--md-surface-container-high);
  gap: 4px;
}

.unit-btn {
  padding: 8px 22px;
  border: none;
  background: transparent;
  border-radius: 16px;
  font-size: 0.9rem;
  font-weight: 500;
  font-family: inherit;
  color: var(--md-on-surface-variant);
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}
.unit-btn.active {
  background: var(--md-primary-container);
  color: var(--md-on-primary-container);
}

@media (max-width: 520px) {
  .weather-card { padding: 32px 20px 24px; border-radius: 28px; margin-top: 28px; }
  .temperature { font-size: 4.5rem; letter-spacing: -2px; }
  .degree-unit { font-size: 1.9rem; }
  .city-name { font-size: 1.2rem; }
  .condition { font-size: 0.88rem; }
  .location-block { margin-bottom: 22px; }
  .details-row { gap: 8px; margin-bottom: 20px; }
  .detail-pill { padding: 10px 12px; border-radius: 16px; }
  .detail-value { font-size: 0.88rem; }
  .detail-label { font-size: 0.6rem; }
  .unit-btn { padding: 7px 18px; font-size: 0.85rem; }
}
</style>