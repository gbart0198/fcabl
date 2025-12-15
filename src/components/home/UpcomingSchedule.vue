<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { mockUpcomingGames } from '@/data/mockData';
import { RouterLink } from 'vue-router';

const games = mockUpcomingGames;

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};
</script>

<template>
  <section class="py-16 bg-fcabl-dark">
    <div class="container mx-auto px-4">
      <!-- Section Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-2">
            <font-awesome-icon :icon="['fas', 'calendar']" class="text-fcabl-accent mr-3" />
            Upcoming Schedule
          </h2>
          <p class="text-gray-400">Don't miss the next games</p>
        </div>
        <RouterLink to="/schedule" class="hidden sm:flex btn btn-outline btn-sm text-gray-300 border-2 border-gray-600 hover:bg-fcabl-accent hover:border-fcabl-accent hover:text-white">
          Full Schedule
          <font-awesome-icon :icon="['fas', 'chevron-right']" class="ml-2" />
        </RouterLink>
      </div>

      <!-- Desktop Table -->
      <div class="hidden md:block overflow-x-auto bg-fcabl-dark-light rounded-lg shadow-xl">
        <table class="table w-full">
          <thead>
            <tr class="border-b border-gray-700">
              <th class="text-gray-400">Date</th>
              <th class="text-gray-400">Time</th>
              <th class="text-gray-400">Matchup</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="game in games"
              :key="game.id"
              class="hover:bg-fcabl-dark/50 transition-colors border-b border-gray-800"
            >
              <td class="font-semibold text-white">{{ formatDate(game.date) }}</td>
              <td class="text-gray-300">{{ game.time }}</td>
              <td>
                <div class="flex items-center gap-2">
                  <span class="font-semibold text-white">{{ game.homeTeam }}</span>
                  <span class="text-gray-500">vs</span>
                  <span class="font-semibold text-white">{{ game.awayTeam }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Cards -->
      <div class="md:hidden space-y-4">
        <div
          v-for="game in games"
          :key="game.id"
          class="card bg-fcabl-dark-light shadow-xl"
        >
          <div class="card-body p-5">
            <!-- Date and Time -->
            <div class="flex items-center gap-3 mb-3">
              <div class="bg-fcabl-accent text-fcabl-dark rounded-lg p-3 text-center min-w-[60px]">
                <div class="text-xs font-semibold">{{ new Date(game.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase() }}</div>
                <div class="text-2xl font-bold">{{ new Date(game.date).getDate() }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-400">{{ formatDate(game.date) }}</div>
                <div class="text-lg font-semibold text-white">{{ game.time }}</div>
              </div>
            </div>

            <!-- Teams -->
            <div class="flex items-center justify-center gap-3 my-4">
              <span class="text-lg font-bold text-white">{{ game.homeTeam }}</span>
              <span class="text-fcabl-accent font-bold">VS</span>
              <span class="text-lg font-bold text-white">{{ game.awayTeam }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile View All Button -->
      <div class="mt-8 text-center sm:hidden">
        <RouterLink to="/schedule" class="btn btn-outline text-gray-300 border-2 border-gray-600 hover:bg-fcabl-accent hover:border-fcabl-accent hover:text-white">
          Full Schedule
          <font-awesome-icon :icon="['fas', 'chevron-right']" class="ml-2" />
        </RouterLink>
      </div>
    </div>
  </section>
</template>
