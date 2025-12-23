<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { GameWithDetails } from '@/types/game.types';
import ScheduleList from '@/components/schedule/ScheduleList.vue';

interface Props {
  games: GameWithDetails[];
  teamId: number;
}

const props = defineProps<Props>();
</script>

<template>
  <div class="bg-fcabl-dark-light rounded-lg shadow-2xl p-6">
    <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
      <font-awesome-icon :icon="['fas', 'calendar']" class="text-fcabl-accent" />
      Schedule & Results
    </h3>
    
    <ScheduleList 
      :games="games" 
      :team-id="teamId"
      :group-by-date="false"
    />
  </div>
</template>
