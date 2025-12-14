<script setup lang="ts">
import { computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { Player } from '@/types/game.types';

interface Props {
  roster: Player[];
}

const props = defineProps<Props>();

const sortedRoster = computed(() => {
  return [...props.roster].sort((a, b) => a.number - b.number);
});

const formatPPG = (ppg: number): string => {
  return ppg.toFixed(1);
};
</script>

<template>
  <div class="bg-fcabl-dark-light rounded-lg shadow-2xl p-6">
    <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
      <font-awesome-icon :icon="['fas', 'users']" class="text-fcabl-accent" />
      Roster
    </h3>

    <!-- Desktop Table -->
    <div class="hidden md:block overflow-x-auto">
      <table class="table w-full">
        <thead>
          <tr class="border-b border-gray-700">
            <th class="text-gray-400 text-center">#</th>
            <th class="text-gray-400">Player Name</th>
            <th class="text-gray-400 text-center">PPG</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="player in sortedRoster"
            :key="player.id"
            class="hover:bg-fcabl-dark-light/50 transition-colors border-b border-gray-800"
          >
            <td class="text-center">
              <span class="badge badge-lg bg-fcabl-blue text-white border-0 font-bold">
                {{ player.number }}
              </span>
            </td>
            <td>
              <span class="font-semibold text-white text-lg">{{ player.name }}</span>
            </td>
            <td class="text-center">
              <span class="font-semibold text-fcabl-accent text-lg">{{ formatPPG(player.pointsPerGame) }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile Cards -->
    <div class="md:hidden space-y-3">
      <div
        v-for="player in sortedRoster"
        :key="player.id"
        class="card bg-fcabl-dark-light shadow-lg"
      >
        <div class="card-body p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="badge badge-lg bg-fcabl-blue text-white border-0 font-bold text-xl w-12 h-12">
                {{ player.number }}
              </div>
              <div>
                <h4 class="font-semibold text-white text-lg">{{ player.name }}</h4>
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-fcabl-accent">{{ formatPPG(player.pointsPerGame) }}</div>
              <div class="text-xs text-gray-400">PPG</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Roster Summary -->
    <div class="mt-4 pt-4 border-t border-gray-700 text-center text-gray-400 text-sm">
      {{ roster.length }} Players
    </div>
  </div>
</template>
