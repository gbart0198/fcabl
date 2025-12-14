<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const authStore = useAuthStore();
const emit = defineEmits<{
  openLogin: [];
  openRegister: [];
}>();

const mobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const handleLogout = async () => {
  await authStore.logout();
  mobileMenuOpen.value = false;
};
</script>

<template>
  <nav class="navbar bg-fcabl-dark-light shadow-lg sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex-1">
        <router-link to="/" class="btn btn-ghost normal-case text-xl lg:text-2xl font-bold text-fcabl-accent">
          <font-awesome-icon :icon="['fas', 'basketball']" class="mr-2" />
          FCABL
        </router-link>
      </div>

      <!-- Desktop Navigation -->
      <div class="hidden lg:flex">
        <ul class="menu menu-horizontal px-1 text-base">
          <li><router-link to="/" class="text-gray-300 hover:text-white">Home</router-link></li>
          <li><router-link to="/schedule" class="text-gray-300 hover:text-white">Schedule</router-link></li>
          <li><router-link to="/standings" class="text-gray-300 hover:text-white">Standings</router-link></li>
          <li><router-link to="/teams" class="text-gray-300 hover:text-white">Teams</router-link></li>
        </ul>
      </div>

      <!-- Desktop Auth Buttons -->
      <div class="hidden lg:flex gap-2 ml-4">
        <template v-if="!authStore.isAuthenticated">
          <button @click="emit('openLogin')" class="btn btn-ghost btn-sm text-gray-300 hover:text-white hover:bg-fcabl-dark-light/50">
            <font-awesome-icon :icon="['fas', 'sign-in-alt']" class="mr-2" />
            Login
          </button>
          <button @click="emit('openRegister')" class="btn btn-primary btn-sm bg-fcabl-blue hover:bg-fcabl-navy border-0 text-white">
            <font-awesome-icon :icon="['fas', 'user-plus']" class="mr-2" />
            Register
          </button>
        </template>
        <template v-else>
          <div class="dropdown dropdown-end">
            <label tabindex="0" class="btn btn-ghost btn-sm text-gray-300">
              <font-awesome-icon :icon="['fas', 'user']" class="mr-2" />
              {{ authStore.user?.name }}
            </label>
            <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-52 mt-2">
              <li><a href="#">Profile</a></li>
              <li><a href="#">Settings</a></li>
              <li><a @click="handleLogout">Logout</a></li>
            </ul>
          </div>
        </template>
      </div>

      <!-- Mobile Menu Button -->
      <div class="lg:hidden">
        <button @click="toggleMobileMenu" class="btn btn-ghost btn-square">
          <font-awesome-icon :icon="['fas', 'bars']" class="text-2xl" />
        </button>
      </div>
    </div>

    <!-- Mobile Menu Drawer -->
    <div v-if="mobileMenuOpen" class="lg:hidden absolute top-full left-0 right-0 bg-fcabl-dark-light shadow-xl">
      <ul class="menu p-4">
        <li><router-link to="/" @click="toggleMobileMenu" class="text-gray-300">Home</router-link></li>
        <li><router-link to="/schedule" @click="toggleMobileMenu" class="text-gray-300">Schedule</router-link></li>
        <li><router-link to="/standings" @click="toggleMobileMenu" class="text-gray-300">Standings</router-link></li>
        <li><router-link to="/teams" @click="toggleMobileMenu" class="text-gray-300">Teams</router-link></li>
        <div class="divider my-2"></div>
        <template v-if="!authStore.isAuthenticated">
          <li>
            <button @click="emit('openLogin'); toggleMobileMenu()" class="text-gray-300 hover:bg-fcabl-dark/50">
              <font-awesome-icon :icon="['fas', 'sign-in-alt']" class="mr-2" />
              Login
            </button>
          </li>
          <li>
            <button @click="emit('openRegister'); toggleMobileMenu()" class="bg-fcabl-blue text-white font-semibold hover:bg-fcabl-navy">
              <font-awesome-icon :icon="['fas', 'user-plus']" class="mr-2" />
              Register
            </button>
          </li>
        </template>
        <template v-else>
          <li class="menu-title text-gray-400">{{ authStore.user?.name }}</li>
          <li><a href="#" @click="toggleMobileMenu" class="text-gray-300">Profile</a></li>
          <li><a href="#" @click="toggleMobileMenu" class="text-gray-300">Settings</a></li>
          <li><a @click="handleLogout" class="text-error">Logout</a></li>
        </template>
      </ul>
    </div>
  </nav>
</template>
