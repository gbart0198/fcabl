/**
 * Mock data for games, standings, teams, and players
 * This data will be replaced with real API calls when backend is implemented
 */

import type { User } from '@/types/auth.types';
import type { Player, Team, Game, PlayerProfile, GameWithDetails, Standing, TeamDetail, GameDetails, PlayerGameStats } from '@/types/game.types';
import { getUserFullName } from '@/utils/user';
import { teamToTeamWithStats } from '@/utils/team';
import { getGameStatus } from '@/utils/game';

// ==================
// MOCK USERS
// ==================

const mockUsers: { [key: string]: User } = {
  'u1': { id: 'u1', email: 'marcus.j@fcabl.com', phoneNumber: '203-555-0101', firstName: 'Marcus', lastName: 'Johnson', role: 'player', createdAt: '2024-01-15T10:00:00', updatedAt: '2024-01-15T10:00:00' },
  'u2': { id: 'u2', email: 'tyler.r@fcabl.com', phoneNumber: '203-555-0102', firstName: 'Tyler', lastName: 'Rodriguez', role: 'player', createdAt: '2024-01-15T10:00:00', updatedAt: '2024-01-15T10:00:00' },
  'u3': { id: 'u3', email: 'chris.a@fcabl.com', phoneNumber: '203-555-0103', firstName: 'Chris', lastName: 'Anderson', role: 'player', createdAt: '2024-01-15T10:00:00', updatedAt: '2024-01-15T10:00:00' },
  'u4': { id: 'u4', email: 'brandon.l@fcabl.com', phoneNumber: '203-555-0104', firstName: 'Brandon', lastName: 'Lee', role: 'player', createdAt: '2024-01-15T10:00:00', updatedAt: '2024-01-15T10:00:00' },
  'u5': { id: 'u5', email: 'kevin.m@fcabl.com', phoneNumber: '203-555-0105', firstName: 'Kevin', lastName: 'Martinez', role: 'player', createdAt: '2024-01-15T10:00:00', updatedAt: '2024-01-15T10:00:00' },
  'u6': { id: 'u6', email: 'josh.w@fcabl.com', phoneNumber: '203-555-0106', firstName: 'Josh', lastName: 'Williams', role: 'player', createdAt: '2024-01-15T10:00:00', updatedAt: '2024-01-15T10:00:00' },
  'u7': { id: 'u7', email: 'derek.t@fcabl.com', phoneNumber: '203-555-0107', firstName: 'Derek', lastName: 'Thompson', role: 'player', createdAt: '2024-01-15T10:00:00', updatedAt: '2024-01-15T10:00:00' },
  'u8': { id: 'u8', email: 'ryan.d@fcabl.com', phoneNumber: '203-555-0108', firstName: 'Ryan', lastName: 'Davis', role: 'player', createdAt: '2024-01-15T10:00:00', updatedAt: '2024-01-15T10:00:00' },
  
  'u9': { id: 'u9', email: 'james.m@fcabl.com', phoneNumber: '203-555-0109', firstName: 'James', lastName: 'Mitchell', role: 'player', createdAt: '2024-01-15T10:00:00', updatedAt: '2024-01-15T10:00:00' },
  'u10': { id: 'u10', email: 'daniel.b@fcabl.com', phoneNumber: '203-555-0110', firstName: 'Daniel', lastName: 'Brooks', role: 'player', createdAt: '2024-01-15T10:00:00', updatedAt: '2024-01-15T10:00:00' },
  'u11': { id: 'u11', email: 'alex.t@fcabl.com', phoneNumber: '203-555-0111', firstName: 'Alex', lastName: 'Turner', role: 'player', createdAt: '2024-01-15T10:00:00', updatedAt: '2024-01-15T10:00:00' },
  'u12': { id: 'u12', email: 'michael.c@fcabl.com', phoneNumber: '203-555-0112', firstName: 'Michael', lastName: 'Chen', role: 'player', createdAt: '2024-01-15T10:00:00', updatedAt: '2024-01-15T10:00:00' },
  'u13': { id: 'u13', email: 'patrick.o@fcabl.com', phoneNumber: '203-555-0113', firstName: 'Patrick', lastName: 'O\'Brien', role: 'player', createdAt: '2024-01-15T10:00:00', updatedAt: '2024-01-15T10:00:00' },
  'u14': { id: 'u14', email: 'sam.r@fcabl.com', phoneNumber: '203-555-0114', firstName: 'Sam', lastName: 'Richards', role: 'player', createdAt: '2024-01-15T10:00:00', updatedAt: '2024-01-15T10:00:00' },
  'u15': { id: 'u15', email: 'connor.w@fcabl.com', phoneNumber: '203-555-0115', firstName: 'Connor', lastName: 'Walsh', role: 'player', createdAt: '2024-01-15T10:00:00', updatedAt: '2024-01-15T10:00:00' },
  'u16': { id: 'u16', email: 'eric.f@fcabl.com', phoneNumber: '203-555-0116', firstName: 'Eric', lastName: 'Foster', role: 'player', createdAt: '2024-01-15T10:00:00', updatedAt: '2024-01-15T10:00:00' },
};

// Adding 40 more users (continuing the pattern)
for (let i = 17; i <= 56; i++) {
  const firstNames = ['Jake', 'Noah', 'Ethan', 'Luke', 'Mason', 'Owen', 'Aiden', 'Caleb', 'Justin', 'Nathan', 'Aaron', 'Jordan', 'Cameron', 'Dylan', 'Blake', 'Austin', 'Trevor', 'Andrew', 'Zachary', 'Sean', 'Kyle', 'Brian', 'Adam', 'Tyler', 'Ryan', 'Matthew', 'Jacob', 'Nicholas', 'Ian', 'Colin', 'Garrett', 'Bradley', 'John', 'David', 'Mike', 'Chris', 'Steve', 'Tom', 'Alex', 'Robert'];
  const lastNames = ['Harrison', 'Campbell', 'Parker', 'Sanders', 'Cooper', 'Bennett', 'Rivera', 'Murphy', 'Wright', 'Gray', 'Kelly', 'Hayes', 'Price', 'Moore', 'Stewart', 'Ross', 'Morgan', 'Coleman', 'Bell', 'Hughes', 'Barnes', 'Fisher', 'Reed', 'Powell', 'Peterson', 'Long', 'Ellis', 'Ross', 'Scott', 'Ward', 'Carter', 'King', 'Smith', 'Johnson', 'Williams', 'Brown', 'Davis', 'Wilson', 'Martinez', 'Garcia'];
  
  const firstName = firstNames[(i - 17) % firstNames.length] || 'Player';
  const lastName = lastNames[(i - 17) % lastNames.length] || 'Unknown';
  mockUsers[`u${i}`] = {
    id: `u${i}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@fcabl.com`,
    phoneNumber: `203-555-${String(100 + i).padStart(4, '0')}`,
    firstName,
    lastName,
    role: 'player',
    createdAt: '2024-01-15T10:00:00',
    updatedAt: '2024-01-15T10:00:00'
  };
}


// ==================
// BASE PLAYERS (matching backend Player model)
// ==================

const mockBasePlayers: { [key: string]: Player } = {
  'p1': { id: 'p1', userId: 'u1', teamId: '1', registrationFeeDue: null, isFullyRegistered: true, isActive: true, jerseyNumber: 23, createdAt: '2024-01-20T10:00:00', updatedAt: '2024-01-20T10:00:00' },
  'p2': { id: 'p2', userId: 'u2', teamId: '1', registrationFeeDue: null, isFullyRegistered: true, isActive: true, jerseyNumber: 12, createdAt: '2024-01-20T10:00:00', updatedAt: '2024-01-20T10:00:00' },
  'p3': { id: 'p3', userId: 'u3', teamId: '1', registrationFeeDue: null, isFullyRegistered: true, isActive: true, jerseyNumber: 7, createdAt: '2024-01-20T10:00:00', updatedAt: '2024-01-20T10:00:00' },
  'p4': { id: 'p4', userId: 'u4', teamId: '1', registrationFeeDue: null, isFullyRegistered: true, isActive: true, jerseyNumber: 33, createdAt: '2024-01-20T10:00:00', updatedAt: '2024-01-20T10:00:00' },
  'p5': { id: 'p5', userId: 'u5', teamId: '1', registrationFeeDue: null, isFullyRegistered: true, isActive: true, jerseyNumber: 5, createdAt: '2024-01-20T10:00:00', updatedAt: '2024-01-20T10:00:00' },
  'p6': { id: 'p6', userId: 'u6', teamId: '1', registrationFeeDue: null, isFullyRegistered: true, isActive: true, jerseyNumber: 21, createdAt: '2024-01-20T10:00:00', updatedAt: '2024-01-20T10:00:00' },
  'p7': { id: 'p7', userId: 'u7', teamId: '1', registrationFeeDue: null, isFullyRegistered: true, isActive: true, jerseyNumber: 14, createdAt: '2024-01-20T10:00:00', updatedAt: '2024-01-20T10:00:00' },
  'p8': { id: 'p8', userId: 'u8', teamId: '1', registrationFeeDue: null, isFullyRegistered: true, isActive: true, jerseyNumber: 31, createdAt: '2024-01-20T10:00:00', updatedAt: '2024-01-20T10:00:00' },
  
  'p9': { id: 'p9', userId: 'u9', teamId: '2', registrationFeeDue: null, isFullyRegistered: true, isActive: true, jerseyNumber: 10, createdAt: '2024-01-20T10:00:00', updatedAt: '2024-01-20T10:00:00' },
  'p10': { id: 'p10', userId: 'u10', teamId: '2', registrationFeeDue: null, isFullyRegistered: true, isActive: true, jerseyNumber: 24, createdAt: '2024-01-20T10:00:00', updatedAt: '2024-01-20T10:00:00' },
  'p11': { id: 'p11', userId: 'u11', teamId: '2', registrationFeeDue: null, isFullyRegistered: true, isActive: true, jerseyNumber: 3, createdAt: '2024-01-20T10:00:00', updatedAt: '2024-01-20T10:00:00' },
  'p12': { id: 'p12', userId: 'u12', teamId: '2', registrationFeeDue: null, isFullyRegistered: true, isActive: true, jerseyNumber: 15, createdAt: '2024-01-20T10:00:00', updatedAt: '2024-01-20T10:00:00' },
  'p13': { id: 'p13', userId: 'u13', teamId: '2', registrationFeeDue: null, isFullyRegistered: true, isActive: true, jerseyNumber: 42, createdAt: '2024-01-20T10:00:00', updatedAt: '2024-01-20T10:00:00' },
  'p14': { id: 'p14', userId: 'u14', teamId: '2', registrationFeeDue: null, isFullyRegistered: true, isActive: true, jerseyNumber: 8, createdAt: '2024-01-20T10:00:00', updatedAt: '2024-01-20T10:00:00' },
  'p15': { id: 'p15', userId: 'u15', teamId: '2', registrationFeeDue: null, isFullyRegistered: true, isActive: true, jerseyNumber: 20, createdAt: '2024-01-20T10:00:00', updatedAt: '2024-01-20T10:00:00' },
  'p16': { id: 'p16', userId: 'u16', teamId: '2', registrationFeeDue: null, isFullyRegistered: true, isActive: true, jerseyNumber: 35, createdAt: '2024-01-20T10:00:00', updatedAt: '2024-01-20T10:00:00' },
};

// Create players for teams 3-6 and unassigned players
const jerseyNumbers = [11, 22, 4, 32, 9, 25, 13, 30, 1, 16, 6, 27, 2, 18, 34, 44, 19, 26, 5, 17, 28, 41, 12, 36, 14, 29, 7, 38, 3, 21, 40, 45, 0, 0, 0, 0, 0, 0, 0, 0];
for (let i = 17; i <= 56; i++) {
  const playerNum = i - 16;
  let teamId: string | null = null;
  
  // Assign to teams 3-6 (8 players each)
  if (i <= 24) teamId = '3';
  else if (i <= 32) teamId = '4';
  else if (i <= 40) teamId = '5';
  else if (i <= 48) teamId = '6';
  // i > 48 remain unassigned
  
  mockBasePlayers[`p${playerNum}`] = {
    id: `p${playerNum}`,
    userId: `u${i}`,
    teamId,
    registrationFeeDue: teamId === null ? 50.00 : null,
    isFullyRegistered: teamId !== null,
    isActive: true,
    jerseyNumber: jerseyNumbers[i - 17] || null,
    createdAt: '2024-01-20T10:00:00',
    updatedAt: '2024-01-20T10:00:00'
  };
}

// ==================
// BASE TEAMS (matching backend Team model)
// ==================

export const mockBaseTeams: { [key: string]: Team } = {
  '1': { id: '1', name: 'Thunder', wins: 12, losses: 2, draws: 0, pointsFor: 1344, pointsAgainst: 1248, createdAt: '2024-01-10T10:00:00', updatedAt: '2024-12-20T10:00:00' },
  '2': { id: '2', name: 'Lightning', wins: 11, losses: 3, draws: 0, pointsFor: 1288, pointsAgainst: 1195, createdAt: '2024-01-10T10:00:00', updatedAt: '2024-12-20T10:00:00' },
  '3': { id: '3', name: 'Storm', wins: 9, losses: 5, draws: 0, pointsFor: 1330, pointsAgainst: 1274, createdAt: '2024-01-10T10:00:00', updatedAt: '2024-12-20T10:00:00' },
  '4': { id: '4', name: 'Hawks', wins: 8, losses: 6, draws: 0, pointsFor: 1246, pointsAgainst: 1268, createdAt: '2024-01-10T10:00:00', updatedAt: '2024-12-20T10:00:00' },
  '5': { id: '5', name: 'Blaze', wins: 6, losses: 8, draws: 0, pointsFor: 1190, pointsAgainst: 1274, createdAt: '2024-01-10T10:00:00', updatedAt: '2024-12-20T10:00:00' },
  '6': { id: '6', name: 'Eagles', wins: 4, losses: 10, draws: 0, pointsFor: 1162, pointsAgainst: 1301, createdAt: '2024-01-10T10:00:00', updatedAt: '2024-12-20T10:00:00' },
};


// ==================
// BASE GAMES (matching backend Game model)
// ==================

export const mockBaseGames: Game[] = [
  // Week 1-10 - Completed games
  { id: '1', homeTeamId: '1', awayTeamId: '2', gameTime: '2025-12-01T19:00:00', createdAt: '2024-11-01T10:00:00', updatedAt: '2025-12-01T21:00:00' },
  { id: '2', homeTeamId: '3', awayTeamId: '5', gameTime: '2025-12-01T20:30:00', createdAt: '2024-11-01T10:00:00', updatedAt: '2025-12-01T22:30:00' },
  { id: '3', homeTeamId: '4', awayTeamId: '6', gameTime: '2025-12-02T19:00:00', createdAt: '2024-11-01T10:00:00', updatedAt: '2025-12-02T21:00:00' },
  { id: '4', homeTeamId: '2', awayTeamId: '3', gameTime: '2025-12-03T19:00:00', createdAt: '2024-11-01T10:00:00', updatedAt: '2025-12-03T21:00:00' },
  { id: '5', homeTeamId: '5', awayTeamId: '1', gameTime: '2025-12-03T20:30:00', createdAt: '2024-11-01T10:00:00', updatedAt: '2025-12-03T22:30:00' },
  { id: '6', homeTeamId: '6', awayTeamId: '4', gameTime: '2025-12-04T19:00:00', createdAt: '2024-11-01T10:00:00', updatedAt: '2025-12-04T21:00:00' },
  { id: '7', homeTeamId: '1', awayTeamId: '3', gameTime: '2025-12-05T19:00:00', createdAt: '2024-11-01T10:00:00', updatedAt: '2025-12-05T21:00:00' },
  { id: '8', homeTeamId: '4', awayTeamId: '2', gameTime: '2025-12-05T20:30:00', createdAt: '2024-11-01T10:00:00', updatedAt: '2025-12-05T22:30:00' },
  { id: '9', homeTeamId: '6', awayTeamId: '5', gameTime: '2025-12-06T19:00:00', createdAt: '2024-11-01T10:00:00', updatedAt: '2025-12-06T21:00:00' },
  { id: '10', homeTeamId: '3', awayTeamId: '6', gameTime: '2025-12-07T19:00:00', createdAt: '2024-11-01T10:00:00', updatedAt: '2025-12-07T21:00:00' },
  { id: '11', homeTeamId: '2', awayTeamId: '5', gameTime: '2025-12-07T20:30:00', createdAt: '2024-11-01T10:00:00', updatedAt: '2025-12-07T22:30:00' },
  { id: '12', homeTeamId: '1', awayTeamId: '4', gameTime: '2025-12-08T19:00:00', createdAt: '2024-11-01T10:00:00', updatedAt: '2025-12-08T21:00:00' },
  { id: '13', homeTeamId: '5', awayTeamId: '4', gameTime: '2025-12-09T19:00:00', createdAt: '2024-11-01T10:00:00', updatedAt: '2025-12-09T21:00:00' },
  { id: '14', homeTeamId: '6', awayTeamId: '1', gameTime: '2025-12-09T20:30:00', createdAt: '2024-11-01T10:00:00', updatedAt: '2025-12-09T22:30:00' },
  { id: '15', homeTeamId: '3', awayTeamId: '2', gameTime: '2025-12-10T19:00:00', createdAt: '2024-11-01T10:00:00', updatedAt: '2025-12-10T21:00:00' },
  { id: '16', homeTeamId: '4', awayTeamId: '3', gameTime: '2025-12-11T19:00:00', createdAt: '2024-11-01T10:00:00', updatedAt: '2025-12-11T21:00:00' },
  { id: '17', homeTeamId: '1', awayTeamId: '5', gameTime: '2025-12-11T20:30:00', createdAt: '2024-11-01T10:00:00', updatedAt: '2025-12-11T22:30:00' },
  { id: '18', homeTeamId: '2', awayTeamId: '6', gameTime: '2025-12-12T19:00:00', createdAt: '2024-11-01T10:00:00', updatedAt: '2025-12-12T21:00:00' },
  { id: '19', homeTeamId: '5', awayTeamId: '3', gameTime: '2025-12-13T19:00:00', createdAt: '2024-11-01T10:00:00', updatedAt: '2025-12-13T21:00:00' },
  { id: '20', homeTeamId: '6', awayTeamId: '2', gameTime: '2025-12-13T20:30:00', createdAt: '2024-11-01T10:00:00', updatedAt: '2025-12-13T22:30:00' },
  { id: '21', homeTeamId: '4', awayTeamId: '1', gameTime: '2025-12-14T19:00:00', createdAt: '2024-11-01T10:00:00', updatedAt: '2025-12-14T21:00:00' },
  { id: '22', homeTeamId: '1', awayTeamId: '2', gameTime: '2025-12-15T19:00:00', createdAt: '2024-11-01T10:00:00', updatedAt: '2025-12-15T21:00:00' },
  { id: '23', homeTeamId: '3', awayTeamId: '4', gameTime: '2025-12-15T20:30:00', createdAt: '2024-11-01T10:00:00', updatedAt: '2025-12-15T22:30:00' },
  { id: '24', homeTeamId: '5', awayTeamId: '6', gameTime: '2025-12-16T19:00:00', createdAt: '2024-11-01T10:00:00', updatedAt: '2025-12-16T21:00:00' },
  { id: '25', homeTeamId: '2', awayTeamId: '1', gameTime: '2025-12-17T19:00:00', createdAt: '2024-11-01T10:00:00', updatedAt: '2025-12-17T21:00:00' },
  { id: '26', homeTeamId: '4', awayTeamId: '5', gameTime: '2025-12-17T20:30:00', createdAt: '2024-11-01T10:00:00', updatedAt: '2025-12-17T22:30:00' },
  { id: '27', homeTeamId: '6', awayTeamId: '3', gameTime: '2025-12-18T19:00:00', createdAt: '2024-11-01T10:00:00', updatedAt: '2025-12-18T21:00:00' },
  { id: '28', homeTeamId: '3', awayTeamId: '1', gameTime: '2025-12-19T19:00:00', createdAt: '2024-11-01T10:00:00', updatedAt: '2025-12-19T21:00:00' },
  { id: '29', homeTeamId: '5', awayTeamId: '2', gameTime: '2025-12-19T20:30:00', createdAt: '2024-11-01T10:00:00', updatedAt: '2025-12-19T22:30:00' },
  { id: '30', homeTeamId: '6', awayTeamId: '4', gameTime: '2025-12-20T19:00:00', createdAt: '2024-11-01T10:00:00', updatedAt: '2025-12-20T21:00:00' },
  
  // Future games - Scheduled
  { id: '31', homeTeamId: '1', awayTeamId: '6', gameTime: '2025-12-26T19:00:00', createdAt: '2024-11-01T10:00:00', updatedAt: '2024-11-01T10:00:00' },
  { id: '32', homeTeamId: '2', awayTeamId: '4', gameTime: '2025-12-26T20:30:00', createdAt: '2024-11-01T10:00:00', updatedAt: '2024-11-01T10:00:00' },
  { id: '33', homeTeamId: '3', awayTeamId: '5', gameTime: '2025-12-27T19:00:00', createdAt: '2024-11-01T10:00:00', updatedAt: '2024-11-01T10:00:00' },
  { id: '34', homeTeamId: '4', awayTeamId: '1', gameTime: '2026-01-02T19:00:00', createdAt: '2024-11-01T10:00:00', updatedAt: '2024-11-01T10:00:00' },
  { id: '35', homeTeamId: '5', awayTeamId: '3', gameTime: '2026-01-02T20:30:00', createdAt: '2024-11-01T10:00:00', updatedAt: '2024-11-01T10:00:00' },
  { id: '36', homeTeamId: '6', awayTeamId: '2', gameTime: '2026-01-03T19:00:00', createdAt: '2024-11-01T10:00:00', updatedAt: '2024-11-01T10:00:00' },
  { id: '37', homeTeamId: '1', awayTeamId: '3', gameTime: '2026-01-09T19:00:00', createdAt: '2024-11-01T10:00:00', updatedAt: '2024-11-01T10:00:00' },
  { id: '38', homeTeamId: '2', awayTeamId: '5', gameTime: '2026-01-09T20:30:00', createdAt: '2024-11-01T10:00:00', updatedAt: '2024-11-01T10:00:00' },
  { id: '39', homeTeamId: '4', awayTeamId: '6', gameTime: '2026-01-10T19:00:00', createdAt: '2024-11-01T10:00:00', updatedAt: '2024-11-01T10:00:00' },
  { id: '40', homeTeamId: '3', awayTeamId: '2', gameTime: '2026-01-16T19:00:00', createdAt: '2024-11-01T10:00:00', updatedAt: '2024-11-01T10:00:00' },
  { id: '41', homeTeamId: '6', awayTeamId: '1', gameTime: '2026-01-16T20:30:00', createdAt: '2024-11-01T10:00:00', updatedAt: '2024-11-01T10:00:00' },
  { id: '42', homeTeamId: '5', awayTeamId: '4', gameTime: '2026-01-17T19:00:00', createdAt: '2024-11-01T10:00:00', updatedAt: '2024-11-01T10:00:00' },
];

// Mock game scores for completed games
const gameScores: { [gameId: string]: { homeScore: number, awayScore: number } } = {
  '1': { homeScore: 95, awayScore: 88 }, '2': { homeScore: 102, awayScore: 98 }, '3': { homeScore: 87, awayScore: 92 },
  '4': { homeScore: 91, awayScore: 85 }, '5': { homeScore: 78, awayScore: 94 }, '6': { homeScore: 88, awayScore: 90 },
  '7': { homeScore: 99, awayScore: 95 }, '8': { homeScore: 84, awayScore: 96 }, '9': { homeScore: 79, awayScore: 86 },
  '10': { homeScore: 105, awayScore: 89 }, '11': { homeScore: 93, awayScore: 82 }, '12': { homeScore: 97, awayScore: 89 },
  '13': { homeScore: 91, awayScore: 94 }, '14': { homeScore: 81, awayScore: 98 }, '15': { homeScore: 87, awayScore: 92 },
  '16': { homeScore: 88, awayScore: 85 }, '17': { homeScore: 101, awayScore: 87 }, '18': { homeScore: 95, awayScore: 83 },
  '19': { homeScore: 89, awayScore: 97 }, '20': { homeScore: 78, awayScore: 90 }, '21': { homeScore: 82, awayScore: 93 },
  '22': { homeScore: 96, awayScore: 91 }, '23': { homeScore: 101, awayScore: 95 }, '24': { homeScore: 85, awayScore: 79 },
  '25': { homeScore: 88, awayScore: 102 }, '26': { homeScore: 90, awayScore: 85 }, '27': { homeScore: 84, awayScore: 98 },
  '28': { homeScore: 91, awayScore: 97 }, '29': { homeScore: 80, awayScore: 94 }, '30': { homeScore: 77, awayScore: 86 },
};

// Mock PPG data for generating player stats
const playerPPG: { [playerId: string]: number } = {
  'p1': 18.5, 'p2': 15.2, 'p3': 12.8, 'p4': 11.4, 'p5': 10.6, 'p6': 9.8, 'p7': 8.3, 'p8': 7.5,
  'p9': 19.2, 'p10': 16.1, 'p11': 13.5, 'p12': 11.8, 'p13': 10.2, 'p14': 9.5, 'p15': 7.9, 'p16': 6.8,
  'p17': 17.3, 'p18': 15.7, 'p19': 13.9, 'p20': 12.1, 'p21': 10.8, 'p22': 9.2, 'p23': 8.6, 'p24': 7.4,
  'p25': 16.8, 'p26': 14.9, 'p27': 13.2, 'p28': 11.5, 'p29': 10.4, 'p30': 9.1, 'p31': 8.2, 'p32': 6.9,
  'p33': 15.6, 'p34': 14.3, 'p35': 12.7, 'p36': 11.9, 'p37': 10.1, 'p38': 8.8, 'p39': 7.5, 'p40': 6.4,
  'p41': 14.2, 'p42': 13.1, 'p43': 11.8, 'p44': 10.6, 'p45': 9.4, 'p46': 8.3, 'p47': 7.1, 'p48': 5.8,
};


// ==================
// HELPER FUNCTIONS
// ==================

/**
 * Create PlayerProfile from base Player and User
 */
function playerToPlayerProfile(player: Player): PlayerProfile {
  const user = mockUsers[player.userId];
  if (!user) {
    throw new Error(`User not found for player ${player.id}`);
  }
  
  return {
    ...player,
    email: user.email,
    phoneNumber: user.phoneNumber,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    fullName: getUserFullName(user),
  };
}

/**
 * Get roster as PlayerProfiles for a team
 */
function getTeamRoster(teamId: string): PlayerProfile[] {
  const teamPlayers = Object.values(mockBasePlayers).filter(p => p.teamId === teamId);
  return teamPlayers.map(playerToPlayerProfile);
}

/**
 * Get team games with details
 */
function getTeamGames(teamId: string): GameWithDetails[] {
  const teamGames = mockBaseGames.filter(g => g.homeTeamId === teamId || g.awayTeamId === teamId);
  return teamGames.map(gameToGameWithDetails);
}

/**
 * Convert base Game to GameWithDetails
 */
function gameToGameWithDetails(game: Game): GameWithDetails {
  const homeTeam = mockBaseTeams[game.homeTeamId];
  const awayTeam = mockBaseTeams[game.awayTeamId];
  const scores = gameScores[game.id];
  
  return {
    ...game,
    homeTeamName: homeTeam?.name || 'Unknown',
    awayTeamName: awayTeam?.name || 'Unknown',
    homeScore: scores?.homeScore,
    awayScore: scores?.awayScore,
    status: scores ? 'completed' : getGameStatus(game.gameTime),
  };
}

/**
 * Generate realistic player game stats
 */
function generatePlayerStats(roster: PlayerProfile[], teamScore: number): PlayerGameStats[] {
  const stats: PlayerGameStats[] = [];
  let remainingPoints = teamScore;
  
  // Sort players by PPG to give better players more points
  const sortedRoster = [...roster].sort((a, b) => {
    const ppgA = playerPPG[a.id] || 0;
    const ppgB = playerPPG[b.id] || 0;
    return ppgB - ppgA;
  });
  
  sortedRoster.forEach((player, index) => {
    let points: number;
    
    if (index === sortedRoster.length - 1) {
      // Last player gets remaining points
      points = Math.max(0, remainingPoints);
    } else {
      // Distribute points based on player's PPG with some variance
      const ppg = playerPPG[player.id] || 10;
      const ratio = ppg / 94; // 94 is average team score
      const basePoints = Math.floor(teamScore * ratio);
      const variance = Math.floor(Math.random() * 8) - 4; // -4 to +4
      points = Math.max(0, Math.min(basePoints + variance, remainingPoints));
    }
    
    remainingPoints -= points;
    
    stats.push({
      playerId: player.id,
      playerName: player.fullName,
      number: player.jerseyNumber || 0,
      points,
    });
  });
  
  // Sort by points descending
  return stats.sort((a, b) => b.points - a.points);
}

/**
 * Generate half-time scores
 */
function generateHalfScores(totalScore: number): { firstHalf: number; secondHalf: number } {
  // First half typically 45-55% of total score
  const firstHalfRatio = 0.45 + Math.random() * 0.1;
  const firstHalf = Math.round(totalScore * firstHalfRatio);
  const secondHalf = totalScore - firstHalf;
  
  return { firstHalf, secondHalf };
}

/**
 * Generate game details for a completed game
 */
export function generateGameDetails(game: GameWithDetails): GameDetails | undefined {
  if (game.status !== 'completed' || !game.homeScore || !game.awayScore) {
    return undefined;
  }
  
  const homeRoster = getTeamRoster(game.homeTeamId);
  const awayRoster = getTeamRoster(game.awayTeamId);
  
  const homeHalves = generateHalfScores(game.homeScore);
  const awayHalves = generateHalfScores(game.awayScore);
  
  return {
    gameId: game.id,
    homeFirstHalf: homeHalves.firstHalf,
    homeSecondHalf: homeHalves.secondHalf,
    awayFirstHalf: awayHalves.firstHalf,
    awaySecondHalf: awayHalves.secondHalf,
    homePlayerStats: generatePlayerStats(homeRoster, game.homeScore),
    awayPlayerStats: generatePlayerStats(awayRoster, game.awayScore),
  };
}

// ==================
// EXPORTED DATA
// ==================

/**
 * All games with full details
 */
export const mockAllGames: GameWithDetails[] = mockBaseGames.map(gameToGameWithDetails);

/**
 * Team details with rosters and stats
 */
export const mockTeamDetails: { [key: string]: TeamDetail } = {};
Object.keys(mockBaseTeams).forEach(teamId => {
  const baseTeam = mockBaseTeams[teamId];
  if (!baseTeam) return;
  
  const teamWithStats = teamToTeamWithStats(baseTeam);
  
  mockTeamDetails[teamId] = {
    ...teamWithStats,
    coach: ['Mike Stevens', 'Robert Chen', 'David Martinez', 'Tom Anderson', 'Jason Wright', 'Chris Thompson'][parseInt(teamId) - 1],
    homeVenue: ['Fairfield Community Center', 'Darien YMCA', 'Westport High School', 'Norwalk Recreation Center', 'Stamford High School', 'Greenwich Community Center'][parseInt(teamId) - 1],
    roster: getTeamRoster(teamId),
    games: getTeamGames(teamId),
  };
});

/**
 * League standings
 */
export const mockStandings: Standing[] = Object.values(mockBaseTeams)
  .map(team => teamToTeamWithStats(team))
  .sort((a, b) => b.winPercentage - a.winPercentage)
  .map((team, index) => ({
    rank: index + 1,
    team,
    streak: ['W5', 'W3', 'W1', 'W2', 'L2', 'L4'][index],
  }));

/**
 * Recent completed games (for homepage)
 */
export const mockRecentGames: GameWithDetails[] = mockAllGames
  .filter(g => g.status === 'completed')
  .slice(-3);

/**
 * Upcoming scheduled games (for homepage)
 */
export const mockUpcomingGames: GameWithDetails[] = mockAllGames
  .filter(g => g.status === 'scheduled')
  .slice(0, 5);

/**
 * Unassigned players
 */
export const mockUnassignedPlayers: PlayerProfile[] = Object.values(mockBasePlayers)
  .filter(p => p.teamId === null)
  .map(playerToPlayerProfile);

/**
 * All players (assigned + unassigned)
 */
export const getAllPlayers = (): PlayerProfile[] => {
  return Object.values(mockBasePlayers).map(playerToPlayerProfile);
};

