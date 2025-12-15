/**
 * Admin panel types for managing teams, schedules, players, and game results
 */

// ==================
// TEAM MANAGEMENT
// ==================

/** Data required to create a new team */
export interface CreateTeamData {
  /** Team name (required) */
  name: string;
}

/** Data required to update an existing team */
export interface UpdateTeamData extends CreateTeamData {
  /** Team ID */
  id: string;
}

// ==================
// SCHEDULE MANAGEMENT
// ==================

/** Data required to create a new game */
export interface CreateGameData {
  /** Home team ID */
  homeTeamId: string;
  /** Away team ID */
  awayTeamId: string;
  /** Game date in YYYY-MM-DD format */
  date: string;
  /** Game time (e.g., "7:00 PM") */
  time: string;
  /** Game status */
  status: 'scheduled' | 'completed';
}

/** Data required to update an existing game */
export interface UpdateGameData {
  /** Game ID */
  id: string;
  /** Game date in YYYY-MM-DD format (optional) */
  date?: string;
  /** Game time (e.g., "7:00 PM") (optional) */
  time?: string;
  /** Game status (optional) */
  status?: 'scheduled' | 'completed';
  /** Home team score (optional) */
  homeScore?: number;
  /** Away team score (optional) */
  awayScore?: number;
  // Note: homeTeamId, awayTeamId, and location are NOT editable after game creation
}

// ==================
// PLAYER MANAGEMENT
// ==================

/** Data required to assign a player to a team */
export interface AssignPlayerData {
  /** Player ID */
  playerId: string;
  /** Team ID to assign player to */
  teamId: string;
  /** Optional jersey number */
  number?: number;
}

// ==================
// GAME RESULT ENTRY
// ==================

/** Individual player's performance in a game */
export interface PlayerGameResult {
  /** Player ID */
  playerId: string;
  /** Player name */
  playerName: string;
  /** Jersey number */
  number: number;
  /** Points scored */
  points: number;
}

/** Complete game result data including scores and player statistics */
export interface GameResultData {
  /** Game ID */
  gameId: string;
  /** Home team final score */
  homeScore: number;
  /** Away team final score */
  awayScore: number;
  /** Home team first half score */
  homeFirstHalf: number;
  /** Home team second half score */
  homeSecondHalf: number;
  /** Away team first half score */
  awayFirstHalf: number;
  /** Away team second half score */
  awaySecondHalf: number;
  /** Home team player statistics */
  homePlayerStats: PlayerGameResult[];
  /** Away team player statistics */
  awayPlayerStats: PlayerGameResult[];
}
