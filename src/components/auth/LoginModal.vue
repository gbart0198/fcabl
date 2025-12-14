<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { validators, validateField } from '@/utils/validation';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { LoginCredentials } from '@/types/auth.types';

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  close: [];
  switchToRegister: [];
}>();

const authStore = useAuthStore();

// Form data
const formData = ref<LoginCredentials>({
  email: '',
  password: '',
  rememberMe: false,
});

// Form errors
const errors = ref({
  email: '',
  password: '',
});

// Form touched state
const touched = ref({
  email: false,
  password: false,
});

// Validate individual fields
const validateEmail = () => {
  if (!touched.value.email) return;
  errors.value.email = validateField(formData.value.email, [
    { validate: validators.required, message: 'Email is required' },
    { validate: validators.email, message: 'Please enter a valid email' },
  ]);
};

const validatePassword = () => {
  if (!touched.value.password) return;
  errors.value.password = validateField(formData.value.password, [
    { validate: validators.required, message: 'Password is required' },
  ]);
};

// Mark field as touched
const markTouched = (field: 'email' | 'password') => {
  touched.value[field] = true;
};

// Check if form is valid
const isFormValid = computed(() => {
  return (
    formData.value.email &&
    formData.value.password &&
    !errors.value.email &&
    !errors.value.password
  );
});

// Handle form submission
const handleSubmit = async () => {
  // Mark all fields as touched
  touched.value.email = true;
  touched.value.password = true;

  // Validate all fields
  validateEmail();
  validatePassword();

  if (!isFormValid.value) {
    return;
  }

  const success = await authStore.login(formData.value);
  
  if (success) {
    // Reset form
    formData.value = {
      email: '',
      password: '',
      rememberMe: false,
    };
    touched.value = {
      email: false,
      password: false,
    };
    errors.value = {
      email: '',
      password: '',
    };
    emit('close');
  }
};

const handleClose = () => {
  // Reset form state
  formData.value = {
    email: '',
    password: '',
    rememberMe: false,
  };
  touched.value = {
    email: false,
    password: false,
  };
  errors.value = {
    email: '',
    password: '',
  };
  authStore.error = null;
  emit('close');
};
</script>

<template>
  <dialog :class="['modal', { 'modal-open': show }]">
    <div class="modal-box bg-fcabl-dark-light">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h3 class="font-bold text-2xl text-white">Login to FCABL</h3>
        <button @click="handleClose" class="btn btn-sm btn-circle btn-ghost">
          <font-awesome-icon :icon="['fas', 'times']" />
        </button>
      </div>

      <!-- Error Message -->
      <div v-if="authStore.error" class="alert alert-error mb-4">
        <font-awesome-icon :icon="['fas', 'exclamation-circle']" />
        <span>{{ authStore.error }}</span>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Email Field -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Email</span>
          </label>
          <input
            v-model="formData.email"
            @blur="markTouched('email'); validateEmail()"
            @input="validateEmail"
            type="email"
            placeholder="your@email.com"
            class="input input-bordered w-full"
            :class="{ 'input-error': errors.email && touched.email }"
          />
          <label v-if="errors.email && touched.email" class="label">
            <span class="label-text-alt text-error break-words whitespace-normal">{{ errors.email }}</span>
          </label>
        </div>

        <!-- Password Field -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Password</span>
          </label>
          <input
            v-model="formData.password"
            @blur="markTouched('password'); validatePassword()"
            @input="validatePassword"
            type="password"
            placeholder="Enter your password"
            class="input input-bordered w-full"
            :class="{ 'input-error': errors.password && touched.password }"
          />
          <label v-if="errors.password && touched.password" class="label">
            <span class="label-text-alt text-error break-words whitespace-normal">{{ errors.password }}</span>
          </label>
        </div>

        <!-- Remember Me & Forgot Password -->
        <div class="flex justify-between items-center">
          <label class="label cursor-pointer gap-2">
            <input v-model="formData.rememberMe" type="checkbox" class="checkbox checkbox-primary checkbox-sm" />
            <span class="label-text">Remember me</span>
          </label>
          <a href="#" class="text-sm text-fcabl-accent hover:underline">Forgot password?</a>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="btn btn-primary w-full bg-fcabl-blue hover:bg-fcabl-navy border-0 text-white"
          :class="{ loading: authStore.loading }"
          :disabled="authStore.loading || !isFormValid"
        >
          <font-awesome-icon v-if="!authStore.loading" :icon="['fas', 'sign-in-alt']" class="mr-2" />
          {{ authStore.loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <!-- Switch to Register -->
      <div class="divider">OR</div>
      <p class="text-center text-sm text-gray-400">
        Don't have an account?
        <button @click="emit('switchToRegister')" class="text-fcabl-accent hover:underline font-semibold">
          Register here
        </button>
      </p>
    </div>
    <form method="dialog" class="modal-backdrop" @click="handleClose">
      <button>close</button>
    </form>
  </dialog>
</template>
