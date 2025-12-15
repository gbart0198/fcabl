/**
 * Basketball game and team related types
 */

/** Represents a basketball team */
export interface Team {
  /** Unique identifier for the team */
  id: string;
  /** Team name */
  name: string;
  /** Number of wins */
  wins: number;
  /** Number of losses */
  losses: number;
  /** Win percentage (0-1) */
  winPercentage: number;
  /** Optional team logo URL */
  logo?: string;
}

/** Represents a basketball player */
export interface Player {
  /** Unique identifier for the player */
  id: string;
  /** Player name */
  name: string;
  /** Jersey number */
  number: number;
  /** Points per game average */
  pointsPerGame: number;
  /** Email address (links to user account) */
  email?: string;
  /** Current team assignment (null if unassigned) */
  teamId?: string | null;
}

/** Represents a player's performance in a specific game */
export interface PlayerGameStats {
  /** Player ID */
  playerId: string;
  /** Player name */
  playerName: string;
  /** Jersey number */
  number: number;
  /** Total points scored in the game */
  points: number;
}

/** Represents detailed game statistics */
export interface GameDetails {
  /** Game ID */
  gameId: string;
  /** Home team first half score */
  homeFirstHalf: number;
  /** Home team second half score */
  homeSecondHalf: number;
  /** Away team first half score */
  awayFirstHalf: number;
  /** Away team second half score */
  awaySecondHalf: number;
  /** Home team player statistics */
  homePlayerStats: PlayerGameStats[];
  /** Away team player statistics */
  awayPlayerStats: PlayerGameStats[];
}

/** Represents a basketball game */
export interface Game {
  /** Unique identifier for the game */
  id: string;
  /** Home team name */
  homeTeam: string;
  /** Home team ID */
  homeTeamId: string;
  /** Away team name */
  awayTeam: string;
  /** Away team ID */
  awayTeamId: string;
  /** Home team final score */
  homeScore?: number;
  /** Away team final score */
  awayScore?: number;
  /** Game date (YYYY-MM-DD format) */
  date: string;
  /** Game time (e.g., "7:00 PM") */
  time: string;
  /** Current game status */
  status: 'scheduled' | 'live' | 'completed';
  /** Detailed game statistics (only for completed games) */
  details?: GameDetails;
}

/** Extended team details with roster, games, and stats */
export interface TeamDetail extends Team {
  /** Team coach name */
  coach?: string;
  /** Home venue location */
  homeVenue?: string;
  /** Team roster */
  roster: Player[];
  /** All team games (past and future) */
  games: Game[];
  /** Total points scored */
  pointsFor: number;
  /** Total points allowed */
  pointsAgainst: number;
  /** Average points scored per game */
  avgPointsFor: number;
  /** Average points allowed per game */
  avgPointsAgainst: number;
}

/** Represents a team's standing in the league */
export interface Standing {
  /** Current rank position */
  rank: number;
  /** Team information */
  team: Team;
  /** Number of wins */
  wins: number;
  /** Number of losses */
  losses: number;
  /** Win percentage (0-1) */
  winPercentage: number;
  /** Total points scored */
  pointsFor: number;
  /** Total points allowed */
  pointsAgainst: number;
  /** Point differential (PF - PA) */
  pointDifferential: number;
  /** Current win/loss streak (e.g., "W3" or "L2") */
  streak?: string;
}
