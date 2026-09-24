<template>
  <div class="loading-container">
    <svg class="spinner" width="44" height="44" viewBox="0 0 44 44">
      <circle
        class="spinner-track"
        cx="22" cy="22" r="18"
        fill="none" stroke-width="4"
      />
      <circle
        class="spinner-arc"
        cx="22" cy="22" r="18"
        fill="none" stroke-width="4"
        stroke-linecap="round"
      />
    </svg>
    <p class="loading-text">Fetching weather…</p>
  </div>
</template>

<script>
export default { name: 'LoadingMessage' }
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 20px;
}

.spinner { animation: spin 1.4s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.spinner-track { stroke: var(--md-surface-container-high); }
.spinner-arc {
  stroke: var(--md-primary);
  stroke-dasharray: 90;
  stroke-dashoffset: 60;
}

.loading-text {
  margin-top: 18px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--md-on-surface-variant);
}
</style>