<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { scheduleService, adminService, teamService } from '@/services/api';
import type { GameWithDetails, PlayerProfile, TeamDetail } from '@/types/game.types';
import type { GameResultData, PlayerGameResult } from '@/types/admin.types';
import { formatGameDate, formatGameTime } from '@/utils/game';

// State
const games = ref<GameWithDetails[]>([]);
const teams = ref<{ [key: string]: TeamDetail }>({});
const loading = ref(false);
const saving = ref(false);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);

// Filter state
const filterStatus = ref<'all' | 'completed' | 'recent'>('all');

// Modal state
const showModal = ref(false);
const editingGame = ref<GameWithDetails | null>(null);
const isEditingCompleted = ref(false);

// Form state
const formData = ref({
  homeScore: 0,
  awayScore: 0,
  homeFirstHalf: 0,
  homeSecondHalf: 0,
  awayFirstHalf: 0,
  awaySecondHalf: 0,
  homePlayerStats: [] as PlayerGameResult[],
  awayPlayerStats: [] as PlayerGameResult[],
});

// Computed
const filteredGames = computed(() => {
  if (filterStatus.value === 'completed') {
    return games.value.filter(g => g.status === 'completed');
  } else if (filterStatus.value === 'recent') {
    return games.value.slice(-10).reverse();
  }
  return games.value;
});

const homePlayerTotal = computed(() => {
  return formData.value.homePlayerStats.reduce((sum, p) => sum + p.points, 0);
});

const awayPlayerTotal = computed(() => {
  return formData.value.awayPlayerStats.reduce((sum, p) => sum + p.points, 0);
});

const homeHalfTotal = computed(() => {
  return formData.value.homeFirstHalf + formData.value.homeSecondHalf;
});

const awayHalfTotal = computed(() => {
  return formData.value.awayFirstHalf + formData.value.awaySecondHalf;
});

const isValid = computed(() => {
  // Scores are auto-calculated from halves, so just validate player stats match
  return (
    homePlayerTotal.value === homeHalfTotal.value &&
    awayPlayerTotal.value === awayHalfTotal.value &&
    homeHalfTotal.value > 0 &&
    awayHalfTotal.value > 0
  );
});

// Auto-update total scores when half-time scores change
watch([
  () => formData.value.homeFirstHalf,
  () => formData.value.homeSecondHalf
], () => {
  formData.value.homeScore = homeHalfTotal.value;
});

watch([
  () => formData.value.awayFirstHalf,
  () => formData.value.awaySecondHalf
], () => {
  formData.value.awayScore = awayHalfTotal.value;
});

// Methods
async function loadData() {
  loading.value = true;
  error.value = null;
  try {
    const [gamesData, allTeams] = await Promise.all([
      scheduleService.getAllGames(),
      teamService.getAllTeams(),
    ]);
    
    games.value = gamesData.sort((a, b) => 
      new Date(b.gameTime).getTime() - new Date(a.gameTime).getTime()
    );
    
    // Load full team details
    const teamDetails = await Promise.all(
      allTeams.map(team => teamService.getTeamById(team.id))
    );
    
    teams.value = {};
    teamDetails.forEach(team => {
      if (team) {
        teams.value[team.id] = team;
      }
    });
  } catch (err) {
    error.value = 'Failed to load games';
    console.error('Error loading games:', err);
  } finally {
    loading.value = false;
  }
}

function openModal(game: GameWithDetails) {
  editingGame.value = game;
  isEditingCompleted.value = game.status === 'completed';
  
  // Initialize form
  formData.value = {
    homeScore: game.homeScore || 0,
    awayScore: game.awayScore || 0,
    homeFirstHalf: 0,
    homeSecondHalf: 0,
    awayFirstHalf: 0,
    awaySecondHalf: 0,
    homePlayerStats: [],
    awayPlayerStats: [],
  };
  
  // Initialize player stats
  const homeRoster = teams.value[game.homeTeamId]?.roster || [];
  const awayRoster = teams.value[game.awayTeamId]?.roster || [];
  
  formData.value.homePlayerStats = homeRoster.map((player: PlayerProfile) => ({
    playerId: player.id,
    playerName: player.fullName,
    number: player.jerseyNumber || 0,
    points: 0,
  }));
  
  formData.value.awayPlayerStats = awayRoster.map((player: PlayerProfile) => ({
    playerId: player.id,
    playerName: player.fullName,
    number: player.jerseyNumber || 0,
    points: 0,
  }));
  
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  editingGame.value = null;
  isEditingCompleted.value = false;
}

async function submitResult() {
  if (!editingGame.value || !isValid.value) return;
  
  saving.value = true;
  error.value = null;
  
  try {
    const resultData: GameResultData = {
      gameId: editingGame.value.id,
      homeScore: homeHalfTotal.value,
      awayScore: awayHalfTotal.value,
      homeFirstHalf: formData.value.homeFirstHalf,
      homeSecondHalf: formData.value.homeSecondHalf,
      awayFirstHalf: formData.value.awayFirstHalf,
      awaySecondHalf: formData.value.awaySecondHalf,
      homePlayerStats: formData.value.homePlayerStats,
      awayPlayerStats: formData.value.awayPlayerStats,
    };
    
    const response = await adminService.submitGameResult(editingGame.value.id, resultData);
    
    if (response.success) {
      successMessage.value = isEditingCompleted.value 
        ? 'Game result updated successfully' 
        : 'Game result submitted successfully';
      closeModal();
      await loadData();
      
      setTimeout(() => {
        successMessage.value = null;
      }, 3000);
    } else {
      error.value = response.error || 'Failed to submit game result';
    }
  } catch (err) {
    error.value = 'An error occurred while submitting the result';
    console.error('Error submitting result:', err);
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-white">Game Result Entry</h2>
        <p class="text-gray-400 text-sm mt-1">Enter or edit game scores and player statistics</p>
      </div>
      
      <!-- Filter Tabs -->
      <div class="tabs tabs-boxed bg-fcabl-dark-light">
        <a 
          class="tab" 
          :class="{ 'tab-active': filterStatus === 'all' }"
          @click="filterStatus = 'all'"
        >
          All Games
        </a>
        <a 
          class="tab" 
          :class="{ 'tab-active': filterStatus === 'completed' }"
          @click="filterStatus = 'completed'"
        >
          Completed
        </a>
        <a 
          class="tab" 
          :class="{ 'tab-active': filterStatus === 'recent' }"
          @click="filterStatus = 'recent'"
        >
          Recent
        </a>
      </div>
    </div>

    <!-- Success Message -->
    <div v-if="successMessage" class="alert alert-success">
      <font-awesome-icon :icon="['fas', 'save']" />
      <span>{{ successMessage }}</span>
    </div>

    <!-- Error Message -->
    <div v-if="error && !showModal" class="alert alert-error">
      <font-awesome-icon :icon="['fas', 'exclamation-circle']" />
      <span>{{ error }}</span>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <span class="loading loading-spinner loading-lg text-fcabl-accent"></span>
      <p class="text-gray-400 mt-4">Loading games...</p>
    </div>

    <!-- Games List -->
    <div v-else-if="filteredGames.length > 0" class="space-y-4">
      <div
        v-for="game in filteredGames"
        :key="game.id"
        class="card bg-fcabl-dark-light shadow-xl hover:shadow-2xl transition-shadow"
      >
        <div class="card-body p-4">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <!-- Game Info -->
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <span class="badge badge-sm" :class="game.status === 'completed' ? 'badge-success' : 'badge-outline'">
                  {{ game.status === 'completed' ? 'Completed' : 'Scheduled' }}
                </span>
                <span class="text-gray-400 text-sm">{{ formatGameDate(game.gameTime) }} at {{ formatGameTime(game.gameTime) }}</span>
              </div>
              
              <div class="flex items-center justify-between gap-3">
                <span class="text-white font-semibold">{{ game.homeTeamName }}</span>
                <div class="text-center">
                  <template v-if="game.status === 'completed' && game.homeScore !== undefined">
                    <span class="text-2xl font-bold text-fcabl-accent">
                      {{ game.homeScore }} - {{ game.awayScore }}
                    </span>
                  </template>
                  <template v-else>
                    <span class="text-gray-500">vs</span>
                  </template>
                </div>
                <span class="text-white font-semibold">{{ game.awayTeamName }}</span>
              </div>
            </div>

            <!-- Action Button -->
            <button 
              @click="openModal(game)"
              class="btn btn-sm"
              :class="game.status === 'completed' ? 'btn-outline btn-warning' : 'btn-primary bg-fcabl-accent border-0'"
            >
              <font-awesome-icon :icon="['fas', game.status === 'completed' ? 'edit' : 'plus']" />
              {{ game.status === 'completed' ? 'Edit Result' : 'Enter Result' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <font-awesome-icon :icon="['fas', 'clipboard-list']" class="text-gray-600 text-5xl mb-4" />
      <p class="text-gray-400 text-lg">No games found</p>
    </div>

    <!-- Game Result Modal -->
    <dialog :class="{ 'modal modal-open': showModal }" class="modal">
      <div class="modal-box w-full max-w-md sm:max-w-2xl lg:max-w-4xl p-4 sm:p-6 bg-fcabl-dark-light">
        <!-- Modal Header -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-xl text-white">
            {{ isEditingCompleted ? 'Edit Game Result' : 'Enter Game Result' }}
          </h3>
          <button @click="closeModal" class="btn btn-sm btn-circle btn-ghost">
            <font-awesome-icon :icon="['fas', 'times']" />
          </button>
        </div>

        <!-- Warning for Editing Completed Game -->
        <div v-if="isEditingCompleted" class="alert alert-warning mb-4">
          <font-awesome-icon :icon="['fas', 'exclamation-triangle']" />
          <span>You are editing a game that has already been completed</span>
        </div>

        <!-- Error in Modal -->
        <div v-if="error && showModal" class="alert alert-error mb-4">
          <font-awesome-icon :icon="['fas', 'exclamation-circle']" />
          <span>{{ error }}</span>
        </div>

        <!-- Game Info -->
        <div v-if="editingGame" class="bg-fcabl-dark p-4 rounded-lg mb-6">
          <div class="text-center">
            <div class="text-gray-400 text-sm mb-2">
              {{ formatGameDate(editingGame.gameTime) }} at {{ formatGameTime(editingGame.gameTime) }}
            </div>
            <div class="text-2xl font-bold text-white">
              {{ editingGame.homeTeamName }} <span class="text-fcabl-accent">vs</span> {{ editingGame.awayTeamName }}
            </div>
          </div>
        </div>

        <!-- Form -->
        <div class="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
          <!-- Scoreboard Display -->
          <div class="bg-fcabl-dark rounded-lg p-6">
            <h4 class="text-center text-gray-400 text-sm font-semibold mb-4 uppercase">Final Score</h4>
            <div class="grid grid-cols-3 gap-4 items-center max-w-2xl mx-auto">
              <!-- Home Team -->
              <div class="text-center">
                <div class="text-gray-400 text-sm mb-2">{{ editingGame?.homeTeamName }}</div>
                <div class="text-5xl font-bold text-white bg-fcabl-dark-light rounded-lg py-6">
                  {{ homeHalfTotal }}
                </div>
              </div>
              
              <!-- VS Separator -->
              <div class="text-center">
                <div class="text-fcabl-accent text-2xl font-bold">VS</div>
              </div>
              
              <!-- Away Team -->
              <div class="text-center">
                <div class="text-gray-400 text-sm mb-2">{{ editingGame?.awayTeamName }}</div>
                <div class="text-5xl font-bold text-white bg-fcabl-dark-light rounded-lg py-6">
                  {{ awayHalfTotal }}
                </div>
              </div>
            </div>
            <p class="text-center text-xs text-gray-500 mt-3">Automatically calculated from half-time scores</p>
          </div>

          <!-- Half-Time Scores -->
          <div>
            <h4 class="text-lg font-semibold text-white mb-1">Enter Half-Time Scores</h4>
            <p class="text-xs text-gray-400 mb-3">These will determine the final score</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Home Team Halves -->
              <div class="space-y-2">
                <div class="text-sm font-semibold text-gray-400">{{ editingGame?.homeTeamName }}</div>
                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <label class="label">
                      <span class="label-text text-gray-400 text-xs">1st Half</span>
                    </label>
                    <input 
                      v-model.number="formData.homeFirstHalf" 
                      type="number" 
                      min="0"
                      class="input input-bordered input-sm w-full bg-fcabl-dark text-white"
                    />
                  </div>
                  <div>
                    <label class="label">
                      <span class="label-text text-gray-400 text-xs">2nd Half</span>
                    </label>
                    <input 
                      v-model.number="formData.homeSecondHalf" 
                      type="number" 
                      min="0"
                      class="input input-bordered input-sm w-full bg-fcabl-dark text-white"
                    />
                  </div>
                </div>
              </div>

              <!-- Away Team Halves -->
              <div class="space-y-2">
                <div class="text-sm font-semibold text-gray-400">{{ editingGame?.awayTeamName }}</div>
                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <label class="label">
                      <span class="label-text text-gray-400 text-xs">1st Half</span>
                    </label>
                    <input 
                      v-model.number="formData.awayFirstHalf" 
                      type="number" 
                      min="0"
                      class="input input-bordered input-sm w-full bg-fcabl-dark text-white"
                    />
                  </div>
                  <div>
                    <label class="label">
                      <span class="label-text text-gray-400 text-xs">2nd Half</span>
                    </label>
                    <input 
                      v-model.number="formData.awaySecondHalf" 
                      type="number" 
                      min="0"
                      class="input input-bordered input-sm w-full bg-fcabl-dark text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Player Stats -->
          <div>
            <h4 class="text-lg font-semibold text-white mb-3">Player Statistics</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Home Team Players -->
              <div>
                <div class="text-sm font-semibold text-gray-400 mb-2 flex items-center justify-between">
                  <span>{{ editingGame?.homeTeamName }}</span>
                  <span :class="homePlayerTotal === homeHalfTotal ? 'text-success' : 'text-error'">
                    {{ homePlayerTotal }} / {{ homeHalfTotal }}
                  </span>
                </div>
                <div class="space-y-2 max-h-64 overflow-y-auto">
                  <div
                    v-for="player in formData.homePlayerStats"
                    :key="player.playerId"
                    class="flex items-center gap-2 bg-fcabl-dark p-2 rounded"
                  >
                    <span class="text-gray-400 text-xs font-mono w-8">#{{ player.number }}</span>
                    <span class="text-white text-sm flex-1">{{ player.playerName }}</span>
                    <input 
                      v-model.number="player.points" 
                      type="number" 
                      min="0"
                      class="input input-bordered input-sm w-20 bg-fcabl-dark-light text-white"
                      placeholder="Pts"
                    />
                  </div>
                </div>
              </div>

              <!-- Away Team Players -->
              <div>
                <div class="text-sm font-semibold text-gray-400 mb-2 flex items-center justify-between">
                  <span>{{ editingGame?.awayTeamName }}</span>
                  <span :class="awayPlayerTotal === awayHalfTotal ? 'text-success' : 'text-error'">
                    {{ awayPlayerTotal }} / {{ awayHalfTotal }}
                  </span>
                </div>
                <div class="space-y-2 max-h-64 overflow-y-auto">
                  <div
                    v-for="player in formData.awayPlayerStats"
                    :key="player.playerId"
                    class="flex items-center gap-2 bg-fcabl-dark p-2 rounded"
                  >
                    <span class="text-gray-400 text-xs font-mono w-8">#{{ player.number }}</span>
                    <span class="text-white text-sm flex-1">{{ player.playerName }}</span>
                    <input 
                      v-model.number="player.points" 
                      type="number" 
                      min="0"
                      class="input input-bordered input-sm w-20 bg-fcabl-dark-light text-white"
                      placeholder="Pts"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Validation Summary -->
          <div v-if="!isValid" class="alert alert-warning">
            <font-awesome-icon :icon="['fas', 'exclamation-triangle']" />
            <div class="text-sm">
              <div class="font-semibold mb-1">Validation Errors:</div>
              <ul class="list-disc list-inside space-y-1">
                <li v-if="homePlayerTotal !== formData.homeScore">
                  Home team player stats don't match total score
                </li>
                <li v-if="awayPlayerTotal !== formData.awayScore">
                  Away team player stats don't match total score
                </li>
                <li v-if="homeHalfTotal !== formData.homeScore">
                  Home team half-time scores don't match total score
                </li>
                <li v-if="awayHalfTotal !== formData.awayScore">
                  Away team half-time scores don't match total score
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Modal Actions -->
        <div class="modal-action">
          <button @click="closeModal" class="btn btn-ghost">Cancel</button>
          <button 
            @click="submitResult" 
            class="btn btn-primary bg-fcabl-accent border-0"
            :disabled="!isValid || saving"
          >
            <span v-if="saving" class="loading loading-spinner loading-sm"></span>
            <font-awesome-icon v-else :icon="['fas', 'save']" />
            {{ saving ? 'Saving...' : 'Submit Result' }}
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="closeModal">close</button>
      </form>
    </dialog>
  </div>
</template>

<style scoped>
.input {
  padding-left: 1rem !important;
  padding-right: 1rem !important;
}
input[type="number"] {
  padding-left: 1rem !important;
  padding-right: 0.75rem !important;
}
.input-sm {
  padding-left: 0.75rem !important;
  padding-right: 0.75rem !important;
}
</style>
