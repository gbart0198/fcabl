<script setup lang="ts">
import { ref } from 'vue';
import { authService } from '@/services/api';

const email = ref('');
const isSubmitting = ref(false);
const error = ref('');
const success = ref(false);
const touched = ref(false);

const validateEmail = () => {
  if (!touched.value) return true;
  if (!email.value.trim()) {
    error.value = 'Email is required';
    return false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    error.value = 'Please enter a valid email address';
    return false;
  }
  error.value = '';
  return true;
};

const handleSubmit = async () => {
  touched.value = true;
  if (!validateEmail()) return;

  isSubmitting.value = true;
  error.value = '';

  try {
    const response = await authService.requestPasswordReset(email.value);
    
    if (response.success) {
      success.value = true;
    } else {
      error.value = response.error || 'Failed to send reset email';
    }
  } catch (e) {
    error.value = 'An error occurred. Please try again.';
    console.error('Password reset request error:', e);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-fcabl-dark flex items-center justify-center px-4 py-12">
    <div class="max-w-md w-full">
      <div class="card bg-fcabl-dark-light shadow-xl">
        <div class="card-body">
          <!-- Success State -->
          <div v-if="success" class="text-center">
            <div class="text-6xl text-green-500 mb-4">
              <font-awesome-icon :icon="['fas', 'envelope']" />
            </div>
            <h2 class="text-2xl font-bold text-white mb-4">Check Your Email</h2>
            <p class="text-gray-300 mb-6">
              If an account exists with <strong>{{ email }}</strong>, you will receive an email with instructions to reset your password.
            </p>
            <p class="text-sm text-gray-400 mb-4">
              The link will expire in 30 minutes.
            </p>
            <router-link
              to="/"
              class="btn btn-primary bg-fcabl-blue hover:bg-fcabl-navy border-0 text-white w-full"
            >
              Return to Home
            </router-link>
          </div>

          <!-- Form State -->
          <div v-else>
            <div class="text-center mb-6">
              <div class="text-5xl text-fcabl-accent mb-3">
                <font-awesome-icon :icon="['fas', 'key']" />
              </div>
              <h2 class="text-2xl font-bold text-white">Reset Your Password</h2>
              <p class="text-gray-400 mt-2">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            <form @submit.prevent="handleSubmit" novalidate>
              <!-- Email Field -->
              <div class="form-control w-full mb-4">
                <label class="label">
                  <span class="label-text text-gray-300">Email Address</span>
                </label>
                <input
                  v-model="email"
                  @blur="touched = true; validateEmail()"
                  @input="validateEmail"
                  type="email"
                  placeholder="your.email@example.com"
                  class="input input-bordered w-full bg-fcabl-dark border-gray-600 text-white"
                  :class="{ 'input-error': error && touched }"
                  :disabled="isSubmitting"
                  autocomplete="email"
                />
                <label v-if="error && touched" class="label">
                  <span class="label-text-alt text-error break-words whitespace-normal">
                    {{ error }}
                  </span>
                </label>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                class="btn btn-primary bg-fcabl-blue hover:bg-fcabl-navy border-0 text-white w-full mb-4"
                :disabled="isSubmitting || !!error"
              >
                <font-awesome-icon
                  v-if="isSubmitting"
                  :icon="['fas', 'spinner']"
                  class="mr-2 animate-spin"
                />
                <font-awesome-icon v-else :icon="['fas', 'envelope']" class="mr-2" />
                <span v-if="isSubmitting">Sending...</span>
                <span v-else>Send Reset Link</span>
              </button>

              <!-- Back to Home -->
              <router-link
                to="/"
                class="btn btn-outline border-2 border-gray-600 hover:bg-fcabl-dark-light w-full"
              >
                Cancel
              </router-link>
            </form>
          </div>
        </div>
      </div>

      <!-- Additional Help -->
      <div class="text-center mt-6 text-gray-400 text-sm">
        <p>Remember your password?</p>
        <router-link to="/" class="text-fcabl-accent hover:underline">
          Return to home and login
        </router-link>
      </div>
    </div>
  </div>
</template>
