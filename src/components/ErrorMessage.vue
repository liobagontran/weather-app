<template>
  <div class="error-container">
    <div class="error-icon">⚠️</div>
    <h3 class="error-title">{{ title }}</h3>
    <p class="error-message">{{ message }}</p>
    <button class="retry-btn" @click="$emit('retry')">
      Try Again
    </button>
  </div>
</template>

<script>
export default {
  name: 'ErrorMessage',
  props: {
    title: {
      type: String,
      default: 'Something went wrong'
    },
    message: {
      type: String,
      default: 'Please try again later.'
    }
  },
  emits: ['retry']
}
</script>

<style scoped>
.error-container {
  text-align: center;
  padding: 48px 24px;
  background: white;
  border-radius: 24px;
  max-width: 480px;
  margin: 0 auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
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

.error-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.error-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.error-message {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0 0 24px 0;
  line-height: 1.5;
}

.retry-btn {
  padding: 12px 32px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}
</style>