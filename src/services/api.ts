/**
 * Mock API service layer for authentication, teams, and standings
 * This will be replaced with real API calls when backend is implemented
 */

import type { LoginCredentials, RegisterData, AuthResponse, User } from '@/types/auth.types';
import type { Team, TeamDetail, Standing, Game } from '@/types/game.types';
import { mockTeamDetails, mockStandings, mockAllGames, generateGameDetails } from '@/data/mockData';

/** Simulated network delay in milliseconds */
const MOCK_DELAY = 500;

/** Mock user data for demonstration */
const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'player',
};

/**
 * Authentication service with stubbed API calls
 */
export const authService = {
  /**
   * Mock login endpoint
   * @param credentials - User login credentials
   * @returns Promise resolving to authentication response
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    
    // Mock validation - in real implementation, this would call the backend
    if (credentials.email && credentials.password) {
      return {
        success: true,
        token: 'mock-jwt-token-' + Date.now(),
        user: { ...mockUser, email: credentials.email },
      };
    }
    
    return {
      success: false,
      error: 'Invalid credentials',
    };
  },

  /**
   * Mock registration endpoint
   * @param data - User registration data
   * @returns Promise resolving to authentication response
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    
    // Mock successful registration
    return {
      success: true,
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: String(Date.now()),
        name: data.name,
        email: data.email,
        role: 'player',
      },
    };
  },

  /**
   * Mock logout endpoint
   * Clears stored authentication data
   */
  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    localStorage.removeItem('fcabl_token');
    localStorage.removeItem('fcabl_user');
  },

  /**
   * Mock token verification endpoint
   * @param token - JWT token to verify
   * @returns Promise resolving to user data if token is valid, null otherwise
   */
  async verifyToken(token: string): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Mock token verification
    const storedUser = localStorage.getItem('fcabl_user');
    if (storedUser && token) {
      try {
        return JSON.parse(storedUser);
      } catch {
        return null;
      }
    }
    return null;
  },
};

/**
 * Team service with stubbed API calls
 */
export const teamService = {
  /**
   * Get all teams (basic info)
   * @returns Promise resolving to array of teams
   */
  async getAllTeams(): Promise<Team[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return Object.values(mockTeamDetails).map(td => ({
      id: td.id,
      name: td.name,
      wins: td.wins,
      losses: td.losses,
      winPercentage: td.winPercentage,
    }));
  },

  /**
   * Get detailed team info including roster and games
   * @param id - Team ID
   * @returns Promise resolving to team details or null if not found
   */
  async getTeamById(id: string): Promise<TeamDetail | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockTeamDetails[id] || null;
  },
};

/**
 * Standings service with stubbed API calls
 */
export const standingsService = {
  /**
   * Get full league standings
   * @returns Promise resolving to array of standings
   */
  async getFullStandings(): Promise<Standing[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockStandings;
  },
};

/**
 * Schedule service with stubbed API calls
 */
export const scheduleService = {
  /**
   * Get all league games (completed and scheduled)
   * @returns Promise resolving to array of all games
   */
  async getAllGames(): Promise<Game[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    // Add game details to completed games
    return mockAllGames.map(game => {
      if (game.status === 'completed') {
        return {
          ...game,
          details: generateGameDetails(game),
        };
      }
      return game;
    });
  },
};
