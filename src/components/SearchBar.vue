<template>
  <div class="search-bar">
    <div class="search-input-wrapper">
      <span class="search-icon">🔍</span>
      <input
        v-model="localCity"
        type="text"
        class="search-input"
        placeholder="Enter a city name..."
        @keyup.enter="handleSearch"
        :disabled="isLoading"
      />
      <button
        v-show="localCity"
        class="clear-btn"
        @click="clearInput"
        :disabled="isLoading"
      >
        ✕
      </button>
    </div>
    <button
      class="search-btn"
      @click="handleSearch"
      :disabled="isLoading || !localCity.trim()"
    >
      <span v-if="!isLoading">Search</span>
      <span v-else class="btn-loading">Searching...</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
    initialCity: {
      type: String,
      default: ''
    }
  },
  emits: ['search'],
  data() {
    return {
      localCity: this.initialCity
    }
  },
  methods: {
    handleSearch() {
      const city = this.localCity.trim()
      if (city && !this.isLoading) {
        this.$emit('search', city)
      }
    },
    clearInput() {
      this.localCity = ''
    }
  }
}
</script>

<style scoped>
.search-bar {
  display: flex;
  gap: 12px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.search-input-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 16px;
  font-size: 1.1rem;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 14px 44px 14px 48px;
  border: 2px solid #e2e8f0;
  border-radius: 14px;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s ease;
  background: white;
  color: #1e293b;
}

.search-input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.search-input:disabled {
  background: #f1f5f9;
  cursor: not-allowed;
}

.clear-btn {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 4px;
}

.clear-btn:hover {
  color: #64748b;
}

.search-btn {
  padding: 14px 28px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.search-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.search-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .search-bar {
    flex-direction: column;
  }
  .search-btn {
    width: 100%;
  }
}
</style>