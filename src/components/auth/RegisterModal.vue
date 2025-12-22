<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { validators, validateField } from '@/utils/validation';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { RegisterData } from '@/types/auth.types';

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  close: [];
  switchToLogin: [];
}>();

const authStore = useAuthStore();

// Form data
const formData = ref<RegisterData>({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false,
});

// Form errors
const errors = ref({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: '',
});

// Form touched state
const touched = ref({
  firstName: false,
  lastName: false,
  email: false,
  phoneNumber: false,
  password: false,
  confirmPassword: false,
  agreeToTerms: false,
});

// Validate individual fields
const validateFirstName = () => {
  if (!touched.value.firstName) return;
  errors.value.firstName = validateField(formData.value.firstName, [
    { validate: validators.required, message: 'First name is required' },
    { validate: validators.minLength(2), message: 'First name must be at least 2 characters' },
  ]);
};

const validateLastName = () => {
  if (!touched.value.lastName) return;
  errors.value.lastName = validateField(formData.value.lastName, [
    { validate: validators.required, message: 'Last name is required' },
    { validate: validators.minLength(2), message: 'Last name must be at least 2 characters' },
  ]);
};

const validatePhoneNumber = () => {
  if (!touched.value.phoneNumber) return;
  errors.value.phoneNumber = validateField(formData.value.phoneNumber, [
    { validate: validators.required, message: 'Phone number is required' },
  ]);
};

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
    { validate: validators.passwordStrength, message: 'Password must be at least 8 characters with uppercase, lowercase, and number' },
  ]);
  // Also validate confirm password if it's been touched
  if (touched.value.confirmPassword) {
    validateConfirmPassword();
  }
};

const validateConfirmPassword = () => {
  if (!touched.value.confirmPassword) return;
  errors.value.confirmPassword = validateField(formData.value.confirmPassword, [
    { validate: validators.required, message: 'Please confirm your password' },
    { validate: validators.matchesField(formData.value.password), message: 'Passwords do not match' },
  ]);
};

const validateTerms = () => {
  if (!touched.value.agreeToTerms) return;
  errors.value.agreeToTerms = formData.value.agreeToTerms ? '' : 'You must agree to the terms and conditions';
};

// Mark field as touched
const markTouched = (field: keyof typeof touched.value) => {
  touched.value[field] = true;
};

// Check if form is valid
const isFormValid = computed(() => {
  return (
    formData.value.firstName &&
    formData.value.lastName &&
    formData.value.email &&
    formData.value.phoneNumber &&
    formData.value.password &&
    formData.value.confirmPassword &&
    formData.value.agreeToTerms &&
    !errors.value.firstName &&
    !errors.value.lastName &&
    !errors.value.phoneNumber &&
    !errors.value.email &&
    !errors.value.password &&
    !errors.value.confirmPassword
  );
});

// Handle form submission
const handleSubmit = async () => {
  console.log('Register form submitted');
  
  // Mark all fields as touched
  touched.value.firstName = true;
  touched.value.lastName = true;
  touched.value.email = true;
  touched.value.phoneNumber = true;
  touched.value.password = true;
  touched.value.confirmPassword = true;
  touched.value.agreeToTerms = true;

  // Validate all fields
  validateFirstName();
  validateLastName();
  validatePhoneNumber();
  validateEmail();
  validatePassword();
  validateConfirmPassword();
  validateTerms();

  console.log('Form data:', formData.value);
  console.log('Form errors:', errors.value);
  console.log('Form valid:', isFormValid.value);

  if (!isFormValid.value) {
    console.log('Form validation failed');
    return;
  }

  console.log('Calling authStore.register...');
  const success = await authStore.register(formData.value);
  console.log('Register success:', success);
  
  if (success) {
    // Reset form
    formData.value = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    };
    touched.value = {
      firstName: false,
      lastName: false,
      email: false,
      phoneNumber: false,
      password: false,
      confirmPassword: false,
      agreeToTerms: false,
    };
    errors.value = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: '',
    };
    emit('close');
  }
};

const handleClose = () => {
  // Reset form state
  formData.value = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  };
  touched.value = {
    firstName: false,
    lastName: false,
    email: false,
    phoneNumber: false,
    password: false,
    confirmPassword: false,
    agreeToTerms: false,
  };
  errors.value = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: '',
  };
  authStore.error = null;
  emit('close');
};
</script>

<template>
  <dialog :class="['modal', { 'modal-open': show }]">
    <div class="modal-box bg-fcabl-dark-light max-w-[95vw] sm:max-w-lg p-4 sm:p-6 mx-2">
      <!-- Header -->
      <div class="flex justify-between items-center mb-4 sm:mb-6">
        <h3 class="font-bold text-xl sm:text-2xl text-white">Join FCABL</h3>
        <button @click="handleClose" class="btn btn-sm btn-circle btn-ghost">
          <font-awesome-icon :icon="['fas', 'times']" />
        </button>
      </div>

      <!-- Error Message -->
      <div v-if="authStore.error" class="alert alert-error mb-4">
        <font-awesome-icon :icon="['fas', 'exclamation-circle']" />
        <span>{{ authStore.error }}</span>
      </div>

      <!-- Register Form -->
      <form @submit.prevent="handleSubmit" class="space-y-3 sm:space-y-4">
        <!-- First Name Field -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">First Name</span>
          </label>
          <input
            v-model="formData.firstName"
            @blur="markTouched('firstName'); validateFirstName()"
            @input="validateFirstName"
            type="text"
            placeholder="John"
            class="input input-bordered w-full"
            :class="{ 'input-error': errors.firstName && touched.firstName }"
          />
          <label v-if="errors.firstName && touched.firstName" class="label">
            <span class="label-text-alt text-error break-words whitespace-normal">{{ errors.firstName }}</span>
          </label>
        </div>

        <!-- Last Name Field -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Last Name</span>
          </label>
          <input
            v-model="formData.lastName"
            @blur="markTouched('lastName'); validateLastName()"
            @input="validateLastName"
            type="text"
            placeholder="Doe"
            class="input input-bordered w-full"
            :class="{ 'input-error': errors.lastName && touched.lastName }"
          />
          <label v-if="errors.lastName && touched.lastName" class="label">
            <span class="label-text-alt text-error break-words whitespace-normal">{{ errors.lastName }}</span>
          </label>
        </div>

        <!-- Phone Number Field -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Phone Number</span>
          </label>
          <input
            v-model="formData.phoneNumber"
            @blur="markTouched('phoneNumber'); validatePhoneNumber()"
            @input="validatePhoneNumber"
            type="tel"
            placeholder="(203) 555-1234"
            class="input input-bordered w-full"
            :class="{ 'input-error': errors.phoneNumber && touched.phoneNumber }"
          />
          <label v-if="errors.phoneNumber && touched.phoneNumber" class="label">
            <span class="label-text-alt text-error break-words whitespace-normal">{{ errors.phoneNumber }}</span>
          </label>
        </div>

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
            placeholder="Create a strong password"
            class="input input-bordered w-full"
            :class="{ 'input-error': errors.password && touched.password }"
          />
          <label v-if="errors.password && touched.password" class="label">
            <span class="label-text-alt text-error break-words whitespace-normal">{{ errors.password }}</span>
          </label>
        </div>

        <!-- Confirm Password Field -->
        <div class="form-control">
          <label class="label">
            <span class="label-text">Confirm Password</span>
          </label>
          <input
            v-model="formData.confirmPassword"
            @blur="markTouched('confirmPassword'); validateConfirmPassword()"
            @input="validateConfirmPassword"
            type="password"
            placeholder="Confirm your password"
            class="input input-bordered w-full"
            :class="{ 'input-error': errors.confirmPassword && touched.confirmPassword }"
          />
          <label v-if="errors.confirmPassword && touched.confirmPassword" class="label">
            <span class="label-text-alt text-error break-words whitespace-normal">{{ errors.confirmPassword }}</span>
          </label>
        </div>

        <!-- Terms and Conditions -->
        <div class="form-control">
          <label class="label cursor-pointer justify-start gap-3">
            <input
              v-model="formData.agreeToTerms"
              @change="markTouched('agreeToTerms'); validateTerms()"
              type="checkbox"
              class="checkbox checkbox-primary"
              :class="{ 'checkbox-error': errors.agreeToTerms && touched.agreeToTerms }"
            />
            <span class="label-text">
              I agree to the <a href="#" class="text-fcabl-accent hover:underline">Terms and Conditions</a>
            </span>
          </label>
          <label v-if="errors.agreeToTerms && touched.agreeToTerms" class="label">
            <span class="label-text-alt text-error break-words whitespace-normal">{{ errors.agreeToTerms }}</span>
          </label>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="btn btn-primary w-full bg-fcabl-blue hover:bg-fcabl-navy border-0 text-white"
          :class="{ loading: authStore.loading }"
          :disabled="authStore.loading || !isFormValid"
        >
          <font-awesome-icon v-if="!authStore.loading" :icon="['fas', 'user-plus']" class="mr-2" />
          {{ authStore.loading ? 'Creating account...' : 'Create Account' }}
        </button>
      </form>

      <!-- Switch to Login -->
      <div class="divider">OR</div>
      <p class="text-center text-sm text-gray-400">
        Already have an account?
        <button @click="emit('switchToLogin')" class="text-fcabl-accent hover:underline font-semibold">
          Login here
        </button>
      </p>
    </div>
    <form method="dialog" class="modal-backdrop" @click="handleClose">
      <button>close</button>
    </form>
  </dialog>
</template>
