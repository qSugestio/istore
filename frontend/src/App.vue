<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from './stores/auth';
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';

const authStore = useAuthStore();

onMounted(() => {
  if (authStore.isAuthenticated) {
    authStore.fetchUser();
  }
});
</script>

<template>
  <div class="app">
    <AppHeader />
    <main class="main-content">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}
</style>
