<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { scheduleService } from '@/services/api';
import type { GameWithDetails } from '@/types/game.types';
import ScheduleList from '@/components/schedule/ScheduleList.vue';

const allGames = ref<GameWithDetails[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    loading.value = true;
    error.value = null;
    allGames.value = await scheduleService.getAllGames();
  } catch (err) {
    error.value = 'Failed to load schedule';
    console.error('Error loading schedule:', err);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="min-h-screen bg-fcabl-dark">
    <!-- Header Section -->
    <section class="py-16 bg-fcabl-dark-light">
      <div class="container mx-auto px-4">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
            <font-awesome-icon :icon="['fas', 'calendar-alt']" class="text-fcabl-accent mr-3" />
            League Schedule
          </h1>
          <p class="text-gray-400 text-lg">Complete game schedule for all teams</p>
        </div>
      </div>
    </section>

    <!-- Schedule Content -->
    <section class="py-12">
      <div class="container mx-auto px-4 max-w-5xl">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <span class="loading loading-spinner loading-lg text-fcabl-accent"></span>
          <p class="text-gray-400 mt-4">Loading schedule...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
          <font-awesome-icon :icon="['fas', 'exclamation-circle']" class="text-error text-5xl mb-4" />
          <p class="text-error text-lg">{{ error }}</p>
        </div>

        <!-- Schedule List -->
        <ScheduleList 
          v-else
          :games="allGames"
          :group-by-date="true"
        />
      </div>
    </section>
  </div>
</template>
