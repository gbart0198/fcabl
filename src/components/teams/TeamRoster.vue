<script setup lang="ts">
import { computed } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import type { SimplePlayerDetails } from "@/types/game.types";

interface Props {
    roster: SimplePlayerDetails[];
}

const props = defineProps<Props>();

const sortedRoster = computed(() => {
    return [...props.roster].sort(
        (a, b) => (a.jerseyNumber || 99) - (b.jerseyNumber || 99),
    );
});
</script>

<template>
    <div class="bg-fcabl-dark-light rounded-lg shadow-2xl p-6">
        <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <font-awesome-icon
                :icon="['fas', 'users']"
                class="text-fcabl-accent"
            />
            Roster
        </h3>

        <!-- Desktop Table -->
        <div class="hidden md:block overflow-x-auto">
            <table class="table w-full">
                <thead>
                    <tr class="border-b border-gray-700">
                        <th class="text-gray-400 text-center">#</th>
                        <th class="text-gray-400">Player Name</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="player in sortedRoster"
                        :key="player.lastName"
                        class="hover:bg-fcabl-dark-light/50 transition-colors border-b border-gray-800"
                    >
                        <td class="text-center">
                            <span
                                class="badge badge-lg bg-fcabl-blue text-white border-0 font-bold"
                            >
                                {{ player.jerseyNumber || "-" }}
                            </span>
                        </td>
                        <td>
                            <span class="font-semibold text-white text-lg">{{
                                player.firstName + " " + player.lastName
                            }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Mobile Cards -->
        <div class="md:hidden space-y-3">
            <div
                v-for="player in sortedRoster"
                :key="player.lastName"
                class="card bg-fcabl-dark-light shadow-lg"
            >
                <div class="card-body p-4">
                    <div class="flex items-center gap-3">
                        <div
                            class="badge badge-lg bg-fcabl-blue text-white border-0 font-bold text-xl w-12 h-12"
                        >
                            {{ player.jerseyNumber || "-" }}
                        </div>
                        <div>
                            <h4 class="font-semibold text-white text-lg">
                                {{ player.firstName + " " + player.lastName }}
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Roster Summary -->
        <div
            class="mt-4 pt-4 border-t border-gray-700 text-center text-gray-400 text-sm"
        >
            {{ roster.length }} Players
        </div>
    </div>
</template>
