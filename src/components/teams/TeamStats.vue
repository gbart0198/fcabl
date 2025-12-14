<script setup lang="ts">
import { computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { TeamDetail } from '@/types/game.types';

interface Props {
  team: TeamDetail;
}

const props = defineProps<Props>();

const formatPercentage = (value: number): string => {
  return (value * 100).toFixed(1) + '%';
};

const formatAverage = (value: number): string => {
  return value.toFixed(1);
};

const differentialClass = computed(() => {
  if (props.team.pointsFor - props.team.pointsAgainst > 0) {
    return 'text-success';
  } else if (props.team.pointsFor - props.team.pointsAgainst < 0) {
    return 'text-error';
  }
  return 'text-gray-400';
});

const differentialPrefix = computed(() => {
  const diff = props.team.pointsFor - props.team.pointsAgainst;
  return diff > 0 ? '+' : '';
});
</script>

<template>
  <div class="bg-fcabl-dark-light rounded-lg shadow-2xl p-6">
    <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
      <font-awesome-icon :icon="['fas', 'chart-bar']" class="text-fcabl-accent" />
      Team Statistics
    </h3>
    
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
      <!-- Record -->
      <div class="text-center">
        <div class="text-3xl font-bold text-white">{{ team.wins }}-{{ team.losses }}</div>
        <div class="text-sm text-gray-400">Record</div>
      </div>
      
      <!-- Win Percentage -->
      <div class="text-center">
        <div class="text-3xl font-bold text-fcabl-accent">{{ formatPercentage(team.winPercentage) }}</div>
        <div class="text-sm text-gray-400">Win %</div>
      </div>
      
      <!-- Points For -->
      <div class="text-center">
        <div class="text-3xl font-bold text-success">{{ team.pointsFor }}</div>
        <div class="text-sm text-gray-400">Points For</div>
        <div class="text-xs text-gray-500 mt-1">{{ formatAverage(team.avgPointsFor) }} avg</div>
      </div>
      
      <!-- Points Against -->
      <div class="text-center">
        <div class="text-3xl font-bold text-error">{{ team.pointsAgainst }}</div>
        <div class="text-sm text-gray-400">Points Against</div>
        <div class="text-xs text-gray-500 mt-1">{{ formatAverage(team.avgPointsAgainst) }} avg</div>
      </div>
      
      <!-- Point Differential -->
      <div class="text-center">
        <div class="text-3xl font-bold" :class="differentialClass">
          {{ differentialPrefix }}{{ team.pointsFor - team.pointsAgainst }}
        </div>
        <div class="text-sm text-gray-400">Point Diff</div>
      </div>
    </div>
  </div>
</template>
