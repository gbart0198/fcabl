<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
</script>

<template>
  <section id="about" class="py-16 bg-fcabl-dark-light">
    <div class="container mx-auto px-4">
      <!-- Section Header -->
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">About FCABL</h2>
        <p class="text-gray-400 text-lg max-w-2xl mx-auto">
          The premier adult basketball league in Fairfield County
        </p>
      </div>

      <!-- Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <!-- About Text -->
        <div class="space-y-6">
          <div class="card bg-fcabl-dark shadow-xl">
            <div class="card-body">
              <h3 class="card-title text-fcabl-accent mb-4">
                <font-awesome-icon :icon="['fas', 'info-circle']" class="mr-2" />
                Our Mission
              </h3>
              <p class="text-gray-300 leading-relaxed">
                The Fairfield County Adult Basketball League (FCABL) was founded to provide competitive, 
                organized basketball for adults in the Fairfield County area. We bring together players 
                of all skill levels who share a passion for the game.
              </p>
              <p class="text-gray-300 leading-relaxed">
                Our league emphasizes sportsmanship, competition, and community. Whether you're looking 
                to stay active, compete at a high level, or just have fun playing the game you love, 
                FCABL is the place for you.
              </p>
            </div>
          </div>

          <div class="card bg-fcabl-dark shadow-xl">
            <div class="card-body">
              <h3 class="card-title text-fcabl-accent mb-4">
                <font-awesome-icon :icon="['fas', 'users']" class="mr-2" />
                Who Can Join
              </h3>
              <p class="text-gray-300 leading-relaxed">
                Open to adults 18 years and older. All skill levels are welcome! We organize teams 
                to ensure competitive balance and fair play throughout the season.
              </p>
            </div>
          </div>
        </div>

        <!-- Key Information -->
        <div class="space-y-6">
          <div class="card bg-fcabl-dark shadow-xl">
            <div class="card-body">
              <h3 class="card-title text-fcabl-accent mb-4">
                <font-awesome-icon :icon="['fas', 'clipboard-list']" class="mr-2" />
                League Information
              </h3>
              <ul class="space-y-4">
                <li class="flex items-start gap-3">
                  <font-awesome-icon :icon="['fas', 'calendar-alt']" class="text-fcabl-accent mt-1 flex-shrink-0" />
                  <div>
                    <div class="font-semibold text-white">Season Duration</div>
                    <div class="text-gray-400 text-sm">Winter/Spring 2025 (Jan - May)</div>
                  </div>
                </li>
                <li class="flex items-start gap-3">
                  <font-awesome-icon :icon="['fas', 'clock']" class="text-fcabl-accent mt-1 flex-shrink-0" />
                  <div>
                    <div class="font-semibold text-white">Game Days</div>
                    <div class="text-gray-400 text-sm">Weeknight evenings (Monday-Thursday)</div>
                  </div>
                </li>
                <li class="flex items-start gap-3">
                  <font-awesome-icon :icon="['fas', 'map-marker-alt']" class="text-fcabl-accent mt-1 flex-shrink-0" />
                  <div>
                    <div class="font-semibold text-white">Locations</div>
                    <div class="text-gray-400 text-sm">Various gyms across Fairfield County</div>
                  </div>
                </li>
                <li class="flex items-start gap-3">
                  <font-awesome-icon :icon="['fas', 'dollar-sign']" class="text-fcabl-accent mt-1 flex-shrink-0" />
                  <div>
                    <div class="font-semibold text-white">Registration Fee</div>
                    <div class="text-gray-400 text-sm">$150 per player (includes jersey)</div>
                  </div>
                </li>
                <li class="flex items-start gap-3">
                  <font-awesome-icon :icon="['fas', 'basketball']" class="text-fcabl-accent mt-1 flex-shrink-0" />
                  <div>
                    <div class="font-semibold text-white">Game Format</div>
                    <div class="text-gray-400 text-sm">5-on-5, regulation rules, refereed games</div>
                  </div>
                </li>
                <li class="flex items-start gap-3">
                  <font-awesome-icon :icon="['fas', 'trophy']" class="text-fcabl-accent mt-1 flex-shrink-0" />
                  <div>
                    <div class="font-semibold text-white">Playoffs</div>
                    <div class="text-gray-400 text-sm">Top 4 teams advance to playoff bracket</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <!-- CTA Card -->
          <div class="card bg-gradient-to-br from-fcabl-navy to-fcabl-blue shadow-xl">
            <div class="card-body text-center">
              <h3 class="text-2xl font-bold text-white mb-2">Ready to Play?</h3>
              <p class="text-gray-200 mb-4">
                Registration for the 2025 season is now open!
              </p>
              <button class="btn btn-accent btn-lg bg-fcabl-accent hover:bg-amber-600 border-0 text-fcabl-dark font-bold">
                <font-awesome-icon :icon="['fas', 'user-plus']" class="mr-2" />
                Register Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
