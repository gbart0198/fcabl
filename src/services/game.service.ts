/**
 * Game API service
 * Handles all game/schedule-related API calls
 */

import { apiClient } from './apiClient';
import type { Game, GameWithDetails } from '@/types/game.types';

/**
 * Parameters for getting a game
 * Can query by id or other unique fields
 */
export interface GetGameParams extends Record<string, string | undefined> {
  id?: string;
}

/**
 * Parameters for listing games by team
 */
export interface ListGamesByTeamParams extends Record<string, string | undefined> {
  teamId: string;
}

/**
 * Parameters for getting team schedule
 */
export interface ListTeamScheduleParams extends Record<string, string | undefined> {
  teamId: string;
}

/**
 * Data for creating a new game
 */
export interface CreateGameData {
  homeTeamId: string;
  awayTeamId: string;
  gameTime: string;
}

/**
 * Data for updating an existing game
 */
export interface UpdateGameData {
  id: string;
  homeTeamId?: string;
  awayTeamId?: string;
  gameTime?: string;
}

/**
 * Data for updating game score and status
 */
export interface UpdateGameScoreAndStatusData {
  id: string;
  homeScore: number;
  awayScore: number;
  status: 'scheduled' | 'live' | 'completed';
}

/**
 * Data for updating game time
 */
export interface UpdateGameTimeData {
  id: string;
  gameTime: string;
}

/**
 * Game service for managing games and schedules
 */
export const gameService = {
  /**
   * Get a list of all games
   * @returns Promise resolving to array of games
   */
  async listGames(): Promise<Game[]> {
    return apiClient.get<Game[]>('/api/game/list');
  },

  /**
   * Get a list of upcoming games
   * @returns Promise resolving to array of upcoming games
   */
  async listUpcomingGames(): Promise<GameWithDetails[]> {
    return apiClient.get<GameWithDetails[]>('/api/game/upcoming');
  },

  /**
   * Get a list of past games
   * @returns Promise resolving to array of past games
   */
  async listPastGames(): Promise<GameWithDetails[]> {
    return apiClient.get<GameWithDetails[]>('/api/game/past');
  },

  /**
   * Get a list of games for a specific team
   * @param params - Query parameters (teamId)
   * @returns Promise resolving to array of games
   */
  async listGamesByTeam(params: ListGamesByTeamParams): Promise<Game[]> {
    return apiClient.get<Game[]>('/api/game/team', params);
  },

  /**
   * Get a game with team details
   * @param params - Query parameters (id)
   * @returns Promise resolving to game with team information
   */
  async getGameWithTeams(params: GetGameParams): Promise<GameWithDetails> {
    return apiClient.get<GameWithDetails>('/api/game/with-teams', params);
  },

  /**
   * Get a list of all games with team details
   * @returns Promise resolving to array of games with team information
   */
  async listGamesWithTeams(): Promise<GameWithDetails[]> {
    return apiClient.get<GameWithDetails[]>('/api/game/list-with-teams');
  },

  /**
   * Get team schedule
   * @param params - Query parameters (teamId)
   * @returns Promise resolving to array of scheduled games
   */
  async listTeamSchedule(params: ListTeamScheduleParams): Promise<GameWithDetails[]> {
    return apiClient.get<GameWithDetails[]>('/api/game/schedule', params);
  },

  /**
   * Get a single game by id
   * @param params - Query parameters (id)
   * @returns Promise resolving to game
   */
  async getGame(params: GetGameParams): Promise<Game> {
    return apiClient.get<Game>('/api/game', params);
  },

  /**
   * Create a new game
   * @param data - Game creation data
   * @returns Promise resolving to created game
   */
  async createGame(data: CreateGameData): Promise<Game> {
    return apiClient.post<Game>('/api/game', data);
  },

  /**
   * Update an existing game
   * @param data - Game update data (must include id)
   * @returns Promise resolving to updated game
   */
  async updateGame(data: UpdateGameData): Promise<Game> {
    return apiClient.put<Game>('/api/game', data);
  },

  /**
   * Update game score and status
   * @param data - Game score and status update data
   * @returns Promise resolving to updated game
   */
  async updateGameScoreAndStatus(data: UpdateGameScoreAndStatusData): Promise<Game> {
    return apiClient.put<Game>('/api/game/status', data);
  },

  /**
   * Update game time
   * @param data - Game time update data
   * @returns Promise resolving to updated game
   */
  async updateGameTime(data: UpdateGameTimeData): Promise<Game> {
    return apiClient.patch<Game>('/api/game/time', data);
  },

  /**
   * Delete a game
   * @param id - Game ID
   * @returns Promise resolving to success confirmation
   */
  async deleteGame(id: string): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(`/api/game/${id}`);
  },
};
