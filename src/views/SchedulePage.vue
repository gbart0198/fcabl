<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { scheduleService } from '@/services/api';
import type { Game } from '@/types/game.types';

const allGames = ref<Game[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const expandedGameIds = ref<Set<string>>(new Set());

// Group games by date
const gamesByDate = computed(() => {
  const grouped = new Map<string, Game[]>();
  
  allGames.value.forEach(game => {
    if (!grouped.has(game.date)) {
      grouped.set(game.date, []);
    }
    grouped.get(game.date)!.push(game);
  });
  
  // Sort games within each date by time
  grouped.forEach((games) => {
    games.sort((a, b) => {
      const timeA = new Date(`${a.date} ${a.time}`).getTime();
      const timeB = new Date(`${b.date} ${b.time}`).getTime();
      return timeA - timeB;
    });
  });
  
  // Convert to array and sort by date (oldest first)
  return Array.from(grouped.entries())
    .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime());
});

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('en-US', options);
};

const isCompleted = (game: Game): boolean => {
  return game.status === 'completed';
};

const isExpanded = (gameId: string): boolean => {
  return expandedGameIds.value.has(gameId);
};

const toggleGameDetails = (gameId: string) => {
  if (expandedGameIds.value.has(gameId)) {
    expandedGameIds.value.delete(gameId);
  } else {
    expandedGameIds.value.add(gameId);
  }
};

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

        <!-- Schedule by Date -->
        <div v-else-if="gamesByDate.length > 0" class="space-y-8">
          <div
            v-for="[date, games] in gamesByDate"
            :key="date"
            class="bg-fcabl-dark-light rounded-lg shadow-xl p-6"
          >
            <!-- Date Header -->
            <h2 class="text-2xl font-bold text-white mb-4 pb-3 border-b border-gray-700">
              {{ formatDate(date) }}
            </h2>

            <!-- Games for this date -->
            <div class="space-y-3">
              <div
                v-for="game in games"
                :key="game.id"
                class="card bg-fcabl-dark shadow-md transition-shadow"
                :class="{ 'hover:shadow-lg cursor-pointer': isCompleted(game) }"
              >
                <!-- Main Game Card -->
                <div 
                  class="card-body p-4"
                  @click="isCompleted(game) ? toggleGameDetails(game.id) : null"
                >
                  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <!-- Time -->
                    <div class="text-sm font-semibold text-gray-400 sm:w-24">
                      {{ game.time }}
                    </div>

                    <!-- Teams & Score -->
                    <div class="flex-1">
                      <div class="flex items-center justify-center gap-3">
                        <!-- Away Team -->
                        <span class="text-white font-semibold text-right flex-1">
                          {{ game.awayTeam }}
                        </span>

                        <!-- Score or @ symbol -->
                        <div class="text-center w-20">
                          <template v-if="isCompleted(game)">
                            <span class="text-lg font-bold">
                              <span class="text-white">{{ game.awayScore }}</span>
                              <span class="text-gray-500 mx-1">-</span>
                              <span class="text-white">{{ game.homeScore }}</span>
                            </span>
                          </template>
                          <template v-else>
                            <span class="text-gray-400 font-semibold">@</span>
                          </template>
                        </div>

                        <!-- Home Team -->
                        <span class="text-white font-semibold text-left flex-1">
                          {{ game.homeTeam }}
                        </span>
                      </div>

                      <!-- Location (only for scheduled games) -->
                      <div v-if="!isCompleted(game)" class="text-center text-xs text-gray-500 mt-1">
                        <font-awesome-icon :icon="['fas', 'map-marker-alt']" class="mr-1" />
                        {{ game.location }}
                      </div>
                    </div>

                    <!-- Status Badge & Expand Icon -->
                    <div class="flex items-center gap-2 justify-center sm:justify-end sm:w-24">
                      <span
                        v-if="isCompleted(game)"
                        class="badge badge-success badge-sm"
                      >
                        Final
                      </span>
                      <span
                        v-else
                        class="badge badge-outline badge-sm text-gray-400 border-gray-600"
                      >
                        Scheduled
                      </span>
                      <font-awesome-icon 
                        v-if="isCompleted(game)"
                        :icon="['fas', isExpanded(game.id) ? 'chevron-up' : 'chevron-down']" 
                        class="text-gray-400 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <!-- Expanded Game Details -->
                <div 
                  v-if="isCompleted(game) && isExpanded(game.id) && game.details"
                  class="border-t border-gray-700 p-4 bg-fcabl-dark-light"
                >
                  <!-- Half-Time Scores -->
                  <div class="mb-4">
                    <h4 class="text-sm font-semibold text-gray-400 mb-2 uppercase">Score by Half</h4>
                    <div class="grid grid-cols-2 gap-4">
                      <!-- Away Team Halves -->
                      <div class="text-center">
                        <div class="text-xs text-gray-400 mb-1">{{ game.awayTeam }}</div>
                        <div class="flex justify-center gap-4 text-sm">
                          <span class="text-white">
                            <span class="text-gray-500">1st:</span> {{ game.details.awayFirstHalf }}
                          </span>
                          <span class="text-white">
                            <span class="text-gray-500">2nd:</span> {{ game.details.awaySecondHalf }}
                          </span>
                        </div>
                      </div>
                      <!-- Home Team Halves -->
                      <div class="text-center">
                        <div class="text-xs text-gray-400 mb-1">{{ game.homeTeam }}</div>
                        <div class="flex justify-center gap-4 text-sm">
                          <span class="text-white">
                            <span class="text-gray-500">1st:</span> {{ game.details.homeFirstHalf }}
                          </span>
                          <span class="text-white">
                            <span class="text-gray-500">2nd:</span> {{ game.details.homeSecondHalf }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Player Statistics -->
                  <div class="grid md:grid-cols-2 gap-4">
                    <!-- Away Team Players -->
                    <div>
                      <h4 class="text-sm font-semibold text-gray-400 mb-2 uppercase">{{ game.awayTeam }} - Players</h4>
                      <div class="space-y-1">
                        <div 
                          v-for="player in game.details.awayPlayerStats"
                          :key="player.playerId"
                          class="flex items-center justify-between text-sm py-1 px-2 rounded bg-fcabl-dark/50"
                        >
                          <span class="text-gray-300">
                            <span class="text-gray-500 font-mono text-xs mr-2">#{{ player.number }}</span>
                            {{ player.playerName }}
                          </span>
                          <span class="text-white font-semibold">{{ player.points }} pts</span>
                        </div>
                      </div>
                    </div>

                    <!-- Home Team Players -->
                    <div>
                      <h4 class="text-sm font-semibold text-gray-400 mb-2 uppercase">{{ game.homeTeam }} - Players</h4>
                      <div class="space-y-1">
                        <div 
                          v-for="player in game.details.homePlayerStats"
                          :key="player.playerId"
                          class="flex items-center justify-between text-sm py-1 px-2 rounded bg-fcabl-dark/50"
                        >
                          <span class="text-gray-300">
                            <span class="text-gray-500 font-mono text-xs mr-2">#{{ player.number }}</span>
                            {{ player.playerName }}
                          </span>
                          <span class="text-white font-semibold">{{ player.points }} pts</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Games -->
        <div v-else class="text-center py-12">
          <font-awesome-icon :icon="['fas', 'calendar']" class="text-gray-600 text-5xl mb-4" />
          <p class="text-gray-400 text-lg">No games scheduled</p>
        </div>
      </div>
    </section>
  </div>
</template>
