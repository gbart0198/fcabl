<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/services/api';

const props = defineProps<{
  token: string;
}>();

const router = useRouter();
const newPassword = ref('');
const confirmPassword = ref('');
const isSubmitting = ref(false);
const errors = ref({ newPassword: '', confirmPassword: '' });
const touched = ref({ newPassword: false, confirmPassword: false });
const success = ref(false);
const tokenError = ref('');

onMounted(() => {
  if (!props.token) {
    tokenError.value = 'Invalid reset link';
  }
});

const validatePassword = () => {
  if (!touched.value.newPassword) return true;
  
  if (!newPassword.value) {
    errors.value.newPassword = 'Password is required';
    return false;
  }
  
  if (newPassword.value.length < 8) {
    errors.value.newPassword = 'Password must be at least 8 characters';
    return false;
  }
  
  if (!/[A-Z]/.test(newPassword.value)) {
    errors.value.newPassword = 'Password must contain at least one uppercase letter';
    return false;
  }
  
  if (!/[a-z]/.test(newPassword.value)) {
    errors.value.newPassword = 'Password must contain at least one lowercase letter';
    return false;
  }
  
  if (!/[0-9]/.test(newPassword.value)) {
    errors.value.newPassword = 'Password must contain at least one number';
    return false;
  }
  
  errors.value.newPassword = '';
  return true;
};

const validateConfirmPassword = () => {
  if (!touched.value.confirmPassword) return true;
  
  if (!confirmPassword.value) {
    errors.value.confirmPassword = 'Please confirm your password';
    return false;
  }
  
  if (confirmPassword.value !== newPassword.value) {
    errors.value.confirmPassword = 'Passwords do not match';
    return false;
  }
  
  errors.value.confirmPassword = '';
  return true;
};

const handleSubmit = async () => {
  touched.value.newPassword = true;
  touched.value.confirmPassword = true;
  
  if (!validatePassword() || !validateConfirmPassword()) return;

  isSubmitting.value = true;

  try {
    const response = await authService.resetPassword(props.token, newPassword.value);
    
    if (response.success) {
      success.value = true;
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } else {
      tokenError.value = response.error || 'Failed to reset password';
    }
  } catch (e) {
    tokenError.value = 'An error occurred. Please try again or request a new reset link.';
    console.error('Password reset error:', e);
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
              <font-awesome-icon :icon="['fas', 'check-circle']" />
            </div>
            <h2 class="text-2xl font-bold text-white mb-4">Password Reset Successful!</h2>
            <p class="text-gray-300 mb-6">
              Your password has been updated. You can now login with your new password.
            </p>
            <p class="text-sm text-gray-400">
              Redirecting to home page...
            </p>
          </div>

          <!-- Error State -->
          <div v-else-if="tokenError" class="text-center">
            <div class="text-6xl text-error mb-4">
              <font-awesome-icon :icon="['fas', 'exclamation-triangle']" />
            </div>
            <h2 class="text-2xl font-bold text-white mb-4">Reset Link Invalid</h2>
            <p class="text-gray-300 mb-6">
              {{ tokenError }}
            </p>
            <router-link
              to="/password-reset"
              class="btn btn-primary bg-fcabl-blue hover:bg-fcabl-navy border-0 text-white w-full mb-2"
            >
              Request New Reset Link
            </router-link>
            <router-link
              to="/"
              class="btn btn-outline border-2 border-gray-600 hover:bg-fcabl-dark-light w-full"
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
              <h2 class="text-2xl font-bold text-white">Set New Password</h2>
              <p class="text-gray-400 mt-2">
                Choose a strong password for your account.
              </p>
            </div>

            <form @submit.prevent="handleSubmit" novalidate>
              <!-- New Password Field -->
              <div class="form-control w-full mb-4">
                <label class="label">
                  <span class="label-text text-gray-300">New Password</span>
                </label>
                <input
                  v-model="newPassword"
                  @blur="touched.newPassword = true; validatePassword()"
                  @input="validatePassword(); validateConfirmPassword()"
                  type="password"
                  placeholder="Enter new password"
                  class="input input-bordered w-full bg-fcabl-dark border-gray-600 text-white"
                  :class="{ 'input-error': errors.newPassword && touched.newPassword }"
                  :disabled="isSubmitting"
                  autocomplete="new-password"
                />
                <label v-if="errors.newPassword && touched.newPassword" class="label">
                  <span class="label-text-alt text-error break-words whitespace-normal">
                    {{ errors.newPassword }}
                  </span>
                </label>
                <label v-else class="label">
                  <span class="label-text-alt text-gray-400">
                    Must be 8+ characters with uppercase, lowercase, and number
                  </span>
                </label>
              </div>

              <!-- Confirm Password Field -->
              <div class="form-control w-full mb-6">
                <label class="label">
                  <span class="label-text text-gray-300">Confirm New Password</span>
                </label>
                <input
                  v-model="confirmPassword"
                  @blur="touched.confirmPassword = true; validateConfirmPassword()"
                  @input="validateConfirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  class="input input-bordered w-full bg-fcabl-dark border-gray-600 text-white"
                  :class="{ 'input-error': errors.confirmPassword && touched.confirmPassword }"
                  :disabled="isSubmitting"
                  autocomplete="new-password"
                />
                <label v-if="errors.confirmPassword && touched.confirmPassword" class="label">
                  <span class="label-text-alt text-error break-words whitespace-normal">
                    {{ errors.confirmPassword }}
                  </span>
                </label>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                class="btn btn-primary bg-fcabl-blue hover:bg-fcabl-navy border-0 text-white w-full mb-4"
                :disabled="isSubmitting || !!errors.newPassword || !!errors.confirmPassword"
              >
                <font-awesome-icon
                  v-if="isSubmitting"
                  :icon="['fas', 'spinner']"
                  class="mr-2 animate-spin"
                />
                <font-awesome-icon v-else :icon="['fas', 'key']" class="mr-2" />
                <span v-if="isSubmitting">Resetting Password...</span>
                <span v-else>Reset Password</span>
              </button>

              <!-- Cancel Button -->
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
    </div>
  </div>
</template>
