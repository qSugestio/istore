<template>
  <div class="input-group">
    <label v-if="label" :for="id" class="input-label">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      class="input"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="error" class="input-error">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  id?: string;
  label?: string;
  type?: string;
  modelValue: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false,
});

defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>

<style scoped>
.input-group {
  margin-bottom: 1rem;
}

.input-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2c3e50;
}

.input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  color: #2c3e50;
  background: white;
  transition: border-color 0.2s;
}

.input:focus {
  outline: none;
  border-color: #3498db;
}

.input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.input-error {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #e74c3c;
}
</style>
