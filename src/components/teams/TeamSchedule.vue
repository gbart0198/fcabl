<script setup lang="ts">
import { ref, computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { GameWithDetails } from '@/types/game.types';
import { formatGameDate, formatGameTime } from '@/utils/game';

interface Props {
  games: GameWithDetails[];
  teamId: string;
}

const props = defineProps<Props>();

const expandedGameIds = ref<Set<string>>(new Set());

const sortedGames = computed(() => {
  return [...props.games].sort((a, b) => {
    return new Date(a.gameTime).getTime() - new Date(b.gameTime).getTime();
  });
});

const completedGames = computed(() => {
  return sortedGames.value
    .filter(g => g.status === 'completed')
    .reverse(); // Most recent first
});

const upcomingGames = computed(() => {
  return sortedGames.value.filter(g => g.status === 'scheduled');
});

const isHomeGame = (game: GameWithDetails): boolean => {
  return game.homeTeamId === props.teamId;
};

const getGameResult = (game: GameWithDetails): 'W' | 'L' | null => {
  if (game.status !== 'completed') return null;
  
  const isHome = isHomeGame(game);
  const teamScore = isHome ? game.homeScore : game.awayScore;
  const oppScore = isHome ? game.awayScore : game.homeScore;
  
  return teamScore! > oppScore! ? 'W' : 'L';
};

const getOpponent = (game: GameWithDetails): string => {
  return isHomeGame(game) ? game.awayTeamName : game.homeTeamName;
};

const getTeamScore = (game: GameWithDetails): number | undefined => {
  return isHomeGame(game) ? game.homeScore : game.awayScore;
};

const getOpponentScore = (game: GameWithDetails): number | undefined => {
  return isHomeGame(game) ? game.awayScore : game.homeScore;
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
</script>

<template>
  <div class="bg-fcabl-dark-light rounded-lg shadow-2xl p-6">
    <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
      <font-awesome-icon :icon="['fas', 'calendar']" class="text-fcabl-accent" />
      Schedule & Results
    </h3>

    <div class="space-y-6">
      <!-- Completed Games Section -->
      <div v-if="completedGames.length > 0">
        <h4 class="text-lg font-semibold text-gray-400 mb-3 flex items-center gap-2">
          <font-awesome-icon :icon="['fas', 'check-circle']" class="text-success" />
          Results
        </h4>
        <div class="space-y-2">
          <div
            v-for="game in completedGames"
            :key="game.id"
            class="card bg-fcabl-dark-light shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          >
            <div class="card-body p-3" @click="toggleGameDetails(game.id)">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <!-- Date & Time -->
                <div class="text-xs text-gray-400 sm:w-24">
                  <div class="font-semibold">{{ formatGameDate(game.gameTime) }}</div>
                  <div>{{ formatGameTime(game.gameTime) }}</div>
                </div>

                <!-- Score & Opponent -->
                <div class="flex-1 text-center">
                  <div class="flex items-center justify-center gap-2 text-sm">
                    <!-- Home/Away Indicator -->
                    <span class="text-gray-400 font-semibold">
                      {{ isHomeGame(game) ? 'vs' : '@' }}
                    </span>
                    
                    <!-- Opponent -->
                    <span class="text-white font-semibold">{{ getOpponent(game) }}</span>
                  </div>
                  
                  <!-- Score -->
                  <div class="mt-1 text-lg font-bold">
                    <span class="text-white">{{ getTeamScore(game) }}</span>
                    <span class="text-gray-500 mx-1">-</span>
                    <span class="text-gray-400">{{ getOpponentScore(game) }}</span>
                  </div>
                </div>

                <!-- Result Badge & Expand Icon -->
                <div class="flex items-center gap-2 justify-center sm:justify-end sm:w-16">
                  <span
                    class="badge badge-md font-bold"
                    :class="getGameResult(game) === 'W' ? 'badge-success' : 'badge-error'"
                  >
                    {{ getGameResult(game) }}
                  </span>
                  <font-awesome-icon 
                    :icon="['fas', isExpanded(game.id) ? 'chevron-up' : 'chevron-down']" 
                    class="text-gray-400 text-sm"
                  />
                </div>
              </div>
            </div>

            <!-- Expanded Game Details -->
            <div 
              v-if="isExpanded(game.id) && game.details"
              class="border-t border-gray-700 p-4 bg-fcabl-dark/50"
            >
              <!-- Half-Time Scores -->
              <div class="mb-4">
                <h4 class="text-sm font-semibold text-gray-400 mb-2 uppercase">Score by Half</h4>
                <div class="grid grid-cols-2 gap-4">
                  <!-- Away Team Halves -->
                  <div class="text-center">
                    <div class="text-xs text-gray-400 mb-1">{{ game.awayTeamName }}</div>
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
                    <div class="text-xs text-gray-400 mb-1">{{ game.homeTeamName }}</div>
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
                  <h4 class="text-sm font-semibold text-gray-400 mb-2 uppercase">{{ game.awayTeamName }} - Players</h4>
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
                  <h4 class="text-sm font-semibold text-gray-400 mb-2 uppercase">{{ game.homeTeamName }} - Players</h4>
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

      <!-- Upcoming Games Section -->
      <div v-if="upcomingGames.length > 0">
        <h4 class="text-lg font-semibold text-gray-400 mb-3 flex items-center gap-2">
          <font-awesome-icon :icon="['fas', 'clock']" class="text-fcabl-accent" />
          Upcoming Games
        </h4>
        <div class="space-y-2">
          <div
            v-for="game in upcomingGames"
            :key="game.id"
            class="card bg-fcabl-dark-light/50 shadow-lg hover:shadow-xl transition-shadow border border-gray-700"
          >
            <div class="card-body p-3">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <!-- Date & Time -->
                <div class="text-xs text-gray-300 sm:w-24">
                  <div class="font-semibold">{{ formatGameDate(game.gameTime) }}</div>
                  <div>{{ formatGameTime(game.gameTime) }}</div>
                </div>

                <!-- Opponent -->
                <div class="flex-1 text-center">
                  <div class="flex items-center justify-center gap-2 text-sm">
                    <!-- Home/Away Indicator -->
                    <span class="text-gray-400 font-semibold">
                      {{ isHomeGame(game) ? 'vs' : '@' }}
                    </span>
                    
                    <!-- Opponent -->
                    <span class="text-white font-semibold">{{ getOpponent(game) }}</span>
                  </div>
                </div>

                <!-- Scheduled Badge -->
                <div class="flex justify-center sm:justify-end sm:w-16">
                  <span class="badge badge-outline badge-sm text-gray-400 border-gray-600">
                    Scheduled
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No games message -->
      <div v-if="games.length === 0" class="text-center text-gray-400 py-8">
        <font-awesome-icon :icon="['fas', 'calendar']" class="text-4xl mb-2 opacity-50" />
        <p>No games scheduled</p>
      </div>
    </div>
  </div>
</template>
