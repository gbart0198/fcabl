<script setup lang="ts">
import { ref, onMounted, provide } from 'vue';
import { RouterView } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Navbar from '@/components/layout/Navbar.vue';
import Footer from '@/components/layout/Footer.vue';
import LoginModal from '@/components/auth/LoginModal.vue';
import RegisterModal from '@/components/auth/RegisterModal.vue';

const authStore = useAuthStore();

const showLoginModal = ref(false);
const showRegisterModal = ref(false);

const openLogin = () => {
  showRegisterModal.value = false;
  showLoginModal.value = true;
};

const openRegister = () => {
  showLoginModal.value = false;
  showRegisterModal.value = true;
};

const closeLogin = () => {
  showLoginModal.value = false;
};

const closeRegister = () => {
  showRegisterModal.value = false;
};

// Provide modal functions to child components
provide('openLogin', openLogin);
provide('openRegister', openRegister);

// Check authentication status on app load
onMounted(() => {
  authStore.checkAuth();
});
</script>

<template>
  <div id="app" class="min-h-screen flex flex-col bg-fcabl-dark text-gray-100">
    <!-- Navbar (visible on all pages) -->
    <Navbar @open-login="openLogin" @open-register="openRegister" />

    <!-- Main Content (router views) -->
    <main class="flex-1">
      <RouterView />
    </main>

    <!-- Footer (visible on all pages) -->
    <Footer />

    <!-- Authentication Modals (accessible from all pages) -->
    <LoginModal
      :show="showLoginModal"
      @close="closeLogin"
      @switch-to-register="openRegister"
    />
    <RegisterModal
      :show="showRegisterModal"
      @close="closeRegister"
      @switch-to-login="openLogin"
    />
  </div>
</template>

<style>
/* Additional global styles if needed */
</style>
