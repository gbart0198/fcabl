<script setup lang="ts">
import { ref, computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { GameWithDetails } from '@/types/game.types';
import { formatGameTime, formatGameDate } from '@/utils/game';

interface Props {
  games: GameWithDetails[];
  teamId?: number;
  groupByDate?: boolean;
  showExpandedDetails?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showExpandedDetails: true,
  groupByDate: false,
});

const expandedGameIds = ref<Set<string>>(new Set());

// Sort games chronologically
const sortedGames = computed(() => {
  return [...props.games].sort((a, b) => {
    return new Date(a.gameTime).getTime() - new Date(b.gameTime).getTime();
  });
});

// Group games by date (when groupByDate = true)
const gamesByDate = computed(() => {
  if (!props.groupByDate) return [];

  const grouped = new Map<string, GameWithDetails[]>();

  sortedGames.value.forEach(game => {
    const dateKey = formatGameDate(game.gameTime);
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)!.push(game);
  });

  // Convert to array and sort by date
  return Array.from(grouped.entries()).sort(([, gamesA], [, gamesB]) => {
    const timeA = gamesA[0]?.gameTime ? new Date(gamesA[0].gameTime).getTime() : 0;
    const timeB = gamesB[0]?.gameTime ? new Date(gamesB[0].gameTime).getTime() : 0;
    return timeA - timeB;
  });
});

// Group games by status (when groupByDate = false)
const upcomingGames = computed(() => {
  if (props.groupByDate) return [];
  return sortedGames.value.filter(g => g.status === 'scheduled');
});

const completedGames = computed(() => {
  if (props.groupByDate) return [];
  return sortedGames.value
    .filter(g => g.status === 'completed')
    .reverse(); // Most recent first
});

// Helper functions for team-centric view
const isHomeGame = (game: GameWithDetails): boolean => {
  return props.teamId !== undefined && game.homeTeamId === props.teamId;
};

const getGameResult = (game: GameWithDetails): 'W' | 'L' | null => {
  if (game.status !== 'completed' || props.teamId === undefined) return null;

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

// Helper functions for league-wide view
const isCompleted = (game: GameWithDetails): boolean => {
  return game.status === 'completed';
};

const formatDateHeader = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return date.toLocaleDateString('en-US', options);
};

// Expand/collapse functionality
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
  <div>
    <!-- Status-based grouping (default) -->
    <template v-if="!groupByDate">
      <div class="space-y-6">
        <!-- Upcoming Games Section -->
        <div v-if="upcomingGames.length > 0" :class="{ 'py-5': teamId }">
          <h4 v-if="teamId" class="text-lg font-semibold text-gray-400 mb-3 flex items-center gap-2">
            Upcoming Games
          </h4>
          <div class="space-y-2">
            <div v-for="game in upcomingGames" :key="game.id"
              class="card bg-fcabl-dark-light/50 shadow-lg hover:shadow-xl transition-shadow border border-gray-700">
              <div class="card-body p-3">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <!-- Date & Time -->
                  <div class="text-xs text-gray-300 sm:w-24">
                    <div class="font-semibold">{{ formatGameTime(game.gameTime) }}</div>
                  </div>

                  <!-- Teams Display -->
                  <div class="flex-1 text-center">
                    <!-- Team-centric view: show opponent -->
                    <div v-if="teamId" class="flex items-center justify-center gap-2 text-sm">
                      <span class="text-gray-400 font-semibold">
                        {{ isHomeGame(game) ? 'vs' : '@' }}
                      </span>
                      <span class="text-white font-semibold">{{ getOpponent(game) }}</span>
                    </div>

                    <!-- League view: show both teams -->
                    <div v-else class="flex items-center justify-center gap-2 text-sm">
                      <span class="text-white font-semibold">{{ game.awayTeamName }}</span>
                      <span class="text-gray-400 font-semibold">@</span>
                      <span class="text-white font-semibold">{{ game.homeTeamName }}</span>
                    </div>
                  </div>

                  <!-- Status Badge -->
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

        <!-- Completed Games Section -->
        <div v-if="completedGames.length > 0">
          <h4 v-if="teamId" class="text-lg font-semibold text-gray-400 mb-3 flex items-center gap-2">
            Results
          </h4>
          <div class="space-y-2">
            <div v-for="game in completedGames" :key="game.id"
              class="card bg-fcabl-dark-light shadow-lg hover:shadow-xl transition-shadow cursor-pointer border border-gray-700">
              <div class="card-body p-3" @click="toggleGameDetails(game.id)">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <!-- Date & Time -->
                  <div class="text-xs text-gray-300 sm:w-24">
                    <div class="font-semibold">{{ formatGameTime(game.gameTime) }}</div>
                  </div>

                  <!-- Score & Teams -->
                  <div class="flex-1 text-center">
                    <!-- Team-centric view -->
                    <div v-if="teamId">
                      <div class="flex items-center justify-center gap-2 text-sm">
                        <span class="text-gray-400 font-semibold">
                          {{ isHomeGame(game) ? 'vs' : '@' }}
                        </span>
                        <span class="text-white font-semibold">{{ getOpponent(game) }}</span>
                      </div>
                      <div class="mt-1 text-lg font-bold">
                        <span class="text-white">{{ getTeamScore(game) }}</span>
                        <span class="text-gray-500 mx-1">-</span>
                        <span class="text-gray-400">{{ getOpponentScore(game) }}</span>
                      </div>
                    </div>

                    <!-- League view -->
                    <div v-else>
                      <div class="flex items-center justify-center gap-2 text-sm">
                        <span class="text-white font-semibold">{{ game.awayTeamName }}</span>
                        <span class="text-gray-400 font-semibold">@</span>
                        <span class="text-white font-semibold">{{ game.homeTeamName }}</span>
                      </div>
                      <div class="mt-1 text-lg font-bold">
                        <span class="text-white">{{ game.awayScore }}</span>
                        <span class="text-gray-500 mx-1">-</span>
                        <span class="text-white">{{ game.homeScore }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Result Badge & Expand Icon -->
                  <div class="flex items-center gap-2 justify-center sm:justify-end sm:w-16">
                    <!-- Team-centric: W/L badge -->
                    <span v-if="teamId" class="badge font-bold badge-outline"
                      :class="getGameResult(game) === 'W' ? 'badge-success' : 'badge-error'">
                      {{ getGameResult(game) }}
                    </span>
                    <!-- League view: Final badge -->
                    <span v-else class="badge badge-success badge-sm">
                      Final
                    </span>
                    <font-awesome-icon :icon="['fas', isExpanded(game.id) ? 'chevron-up' : 'chevron-down']"
                      class="text-gray-400 text-sm" />
                  </div>
                </div>
              </div>

              <!-- Expanded Game Details -->
              <div v-if="isExpanded(game.id) && showExpandedDetails"
                class="border-t border-gray-700 p-4 bg-fcabl-dark/50">
                <div class="grid md:grid-cols-2 gap-4">
                  <!-- Away Team Players -->
                  <div>
                    <h4 class="text-sm font-semibold text-gray-400 mb-2 uppercase">{{ game.awayTeamName }}
                    </h4>
                    <div class="space-y-1">
                      <div v-for="player in game.awayPlayerStats" :key="player.playerId"
                        class="flex items-center justify-between text-sm py-1 px-2 rounded bg-fcabl-dark/50">
                        <span class="text-gray-300">
                          <span class="text-gray-500 font-mono text-xs mr-2">#{{ player.number }}</span>
                          {{ player.playerFirstName }} {{ player.playerLastName }}
                        </span>
                        <span class="text-white font-semibold">{{ player.score }} pts</span>
                      </div>
                    </div>
                  </div>

                  <!-- Home Team Players -->
                  <div>
                    <h4 class="text-sm font-semibold text-gray-400 mb-2 uppercase">{{ game.homeTeamName }}
                    </h4>
                    <div class="space-y-1">
                      <div v-for="player in game.homePlayerStats" :key="player.playerId"
                        class="flex items-center justify-between text-sm py-1 px-2 rounded bg-fcabl-dark/50">
                        <span class="text-gray-300">
                          <span class="text-gray-500 font-mono text-xs mr-2">#{{ player.number }}</span>
                          {{ player.playerFirstName }} {{ player.playerLastName }}
                        </span>
                        <span class="text-white font-semibold">{{ player.score }} pts</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="games.length === 0" class="text-center text-gray-400 py-8">
          <font-awesome-icon :icon="['fas', 'calendar']" class="text-4xl mb-2 opacity-50" />
          <p>No games scheduled</p>
        </div>
      </div>
    </template>

    <!-- Date-based grouping -->
    <template v-else>
      <div v-if="gamesByDate.length > 0" class="space-y-8">
        <div v-for="[date, games] in gamesByDate" :key="date" class="bg-fcabl-dark-light rounded-lg shadow-xl p-6">
          <!-- Date Header -->
          <h2 class="text-2xl font-bold text-white mb-4 pb-3 border-b border-gray-700">
            {{ formatDateHeader(date) }}
          </h2>

          <!-- Games for this date -->
          <div class="space-y-3">
            <div v-for="game in games" :key="game.id" class="card bg-fcabl-dark shadow-md transition-shadow"
              :class="{ 'hover:shadow-lg cursor-pointer': isCompleted(game) }">
              <!-- Main Game Card -->
              <div class="card-body p-4" @click="isCompleted(game) ? toggleGameDetails(game.id) : null">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <!-- Time -->
                  <div class="text-sm font-semibold text-gray-400 sm:w-24">
                    {{ formatGameTime(game.gameTime).split(' at ')[1] || formatGameTime(game.gameTime) }}
                  </div>

                  <!-- Teams & Score -->
                  <div class="flex-1">
                    <div class="flex items-center justify-center gap-3">
                      <!-- Away Team -->
                      <span class="text-white font-semibold text-right flex-1">
                        {{ game.awayTeamName }}
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
                        {{ game.homeTeamName }}
                      </span>
                    </div>
                  </div>

                  <!-- Status Badge & Expand Icon -->
                  <div class="flex items-center gap-2 justify-center sm:justify-end sm:w-24">
                    <span v-if="isCompleted(game)" class="badge badge-success badge-sm">
                      Final
                    </span>
                    <span v-else class="badge badge-outline badge-sm text-gray-400 border-gray-600">
                      Scheduled
                    </span>
                    <font-awesome-icon v-if="isCompleted(game)"
                      :icon="['fas', isExpanded(game.id) ? 'chevron-up' : 'chevron-down']"
                      class="text-gray-400 text-sm" />
                  </div>
                </div>
              </div>

              <!-- Expanded Game Details -->
              <div v-if="isCompleted(game) && isExpanded(game.id) && showExpandedDetails"
                class="border-t border-gray-700 p-4 bg-fcabl-dark-light">
                <div class="grid md:grid-cols-2 gap-4">
                  <!-- Away Team Players -->
                  <div>
                    <h4 class="text-sm font-semibold text-gray-400 mb-2 uppercase">{{ game.awayTeamName }}</h4>
                    <div class="space-y-1">
                      <div v-for="player in game.awayPlayerStats" :key="player.playerId"
                        class="flex items-center justify-between text-sm py-1 px-2 rounded bg-fcabl-dark/50">
                        <span class="text-gray-300">
                          <span class="text-gray-500 font-mono text-xs mr-2">#{{ player.number }}</span>
                          {{ player.playerFirstName + " " + player.playerLastName }}
                        </span>
                        <span class="text-white font-semibold">{{ player.score }} pts</span>
                      </div>
                    </div>
                  </div>

                  <!-- Home Team Players -->
                  <div>
                    <h4 class="text-sm font-semibold text-gray-400 mb-2 uppercase">{{ game.homeTeamName }}</h4>
                    <div class="space-y-1">
                      <div v-for="player in game.homePlayerStats" :key="player.playerId"
                        class="flex items-center justify-between text-sm py-1 px-2 rounded bg-fcabl-dark/50">
                        <span class="text-gray-300">
                          <span class="text-gray-500 font-mono text-xs mr-2">#{{ player.number }}</span>
                          {{ player.playerFirstName + " " + player.playerLastName }}
                        </span>
                        <span class="text-white font-semibold">{{ player.score }} pts</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center text-gray-400 py-8">
        <font-awesome-icon :icon="['fas', 'calendar']" class="text-4xl mb-2 opacity-50" />
        <p>No games scheduled</p>
      </div>
    </template>
  </div>
</template>
