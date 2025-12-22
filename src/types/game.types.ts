/**
 * Basketball game and team related types
 */

// ==================
// BASE TYPES (Backend Models - 1:1 mapping)
// ==================

/**
 * Basketball team
 * Matches backend Team model exactly (1:1 mapping with JSON tags)
 * Maps to: backend/internal/repository/models.go Team struct
 */
export interface Team {
  /** Unique identifier for the team */
  id: number; // json:"id"

  /** Team name */
  name: string; // json:"name"

  /** Number of wins */
  wins: number; // json:"wins"

  /** Number of losses */
  losses: number; // json:"losses"

  /** Number of draws */
  draws: number; // json:"draws"

  /** Total points scored by team */
  pointsFor: number; // json:"pointsFor"

  /** Total points allowed by team */
  pointsAgainst: number; // json:"pointsAgainst"

  /** Timestamp when team was created (ISO 8601 format: "2024-02-10T16:00:00") */
  createdAt: string; // json:"createdAt"

  /** Timestamp when team was last updated (ISO 8601 format: "2024-02-10T16:00:00") */
  updatedAt: string; // json:"updatedAt"
}

/**
 * Basketball team with player details.
 * Maps to: backend/internal/repository/models.go TeamWithPlayers struct
 */
export interface TeamWithPlayers {
  /** Unique identifier for the team */
  id: number; // json:"id"

  /** Team name */
  name: string; // json:"name"

  /** Number of wins */
  wins: number; // json:"wins"

  /** Number of losses */
  losses: number; // json:"losses"

  /** Number of draws */
  draws: number; // json:"draws"

  /** Total points scored by team */
  pointsFor: number; // json:"pointsFor"

  /** Total points allowed by team */
  pointsAgainst: number; // json:"pointsAgainst"

  /** Timestamp when team was created (ISO 8601 format: "2024-02-10T16:00:00") */
  createdAt: string; // json:"createdAt"

  /** Timestamp when team was last updated (ISO 8601 format: "2024-02-10T16:00:00") */
  updatedAt: string; // json:"updatedAt"

  players: SimplePlayerDetails[];
}

export interface SimplePlayerDetails {
  jerseyNumber: number;

  firstName: string;

  lastName: string;
}

/**
 * Player registration and team assignment
 * Matches backend Player model exactly (1:1 mapping with JSON tags)
 * Maps to: backend/internal/repository/models.go Player struct
 *
 * NOTE: This is the base player record. For display with user info, use PlayerProfile
 */
export interface Player {
  /** Unique identifier for the player */
  id: string; // json:"id"

  /** ID of the user account (links to User.id) */
  userId: string; // json:"userId"

  /** ID of the team (null if unassigned) */
  teamId: string | null; // json:"teamId" - nullable

  /** Registration fee amount due (null if paid in full) */
  registrationFeeDue: number | null; // json:"registrationFeeDue" - decimal

  /** Whether player has completed full registration */
  isFullyRegistered: boolean; // json:"isFullyRegistered"

  /** Whether player is active in the league */
  isActive: boolean; // json:"isActive"

  /** Player's jersey number (null if not assigned) */
  jerseyNumber: number | null; // json:"jerseyNumber" - nullable

  /** Timestamp when player was created (ISO 8601 format: "2024-02-10T16:00:00") */
  createdAt: string; // json:"createdAt"

  /** Timestamp when player was last updated (ISO 8601 format: "2024-02-10T16:00:00") */
  updatedAt: string; // json:"updatedAt"
}

/**
 * Scheduled game
 * Matches backend Game model exactly (1:1 mapping with JSON tags)
 * Maps to: backend/internal/repository/models.go Game struct
 *
 * NOTE: This only contains schedule info. For scores, see GameResult type
 */
export interface Game {
  /** Unique identifier for the game */
  id: string; // json:"id"

  /** Home team ID */
  homeTeamId: number; // json:"homeTeamId"

  /** Away team ID */
  awayTeamId: string; // json:"awayTeamId"

  /** Scheduled game time (ISO 8601 format: "2024-02-10T16:00:00") */
  gameTime: string; // json:"gameTime"

  /** The home team's score if the game has completed */
  homeScore: number // json:"homeScore"

  /** The away team's score if the game has completed */
  awayScore: number // json:"awayScore"

  /** Timestamp when game was created (ISO 8601 format: "2024-02-10T16:00:00") */
  createdAt: string; // json:"createdAt"

  /** Timestamp when game was last updated (ISO 8601 format: "2024-02-10T16:00:00") */
  updatedAt: string; // json:"updatedAt"

  status: string; // json:"status"
}

/**
 * 
 *
 */
export interface GameWithDetails extends Game {
  /** The home team's name */
  homeTeamName: string;

  /** The away team's name */
  awayTeamName: string;

  /** The player stats for home team */
  homePlayerStats: PlayerGameStats[];

  /** The player stats for away team */
  awayPlayerStats: PlayerGameStats[];
}


// ==================
// COMPOSITE TYPES (Frontend Convenience Types)
// ==================

/**
 * Player with full user information
 * Combines Player + User data for display purposes
 * This is what most components should use instead of base Player type
 */
export interface PlayerProfile extends Player {
  /** User's email address (from User.email) */
  email: string;

  /** User's phone number (from User.phoneNumber) */
  phoneNumber: string;

  /** User's first name (from User.firstName) */
  firstName: string;

  /** User's last name (from User.lastName) */
  lastName: string;

  /** User's role (from User.role) */
  role: string;

  /** Computed full name (firstName + lastName) */
  fullName: string;
}

/**
 * Team with computed statistics
 * Extends base Team with calculated fields for display
 */
export interface TeamWithStats extends Team {
  /** Win percentage (0-1), computed: wins / (wins + losses + draws) */
  winPercentage: number;

  /** Point differential, computed: pointsFor - pointsAgainst */
  pointDifferential: number;

  /** Total games played, computed: wins + losses + draws */
  gamesPlayed: number;

  /** Average points scored per game, computed: pointsFor / gamesPlayed */
  avgPointsFor: number;

  /** Average points allowed per game, computed: pointsAgainst / gamesPlayed */
  avgPointsAgainst: number;
}

/**
 * Player's performance in a specific game
 * Used for game statistics display
 */
export interface PlayerGameStats {
  /** Player ID */
  playerId: string;
  /** Player first name */
  playerFirstName: string;
  /** Player last name */
  playerLastName: string;
  /** Jersey number */
  number: number;
  /** Total points scored in the game */
  score: number;
}

/**
 * Detailed game statistics
 * Used for displaying half-time scores and player stats
 */
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

/**
 * Team's standing in the league
 * Used for standings table display
 */
export interface Standing {
  /** Current rank position */
  rank: number;
  /** Team information with statistics */
  team: Team;
}

/**
 * Extended team details with roster, games, and additional info
 * Used for team detail pages
 */
export interface TeamDetail extends TeamWithStats {
  /** Team coach name */
  coach?: string;
  /** Home venue location */
  homeVenue?: string;
  /** Team logo URL */
  logo?: string;
  /** Team roster with full player profiles */
  roster: PlayerProfile[];
  /** All team games with details */
  games: GameWithDetails[];
}
