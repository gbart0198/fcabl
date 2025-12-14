<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { teamService } from '@/services/api';
import type { Team, TeamDetail } from '@/types/game.types';
import TeamStats from '@/components/teams/TeamStats.vue';
import TeamRoster from '@/components/teams/TeamRoster.vue';
import TeamSchedule from '@/components/teams/TeamSchedule.vue';

const route = useRoute();
const router = useRouter();

const allTeams = ref<Team[]>([]);
const selectedTeam = ref<TeamDetail | null>(null);
const selectedTeamId = ref<string>('');
const loading = ref(false);
const error = ref<string | null>(null);

// Sort teams alphabetically by name
const sortedTeams = computed(() => {
  return [...allTeams.value].sort((a, b) => a.name.localeCompare(b.name));
});

const formatRecord = (team: TeamDetail): string => {
  return `${team.wins}-${team.losses}`;
};

const formatWinPercentage = (pct: number): string => {
  return (pct * 100).toFixed(1) + '%';
};

const selectTeam = async (teamId: string) => {
  if (!teamId) return;
  
  try {
    loading.value = true;
    error.value = null;
    
    // Update URL with query parameter (doesn't reload the page)
    router.push({ path: '/teams', query: { team_id: teamId } });
    
    // Fetch team details
    const team = await teamService.getTeamById(teamId);
    if (team) {
      selectedTeam.value = team;
      selectedTeamId.value = teamId;
    } else {
      error.value = 'Team not found';
    }
  } catch (err) {
    error.value = 'Failed to load team details';
    console.error('Error loading team:', err);
  } finally {
    loading.value = false;
  }
};

const loadTeamDetails = async (teamId: string) => {
  try {
    loading.value = true;
    error.value = null;
    
    const team = await teamService.getTeamById(teamId);
    if (team) {
      selectedTeam.value = team;
      selectedTeamId.value = teamId;
    } else {
      error.value = 'Team not found';
      selectedTeam.value = null;
      selectedTeamId.value = '';
    }
  } catch (err) {
    error.value = 'Failed to load team details';
    console.error('Error loading team:', err);
  } finally {
    loading.value = false;
  }
};

// Watch query parameter changes
watch(() => route.query.team_id, (newTeamId) => {
  if (newTeamId && typeof newTeamId === 'string') {
    loadTeamDetails(newTeamId);
  } else {
    // No team selected - clear selection
    selectedTeam.value = null;
    selectedTeamId.value = '';
  }
}, { immediate: false });

onMounted(async () => {
  try {
    // Load all teams for dropdown
    allTeams.value = await teamService.getAllTeams();
    
    // If team_id is in query params, load that team
    const teamId = route.query.team_id;
    if (teamId && typeof teamId === 'string') {
      await loadTeamDetails(teamId);
    }
  } catch (err) {
    error.value = 'Failed to load teams';
    console.error('Error loading teams:', err);
  }
});
</script>

<template>
  <div class="min-h-screen bg-fcabl-dark">
    <!-- Header Section -->
    <section class="py-16 bg-fcabl-dark-light">
      <div class="container mx-auto px-4">
        <div class="text-center mb-8">
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
            <font-awesome-icon :icon="['fas', 'basketball']" class="text-fcabl-accent mr-3" />
            Teams
          </h1>
          <p class="text-gray-400 text-lg">View team rosters, schedules, and statistics</p>
        </div>

        <!-- Team Dropdown Selector -->
        <div v-if="sortedTeams.length > 0" class="flex justify-center">
          <div class="form-control w-full max-w-xs">
            <label class="label">
              <span class="label-text text-gray-400">Select a team</span>
            </label>
            <select
              v-model="selectedTeamId"
              @change="selectTeam(selectedTeamId)"
              class="select select-bordered select-lg bg-fcabl-dark text-white border-gray-600 focus:border-fcabl-accent focus:outline-none pl-6"
            >
              <option value="" disabled class="text-center">Choose a team...</option>
              <option
                v-for="team in sortedTeams"
                :key="team.id"
                :value="team.id"
                class="text-center"
              >
                {{ team.name }} ({{ team.wins }}-{{ team.losses }})
              </option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Content Section -->
    <section class="py-12">
      <div class="container mx-auto px-4">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <span class="loading loading-spinner loading-lg text-fcabl-accent"></span>
          <p class="text-gray-400 mt-4">Loading team details...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12">
          <font-awesome-icon :icon="['fas', 'exclamation-circle']" class="text-error text-5xl mb-4" />
          <p class="text-error text-lg">{{ error }}</p>
        </div>

        <!-- Team Details -->
        <div v-else-if="selectedTeam" class="space-y-8">
          <!-- Team Header -->
          <div class="text-center mb-8">
            <h2 class="text-4xl md:text-5xl font-bold text-white mb-2">{{ selectedTeam.name }}</h2>
            <p class="text-2xl text-gray-400">
              {{ formatRecord(selectedTeam) }}
              <span class="text-fcabl-accent ml-2">({{ formatWinPercentage(selectedTeam.winPercentage) }})</span>
            </p>
          </div>

          <!-- Team Statistics -->
          <TeamStats :team="selectedTeam" />

          <!-- Team Roster -->
          <TeamRoster :roster="selectedTeam.roster" />

          <!-- Team Schedule -->
          <TeamSchedule :games="selectedTeam.games" :team-id="selectedTeam.id" />
        </div>

        <!-- No Team Selected -->
        <div v-else class="text-center py-12">
          <font-awesome-icon :icon="['fas', 'basketball']" class="text-gray-600 text-5xl mb-4" />
          <p class="text-gray-400 text-lg">Select a team from the dropdown above to view details</p>
        </div>
      </div>
    </section>
  </div>
</template>
