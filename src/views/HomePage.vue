<script setup lang="ts">
import HeroSection from '@/components/home/HeroSection.vue';
import RecentGames from '@/components/home/RecentGames.vue';
import StandingsTable from '@/components/home/StandingsTable.vue';
import UpcomingSchedule from '@/components/home/UpcomingSchedule.vue';
import LeagueInfo from '@/components/home/LeagueInfo.vue';
</script>

<template>
  <div>
    <!-- Hero Section -->
    <HeroSection />

    <!-- Recent Games -->
    <RecentGames />

    <!-- Standings -->
    <StandingsTable />

    <!-- Upcoming Schedule -->
    <UpcomingSchedule />

    <!-- League Info -->
    <LeagueInfo />
  </div>
</template>
