/**
 * Team utility functions
 */

import type { Team, TeamWithStats } from '@/types/game.types';

/**
 * Calculate win percentage for a team
 * @param wins - Number of wins
 * @param losses - Number of losses
 * @param draws - Number of draws
 * @returns Win percentage (0-1)
 */
export function calculateWinPercentage(wins: number, losses: number, draws: number): number {
  const totalGames = wins + losses + draws;
  if (totalGames === 0) return 0;
  return wins / totalGames;
}

/**
 * Calculate point differential
 * @param pointsFor - Points scored by team
 * @param pointsAgainst - Points allowed by team
 * @returns Point differential (positive = team is outscoring opponents)
 */
export function calculatePointDifferential(pointsFor: number, pointsAgainst: number): number {
  return pointsFor - pointsAgainst;
}

/**
 * Calculate total games played
 * @param wins - Number of wins
 * @param losses - Number of losses
 * @param draws - Number of draws
 * @returns Total games played
 */
export function calculateGamesPlayed(wins: number, losses: number, draws: number): number {
  return wins + losses + draws;
}

/**
 * Calculate average points for per game
 * @param pointsFor - Total points scored
 * @param gamesPlayed - Total games played
 * @returns Average points for per game
 */
export function calculateAvgPointsFor(pointsFor: number, gamesPlayed: number): number {
  if (gamesPlayed === 0) return 0;
  return Number((pointsFor / gamesPlayed).toFixed(1));
}

/**
 * Calculate average points against per game
 * @param pointsAgainst - Total points allowed
 * @param gamesPlayed - Total games played
 * @returns Average points against per game
 */
export function calculateAvgPointsAgainst(pointsAgainst: number, gamesPlayed: number): number {
  if (gamesPlayed === 0) return 0;
  return Number((pointsAgainst / gamesPlayed).toFixed(1));
}

/**
 * Transform base Team into TeamWithStats by computing statistics
 * @param team - Base team object
 * @returns Team with computed statistics
 */
export function teamToTeamWithStats(team: Team): TeamWithStats {
  const gamesPlayed = calculateGamesPlayed(team.wins, team.losses, team.draws);
  
  return {
    ...team,
    winPercentage: calculateWinPercentage(team.wins, team.losses, team.draws),
    pointDifferential: calculatePointDifferential(team.pointsFor, team.pointsAgainst),
    gamesPlayed,
    avgPointsFor: calculateAvgPointsFor(team.pointsFor, gamesPlayed),
    avgPointsAgainst: calculateAvgPointsAgainst(team.pointsAgainst, gamesPlayed),
  };
}

/**
 * Format win percentage as percentage string
 * @param winPercentage - Win percentage (0-1)
 * @returns Formatted percentage (e.g., "75.0%")
 */
export function formatWinPercentage(winPercentage: number): string {
  return `${(winPercentage * 100).toFixed(1)}%`;
}

/**
 * Format team record as string
 * @param wins - Number of wins
 * @param losses - Number of losses
 * @param draws - Number of draws (optional, only show if > 0)
 * @returns Formatted record (e.g., "10-5" or "10-5-2")
 */
export function formatTeamRecord(wins: number, losses: number, draws: number = 0): string {
  if (draws > 0) {
    return `${wins}-${losses}-${draws}`;
  }
  return `${wins}-${losses}`;
}
