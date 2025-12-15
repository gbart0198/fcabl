/**
 * Vue Router configuration
 */

import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import HomePage from '@/views/HomePage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: {
        title: 'Home - FCABL',
      },
    },
    {
      path: '/standings',
      name: 'standings',
      component: () => import('@/views/StandingsPage.vue'),
      meta: {
        title: 'Standings - FCABL',
      },
    },
    {
      path: '/teams',
      name: 'teams',
      component: () => import('@/views/TeamsPage.vue'),
      meta: {
        title: 'Teams - FCABL',
      },
    },
    {
      path: '/schedule',
      name: 'schedule',
      component: () => import('@/views/SchedulePage.vue'),
      meta: {
        title: 'Schedule - FCABL',
      },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/AdminPage.vue'),
      meta: {
        title: 'Admin Dashboard - FCABL',
        requiresAuth: true,
      },
      beforeEnter: (_to, _from, next) => {
        const authStore = useAuthStore();
        if (!authStore.isAuthenticated) {
          next('/');
        } else {
          next();
        }
      },
    },
  ],
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

// Navigation guard for setting page titles
router.beforeEach((to, _from, next) => {
  const title = to.meta.title as string;
  if (title) {
    document.title = title;
  }
  next();
});

export default router;
