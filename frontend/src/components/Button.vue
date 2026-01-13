<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="['btn', `btn-${variant}`, { 'btn-loading': loading }]"
    @click="$emit('click')"
  >
    <span v-if="loading" class="btn-spinner"></span>
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
}

withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  disabled: false,
  loading: false,
});

defineEmits<{
  click: [];
}>();
</script>

<style scoped>
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-secondary {
  background: #95a5a6;
  color: white;
}

.btn-danger {
  background: #e74c3c;
  color: white;
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
