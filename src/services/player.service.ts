/**
 * Player API service
 * Handles all player-related API calls
 */

import { apiClient } from './apiClient';
import type { Player, PlayerProfile } from '@/types/game.types';

/**
 * Parameters for getting a player
 * Can query by id or other unique fields
 */
export interface GetPlayerParams extends Record<string, string | undefined> {
  id?: string;
  userId?: string;
}

/**
 * Parameters for listing players by team
 */
export interface ListPlayersByTeamParams extends Record<string, string | undefined> {
  teamId: string;
}

/**
 * Data for creating a new player
 */
export interface CreatePlayerData {
  userId: string;
  teamId?: string | null;
  registrationFeeDue?: number | null;
  isFullyRegistered?: boolean;
  isActive?: boolean;
  jerseyNumber?: number | null;
}

/**
 * Data for updating an existing player
 */
export interface UpdatePlayerData {
  id: string;
  teamId?: string | null;
  registrationFeeDue?: number | null;
  isFullyRegistered?: boolean;
  isActive?: boolean;
  jerseyNumber?: number | null;
}

/**
 * Data for updating a player's team assignment
 */
export interface UpdatePlayerTeamData {
  playerId: string;
  teamId: string | null;
  jerseyNumber?: number | null;
}

/**
 * Data for updating a player's registration status
 */
export interface UpdatePlayerRegistrationData {
  playerId: string;
  isFullyRegistered: boolean;
  registrationFeeDue?: number | null;
}

/**
 * Player service for managing players
 */
export const playerService = {
  /**
   * Get a list of all players
   * @returns Promise resolving to array of players
   */
  async listPlayers(): Promise<Player[]> {
    return apiClient.get<Player[]>('/api/player/list');
  },

  /**
   * Get a list of active players
   * @returns Promise resolving to array of active players
   */
  async listActivePlayers(): Promise<Player[]> {
    return apiClient.get<Player[]>('/api/player/active');
  },

  /**
   * Get a list of players on a specific team
   * @param params - Query parameters (teamId)
   * @returns Promise resolving to array of players
   */
  async listPlayersByTeam(params: ListPlayersByTeamParams): Promise<Player[]> {
    return apiClient.get<Player[]>('/api/player/team', params);
  },

  /**
   * Get a list of free agent players (not assigned to any team)
   * @returns Promise resolving to array of free agent players
   */
  async listFreeAgents(): Promise<Player[]> {
    return apiClient.get<Player[]>('/api/player/free-agents');
  },

  /**
   * Get a player with their user information
   * @param params - Query parameters (id)
   * @returns Promise resolving to player profile with user data
   */
  async getPlayerWithUser(params: GetPlayerParams): Promise<PlayerProfile> {
    return apiClient.get<PlayerProfile>('/api/player/with-user', params);
  },

  /**
   * Get a player with their team information
   * @param params - Query parameters (id)
   * @returns Promise resolving to player with team data
   */
  async getPlayerWithTeam(params: GetPlayerParams): Promise<Player> {
    return apiClient.get<Player>('/api/player/with-team', params);
  },

  /**
   * Get a list of all players with their user information
   * @returns Promise resolving to array of player profiles
   */
  async listPlayersWithUsers(): Promise<PlayerProfile[]> {
    return apiClient.get<PlayerProfile[]>('/api/player/list-with-users');
  },

  /**
   * Get a single player by id
   * @param params - Query parameters (id)
   * @returns Promise resolving to player
   */
  async getPlayer(params: GetPlayerParams): Promise<Player> {
    return apiClient.get<Player>('/api/player', params);
  },

  /**
   * Create a new player
   * @param data - Player creation data
   * @returns Promise resolving to created player
   */
  async createPlayer(data: CreatePlayerData): Promise<Player> {
    return apiClient.post<Player>('/api/player', data);
  },

  /**
   * Update an existing player
   * @param data - Player update data (must include id)
   * @returns Promise resolving to updated player
   */
  async updatePlayer(data: UpdatePlayerData): Promise<Player> {
    return apiClient.put<Player>('/api/player', data);
  },

  /**
   * Update a player's team assignment
   * @param data - Player team update data
   * @returns Promise resolving to updated player
   */
  async updatePlayerTeam(data: UpdatePlayerTeamData): Promise<Player> {
    return apiClient.patch<Player>('/api/player/team', data);
  },

  /**
   * Update a player's registration status
   * @param data - Player registration update data
   * @returns Promise resolving to updated player
   */
  async updatePlayerRegistration(data: UpdatePlayerRegistrationData): Promise<Player> {
    return apiClient.patch<Player>('/api/player/registration', data);
  },

  /**
   * Delete a player
   * @param id - Player ID
   * @returns Promise resolving to success confirmation
   */
  async deletePlayer(id: string): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(`/api/player/${id}`);
  },
};
