<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const authStore = useAuthStore();
const router = useRouter();
const isLoggingOut = ref(false);

const handleLogout = async () => {
  isLoggingOut.value = true;
  try {
    await authStore.logout();
    router.push('/');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    isLoggingOut.value = false;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
</script>

<template>
  <div class="min-h-screen bg-fcabl-dark py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Profile Header -->
      <div class="card bg-fcabl-dark-light shadow-xl mb-6">
        <div class="card-body">
          <div class="flex items-center justify-between mb-4">
            <h1 class="text-3xl font-bold text-white">
              <font-awesome-icon :icon="['fas', 'user']" class="mr-3" />
              My Profile
            </h1>
            <button
              @click="handleLogout"
              class="btn btn-outline border-2 border-gray-600 hover:bg-red-600 hover:border-red-600"
              :disabled="isLoggingOut"
            >
              <font-awesome-icon :icon="['fas', 'sign-out-alt']" class="mr-2" />
              <span v-if="isLoggingOut">Logging out...</span>
              <span v-else>Logout</span>
            </button>
          </div>

          <div class="divider"></div>

          <!-- User Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-sm font-semibold text-gray-400 uppercase mb-2">Full Name</h3>
              <p class="text-lg text-white">{{ authStore.userFullName }}</p>
            </div>

            <div>
              <h3 class="text-sm font-semibold text-gray-400 uppercase mb-2">Email</h3>
              <p class="text-lg text-white">{{ authStore.user?.email }}</p>
            </div>

            <div>
              <h3 class="text-sm font-semibold text-gray-400 uppercase mb-2">Phone Number</h3>
              <p class="text-lg text-white">{{ authStore.user?.phoneNumber }}</p>
            </div>

            <div>
              <h3 class="text-sm font-semibold text-gray-400 uppercase mb-2">Role</h3>
              <div class="badge badge-primary badge-lg">
                {{ authStore.user?.role }}
              </div>
            </div>

            <div>
              <h3 class="text-sm font-semibold text-gray-400 uppercase mb-2">Member Since</h3>
              <p class="text-lg text-white">{{ formatDate(authStore.user?.createdAt || '') }}</p>
            </div>

            <div>
              <h3 class="text-sm font-semibold text-gray-400 uppercase mb-2">User ID</h3>
              <p class="text-sm text-gray-400 font-mono">{{ authStore.user?.id }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card bg-fcabl-dark-light shadow-xl">
        <div class="card-body">
          <h2 class="text-2xl font-bold text-white mb-4">Quick Actions</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <router-link
              to="/password-reset"
              class="btn btn-outline border-2 border-gray-600 hover:bg-fcabl-accent hover:border-fcabl-accent"
            >
              <font-awesome-icon :icon="['fas', 'key']" class="mr-2" />
              Change Password
            </router-link>

            <button
              class="btn btn-outline border-2 border-gray-600 hover:bg-fcabl-blue hover:border-fcabl-blue"
              disabled
            >
              <font-awesome-icon :icon="['fas', 'edit']" class="mr-2" />
              Edit Profile (Coming Soon)
            </button>
          </div>
        </div>
      </div>

      <!-- Admin Link (if admin) -->
      <div v-if="authStore.isAdmin" class="card bg-fcabl-dark-light shadow-xl mt-6">
        <div class="card-body">
          <h2 class="text-2xl font-bold text-white mb-4">Admin</h2>
          <router-link
            to="/admin"
            class="btn btn-primary bg-fcabl-blue hover:bg-fcabl-navy border-0 text-white"
          >
            <font-awesome-icon :icon="['fas', 'user-shield']" class="mr-2" />
            Go to Admin Dashboard
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
