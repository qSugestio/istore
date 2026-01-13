<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import Input from '../components/Input.vue';
import Button from '../components/Button.vue';
import ErrorMessage from '../components/ErrorMessage.vue';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const formError = ref<string | null>(null);

const handleLogin = async () => {
  formError.value = null;
  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    });
    router.push('/');
  } catch (err: any) {
    formError.value = authStore.error || 'Login failed';
  }
};
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1>Login</h1>
      <ErrorMessage v-if="formError" :message="formError" />
      <form @submit.prevent="handleLogin">
        <Input
          v-model="email"
          type="email"
          label="Email"
          id="email"
          placeholder="Enter your email"
          required
        />
        <Input
          v-model="password"
          type="password"
          label="Password"
          id="password"
          placeholder="Enter your password"
          required
        />
        <Button type="submit" :loading="authStore.loading" class="submit-btn">
          Login
        </Button>
      </form>
      <p class="auth-link">
        Don't have an account?
        <router-link to="/register">Register here</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.auth-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.auth-card h1 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #2c3e50;
}

.submit-btn {
  width: 100%;
  margin-top: 1rem;
}

.auth-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #7f8c8d;
}

.auth-link a {
  color: #3498db;
  text-decoration: none;
}
</style>
