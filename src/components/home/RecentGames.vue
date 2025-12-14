<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { mockRecentGames } from '@/data/mockData';

const games = mockRecentGames;

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
</script>

<template>
  <section class="py-16 bg-fcabl-dark">
    <div class="container mx-auto px-4">
      <!-- Section Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-2">Recent Games</h2>
          <p class="text-gray-400">Check out the latest game results</p>
        </div>
        <a href="#" class="hidden sm:flex btn btn-outline btn-sm text-gray-300 border-2 border-gray-600 hover:bg-fcabl-accent hover:border-fcabl-accent hover:text-white">
          View All
          <font-awesome-icon :icon="['fas', 'chevron-right']" class="ml-2" />
        </a>
      </div>

      <!-- Games Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="game in games"
          :key="game.id"
          class="card bg-fcabl-dark-light shadow-xl hover:shadow-2xl transition-shadow duration-300"
        >
          <div class="card-body">
            <!-- Game Status Badge -->
            <div class="flex justify-between items-start mb-4">
              <div class="badge badge-success badge-sm">FINAL</div>
              <font-awesome-icon :icon="['fas', 'basketball']" class="text-fcabl-accent text-xl" />
            </div>

            <!-- Teams and Scores -->
            <div class="space-y-3">
              <!-- Home Team -->
              <div class="flex justify-between items-center">
                <span class="text-lg font-semibold text-white">{{ game.homeTeam }}</span>
                <span class="text-2xl font-bold text-fcabl-accent">{{ game.homeScore }}</span>
              </div>

              <div class="divider my-1"></div>

              <!-- Away Team -->
              <div class="flex justify-between items-center">
                <span class="text-lg font-semibold text-white">{{ game.awayTeam }}</span>
                <span class="text-2xl font-bold" :class="game.awayScore && game.homeScore && game.awayScore > game.homeScore ? 'text-fcabl-accent' : 'text-gray-400'">
                  {{ game.awayScore }}
                </span>
              </div>
            </div>

            <!-- Game Info -->
            <div class="mt-4 pt-4 border-t border-gray-700">
              <div class="flex items-center text-sm text-gray-400 mb-2">
                <font-awesome-icon :icon="['fas', 'calendar']" class="mr-2" />
                {{ formatDate(game.date) }} at {{ game.time }}
              </div>
              <div class="flex items-center text-sm text-gray-400">
                <font-awesome-icon :icon="['fas', 'map-marker-alt']" class="mr-2" />
                {{ game.location }}
              </div>
            </div>

            <!-- View Details Link -->
            <div class="card-actions justify-end mt-4">
              <a href="#" class="btn btn-ghost btn-sm text-fcabl-accent">
                View Details
                <font-awesome-icon :icon="['fas', 'chevron-right']" class="ml-1" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile View All Button -->
      <div class="mt-8 text-center sm:hidden">
        <a href="#" class="btn btn-outline text-gray-300 border-2 border-gray-600 hover:bg-fcabl-accent hover:border-fcabl-accent hover:text-white">
          View All Games
          <font-awesome-icon :icon="['fas', 'chevron-right']" class="ml-2" />
        </a>
      </div>
    </div>
  </section>
</template>
