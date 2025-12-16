/**
 * Game result types
 * Maps to: backend/internal/repository/models.go GameResult struct
 */

/**
 * Final game result with scores
 * Matches backend GameResult model exactly (1:1 mapping with JSON tags)
 */
export interface GameResult {
  /** Unique identifier for the game result */
  id: string;                    // json:"id"
  
  /** ID of the game this result belongs to */
  gameId: string;                // json:"gameId"
  
  /** Home team final score */
  homeScore: number;             // json:"homeScore"
  
  /** Away team final score */
  awayScore: number;             // json:"awayScore"
  
  /** ID of the winning team (null for draws) */
  winningTeamId: string | null;  // json:"winningTeamId" - nullable
  
  /** Timestamp when result was recorded (ISO 8601 format: "2024-02-10T16:00:00") */
  recordedAt: string;            // json:"recordedAt"
}
