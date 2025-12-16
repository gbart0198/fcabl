<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { standingsService } from '@/services/api';
import type { Standing } from '@/types/game.types';

const router = useRouter();
const standings = ref<Standing[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const formatWinPercentage = (pct: number): string => {
  return (pct * 100).toFixed(1) + '%';
};

const getDifferentialClass = (diff: number): string => {
  if (diff > 0) return 'text-success';
  if (diff < 0) return 'text-error';
  return 'text-gray-400';
};

const getDifferentialPrefix = (diff: number): string => {
  return diff > 0 ? '+' : '';
};

const navigateToTeam = (teamId: string) => {
  router.push({ path: '/teams', query: { team_id: teamId } });
};

onMounted(async () => {
  try {
    loading.value = true;
    standings.value = await standingsService.getFullStandings();
  } catch (err) {
    error.value = 'Failed to load standings';
    console.error('Error loading standings:', err);
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
            <font-awesome-icon :icon="['fas', 'trophy']" class="text-fcabl-accent mr-3" />
            League Standings
          </h1>
          <p class="text-gray-400 text-lg">Full season standings for all teams</p>
        </div>
      </div>
    </section>

    <!-- Standings Table Section -->
    <section class="py-12">
      <div class="container mx-auto px-4">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <span class="loading loading-spinner loading-lg text-fcabl-accent"></span>
          <p class="text-gray-400 mt-4">Loading standings...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
          <font-awesome-icon :icon="['fas', 'exclamation-circle']" class="text-error text-5xl mb-4" />
          <p class="text-error text-lg">{{ error }}</p>
        </div>

        <!-- Standings Content -->
        <div v-else>
          <!-- Desktop Table -->
          <div class="hidden md:block overflow-x-auto bg-fcabl-dark-light rounded-lg shadow-xl">
            <table class="table w-full">
              <thead>
                <tr class="border-b border-gray-700">
                  <th class="text-gray-400">Rank</th>
                  <th class="text-gray-400">Team</th>
                  <th class="text-gray-400 text-center">W</th>
                  <th class="text-gray-400 text-center">L</th>
                  <th class="text-gray-400 text-center">Win %</th>
                  <th class="text-gray-400 text-center">PF</th>
                  <th class="text-gray-400 text-center">PA</th>
                  <th class="text-gray-400 text-center">Diff</th>
                  <th class="text-gray-400 text-center">Streak</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="standing in standings"
                  :key="standing.team.id"
                  @click="navigateToTeam(standing.team.id)"
                  class="hover:bg-fcabl-dark/50 transition-colors border-b border-gray-800 cursor-pointer"
                >
                  <td class="font-semibold">
                    <span v-if="standing.rank === 1" class="text-fcabl-accent text-2xl">
                      <font-awesome-icon :icon="['fas', 'trophy']" />
                    </span>
                    <span v-else class="text-gray-400 text-lg">{{ standing.rank }}</span>
                  </td>
                  <td>
                    <span class="font-semibold text-white text-lg hover:text-fcabl-accent transition-colors">
                      {{ standing.team.name }}
                    </span>
                  </td>
                  <td class="text-center font-semibold text-success text-lg">{{ standing.team.wins }}</td>
                  <td class="text-center font-semibold text-error text-lg">{{ standing.team.losses }}</td>
                  <td class="text-center font-semibold text-fcabl-accent text-lg">
                    {{ formatWinPercentage(standing.team.winPercentage) }}
                  </td>
                  <td class="text-center font-semibold text-gray-300">{{ standing.team.pointsFor }}</td>
                  <td class="text-center font-semibold text-gray-300">{{ standing.team.pointsAgainst }}</td>
                  <td class="text-center font-semibold" :class="getDifferentialClass(standing.team.pointDifferential)">
                    {{ getDifferentialPrefix(standing.team.pointDifferential) }}{{ standing.team.pointDifferential }}
                  </td>
                  <td class="text-center">
                    <span
                      class="badge badge-sm"
                      :class="standing.streak?.startsWith('W') ? 'badge-success' : 'badge-error'"
                    >
                      {{ standing.streak }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile Cards -->
          <div class="md:hidden space-y-4">
            <div
              v-for="standing in standings"
              :key="standing.team.id"
              @click="navigateToTeam(standing.team.id)"
              class="card bg-fcabl-dark-light shadow-xl cursor-pointer hover:shadow-2xl transition-shadow"
            >
              <div class="card-body">
                <div class="flex justify-between items-start mb-3">
                  <div class="flex items-center gap-3">
                    <span v-if="standing.rank === 1" class="text-fcabl-accent text-3xl">
                      <font-awesome-icon :icon="['fas', 'trophy']" />
                    </span>
                    <span v-else class="text-2xl font-bold text-gray-400">#{{ standing.rank }}</span>
                    <h3 class="text-xl font-bold text-white">{{ standing.team.name }}</h3>
                  </div>
                  <span
                    class="badge"
                    :class="standing.streak?.startsWith('W') ? 'badge-success' : 'badge-error'"
                  >
                    {{ standing.streak }}
                  </span>
                </div>

                <div class="grid grid-cols-3 gap-3 text-center mb-3">
                  <div>
                    <div class="text-2xl font-bold text-success">{{ standing.team.wins }}</div>
                    <div class="text-xs text-gray-400">Wins</div>
                  </div>
                  <div>
                    <div class="text-2xl font-bold text-error">{{ standing.team.losses }}</div>
                    <div class="text-xs text-gray-400">Losses</div>
                  </div>
                  <div>
                    <div class="text-2xl font-bold text-fcabl-accent">
                      {{ formatWinPercentage(standing.team.winPercentage) }}
                    </div>
                    <div class="text-xs text-gray-400">Win %</div>
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-3 text-center pt-3 border-t border-gray-700">
                  <div>
                    <div class="text-lg font-bold text-gray-300">{{ standing.team.pointsFor }}</div>
                    <div class="text-xs text-gray-400">PF</div>
                  </div>
                  <div>
                    <div class="text-lg font-bold text-gray-300">{{ standing.team.pointsAgainst }}</div>
                    <div class="text-xs text-gray-400">PA</div>
                  </div>
                  <div>
                    <div
                      class="text-lg font-bold"
                      :class="getDifferentialClass(standing.team.pointDifferential)"
                    >
                      {{ getDifferentialPrefix(standing.team.pointDifferential) }}{{ standing.team.pointDifferential }}
                    </div>
                    <div class="text-xs text-gray-400">Diff</div>
                  </div>
                </div>

                <div class="mt-3 text-center text-sm text-gray-500">
                  <font-awesome-icon :icon="['fas', 'chevron-right']" class="ml-1" />
                  Tap to view team details
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
