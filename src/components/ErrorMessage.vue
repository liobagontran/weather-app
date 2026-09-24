<template>
  <div class="error-container">
    <div class="error-icon">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9.25" stroke="currentColor" stroke-width="1.8" />
        <line x1="12" y1="7.5" x2="12" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        <circle cx="12" cy="16.3" r="1.15" fill="currentColor" />
      </svg>
    </div>
    <h3 class="error-title">{{ title }}</h3>
    <p class="error-message">{{ message }}</p>
    <button class="retry-btn" @click="$emit('retry')">Try again</button>
  </div>
</template>

<script>
export default {
  name: 'ErrorMessage',
  props: {
    title: { type: String, default: 'Something went wrong' },
    message: { type: String, default: 'Please try again later.' }
  },
  emits: ['retry']
}
</script>

<style scoped>
.error-container {
  text-align: center;
  padding: 44px 32px;
  border-radius: 28px;
  max-width: 480px;
  margin: 40px auto 0;
  background: var(--md-error-container);
}

.error-icon {
  display: inline-flex;
  color: var(--md-on-error-container);
  margin-bottom: 12px;
}

.error-title {
  font-size: 1.15rem;
  font-weight: 500;
  margin: 0 0 6px 0;
  color: var(--md-on-error-container);
}

.error-message {
  font-size: 0.92rem;
  margin: 0 0 24px 0;
  line-height: 1.5;
  color: var(--md-on-error-container);
  opacity: 0.85;
}

.retry-btn {
  padding: 12px 32px;
  border: none;
  border-radius: 24px;
  background: var(--md-on-error-container);
  color: var(--md-error-container);
  font-size: 0.9rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: opacity 0.2s ease;
}
.retry-btn:hover { opacity: 0.85; }

@media (max-width: 520px) {
  .error-container { padding: 32px 20px; border-radius: 22px; }
}
</style>