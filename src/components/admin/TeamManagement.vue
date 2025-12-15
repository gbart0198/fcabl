<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { teamService, adminService } from '@/services/api';
import type { TeamDetail } from '@/types/game.types';
import type { CreateTeamData, UpdateTeamData } from '@/types/admin.types';

// State
const teams = ref<TeamDetail[]>([]);
const loading = ref(false);
const saving = ref(false);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);

// Modal state
const showModal = ref(false);
const editingTeam = ref<TeamDetail | null>(null);
const showDeleteDialog = ref(false);
const deletingTeam = ref<TeamDetail | null>(null);

// Form state
const formData = ref({
  name: '',
});

// Methods
async function loadTeams() {
  loading.value = true;
  error.value = null;
  try {
    const allTeams = await teamService.getAllTeams();
    const teamDetails = await Promise.all(
      allTeams.map(team => teamService.getTeamById(team.id))
    );
    teams.value = teamDetails.filter(t => t !== null) as TeamDetail[];
  } catch (err) {
    error.value = 'Failed to load teams';
    console.error('Error loading teams:', err);
  } finally {
    loading.value = false;
  }
}

function openCreateModal() {
  editingTeam.value = null;
  formData.value = { name: '' };
  showModal.value = true;
}

function openEditModal(team: TeamDetail) {
  editingTeam.value = team;
  formData.value = {
    name: team.name,
  };
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  editingTeam.value = null;
  error.value = null;
}

async function submitForm() {
  if (!formData.value.name.trim()) {
    error.value = 'Team name is required';
    return;
  }

  saving.value = true;
  error.value = null;

  try {
    if (editingTeam.value) {
      // Update existing team
      const updateData: UpdateTeamData = {
        id: editingTeam.value.id,
        name: formData.value.name.trim(),
      };
      await adminService.updateTeam(editingTeam.value.id, updateData);
      successMessage.value = 'Team updated successfully';
    } else {
      // Create new team
      const createData: CreateTeamData = {
        name: formData.value.name.trim(),
      };
      await adminService.createTeam(createData);
      successMessage.value = 'Team created successfully';
    }

    closeModal();
    await loadTeams();

    setTimeout(() => {
      successMessage.value = null;
    }, 3000);
  } catch (err) {
    error.value = 'Failed to save team';
    console.error('Error saving team:', err);
  } finally {
    saving.value = false;
  }
}

function openDeleteDialog(team: TeamDetail) {
  deletingTeam.value = team;
  showDeleteDialog.value = true;
}

function closeDeleteDialog() {
  showDeleteDialog.value = false;
  deletingTeam.value = null;
  error.value = null;
}

async function confirmDelete() {
  if (!deletingTeam.value) return;

  saving.value = true;
  error.value = null;

  try {
    const response = await adminService.deleteTeam(deletingTeam.value.id);
    
    if (response.success) {
      successMessage.value = `${deletingTeam.value.name} deleted successfully`;
      closeDeleteDialog();
      await loadTeams();

      setTimeout(() => {
        successMessage.value = null;
      }, 3000);
    } else {
      error.value = response.error || 'Failed to delete team';
    }
  } catch (err) {
    error.value = 'An error occurred while deleting the team';
    console.error('Error deleting team:', err);
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  loadTeams();
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-white">Team Management</h2>
        <p class="text-gray-400 text-sm mt-1">Create, edit, and manage teams</p>
      </div>
      <button @click="openCreateModal" class="btn btn-primary bg-fcabl-accent border-0">
        <font-awesome-icon :icon="['fas', 'plus']" />
        Add Team
      </button>
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
      <p class="text-gray-400 mt-4">Loading teams...</p>
    </div>

    <!-- Teams List -->
    <div v-else-if="teams.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="team in teams"
        :key="team.id"
        class="card bg-fcabl-dark-light shadow-xl hover:shadow-2xl transition-shadow"
      >
        <div class="card-body">
          <h3 class="card-title text-white">{{ team.name }}</h3>
          
          <div class="space-y-2 text-sm">
            <div class="flex items-center gap-2 text-gray-400">
              <font-awesome-icon :icon="['fas', 'trophy']" class="w-4" />
              <span>{{ team.wins }}W - {{ team.losses }}L</span>
            </div>
          </div>

          <div class="card-actions justify-end mt-4">
            <button @click="openEditModal(team)" class="btn btn-sm btn-ghost text-fcabl-accent">
              <font-awesome-icon :icon="['fas', 'edit']" />
              Edit
            </button>
            <button @click="openDeleteDialog(team)" class="btn btn-sm btn-ghost text-error">
              <font-awesome-icon :icon="['fas', 'trash']" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <font-awesome-icon :icon="['fas', 'users']" class="text-gray-600 text-5xl mb-4" />
      <p class="text-gray-400 text-lg">No teams found</p>
      <button @click="openCreateModal" class="btn btn-primary bg-fcabl-accent border-0 mt-4">
        <font-awesome-icon :icon="['fas', 'plus']" />
        Create Your First Team
      </button>
    </div>

    <!-- Create/Edit Team Modal -->
    <dialog :class="{ 'modal modal-open': showModal }" class="modal">
      <div class="modal-box w-full max-w-md sm:max-w-lg p-4 sm:p-6 bg-fcabl-dark-light">
        <h3 class="font-bold text-xl text-white mb-4">
          {{ editingTeam ? 'Edit Team' : 'Create New Team' }}
        </h3>

        <!-- Error in Modal -->
        <div v-if="error && showModal" class="alert alert-error mb-4">
          <font-awesome-icon :icon="['fas', 'exclamation-circle']" />
          <span>{{ error }}</span>
        </div>

        <!-- Form -->
        <div class="space-y-4">
          <div>
            <label class="label">
              <span class="label-text text-gray-400 font-semibold">Team Name *</span>
            </label>
            <input 
              v-model="formData.name" 
              type="text" 
              class="input input-bordered w-full bg-fcabl-dark text-white"
              placeholder="Enter team name"
              required
            />
          </div>
        </div>

        <!-- Modal Actions -->
        <div class="modal-action">
          <button @click="closeModal" class="btn btn-ghost">Cancel</button>
          <button 
            @click="submitForm" 
            class="btn btn-primary bg-fcabl-accent border-0"
            :disabled="saving || !formData.name.trim()"
          >
            <span v-if="saving" class="loading loading-spinner loading-sm"></span>
            <font-awesome-icon v-else :icon="['fas', 'save']" />
            {{ saving ? 'Saving...' : (editingTeam ? 'Update Team' : 'Create Team') }}
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

        <!-- Error in Dialog -->
        <div v-if="error && showDeleteDialog" class="alert alert-error mb-4">
          <font-awesome-icon :icon="['fas', 'exclamation-circle']" />
          <span>{{ error }}</span>
        </div>

        <p class="text-gray-300 mb-4">
          Are you sure you want to delete <strong class="text-white">{{ deletingTeam?.name }}</strong>?
        </p>
        <p class="text-gray-400 text-sm">
          This action cannot be undone.
        </p>

        <div class="modal-action">
          <button @click="closeDeleteDialog" class="btn btn-ghost">Cancel</button>
          <button 
            @click="confirmDelete" 
            class="btn btn-error"
            :disabled="saving"
          >
            <span v-if="saving" class="loading loading-spinner loading-sm"></span>
            <font-awesome-icon v-else :icon="['fas', 'trash']" />
            {{ saving ? 'Deleting...' : 'Delete Team' }}
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
.input {
  padding-left: 1rem !important;
  padding-right: 1rem !important;
}
</style>
