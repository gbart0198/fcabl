/**
 * API service layer - Re-exports all services
 * 
 * This file provides backward compatibility by re-exporting all service modules.
 * All services now connect to the real backend API.
 */

// Export all new API services
export { authService } from './auth.service';
export { userService } from './user.service';
export { teamService } from './team.service';
export { playerService } from './player.service';
export { gameService } from './game.service';
export { paymentService } from './payment.service';

// Export API client and config for advanced usage
export { apiClient, ApiError } from './apiClient';
export { config } from './config';

// Backward compatibility aliases for old service names
// These map to the new service implementations
import { teamService } from './team.service';
import { gameService } from './game.service';
import { playerService } from './player.service';
import type { Standing, GameWithDetails } from '@/types/game.types';

/**
 * Standings service (backward compatibility)
 * Maps to teamService.getTeamStandings()
 */
export const standingsService = {
  async getFullStandings(): Promise<Standing[]> {
    return teamService.getTeamStandings();
  },
};

/**
 * Schedule service (backward compatibility)
 * Maps to gameService.listGamesWithTeams()
 */
export const scheduleService = {
  async getAllGames(): Promise<GameWithDetails[]> {
    return gameService.listSchedule();
  },
};

/**
 * Admin service (backward compatibility)
 * Maps to various team, game, and player services
 * 
 * Note: This is a legacy service. For new code, use the specific services directly:
 * - teamService for team operations
 * - gameService for game operations
 * - playerService for player operations
 */
export const adminService = {
  // Team management
  async createTeam(data: { name: string }) {
    return teamService.createTeam(data);
  },

  async updateTeam(id: string, data: { name: string }) {
    return teamService.updateTeam({ id, ...data });
  },

  async deleteTeam(id: string) {
    return teamService.deleteTeam(id);
  },

  // Schedule management
  async createGame(data: { homeTeamId: string; awayTeamId: string; date: string; time: string; status: 'scheduled' | 'completed' }) {
    // Combine date and time into ISO format
    const gameTime = `${data.date}T${convertTimeTo24Hour(data.time)}:00`;
    return gameService.createGame({
      homeTeamId: data.homeTeamId,
      awayTeamId: data.awayTeamId,
      gameTime,
    });
  },

  async updateGame(id: string, data: { date?: string; time?: string; status?: 'scheduled' | 'completed'; homeScore?: number; awayScore?: number }) {
    const updateData: { id: string; gameTime?: string } = { id };

    // Combine date and time if provided
    if (data.date && data.time) {
      updateData.gameTime = `${data.date}T${convertTimeTo24Hour(data.time)}:00`;
    }

    return gameService.updateGame(updateData);
  },

  async deleteGame(id: string) {
    return gameService.deleteGame(id);
  },

  // Player management
  async getAllPlayers() {
    return playerService.listPlayersWithUsers();
  },

  async getUnassignedPlayers() {
    return playerService.listFreeAgents();
  },

  async getTeamPlayers(teamId: string) {
    return playerService.listPlayersByTeam({ teamId });
  },

  async assignPlayerToTeam(playerId: string, teamId: string, jerseyNumber?: number) {
    return playerService.updatePlayerTeam({
      playerId,
      teamId,
      jerseyNumber: jerseyNumber || null,
    });
  },

  async removePlayerFromTeam(playerId: string, _teamId: string) {
    return playerService.updatePlayerTeam({
      playerId,
      teamId: null,
      jerseyNumber: null,
    });
  },

  async updatePlayerNumber(playerId: string, teamId: string, jerseyNumber: number) {
    return playerService.updatePlayerTeam({
      playerId,
      teamId,
      jerseyNumber,
    });
  },

  // Game result entry
  async submitGameResult(gameId: string, data: {
    homeScore: number;
    awayScore: number;
    homeFirstHalf: number;
    homeSecondHalf: number;
    awayFirstHalf: number;
    awaySecondHalf: number;
    homePlayerStats: Array<{ playerId: string; playerName: string; number: number; points: number }>;
    awayPlayerStats: Array<{ playerId: string; playerName: string; number: number; points: number }>;
  }) {
    // Submit game score and status
    await gameService.updateGameScoreAndStatus({
      id: gameId,
      homeScore: data.homeScore,
      awayScore: data.awayScore,
      status: 'completed',
    });

    // TODO: Submit player stats when backend endpoint is ready
    // For now, just return success
    return { success: true };
  },
};

/**
 * Helper function to convert time string to 24-hour format
 * @param time - Time string (e.g., "7:00 PM" or "14:00")
 * @returns Time in 24-hour format (e.g., "19:00" or "14:00")
 */
function convertTimeTo24Hour(time: string): string {
  // If already in 24-hour format, return as-is
  if (!time.includes('AM') && !time.includes('PM')) {
    return time;
  }

  const parts = time.split(' ');
  if (parts.length !== 2) return time;

  const timePart = parts[0];
  const period = parts[1];

  if (!timePart || !period) return time;

  const timeParts = timePart.split(':').map(Number);
  if (timeParts.length !== 2) return time;

  const hours = timeParts[0];
  const minutes = timeParts[1];

  if (hours === undefined || minutes === undefined) return time;

  let hour24 = hours;
  if (period === 'PM' && hours !== 12) {
    hour24 = hours + 12;
  } else if (period === 'AM' && hours === 12) {
    hour24 = 0;
  }

  return `${hour24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}
