/**
 * Mock API service layer for authentication, teams, and standings
 * This will be replaced with real API calls when backend is implemented
 */

import type { LoginCredentials, RegisterData, AuthResponse, User } from '@/types/auth.types';
import type { Team, TeamDetail, Standing, Game, Player } from '@/types/game.types';
import type { CreateTeamData, UpdateTeamData, CreateGameData, UpdateGameData, GameResultData } from '@/types/admin.types';
import { mockTeamDetails, mockStandings, mockAllGames, generateGameDetails, mockUnassignedPlayers, getAllPlayers } from '@/data/mockData';

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

/**
 * Admin service for managing teams, schedules, players, and game results
 * All operations work with in-memory mock data
 */
export const adminService = {
  // ==================
  // TEAM MANAGEMENT
  // ==================
  
  /**
   * Create a new team
   * @param data - Team creation data
   * @returns Promise resolving to the created team
   */
  async createTeam(data: CreateTeamData): Promise<TeamDetail> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newId = String(Object.keys(mockTeamDetails).length + 1);
    const newTeam: TeamDetail = {
      id: newId,
      name: data.name,
      wins: 0,
      losses: 0,
      winPercentage: 0,
      roster: [],
      games: [],
      pointsFor: 0,
      pointsAgainst: 0,
      avgPointsFor: 0,
      avgPointsAgainst: 0,
    };
    
    mockTeamDetails[newId] = newTeam;
    return newTeam;
  },

  /**
   * Update an existing team
   * @param id - Team ID
   * @param data - Updated team data
   * @returns Promise resolving to updated team or null if not found
   */
  async updateTeam(id: string, data: UpdateTeamData): Promise<TeamDetail | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const team = mockTeamDetails[id];
    if (!team) return null;
    
    team.name = data.name;
    
    // Update team name in all games
    mockAllGames.forEach(game => {
      if (game.homeTeamId === id) game.homeTeam = data.name;
      if (game.awayTeamId === id) game.awayTeam = data.name;
    });
    
    return team;
  },

  /**
   * Delete a team
   * @param id - Team ID
   * @returns Promise resolving to success status and optional error message
   */
  async deleteTeam(id: string): Promise<{ success: boolean; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Check if team has any games
    const hasGames = mockAllGames.some(
      game => game.homeTeamId === id || game.awayTeamId === id
    );
    
    if (hasGames) {
      const gameCount = mockAllGames.filter(
        game => game.homeTeamId === id || game.awayTeamId === id
      ).length;
      return { 
        success: false, 
        error: `Cannot delete ${mockTeamDetails[id]?.name || 'team'}. They have ${gameCount} games on the schedule.` 
      };
    }
    
    delete mockTeamDetails[id];
    return { success: true };
  },

  // ==================
  // SCHEDULE MANAGEMENT
  // ==================
  
  /**
   * Create a new game
   * @param data - Game creation data
   * @returns Promise resolving to the created game
   */
  async createGame(data: CreateGameData): Promise<Game> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newId = String(mockAllGames.length + 1);
    const homeTeam = mockTeamDetails[data.homeTeamId];
    const awayTeam = mockTeamDetails[data.awayTeamId];
    
    if (!homeTeam || !awayTeam) {
      throw new Error('Team not found');
    }
    
    const newGame: Game = {
      id: newId,
      homeTeam: homeTeam.name,
      homeTeamId: data.homeTeamId,
      awayTeam: awayTeam.name,
      awayTeamId: data.awayTeamId,
      date: data.date,
      time: data.time,
      status: data.status,
    };
    
    mockAllGames.push(newGame);
    return newGame;
  },

  /**
   * Update an existing game
   * @param id - Game ID
   * @param data - Updated game data (partial updates allowed)
   * @returns Promise resolving to updated game or null if not found
   */
  async updateGame(id: string, data: UpdateGameData): Promise<Game | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const gameIndex = mockAllGames.findIndex(g => g.id === id);
    if (gameIndex === -1) return null;
    
    const existingGame = mockAllGames[gameIndex];
    if (!existingGame) return null;
    
    // Only update provided fields
    const updatedGame: Game = {
      ...existingGame,
      date: data.date !== undefined ? data.date : existingGame.date,
      time: data.time !== undefined ? data.time : existingGame.time,
      status: data.status !== undefined ? data.status : existingGame.status,
      homeScore: data.homeScore !== undefined ? data.homeScore : existingGame.homeScore,
      awayScore: data.awayScore !== undefined ? data.awayScore : existingGame.awayScore,
    };
    
    mockAllGames[gameIndex] = updatedGame;
    
    return updatedGame;
  },

  /**
   * Delete a game
   * @param id - Game ID
   * @returns Promise resolving to success status
   */
  async deleteGame(id: string): Promise<{ success: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const gameIndex = mockAllGames.findIndex(g => g.id === id);
    if (gameIndex === -1) return { success: false };
    
    mockAllGames.splice(gameIndex, 1);
    return { success: true };
  },

  // ==================
  // PLAYER MANAGEMENT
  // ==================
  
  /**
   * Get all players (assigned and unassigned)
   * @returns Promise resolving to array of all players
   */
  async getAllPlayers(): Promise<Player[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return getAllPlayers();
  },

  /**
   * Get unassigned players (not on any team)
   * @returns Promise resolving to array of unassigned players
   */
  async getUnassignedPlayers(): Promise<Player[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockUnassignedPlayers.filter(p => !p.teamId);
  },

  /**
   * Get players assigned to a specific team
   * @param teamId - Team ID
   * @returns Promise resolving to array of team players
   */
  async getTeamPlayers(teamId: string): Promise<Player[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockTeamDetails[teamId]?.roster || [];
  },

  /**
   * Assign a player to a team
   * @param playerId - Player ID
   * @param teamId - Team ID
   * @param number - Optional jersey number
   * @returns Promise resolving to success status
   */
  async assignPlayerToTeam(playerId: string, teamId: string, number?: number): Promise<{ success: boolean; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const team = mockTeamDetails[teamId];
    if (!team) return { success: false, error: 'Team not found' };
    
    // Find player in unassigned pool
    const playerIndex = mockUnassignedPlayers.findIndex(p => p.id === playerId);
    if (playerIndex === -1) return { success: false, error: 'Player not found' };
    
    const originalPlayer = mockUnassignedPlayers[playerIndex];
    if (!originalPlayer) return { success: false, error: 'Player not found' };
    
    // Create updated player object
    const player: Player = {
      id: originalPlayer.id,
      name: originalPlayer.name,
      number: number !== undefined ? number : originalPlayer.number,
      pointsPerGame: originalPlayer.pointsPerGame,
      email: originalPlayer.email,
      teamId: teamId,
    };
    
    // Add to team roster
    team.roster.push(player);
    
    // Remove from unassigned pool
    mockUnassignedPlayers.splice(playerIndex, 1);
    
    return { success: true };
  },

  /**
   * Remove a player from a team
   * @param playerId - Player ID
   * @param teamId - Team ID
   * @returns Promise resolving to success status
   */
  async removePlayerFromTeam(playerId: string, teamId: string): Promise<{ success: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const team = mockTeamDetails[teamId];
    if (!team) return { success: false };
    
    const playerIndex = team.roster.findIndex(p => p.id === playerId);
    if (playerIndex === -1) return { success: false };
    
    const originalPlayer = team.roster[playerIndex];
    if (!originalPlayer) return { success: false };
    
    // Create updated player for unassigned pool
    const player: Player = {
      id: originalPlayer.id,
      name: originalPlayer.name,
      number: 0,
      pointsPerGame: originalPlayer.pointsPerGame,
      email: originalPlayer.email,
      teamId: null,
    };
    
    // Remove from team roster
    team.roster.splice(playerIndex, 1);
    
    // Add back to unassigned pool
    mockUnassignedPlayers.push(player);
    
    return { success: true };
  },

  /**
   * Update a player's jersey number
   * @param playerId - Player ID
   * @param teamId - Team ID
   * @param number - New jersey number
   * @returns Promise resolving to success status
   */
  async updatePlayerNumber(playerId: string, teamId: string, number: number): Promise<{ success: boolean }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const team = mockTeamDetails[teamId];
    if (!team) return { success: false };
    
    const player = team.roster.find(p => p.id === playerId);
    if (!player) return { success: false };
    
    player.number = number;
    return { success: true };
  },

  // ==================
  // GAME RESULT ENTRY
  // ==================
  
  /**
   * Submit game result with scores and player statistics
   * @param gameId - Game ID
   * @param data - Game result data including scores and player stats
   * @returns Promise resolving to success status
   */
  async submitGameResult(gameId: string, data: GameResultData): Promise<{ success: boolean; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const gameIndex = mockAllGames.findIndex(g => g.id === gameId);
    if (gameIndex === -1) return { success: false, error: 'Game not found' };
    
    // Validation: Half-time scores must add up
    if (data.homeFirstHalf + data.homeSecondHalf !== data.homeScore) {
      return { success: false, error: 'Home team half-time scores do not match total' };
    }
    if (data.awayFirstHalf + data.awaySecondHalf !== data.awayScore) {
      return { success: false, error: 'Away team half-time scores do not match total' };
    }
    
    // Validation: Player stats must add up
    const homePlayerTotal = data.homePlayerStats.reduce((sum, p) => sum + p.points, 0);
    if (homePlayerTotal !== data.homeScore) {
      return { success: false, error: `Home team player stats (${homePlayerTotal}) do not match total score (${data.homeScore})` };
    }
    
    const awayPlayerTotal = data.awayPlayerStats.reduce((sum, p) => sum + p.points, 0);
    if (awayPlayerTotal !== data.awayScore) {
      return { success: false, error: `Away team player stats (${awayPlayerTotal}) do not match total score (${data.awayScore})` };
    }
    
    // Update game
    const game = mockAllGames[gameIndex];
    if (!game) return { success: false, error: 'Game not found' };
    
    game.homeScore = data.homeScore;
    game.awayScore = data.awayScore;
    game.status = 'completed';
    game.details = {
      gameId: gameId,
      homeFirstHalf: data.homeFirstHalf,
      homeSecondHalf: data.homeSecondHalf,
      awayFirstHalf: data.awayFirstHalf,
      awaySecondHalf: data.awaySecondHalf,
      homePlayerStats: data.homePlayerStats,
      awayPlayerStats: data.awayPlayerStats,
    };
    
    return { success: true };
  },
};
