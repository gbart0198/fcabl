/**
 * Team API service
 * Handles all team-related API calls
 */

import { apiClient } from './apiClient';
import type { Team, TeamWithStats, Standing } from '@/types/game.types';

/**
 * Parameters for getting a team
 * Can query by id or other unique fields
 */
export interface GetTeamParams extends Record<string, string | undefined> {
  id?: string;
}

/**
 * Data for creating a new team
 */
export interface CreateTeamData {
  name: string;
}

/**
 * Data for updating an existing team
 */
export interface UpdateTeamData {
  id: string;
  name?: string;
  wins?: number;
  losses?: number;
  draws?: number;
  pointsFor?: number;
  pointsAgainst?: number;
}

/**
 * Team service for managing teams
 */
export const teamService = {
  /**
   * Get a list of all teams
   * @returns Promise resolving to array of teams
   */
  async listTeams(): Promise<Team[]> {
    return apiClient.get<Team[]>('/api/team/list');
  },

  /**
   * Get team standings
   * @returns Promise resolving to array of standings
   */
  async getTeamStandings(): Promise<Standing[]> {
    return apiClient.get<Standing[]>('/api/team/standings');
  },

  /**
   * Get team statistics
   * @param params - Query parameters (id)
   * @returns Promise resolving to team with stats
   */
  async getTeamStats(params: GetTeamParams): Promise<TeamWithStats> {
    return apiClient.get<TeamWithStats>('/api/team/stats', params);
  },

  /**
   * Get team with its players
   * @param params - Query parameters (id)
   * @returns Promise resolving to team with player roster
   */
  async getTeamWithPlayers(params: GetTeamParams): Promise<Team> {
    return apiClient.get<Team>('/api/team/players', params);
  },

  /**
   * Get a single team by id
   * @param params - Query parameters (id)
   * @returns Promise resolving to team
   */
  async getTeam(params: GetTeamParams): Promise<Team> {
    return apiClient.get<Team>('/api/team', params);
  },

  /**
   * Create a new team
   * @param data - Team creation data
   * @returns Promise resolving to created team
   */
  async createTeam(data: CreateTeamData): Promise<Team> {
    return apiClient.post<Team>('/api/team', data);
  },

  /**
   * Update an existing team
   * @param data - Team update data (must include id)
   * @returns Promise resolving to updated team
   */
  async updateTeam(data: UpdateTeamData): Promise<Team> {
    return apiClient.put<Team>('/api/team', data);
  },

  /**
   * Delete a team
   * @param id - Team ID
   * @returns Promise resolving to success confirmation
   */
  async deleteTeam(id: string): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(`/api/team/${id}`);
  },
};
