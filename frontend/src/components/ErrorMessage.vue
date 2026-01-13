<template>
  <div v-if="message" class="error-message">
    <p>{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message?: string | null;
}

defineProps<Props>();
</script>

<style scoped>
.error-message {
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 4px;
  padding: 1rem;
  margin: 1rem 0;
  color: #c33;
}

.error-message p {
  margin: 0;
}
</style>
