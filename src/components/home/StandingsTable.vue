<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { mockStandings } from "@/data/mockData";

const standings = mockStandings;

const formatWinPercentage = (pct: number): string => {
    return (pct * 100).toFixed(1) + "%";
};
</script>

<template>
    <section class="py-16 bg-fcabl-dark-light">
        <div class="container mx-auto px-4">
            <!-- Section Header -->
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h2 class="text-3xl md:text-4xl font-bold text-white mb-2">
                        <font-awesome-icon
                            :icon="['fas', 'trophy']"
                            class="text-fcabl-accent mr-3"
                        />
                        Standings
                    </h2>
                    <p class="text-gray-400">Current league standings</p>
                </div>
                <router-link
                    to="/standings"
                    class="hidden sm:flex btn btn-outline btn-sm text-gray-300 border-2 border-gray-600 hover:bg-fcabl-accent hover:border-fcabl-accent hover:text-white"
                >
                    Full Standings
                    <font-awesome-icon
                        :icon="['fas', 'chevron-right']"
                        class="ml-2"
                    />
                </router-link>
            </div>

            <!-- Desktop Table -->
            <div
                class="hidden md:block overflow-x-auto bg-fcabl-dark rounded-lg shadow-xl"
            >
                <table class="table w-full">
                    <thead>
                        <tr class="border-b border-gray-700">
                            <th class="text-gray-400">Rank</th>
                            <th class="text-gray-400">Team</th>
                            <th class="text-gray-400 text-center">W</th>
                            <th class="text-gray-400 text-center">L</th>
                            <th class="text-gray-400 text-center">Win %</th>
                            <th class="text-gray-400 text-center">Streak</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="standing in standings"
                            :key="standing.team.id"
                            class="hover:bg-fcabl-dark-light/50 transition-colors border-b border-gray-800"
                        >
                            <td class="font-semibold">
                                <span
                                    v-if="standing.rank === 1"
                                    class="text-fcabl-accent text-xl"
                                >
                                    <font-awesome-icon
                                        :icon="['fas', 'trophy']"
                                    />
                                </span>
                                <span v-else class="text-gray-400">{{
                                    standing.rank
                                }}</span>
                            </td>
                            <td>
                                <router-link
                                    :to="{
                                        path: '/teams',
                                        query: { team_id: standing.team.id },
                                    }"
                                    class="font-semibold text-white text-lg hover:text-fcabl-accent transition-colors"
                                >
                                    {{ standing.team.name }}
                                </router-link>
                            </td>
                            <td class="text-center font-semibold text-success">
                                {{ standing.team.wins }}
                            </td>
                            <td class="text-center font-semibold text-error">
                                {{ standing.team.losses }}
                            </td>
                            <td
                                class="text-center font-semibold text-fcabl-accent"
                            >
                                {{
                                    formatWinPercentage(
                                        standing.team.winPercentage,
                                    )
                                }}
                            </td>
                            <td class="text-center">
                                <span
                                    class="badge badge-sm"
                                    :class="
                                        standing.streak?.startsWith('W')
                                            ? 'badge-success'
                                            : 'badge-error'
                                    "
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
                    class="card bg-fcabl-dark shadow-xl"
                >
                    <div class="card-body">
                        <div class="flex justify-between items-start mb-3">
                            <div class="flex items-center gap-3">
                                <span
                                    v-if="standing.rank === 1"
                                    class="text-fcabl-accent text-2xl"
                                >
                                    <font-awesome-icon
                                        :icon="['fas', 'trophy']"
                                    />
                                </span>
                                <span
                                    v-else
                                    class="text-2xl font-bold text-gray-400"
                                    >#{{ standing.rank }}</span
                                >
                                <router-link
                                    :to="{
                                        path: '/teams',
                                        query: { team_id: standing.team.id },
                                    }"
                                    class="text-xl font-bold text-white hover:text-fcabl-accent transition-colors"
                                >
                                    {{ standing.team.name }}
                                </router-link>
                            </div>
                            <span
                                class="badge"
                                :class="
                                    standing.streak?.startsWith('W')
                                        ? 'badge-success'
                                        : 'badge-error'
                                "
                            >
                                {{ standing.streak }}
                            </span>
                        </div>

                        <div class="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div class="text-2xl font-bold text-success">
                                    {{ standing.team.wins }}
                                </div>
                                <div class="text-xs text-gray-400">Wins</div>
                            </div>
                            <div>
                                <div class="text-2xl font-bold text-error">
                                    {{ standing.team.losses }}
                                </div>
                                <div class="text-xs text-gray-400">Losses</div>
                            </div>
                            <div>
                                <div
                                    class="text-2xl font-bold text-fcabl-accent"
                                >
                                    {{
                                        formatWinPercentage(
                                            standing.team.winPercentage,
                                        )
                                    }}
                                </div>
                                <div class="text-xs text-gray-400">Win %</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Mobile View All Button -->
            <div class="mt-8 text-center sm:hidden">
                <router-link
                    to="/standings"
                    class="btn btn-outline text-gray-300 border-2 border-gray-600 hover:bg-fcabl-accent hover:border-fcabl-accent hover:text-white"
                >
                    Full Standings
                    <font-awesome-icon
                        :icon="['fas', 'chevron-right']"
                        class="ml-2"
                    />
                </router-link>
            </div>
        </div>
    </section>
</template>
