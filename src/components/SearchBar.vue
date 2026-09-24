<template>
  <div class="search-bar">
    <div class="field" :class="{ focused: isFocused }">
      <svg class="field-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" />
        <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>

      <input
        v-model="localCity"
        type="text"
        class="field-input"
        placeholder="Search for a city"
        @keyup.enter="handleSearch"
        @focus="isFocused = true"
        @blur="isFocused = false"
        :disabled="isLoading"
      />

      <button
        v-show="localCity"
        class="clear-btn"
        @click="clearInput"
        :disabled="isLoading"
        aria-label="Clear"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </button>
    </div>

    <button
      class="search-btn"
      @click="handleSearch"
      :disabled="isLoading || !localCity.trim()"
    >
      <span v-if="!isLoading">Search</span>
      <span v-else class="btn-loading">
        <span class="dot"></span><span class="dot"></span><span class="dot"></span>
      </span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    isLoading: { type: Boolean, default: false },
    initialCity: { type: String, default: '' }
  },
  emits: ['search'],
  data() {
    return { localCity: this.initialCity, isFocused: false }
  },
  methods: {
    handleSearch() {
      const city = this.localCity.trim()
      if (city && !this.isLoading) this.$emit('search', city)
    },
    clearInput() { this.localCity = '' }
  }
}
</script>

<style scoped>
.search-bar {
  display: flex;
  gap: 10px;
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
}

.field {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  background: var(--md-surface-container-high);
  border-radius: 28px;
  border: 1.5px solid transparent;
  transition: border-color 0.2s ease, background 0.2s ease;
}
.field.focused {
  border-color: var(--md-primary);
  background: var(--md-surface-container-low);
}

.field-icon {
  position: absolute;
  left: 18px;
  color: var(--md-on-surface-variant);
  pointer-events: none;
}

.field-input {
  width: 100%;
  padding: 15px 44px 15px 50px;
  border: none;
  background: transparent;
  outline: none;
  font-size: 1rem;
  font-family: inherit;
  color: var(--md-on-surface);
}
.field-input::placeholder { color: var(--md-on-surface-variant); }
.field-input:disabled { opacity: 0.6; }

.clear-btn {
  position: absolute;
  right: 10px;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--md-on-surface-variant);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.clear-btn:hover { background: var(--md-surface-container); }

.search-btn {
  padding: 0 28px;
  min-height: 52px;
  min-width: 104px;
  border: none;
  border-radius: 28px;
  background: var(--md-primary);
  color: var(--md-on-primary);
  font-size: 0.95rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: opacity 0.2s ease, transform 0.15s ease;
}
.search-btn:hover:not(:disabled) { opacity: 0.9; }
.search-btn:active:not(:disabled) { transform: scale(0.97); }
.search-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.btn-loading { display: inline-flex; gap: 5px; align-items: center; }
.btn-loading .dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--md-on-primary);
  animation: bounce 1.2s infinite ease-in-out;
}
.btn-loading .dot:nth-child(2) { animation-delay: 0.15s; }
.btn-loading .dot:nth-child(3) { animation-delay: 0.3s; }
@keyframes bounce {
  0%, 80%, 100% { transform: scale(0.7); opacity: 0.6; }
  40% { transform: scale(1.1); opacity: 1; }
}

@media (max-width: 520px) {
  .search-bar { flex-direction: column; gap: 8px; }
  .field-input { padding: 13px 40px 13px 46px; font-size: 0.95rem; }
  .search-btn { width: 100%; min-height: 48px; }
}
</style>