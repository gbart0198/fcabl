<script setup lang="ts">
import { ref, watch } from 'vue';
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

// Lock/unlock body scroll when sidebar opens/closes
watch(mobileMenuOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

const handleLogout = async () => {
  await authStore.logout();
  mobileMenuOpen.value = false;
};

// TODO: Make this configurable from the admin panel
const isPlayoffEnabled = ref(true);
</script>

<template>
  <nav class="navbar bg-fcabl-dark-light shadow-lg sticky top-0 z-50">
    <div class="container mx-auto px-4 flex items-center">
      <!-- Mobile: Sidebar Toggle & User Menu on Left -->
      <div class="lg:hidden flex items-center gap-2">
        <!-- Mobile Menu Toggle Button (Left Side) -->
        <button @click="toggleMobileMenu" class="btn btn-ghost btn-square">
          <font-awesome-icon :icon="['fas', 'bars']" class="text-2xl" />
        </button>

        <!-- Mobile User Menu (Authenticated) -->
        <template v-if="authStore.isAuthenticated">
          <div class="dropdown dropdown-end">
            <label tabindex="0" class="btn btn-ghost btn-sm text-gray-300">
              <font-awesome-icon :icon="['fas', 'user']" />
            </label>
            <ul tabindex="0"
              class="dropdown-content z-[60] menu p-2 shadow-xl bg-fcabl-dark-light rounded-box w-52 mt-2 left-0">
              <li class="menu-title text-gray-400">{{ authStore.userFullName }}</li>
              <li><router-link to="/profile" @click="mobileMenuOpen = false" class="text-gray-300">Profile</router-link>
              </li>
              <li><router-link to="/password-reset" @click="mobileMenuOpen = false" class="text-gray-300">Change
                  Password</router-link></li>
              <li><a @click="handleLogout" class="text-error">Logout</a></li>
            </ul>
          </div>
        </template>
      </div>

      <!-- Logo (Left for Mobile, Left-Center for Desktop) -->
      <div class="flex-1 lg:flex-none">
        <router-link to="/" class="btn btn-ghost normal-case text-xl lg:text-2xl font-bold text-fcabl-accent">
          <font-awesome-icon :icon="['fas', 'basketball']" class="mr-2" />
          FCABL
        </router-link>
      </div>

      <!-- Desktop Navigation -->
      <div class="hidden lg:flex lg:flex-1 lg:justify-center">
        <ul class="menu menu-horizontal px-1 text-lg font-medium">
          <li><router-link to="/" exact
              active-class="text-fcabl-accent bg-fcabl-dark/50 shadow-md ring-1 ring-fcabl-accent/30"
              class="text-gray-200 hover:text-white hover:bg-fcabl-dark/50">
              <font-awesome-icon :icon="['fas', 'home']" class="mr-2" />
              Home
            </router-link></li>
          <li><router-link to="/schedule"
              active-class="text-fcabl-accent bg-fcabl-dark/50 shadow-md ring-1 ring-fcabl-accent/30"
              class="text-gray-200 hover:text-white hover:bg-fcabl-dark/50">Schedule</router-link></li>
          <li><router-link to="/standings"
              active-class="text-fcabl-accent bg-fcabl-dark/50 shadow-md ring-1 ring-fcabl-accent/30"
              class="text-gray-200 hover:text-white hover:bg-fcabl-dark/50">Standings</router-link></li>
          <li><router-link to="/teams"
              active-class="text-fcabl-accent bg-fcabl-dark/50 shadow-md ring-1 ring-fcabl-accent/30"
              class="text-gray-200 hover:text-white hover:bg-fcabl-dark/50">Teams</router-link></li>
          <li v-if="isPlayoffEnabled"><router-link to="/playoffs"
              active-class="text-fcabl-accent bg-fcabl-dark/50 shadow-md ring-1 ring-fcabl-accent/30"
              class="text-gray-200 hover:text-white hover:bg-fcabl-dark/50">
              <font-awesome-icon :icon="['fas', 'medal']" class="mr-2" />
              Playoffs
            </router-link></li>
          <li v-if="authStore.isAdmin"><router-link to="/admin"
              active-class="text-fcabl-accent bg-fcabl-dark/50 shadow-md ring-1 ring-fcabl-accent/30"
              class="text-gray-200 hover:text-white hover:bg-fcabl-dark/50">Admin</router-link></li>
        </ul>
      </div>

      <!-- Desktop Auth Buttons -->
      <div class="hidden lg:flex gap-2 lg:flex-none">
        <template v-if="!authStore.isAuthenticated">
          <button @click="emit('openLogin')"
            class="btn btn-ghost btn-sm text-gray-300 hover:text-white hover:bg-fcabl-dark-light/50 ring-2 ring-gray-500 shadow-md hover:ring-gray-400">
            <font-awesome-icon :icon="['fas', 'sign-in-alt']" class="mr-2" />
            Login
          </button>
          <button @click="emit('openRegister')"
            class="btn btn-primary btn-sm bg-fcabl-blue hover:bg-fcabl-navy border-0 text-white">
            <font-awesome-icon :icon="['fas', 'user-plus']" class="mr-2" />
            Register
          </button>
        </template>
        <template v-else>
          <div class="dropdown dropdown-end">
            <label tabindex="0" class="btn btn-ghost btn-sm text-gray-300">
              <font-awesome-icon :icon="['fas', 'user']" class="mr-2" />
              {{ authStore.userFullName }}
            </label>
            <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-fcabl-dark-light rounded-box w-52 mt-2">
              <li><router-link to="/profile" class="text-gray-300">Profile</router-link></li>
              <li><router-link to="/password-reset" class="text-gray-300">Change Password</router-link></li>
              <li><a @click="handleLogout" class="text-error">Logout</a></li>
            </ul>
          </div>
        </template>
      </div>

      <!-- Mobile Auth Buttons (Not Authenticated) - Right Side -->
      <div class="lg:hidden flex items-center gap-2">
        <template v-if="!authStore.isAuthenticated">
          <button @click="emit('openLogin')"
            class="btn btn-ghost btn-sm text-gray-300 hover:text-white hover:bg-fcabl-dark-light/50 ring-2 ring-gray-500 shadow-md hover:ring-gray-400">
            <font-awesome-icon :icon="['fas', 'sign-in-alt']" />
          </button>
          <button @click="emit('openRegister')"
            class="btn btn-primary btn-sm bg-fcabl-blue hover:bg-fcabl-navy border-0 text-white">
            <font-awesome-icon :icon="['fas', 'user-plus']" />
          </button>
        </template>
      </div>
    </div>

    <!-- Mobile Sidebar Overlay -->
    <transition name="fade">
      <div 
        v-if="mobileMenuOpen" 
        @click="toggleMobileMenu"
        class="lg:hidden fixed inset-0 bg-black/50 z-40"
      />
    </transition>

    <!-- Mobile Sidebar Panel -->
    <transition name="slide">
      <div 
        v-if="mobileMenuOpen"
        class="lg:hidden fixed top-0 left-0 bottom-0 w-64 bg-fcabl-dark-light shadow-2xl z-50 overflow-y-auto"
      >
        <!-- Sidebar Header -->
        <div class="flex justify-between items-center p-4 border-b border-fcabl-gray/30">
          <router-link to="/" @click="toggleMobileMenu" class="text-xl font-bold text-fcabl-accent flex items-center gap-2">
            <font-awesome-icon :icon="['fas', 'basketball']" />
            FCABL
          </router-link>
          <button @click="toggleMobileMenu" class="btn btn-ghost btn-sm btn-square">
            <font-awesome-icon :icon="['fas', 'times']" class="text-xl" />
          </button>
        </div>

        <!-- Sidebar Navigation -->
        <ul class="menu p-4 space-y-1">
          <li>
            <router-link to="/" exact @click="toggleMobileMenu"
              active-class="text-fcabl-accent bg-fcabl-dark/50 font-semibold"
              class="text-gray-300 flex items-center gap-3">
              <font-awesome-icon :icon="['fas', 'home']" class="w-5" />
              <span>Home</span>
            </router-link>
          </li>
          <li>
            <router-link to="/schedule" @click="toggleMobileMenu"
              active-class="text-fcabl-accent bg-fcabl-dark/50 font-semibold"
              class="text-gray-300 flex items-center gap-3">
              <font-awesome-icon :icon="['fas', 'calendar']" class="w-5" />
              <span>Schedule</span>
            </router-link>
          </li>
          <li>
            <router-link to="/standings" @click="toggleMobileMenu"
              active-class="text-fcabl-accent bg-fcabl-dark/50 font-semibold"
              class="text-gray-300 flex items-center gap-3">
              <font-awesome-icon :icon="['fas', 'trophy']" class="w-5" />
              <span>Standings</span>
            </router-link>
          </li>
          <li>
            <router-link to="/teams" @click="toggleMobileMenu"
              active-class="text-fcabl-accent bg-fcabl-dark/50 font-semibold"
              class="text-gray-300 flex items-center gap-3">
              <font-awesome-icon :icon="['fas', 'users']" class="w-5" />
              <span>Teams</span>
            </router-link>
          </li>
          <li v-if="isPlayoffEnabled">
            <router-link to="/playoffs" @click="toggleMobileMenu"
              active-class="text-fcabl-accent bg-fcabl-dark/50 font-semibold"
              class="text-gray-300 flex items-center gap-3">
              <font-awesome-icon :icon="['fas', 'medal']" class="w-5" />
              <span>Playoffs</span>
            </router-link>
          </li>
          <li v-if="authStore.isAdmin">
            <router-link to="/admin" @click="toggleMobileMenu"
              active-class="text-fcabl-accent bg-fcabl-dark/50 font-semibold"
              class="text-gray-300 flex items-center gap-3">
              <font-awesome-icon :icon="['fas', 'cog']" class="w-5" />
              <span>Admin</span>
            </router-link>
          </li>
        </ul>
      </div>
    </transition>
  </nav>
</template>

<style scoped>
/* Fade transition for overlay backdrop */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Slide transition for sidebar */
.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s ease-out;
}
.slide-enter-from, .slide-leave-to {
  transform: translateX(-100%);
}
</style>
