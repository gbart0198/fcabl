<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { scheduleService, teamService, adminService } from '@/services/api';
import type { Game, Team } from '@/types/game.types';
import type { CreateGameData, UpdateGameData } from '@/types/admin.types';

// State
const games = ref<Game[]>([]);
const teams = ref<Team[]>([]);
const loading = ref(false);
const saving = ref(false);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);
const filterStatus = ref<'all' | 'scheduled' | 'completed'>('all');

// Modal state
const showModal = ref(false);
const editingGame = ref<Game | null>(null);
const showDeleteDialog = ref(false);
const deletingGame = ref<Game | null>(null);

// Form state
const formData = ref({
  homeTeamId: '',
  awayTeamId: '',
  date: '',
  time: '7:00 PM',
  status: 'scheduled' as 'scheduled' | 'completed',
  homeScore: undefined as number | undefined,
  awayScore: undefined as number | undefined,
});

const timeOptions = ['6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM'];

// Computed
const filteredGames = computed(() => {
  if (filterStatus.value === 'all') return games.value;
  return games.value.filter(g => g.status === filterStatus.value);
});

const availableAwayTeams = computed(() => {
  return teams.value.filter(t => t.id !== formData.value.homeTeamId);
});

// Methods
async function loadData() {
  loading.value = true;
  error.value = null;
  try {
    const [gamesData, teamsData] = await Promise.all([
      scheduleService.getAllGames(),
      teamService.getAllTeams(),
    ]);
    games.value = gamesData.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    teams.value = teamsData;
  } catch (err) {
    error.value = 'Failed to load data';
    console.error('Error loading data:', err);
  } finally {
    loading.value = false;
  }
}

function openCreateModal() {
  editingGame.value = null;
  formData.value = {
    homeTeamId: '',
    awayTeamId: '',
    date: '',
    time: '7:00 PM',
    status: 'scheduled',
    homeScore: undefined,
    awayScore: undefined,
  };
  showModal.value = true;
}

function openEditModal(game: Game) {
  editingGame.value = game;
  formData.value = {
    homeTeamId: game.homeTeamId,
    awayTeamId: game.awayTeamId,
    date: game.date,
    time: game.time,
    status: game.status,
    homeScore: game.homeScore,
    awayScore: game.awayScore,
  };
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  editingGame.value = null;
  error.value = null;
}

async function submitForm() {
  if (!formData.value.homeTeamId || !formData.value.awayTeamId || !formData.value.date) {
    error.value = 'Please fill in all required fields';
    return;
  }

  if (formData.value.homeTeamId === formData.value.awayTeamId) {
    error.value = 'Home and away teams must be different';
    return;
  }

  // Auto-complete if scores are entered
  if ((formData.value.homeScore !== undefined && formData.value.homeScore !== null) || 
      (formData.value.awayScore !== undefined && formData.value.awayScore !== null)) {
    formData.value.status = 'completed';
  }

  saving.value = true;
  error.value = null;

  try {
    if (editingGame.value) {
      // For editing: only send editable fields
      const updateData: UpdateGameData = {
        id: editingGame.value.id,
        date: formData.value.date,
        time: formData.value.time,
        status: formData.value.status,
        homeScore: formData.value.homeScore,
        awayScore: formData.value.awayScore,
      };
      await adminService.updateGame(editingGame.value.id, updateData);
      successMessage.value = 'Game updated successfully';
    } else {
      // For creating: send all fields (no scores for new games)
      const createData: CreateGameData = {
        homeTeamId: formData.value.homeTeamId,
        awayTeamId: formData.value.awayTeamId,
        date: formData.value.date,
        time: formData.value.time,
        status: formData.value.status,
      };
      await adminService.createGame(createData);
      successMessage.value = 'Game created successfully';
    }

    closeModal();
    await loadData();

    setTimeout(() => {
      successMessage.value = null;
    }, 3000);
  } catch (err) {
    error.value = 'Failed to save game';
    console.error('Error saving game:', err);
  } finally {
    saving.value = false;
  }
}

function openDeleteDialog(game: Game) {
  deletingGame.value = game;
  showDeleteDialog.value = true;
}

function closeDeleteDialog() {
  showDeleteDialog.value = false;
  deletingGame.value = null;
  error.value = null;
}

async function confirmDelete() {
  if (!deletingGame.value) return;

  saving.value = true;
  error.value = null;

  try {
    await adminService.deleteGame(deletingGame.value.id);
    successMessage.value = 'Game deleted successfully';
    closeDeleteDialog();
    await loadData();

    setTimeout(() => {
      successMessage.value = null;
    }, 3000);
  } catch (err) {
    error.value = 'Failed to delete game';
    console.error('Error deleting game:', err);
  } finally {
    saving.value = false;
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
        <h2 class="text-2xl font-bold text-white">Schedule Management</h2>
        <p class="text-gray-400 text-sm mt-1">Add, edit, and manage games</p>
      </div>
      <button @click="openCreateModal" class="btn btn-primary bg-fcabl-accent border-0">
        <font-awesome-icon :icon="['fas', 'plus']" />
        Add Game
      </button>
    </div>

    <!-- Filter Tabs -->
    <div class="tabs tabs-boxed bg-fcabl-dark-light w-fit">
      <a class="tab" :class="{ 'tab-active': filterStatus === 'all' }" @click="filterStatus = 'all'">
        All
      </a>
      <a class="tab" :class="{ 'tab-active': filterStatus === 'scheduled' }" @click="filterStatus = 'scheduled'">
        Scheduled
      </a>
      <a class="tab" :class="{ 'tab-active': filterStatus === 'completed' }" @click="filterStatus = 'completed'">
        Completed
      </a>
    </div>

    <!-- Success Message -->
    <div v-if="successMessage" class="alert alert-success">
      <font-awesome-icon :icon="['fas', 'save']" />
      <span>{{ successMessage }}</span>
    </div>

    <!-- Error Message -->
    <div v-if="error && !showModal && !showDeleteDialog" class="alert alert-error">
      <font-awesome-icon :icon="['fas', 'exclamation-circle']" />
      <span>{{ error }}</span>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <span class="loading loading-spinner loading-lg text-fcabl-accent"></span>
      <p class="text-gray-400 mt-4">Loading games...</p>
    </div>

    <!-- Games List -->
    <div v-else-if="filteredGames.length > 0">
      <!-- Desktop Table View -->
      <div class="hidden md:block overflow-x-auto">
        <table class="table w-full bg-fcabl-dark-light">
          <thead>
            <tr class="border-b border-gray-700">
              <th class="text-gray-400">Date</th>
              <th class="text-gray-400">Time</th>
              <th class="text-gray-400">Matchup</th>
              <th class="text-gray-400">Status</th>
              <th class="text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="game in filteredGames" :key="game.id" class="hover:bg-fcabl-dark/50 border-b border-gray-800">
              <td class="text-white">{{ formatDate(game.date) }}</td>
              <td class="text-gray-300">{{ game.time }}</td>
              <td class="text-white">
                {{ game.homeTeam }} <span class="text-gray-500">vs</span> {{ game.awayTeam }}
                <template v-if="game.homeScore !== undefined">
                  <br>
                  <span class="text-sm text-fcabl-accent">{{ game.homeScore }} - {{ game.awayScore }}</span>
                </template>
              </td>
              <td>
                <span class="badge badge-sm" :class="game.status === 'completed' ? 'badge-success' : 'badge-outline'">
                  {{ game.status }}
                </span>
              </td>
              <td>
                <div class="flex gap-2">
                  <button @click="openEditModal(game)" class="btn btn-ghost btn-xs text-fcabl-accent">
                    <font-awesome-icon :icon="['fas', 'edit']" />
                  </button>
                  <button @click="openDeleteDialog(game)" class="btn btn-ghost btn-xs text-error">
                    <font-awesome-icon :icon="['fas', 'trash']" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Card View -->
      <div class="md:hidden space-y-3">
        <div v-for="game in filteredGames" :key="game.id" class="bg-fcabl-dark-light rounded-lg p-4">
          <!-- Date & Time -->
          <div class="text-xs text-gray-400 mb-2">
            {{ formatDate(game.date) }} • {{ game.time }}
          </div>
          
          <!-- Matchup -->
          <div class="text-center mb-3">
            <div class="font-semibold text-white">
              {{ game.homeTeam }}
            </div>
            <div class="text-fcabl-accent my-1">
              <template v-if="game.homeScore !== undefined">
                <span class="text-xl font-bold">{{ game.homeScore }} - {{ game.awayScore }}</span>
              </template>
              <template v-else>
                <span>VS</span>
              </template>
            </div>
            <div class="font-semibold text-white">
              {{ game.awayTeam }}
            </div>
          </div>
          
          <!-- Status Badge -->
          <div class="flex justify-center mb-3">
            <span class="badge badge-sm" :class="game.status === 'completed' ? 'badge-success' : 'badge-outline'">
              {{ game.status }}
            </span>
          </div>
          
          <!-- Action Buttons -->
          <div class="grid grid-cols-2 gap-2">
            <button @click="openEditModal(game)" class="btn btn-sm btn-outline text-fcabl-accent border-fcabl-accent">
              <font-awesome-icon :icon="['fas', 'edit']" class="mr-1" />
              Edit
            </button>
            <button @click="openDeleteDialog(game)" class="btn btn-sm btn-outline btn-error">
              <font-awesome-icon :icon="['fas', 'trash']" class="mr-1" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <font-awesome-icon :icon="['fas', 'calendar-alt']" class="text-gray-600 text-5xl mb-4" />
      <p class="text-gray-400 text-lg">No games found</p>
    </div>

    <!-- Create/Edit Game Modal -->
    <dialog :class="{ 'modal modal-open': showModal }" class="modal">
      <div class="modal-box w-full max-w-md sm:max-w-xl lg:max-w-2xl p-4 sm:p-6 bg-fcabl-dark-light">
        <h3 class="font-bold text-xl text-white mb-4">
          {{ editingGame ? 'Edit Game' : 'Add New Game' }}
        </h3>

        <div v-if="error && showModal" class="alert alert-error mb-4">
          <font-awesome-icon :icon="['fas', 'exclamation-circle']" />
          <span>{{ error }}</span>
        </div>

        <div class="space-y-4">
          <!-- Teams Section - Different for Create vs Edit -->
          <div v-if="!editingGame" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="label">
                <span class="label-text text-gray-400 font-semibold">Home Team *</span>
              </label>
              <select v-model="formData.homeTeamId" class="select select-bordered w-full bg-fcabl-dark text-white">
                <option value="">Select home team</option>
                <option v-for="team in teams" :key="team.id" :value="team.id">{{ team.name }}</option>
              </select>
            </div>

            <div>
              <label class="label">
                <span class="label-text text-gray-400 font-semibold">Away Team *</span>
              </label>
              <select v-model="formData.awayTeamId" class="select select-bordered w-full bg-fcabl-dark text-white">
                <option value="">Select away team</option>
                <option v-for="team in availableAwayTeams" :key="team.id" :value="team.id">{{ team.name }}</option>
              </select>
            </div>
          </div>
          
          <!-- Read-only matchup for Edit mode -->
          <div v-else class="p-4 bg-fcabl-dark rounded-lg">
            <p class="text-gray-400 text-sm mb-2">Matchup (cannot be changed)</p>
            <p class="text-white text-lg font-semibold">
              {{ editingGame.homeTeam }} <span class="text-fcabl-accent">vs</span> {{ editingGame.awayTeam }}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="label">
                <span class="label-text text-gray-400 font-semibold">Date *</span>
              </label>
              <input v-model="formData.date" type="date" class="input input-bordered w-full bg-fcabl-dark text-white" />
            </div>

            <div>
              <label class="label">
                <span class="label-text text-gray-400 font-semibold">Time *</span>
              </label>
              <select v-model="formData.time" class="select select-bordered w-full bg-fcabl-dark text-white">
                <option v-for="time in timeOptions" :key="time" :value="time">{{ time }}</option>
              </select>
            </div>
          </div>

          <!-- Scores (only for EDIT) -->
          <div v-if="editingGame" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="label">
                <span class="label-text text-gray-400 font-semibold">Home Score</span>
              </label>
              <input v-model.number="formData.homeScore" type="number" min="0" class="input input-bordered w-full bg-fcabl-dark text-white" placeholder="Enter home team score" />
            </div>
            <div>
              <label class="label">
                <span class="label-text text-gray-400 font-semibold">Away Score</span>
              </label>
              <input v-model.number="formData.awayScore" type="number" min="0" class="input input-bordered w-full bg-fcabl-dark text-white" placeholder="Enter away team score" />
            </div>
          </div>

          <div>
            <label class="label">
              <span class="label-text text-gray-400 font-semibold">Status</span>
            </label>
            <select 
              v-model="formData.status" 
              class="select select-bordered w-full bg-fcabl-dark text-white"
              :disabled="(formData.homeScore !== undefined && formData.homeScore !== null) || (formData.awayScore !== undefined && formData.awayScore !== null)"
            >
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
            </select>
            <p v-if="(formData.homeScore !== undefined && formData.homeScore !== null) || (formData.awayScore !== undefined && formData.awayScore !== null)" class="text-sm text-gray-400 mt-1">
              Status automatically set to 'completed' when scores are entered
            </p>
          </div>
        </div>

        <div class="modal-action">
          <button @click="closeModal" class="btn btn-ghost">Cancel</button>
          <button @click="submitForm" class="btn btn-primary bg-fcabl-accent border-0" :disabled="saving">
            <span v-if="saving" class="loading loading-spinner loading-sm"></span>
            <font-awesome-icon v-else :icon="['fas', 'save']" />
            {{ saving ? 'Saving...' : (editingGame ? 'Update Game' : 'Create Game') }}
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="closeModal">close</button>
      </form>
    </dialog>

    <!-- Delete Confirmation Dialog -->
    <dialog :class="{ 'modal modal-open': showDeleteDialog }" class="modal">
      <div class="modal-box bg-fcabl-dark-light">
        <h3 class="font-bold text-xl text-white mb-4">Confirm Delete</h3>

        <div v-if="error && showDeleteDialog" class="alert alert-error mb-4">
          <font-awesome-icon :icon="['fas', 'exclamation-circle']" />
          <span>{{ error }}</span>
        </div>

        <p v-if="deletingGame" class="text-gray-300 mb-4">
          Are you sure you want to delete this game?<br>
          <strong class="text-white">{{ deletingGame.homeTeam }} vs {{ deletingGame.awayTeam }}</strong><br>
          <span class="text-gray-400 text-sm">{{ formatDate(deletingGame.date) }} at {{ deletingGame.time }}</span>
        </p>

        <div class="modal-action">
          <button @click="closeDeleteDialog" class="btn btn-ghost">Cancel</button>
          <button @click="confirmDelete" class="btn btn-error" :disabled="saving">
            <span v-if="saving" class="loading loading-spinner loading-sm"></span>
            <font-awesome-icon v-else :icon="['fas', 'trash']" />
            {{ saving ? 'Deleting...' : 'Delete Game' }}
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="closeDeleteDialog">close</button>
      </form>
    </dialog>
  </div>
</template>

<style scoped>
.input,
.select {
  padding-left: 1rem !important;
  padding-right: 1rem !important;
}
input[type="number"] {
  padding-left: 1rem !important;
  padding-right: 0.75rem !important;
}
</style>
