<script setup lang="ts">
import { ref } from 'vue';
import GameResultEntry from '@/components/admin/GameResultEntry.vue';
import TeamManagement from '@/components/admin/TeamManagement.vue';
import ScheduleManagement from '@/components/admin/ScheduleManagement.vue';
import PlayerManagement from '@/components/admin/PlayerManagement.vue';

// Active tab state - default to 'game-results' (most used feature)
const activeTab = ref('game-results');

const setActiveTab = (tab: string) => {
  activeTab.value = tab;
};
</script>

<template>
  <div class="min-h-screen bg-fcabl-dark py-8">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="flex justify-center items-center gap-3 mb-2">
          <font-awesome-icon icon="user-shield" class="text-fcabl-accent text-4xl" />
          <h1 class="text-4xl font-bold text-white">Admin Dashboard</h1>
        </div>
        <p class="text-gray-400 text-lg">Manage teams, schedules, players, and game results</p>
      </div>

      <!-- Tabs Navigation -->
      <div class="flex flex-wrap justify-center gap-3 mb-6">
        <button 
          @click="setActiveTab('game-results')"
          :class="[
            'px-6 py-3 rounded-lg border-2 font-semibold transition-all duration-200 flex items-center gap-2',
            activeTab === 'game-results' 
              ? 'bg-fcabl-accent text-white border-fcabl-accent shadow-lg' 
              : 'bg-fcabl-dark-light text-gray-400 border-gray-600 hover:border-fcabl-accent hover:text-white'
          ]"
        >
          <font-awesome-icon icon="list-alt" />
          <span>Game Results</span>
        </button>
        <button 
          @click="setActiveTab('teams')"
          :class="[
            'px-6 py-3 rounded-lg border-2 font-semibold transition-all duration-200 flex items-center gap-2',
            activeTab === 'teams' 
              ? 'bg-fcabl-accent text-white border-fcabl-accent shadow-lg' 
              : 'bg-fcabl-dark-light text-gray-400 border-gray-600 hover:border-fcabl-accent hover:text-white'
          ]"
        >
          <font-awesome-icon icon="users" />
          <span>Teams</span>
        </button>
        <button 
          @click="setActiveTab('schedule')"
          :class="[
            'px-6 py-3 rounded-lg border-2 font-semibold transition-all duration-200 flex items-center gap-2',
            activeTab === 'schedule' 
              ? 'bg-fcabl-accent text-white border-fcabl-accent shadow-lg' 
              : 'bg-fcabl-dark-light text-gray-400 border-gray-600 hover:border-fcabl-accent hover:text-white'
          ]"
        >
          <font-awesome-icon icon="calendar" />
          <span>Schedule</span>
        </button>
        <button 
          @click="setActiveTab('players')"
          :class="[
            'px-6 py-3 rounded-lg border-2 font-semibold transition-all duration-200 flex items-center gap-2',
            activeTab === 'players' 
              ? 'bg-fcabl-accent text-white border-fcabl-accent shadow-lg' 
              : 'bg-fcabl-dark-light text-gray-400 border-gray-600 hover:border-fcabl-accent hover:text-white'
          ]"
        >
          <font-awesome-icon icon="user" />
          <span>Players</span>
        </button>
      </div>

      <!-- Tab Content -->
      <div class="bg-fcabl-dark-light rounded-lg shadow-xl p-6">
        <!-- Game Results Tab -->
        <div v-show="activeTab === 'game-results'">
          <GameResultEntry />
        </div>

        <!-- Teams Tab -->
        <div v-show="activeTab === 'teams'">
          <TeamManagement />
        </div>

        <!-- Schedule Tab -->
        <div v-show="activeTab === 'schedule'">
          <ScheduleManagement />
        </div>

        <!-- Players Tab -->
        <div v-show="activeTab === 'players'">
          <PlayerManagement />
        </div>
      </div>
    </div>
  </div>
</template>
