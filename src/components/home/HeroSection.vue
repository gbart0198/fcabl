<script setup lang="ts">
import { inject } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Inject the openRegister function from App.vue
const openRegister = inject<() => void>('openRegister', () => {
  console.warn('openRegister function not provided');
});
</script>

<template>
  <section class="hero min-h-[60vh] lg:min-h-[70vh] bg-gradient-to-br from-fcabl-dark via-fcabl-navy to-fcabl-dark relative overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute top-10 left-10 text-9xl">
        <font-awesome-icon :icon="['fas', 'basketball']" />
      </div>
      <div class="absolute bottom-20 right-20 text-9xl">
        <font-awesome-icon :icon="['fas', 'basketball']" />
      </div>
    </div>

    <div class="hero-content text-center relative z-10">
      <div class="max-w-4xl">
        <!-- Basketball Icon -->
        <div class="mb-6">
          <font-awesome-icon :icon="['fas', 'basketball']" class="text-fcabl-accent text-6xl lg:text-7xl animate-bounce" />
        </div>

        <!-- Main Heading -->
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
          Fairfield County Adult Basketball League
        </h1>
        
        <!-- Abbreviation -->
        <p class="text-2xl md:text-3xl font-bold text-fcabl-accent mb-6">
          FCABL
        </p>

        <!-- Tagline -->
        <p class="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Where passion meets competition. Join the premier adult basketball league in Fairfield County.
          Competitive games, skilled players, and a community that loves the game.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button @click="openRegister" class="btn btn-primary btn-lg bg-fcabl-blue hover:bg-fcabl-navy border-0">
            <font-awesome-icon :icon="['fas', 'user-plus']" class="mr-2" />
            Join the League
          </button>
          <a href="#about" class="btn btn-outline btn-lg text-white border-2 border-white hover:bg-white hover:text-fcabl-dark">
            <font-awesome-icon :icon="['fas', 'info-circle']" class="mr-2" />
            Learn More
          </a>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-3 gap-4 mt-12 max-w-2xl mx-auto">
          <div class="stat bg-fcabl-dark-light/50 rounded-lg backdrop-blur-sm">
            <div class="stat-value text-fcabl-accent text-2xl md:text-3xl">6</div>
            <div class="stat-title text-gray-400 text-sm">Teams</div>
          </div>
          <div class="stat bg-fcabl-dark-light/50 rounded-lg backdrop-blur-sm">
            <div class="stat-value text-fcabl-accent text-2xl md:text-3xl">2025</div>
            <div class="stat-title text-gray-400 text-sm">Season</div>
          </div>
          <div class="stat bg-fcabl-dark-light/50 rounded-lg backdrop-blur-sm">
            <div class="stat-value text-fcabl-accent text-2xl md:text-3xl">60+</div>
            <div class="stat-title text-gray-400 text-sm">Players</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
