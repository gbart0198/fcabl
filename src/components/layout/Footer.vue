<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
</script>

<template>
  <footer class="footer footer-center p-10 bg-fcabl-dark-light text-base-content mt-auto">
    <div class="container mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-8">
        <!-- About Section -->
        <div class="text-left">
          <h3 class="font-bold text-lg mb-3 text-fcabl-accent">FCABL</h3>
          <p class="text-gray-400 text-sm">
            Fairfield County Adult Basketball League - Where passion meets competition.
          </p>
        </div>

        <!-- Quick Links -->
        <div class="text-left md:text-center">
          <h3 class="font-bold text-lg mb-3">Quick Links</h3>
          <ul class="text-gray-400 text-sm space-y-2">
            <li><a href="#" class="hover:text-fcabl-accent">About Us</a></li>
            <li><a href="#" class="hover:text-fcabl-accent">Rules</a></li>
            <li><a href="#" class="hover:text-fcabl-accent">Contact</a></li>
            <li><a href="#" class="hover:text-fcabl-accent">Privacy Policy</a></li>
          </ul>
        </div>

        <!-- Social Media -->
        <div class="text-left md:text-right">
          <h3 class="font-bold text-lg mb-3">Follow Us</h3>
          <div class="flex gap-4 md:justify-end">
            <a href="#" class="text-gray-400 hover:text-fcabl-accent transition-colors">
              <font-awesome-icon :icon="['fab', 'facebook']" class="text-2xl" />
            </a>
            <a href="#" class="text-gray-400 hover:text-fcabl-accent transition-colors">
              <font-awesome-icon :icon="['fab', 'twitter']" class="text-2xl" />
            </a>
            <a href="#" class="text-gray-400 hover:text-fcabl-accent transition-colors">
              <font-awesome-icon :icon="['fab', 'instagram']" class="text-2xl" />
            </a>
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div class="border-t border-gray-700 pt-6 w-full">
        <p class="text-gray-400 text-sm">
          Copyright © 2025 Fairfield County Adult Basketball League. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>
