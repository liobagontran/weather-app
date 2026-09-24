<template>
  <div class="loading-container">
    <div class="spinner"></div>
    <p class="loading-text">Fetching weather data...</p>
  </div>
</template>

<script>
export default {
  name: 'LoadingMessage'
}
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e2e8f0;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  margin-top: 20px;
  color: #64748b;
  font-size: 1rem;
  font-weight: 500;
}
</style>