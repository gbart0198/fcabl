<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { adminService, teamService } from '@/services/api';
import type { Team, PlayerProfile } from '@/types/game.types';

// State
const teams = ref<Team[]>([]);
const selectedTeamId = ref<string>('');
const teamRoster = ref<PlayerProfile[]>([]);
const unassignedPlayers = ref<PlayerProfile[]>([]);
const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');
const searchQuery = ref('');

// Pagination state
const currentPage = ref(1);
const itemsPerPage = ref(10);
const itemsPerPageOptions = [5, 10, 25, 50, 100];

// Modal state
const showUpdateNumberModal = ref(false);
const selectedPlayer = ref<PlayerProfile | null>(null);
const newJerseyNumber = ref('');

// Computed
const selectedTeam = computed(() => {
  return teams.value.find(t => t.id === selectedTeamId.value);
});

const filteredUnassignedPlayers = computed(() => {
  if (!searchQuery.value) return unassignedPlayers.value;
  
  const query = searchQuery.value.toLowerCase();
  return unassignedPlayers.value.filter(player => 
    player.fullName.toLowerCase().includes(query) ||
    (player.email && player.email.toLowerCase().includes(query))
  );
});

const paginatedPlayers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredUnassignedPlayers.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredUnassignedPlayers.value.length / itemsPerPage.value);
});

const pageRange = computed(() => {
  const range = [];
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages.value, currentPage.value + 2);
  for (let i = start; i <= end; i++) {
    range.push(i);
  }
  return range;
});

// Methods
const loadData = async () => {
  loading.value = true;
  try {
    // Load teams and unassigned players
    teams.value = await teamService.getAllTeams();
    
    unassignedPlayers.value = await adminService.getUnassignedPlayers();
    
    // If a team is selected, load its roster
    if (selectedTeamId.value) {
      await loadTeamRoster();
    }
  } catch (error) {
    errorMessage.value = 'Failed to load data';
    setTimeout(() => errorMessage.value = '', 3000);
  } finally {
    loading.value = false;
  }
};

const loadTeamRoster = async () => {
  if (!selectedTeamId.value) return;
  
  loading.value = true;
  try {
    teamRoster.value = await adminService.getTeamPlayers(selectedTeamId.value);
  } catch (error) {
    errorMessage.value = 'Failed to load team roster';
    setTimeout(() => errorMessage.value = '', 3000);
  } finally {
    loading.value = false;
  }
};

const handleTeamChange = async () => {
  await loadTeamRoster();
};

const assignPlayerToTeam = async (playerId: string) => {
  if (!selectedTeamId.value) {
    errorMessage.value = 'Please select a team first';
    setTimeout(() => errorMessage.value = '', 3000);
    return;
  }
  
  loading.value = true;
  try {
    const assignData = {
      playerId,
      teamId: selectedTeamId.value,
      jerseyNumber: undefined // Optional: could prompt for number
    };
    
    await adminService.assignPlayerToTeam(assignData.playerId, assignData.teamId, assignData.jerseyNumber);
    successMessage.value = 'Player assigned to team successfully';
    setTimeout(() => successMessage.value = '', 3000);
    
    // Reload data
    await loadData();
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to assign player';
    setTimeout(() => errorMessage.value = '', 3000);
  } finally {
    loading.value = false;
  }
};

const removePlayerFromTeam = async (playerId: string) => {
  if (!confirm('Are you sure you want to remove this player from the team?')) {
    return;
  }
  
  loading.value = true;
  try {
    await adminService.removePlayerFromTeam(playerId, selectedTeamId.value);
    successMessage.value = 'Player removed from team successfully';
    setTimeout(() => successMessage.value = '', 3000);
    
    // Reload data
    await loadData();
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to remove player';
    setTimeout(() => errorMessage.value = '', 3000);
  } finally {
    loading.value = false;
  }
};

const openUpdateNumberModal = (player: PlayerProfile) => {
  selectedPlayer.value = player;
  newJerseyNumber.value = player.jerseyNumber?.toString() || '';
  showUpdateNumberModal.value = true;
};

const closeUpdateNumberModal = () => {
  showUpdateNumberModal.value = false;
  selectedPlayer.value = null;
  newJerseyNumber.value = '';
};

const updatePlayerNumber = async () => {
  if (!selectedPlayer.value) return;
  
  const number = parseInt(newJerseyNumber.value);
  if (isNaN(number) || number < 0 || number > 99) {
    errorMessage.value = 'Please enter a valid jersey number (0-99)';
    setTimeout(() => errorMessage.value = '', 3000);
    return;
  }
  
  loading.value = true;
  try {
    await adminService.updatePlayerNumber(selectedPlayer.value.id, selectedTeamId.value, number);
    successMessage.value = 'Jersey number updated successfully';
    setTimeout(() => successMessage.value = '', 3000);
    
    closeUpdateNumberModal();
    await loadData();
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to update jersey number';
    setTimeout(() => errorMessage.value = '', 3000);
  } finally {
    loading.value = false;
  }
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const changeItemsPerPage = () => {
  currentPage.value = 1; // Reset to first page when changing items per page
};

// Lifecycle
onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-white">Player Management</h2>
        <p class="text-gray-400 mt-1">Assign players to teams and manage rosters</p>
      </div>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="successMessage" class="alert alert-success bg-green-600 text-white">
      <span>{{ successMessage }}</span>
    </div>
    <div v-if="errorMessage" class="alert alert-error bg-red-600 text-white">
      <span>{{ errorMessage }}</span>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <span class="loading loading-spinner loading-lg text-fcabl-accent"></span>
      <span class="ml-3 text-gray-400">Loading...</span>
    </div>

    <!-- Main Content -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Left Panel: Team Roster -->
      <div class="card bg-fcabl-dark-light shadow-xl">
        <div class="card-body">
          <h3 class="card-title text-fcabl-accent">Team Roster</h3>
          
          <!-- Team Selector -->
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-gray-400 font-semibold">Select Team</span>
            </label>
            <select 
              v-model="selectedTeamId" 
              @change="handleTeamChange"
              class="select select-bordered w-full bg-fcabl-dark text-white"
            >
              <option value="">-- Select a Team --</option>
              <option v-for="team in teams" :key="team.id" :value="team.id">
                {{ team.name }}
              </option>
            </select>
          </div>

          <!-- Team Info -->
          <div v-if="selectedTeam" class="mt-4 p-4 bg-fcabl-dark rounded-lg">
            <div class="flex justify-between items-center">
              <div>
                <h4 class="text-lg font-bold text-white">{{ selectedTeam.name }}</h4>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold text-fcabl-accent">{{ teamRoster.length }}</p>
                <p class="text-xs text-gray-400">Players</p>
              </div>
            </div>
          </div>

          <!-- Roster Table -->
          <div v-if="selectedTeamId" class="mt-6">
            <div v-if="teamRoster.length === 0" class="text-center py-8 text-gray-400">
              No players on this team yet
            </div>
            <div v-else class="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
              <table class="table table-zebra w-full min-w-max">
                <thead>
                  <tr>
                    <th class="bg-fcabl-dark text-fcabl-accent">#</th>
                    <th class="bg-fcabl-dark text-fcabl-accent">Name</th>
                    <th class="bg-fcabl-dark text-fcabl-accent">Email</th>
                    <th class="bg-fcabl-dark text-fcabl-accent">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="player in teamRoster" :key="player.id">
                    <td class="text-white font-bold">{{ player.jerseyNumber || '-' }}</td>
                    <td class="text-white">{{ player.fullName }}</td>
                    <td class="text-gray-400 text-sm">{{ player.email || '-' }}</td>
                    <td>
                      <div class="flex gap-2">
                        <button 
                          @click="openUpdateNumberModal(player)"
                          class="btn btn-xs btn-outline btn-info"
                          title="Update Jersey Number"
                        >
                          <font-awesome-icon icon="edit" class="mr-1" />
                          Number
                        </button>
                        <button 
                          @click="removePlayerFromTeam(player.id)"
                          class="btn btn-xs btn-outline btn-error"
                          title="Remove from Team"
                        >
                          <font-awesome-icon icon="trash" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-400">
            Select a team to view its roster
          </div>
        </div>
      </div>

      <!-- Right Panel: Unassigned Players -->
      <div class="card bg-fcabl-dark-light shadow-xl">
        <div class="card-body">
          <h3 class="card-title text-fcabl-accent">Unassigned Players</h3>
          
          <!-- Search and Items Per Page Controls -->
          <div class="flex flex-col sm:flex-row gap-4 items-end">
            <div class="form-control w-full sm:flex-1">
              <label class="label">
                <span class="label-text text-gray-400 font-semibold">Search Players</span>
              </label>
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Search by name or email..." 
                class="input input-bordered w-full bg-fcabl-dark text-white"
              />
            </div>
            
            <div class="form-control w-full sm:w-32">
              <label class="label">
                <span class="label-text text-gray-400 font-semibold">Per Page</span>
              </label>
              <select 
                v-model="itemsPerPage" 
                @change="changeItemsPerPage"
                class="select select-bordered bg-fcabl-dark text-white"
              >
                <option v-for="option in itemsPerPageOptions" :key="option" :value="option">
                  {{ option }}
                </option>
              </select>
            </div>
          </div>

          <!-- Unassigned Players Table -->
          <div class="mt-6">
            <div v-if="filteredUnassignedPlayers.length === 0" class="text-center py-8 text-gray-400">
              {{ searchQuery ? 'No players found matching your search' : 'All players are assigned to teams' }}
            </div>
            
            <div v-else>
              <!-- Table -->
              <div class="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                <table class="table table-zebra w-full min-w-max">
                  <thead>
                    <tr>
                      <th class="bg-fcabl-dark text-fcabl-accent">Name</th>
                      <th class="bg-fcabl-dark text-fcabl-accent">Email</th>
                      <th class="bg-fcabl-dark text-fcabl-accent">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="player in paginatedPlayers" :key="player.id">
                      <td class="text-white">{{ player.fullName }}</td>
                      <td class="text-gray-400 text-sm">{{ player.email || 'No email' }}</td>
                      <td>
                        <button 
                          @click="assignPlayerToTeam(player.id)"
                          :disabled="!selectedTeamId"
                          class="btn btn-sm btn-primary"
                          :class="{ 'btn-disabled': !selectedTeamId }"
                          :title="!selectedTeamId ? 'Select a team first' : `Assign to ${selectedTeam?.name}`"
                        >
                          <font-awesome-icon icon="plus" class="mr-1" />
                          Assign
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <!-- Pagination Controls -->
              <div class="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
                <div class="text-sm text-gray-400">
                  Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} to 
                  {{ Math.min(currentPage * itemsPerPage, filteredUnassignedPlayers.length) }} of 
                  {{ filteredUnassignedPlayers.length }} players
                </div>
                
                <div class="join">
                  <button 
                    @click="goToPage(1)" 
                    :disabled="currentPage === 1"
                    class="join-item btn btn-sm"
                  >
                    «
                  </button>
                  <button 
                    @click="goToPage(currentPage - 1)" 
                    :disabled="currentPage === 1"
                    class="join-item btn btn-sm"
                  >
                    ‹
                  </button>
                  
                  <button 
                    v-for="page in pageRange" 
                    :key="page"
                    @click="goToPage(page)"
                    :class="['join-item btn btn-sm', { 'btn-active': page === currentPage }]"
                  >
                    {{ page }}
                  </button>
                  
                  <button 
                    @click="goToPage(currentPage + 1)" 
                    :disabled="currentPage === totalPages"
                    class="join-item btn btn-sm"
                  >
                    ›
                  </button>
                  <button 
                    @click="goToPage(totalPages)" 
                    :disabled="currentPage === totalPages"
                    class="join-item btn btn-sm"
                  >
                    »
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Info Message -->
          <div v-if="!selectedTeamId" class="alert alert-info bg-blue-600 text-white mt-4">
            <span>Select a team above to assign players</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Update Jersey Number Modal -->
    <dialog :class="{ 'modal modal-open': showUpdateNumberModal }" class="modal">
      <div class="modal-box w-full max-w-md sm:max-w-lg p-4 sm:p-6 bg-fcabl-dark-light">
        <h3 class="font-bold text-lg text-white mb-4">Update Jersey Number</h3>
        
        <div v-if="selectedPlayer" class="space-y-4">
          <p class="text-gray-400">
            Update jersey number for <span class="font-bold text-white">{{ selectedPlayer.fullName }}</span>
          </p>
          
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-gray-400 font-semibold">Jersey Number</span>
            </label>
            <input 
              v-model="newJerseyNumber"
              type="number" 
              min="0"
              max="99"
              placeholder="Enter jersey number (0-99)" 
              class="input input-bordered w-full bg-fcabl-dark text-white"
              @keyup.enter="updatePlayerNumber"
            />
          </div>
        </div>

        <div class="modal-action">
          <button @click="closeUpdateNumberModal" class="btn btn-outline">Cancel</button>
          <button @click="updatePlayerNumber" class="btn btn-primary">
            <font-awesome-icon icon="save" class="mr-2" />
            Update
          </button>
        </div>
      </div>
      <div class="modal-backdrop" @click="closeUpdateNumberModal"></div>
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
