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
      path: '/playoffs',
      name: 'playoffs',
      component: () => import('@/views/SchedulePage.vue'),
      meta: {
        title: 'Playoffs - FCABL',
      },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfilePage.vue'),
      meta: {
        title: 'My Profile - FCABL',
        requiresAuth: true,
      },
    },
    {
      path: '/password-reset',
      name: 'password-reset-request',
      component: () => import('@/views/PasswordResetRequestPage.vue'),
      meta: {
        title: 'Reset Password - FCABL',
      },
    },
    {
      path: '/password-reset/confirm/:token',
      name: 'password-reset-confirm',
      component: () => import('@/views/PasswordResetConfirmPage.vue'),
      props: true,
      meta: {
        title: 'Set New Password - FCABL',
      },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/AdminPage.vue'),
      meta: {
        title: 'Admin Dashboard - FCABL',
        requiresAuth: true,
        requiresAdmin: true,
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

// Global navigation guard for authentication and authorization
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();

  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    // Ensure we have checked authentication status
    if (!authStore.user) {
      await authStore.checkAuth();
    }

    // Redirect to home if not authenticated
    if (!authStore.isAuthenticated) {
      next({ name: 'home' });
      return;
    }

    // Check if route requires admin role
    if (to.meta.requiresAdmin && !authStore.isAdmin) {
      next({ name: 'home' });
      return;
    }
  }

  next();
});

// Navigation guard for setting page titles
router.afterEach((to) => {
  const title = to.meta.title as string;
  if (title) {
    document.title = title;
  }
});

export default router;
