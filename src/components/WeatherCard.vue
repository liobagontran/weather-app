<template>
  <div class="weather-card">
    <div class="card-header">
      <div class="location">
        <h2 class="city-name">{{ weather.city }}</h2>
        <p class="country">{{ weather.country }}</p>
      </div>
      <div class="weather-icon">{{ weather.icon }}</div>
    </div>

    <div class="temperature-section">
      <span class="temperature">{{ displayTemp }}</span>
      <span class="unit">{{ unitSymbol }}</span>
    </div>

    <p class="condition">{{ weather.description }}</p>

    <div class="details-grid">
      <div class="detail-item">
        <span class="detail-icon">💧</span>
        <div>
          <p class="detail-label">Humidity</p>
          <p class="detail-value">{{ weather.humidity }}%</p>
        </div>
      </div>
      <div class="detail-item">
        <span class="detail-icon">💨</span>
        <div>
          <p class="detail-label">Wind Speed</p>
          <p class="detail-value">{{ weather.windSpeed }} km/h</p>
        </div>
      </div>
    </div>

    <div class="unit-toggle">
      <button
        :class="['unit-btn', { active: unit === 'celsius' }]"
        @click="$emit('toggle-unit', 'celsius')"
      >
        °C
      </button>
      <button
        :class="['unit-btn', { active: unit === 'fahrenheit' }]"
        @click="$emit('toggle-unit', 'fahrenheit')"
      >
        °F
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WeatherCard',
  props: {
    weather: {
      type: Object,
      required: true
    },
    unit: {
      type: String,
      default: 'celsius'
    }
  },
  emits: ['toggle-unit'],
  computed: {
    displayTemp() {
      if (this.unit === 'fahrenheit') {
        return Math.round((this.weather.temperature * 9) / 5 + 32)
      }
      return Math.round(this.weather.temperature)
    },
    unitSymbol() {
      return this.unit === 'fahrenheit' ? '°F' : '°C'
    }
  }
}
</script>

<style scoped>
.weather-card {
  background: white;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  max-width: 480px;
  margin: 0 auto;
  animation: fadeInUp 0.4s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.city-name {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.country {
  font-size: 0.95rem;
  color: #64748b;
  margin: 4px 0 0 0;
}

.weather-icon {
  font-size: 3.5rem;
  line-height: 1;
}

.temperature-section {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin: 24px 0 8px;
}

.temperature {
  font-size: 5rem;
  font-weight: 800;
  color: #1e293b;
  line-height: 1;
}

.unit {
  font-size: 1.5rem;
  color: #94a3b8;
  margin-top: 8px;
  margin-left: 4px;
}

.condition {
  text-align: center;
  font-size: 1.15rem;
  color: #475569;
  margin: 0 0 24px 0;
  text-transform: capitalize;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8fafc;
  padding: 16px;
  border-radius: 16px;
}

.detail-icon {
  font-size: 1.5rem;
}

.detail-label {
  font-size: 0.8rem;
  color: #94a3b8;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 2px 0 0 0;
}

.unit-toggle {
  display: flex;
  justify-content: center;
  gap: 8px;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 12px;
  width: fit-content;
  margin: 0 auto;
}

.unit-btn {
  padding: 8px 20px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.unit-btn.active {
  background: white;
  color: #6366f1;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}
</style>