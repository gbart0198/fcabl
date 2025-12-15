/**
 * Mock data for games, standings, teams, and players
 * This data will be replaced with real API calls when backend is implemented
 */

import type { Game, Standing, Player, TeamDetail, GameDetails, PlayerGameStats } from '@/types/game.types';

/**
 * Helper function to generate realistic player game stats
 * Distributes the team's total score among players with some randomness
 */
function generatePlayerStats(roster: Player[], teamScore: number): PlayerGameStats[] {
  const stats: PlayerGameStats[] = [];
  let remainingPoints = teamScore;
  
  // Sort players by PPG to give better players more points
  const sortedRoster = [...roster].sort((a, b) => b.pointsPerGame - a.pointsPerGame);
  
  sortedRoster.forEach((player, index) => {
    let points: number;
    
    if (index === sortedRoster.length - 1) {
      // Last player gets remaining points
      points = Math.max(0, remainingPoints);
    } else {
      // Distribute points based on player's PPG with some variance
      const ratio = player.pointsPerGame / 94; // 94 is average team score
      const basePoints = Math.floor(teamScore * ratio);
      const variance = Math.floor(Math.random() * 8) - 4; // -4 to +4
      points = Math.max(0, Math.min(basePoints + variance, remainingPoints));
    }
    
    remainingPoints -= points;
    
    stats.push({
      playerId: player.id,
      playerName: player.name,
      number: player.number,
      points,
    });
  });
  
  // Sort by points descending
  return stats.sort((a, b) => b.points - a.points);
}

/**
 * Helper function to generate half-time scores
 * Splits the total score into two halves with realistic distribution
 */
function generateHalfScores(totalScore: number): { firstHalf: number; secondHalf: number } {
  // First half typically 45-55% of total score
  const firstHalfRatio = 0.45 + Math.random() * 0.1;
  const firstHalf = Math.round(totalScore * firstHalfRatio);
  const secondHalf = totalScore - firstHalf;
  
  return { firstHalf, secondHalf };
}

/**
 * Helper function to get team roster by ID
 */
function getRosterById(teamId: string): Player[] {
  const rosters: { [key: string]: Player[] } = {
    '1': thunderRoster,
    '2': lightningRoster,
    '3': stormRoster,
    '4': hawksRoster,
    '5': blazeRoster,
    '6': eaglesRoster,
  };
  return rosters[teamId] || [];
}

/**
 * Generate game details for a completed game
 * This creates realistic half-time scores and player statistics
 */
export function generateGameDetails(game: Game): GameDetails | undefined {
  if (game.status !== 'completed' || !game.homeScore || !game.awayScore) {
    return undefined;
  }
  
  const homeRoster = getRosterById(game.homeTeamId);
  const awayRoster = getRosterById(game.awayTeamId);
  
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

/**
 * Mock player rosters for each team
 */
const thunderRoster: Player[] = [
  { id: 'p1', name: 'Marcus Johnson', number: 23, pointsPerGame: 18.5, email: 'marcus.j@fcabl.com', teamId: '1' },
  { id: 'p2', name: 'Tyler Rodriguez', number: 12, pointsPerGame: 15.2, email: 'tyler.r@fcabl.com', teamId: '1' },
  { id: 'p3', name: 'Chris Anderson', number: 7, pointsPerGame: 12.8, email: 'chris.a@fcabl.com', teamId: '1' },
  { id: 'p4', name: 'Brandon Lee', number: 33, pointsPerGame: 11.4, email: 'brandon.l@fcabl.com', teamId: '1' },
  { id: 'p5', name: 'Kevin Martinez', number: 5, pointsPerGame: 10.6, email: 'kevin.m@fcabl.com', teamId: '1' },
  { id: 'p6', name: 'Josh Williams', number: 21, pointsPerGame: 9.8, email: 'josh.w@fcabl.com', teamId: '1' },
  { id: 'p7', name: 'Derek Thompson', number: 14, pointsPerGame: 8.3, email: 'derek.t@fcabl.com', teamId: '1' },
  { id: 'p8', name: 'Ryan Davis', number: 31, pointsPerGame: 7.5, email: 'ryan.d@fcabl.com', teamId: '1' },
];

const lightningRoster: Player[] = [
  { id: 'p9', name: 'James Mitchell', number: 10, pointsPerGame: 19.2, email: 'james.m@fcabl.com', teamId: '2' },
  { id: 'p10', name: 'Daniel Brooks', number: 24, pointsPerGame: 16.1, email: 'daniel.b@fcabl.com', teamId: '2' },
  { id: 'p11', name: 'Alex Turner', number: 3, pointsPerGame: 13.5, email: 'alex.t@fcabl.com', teamId: '2' },
  { id: 'p12', name: 'Michael Chen', number: 15, pointsPerGame: 11.8, email: 'michael.c@fcabl.com', teamId: '2' },
  { id: 'p13', name: 'Patrick O\'Brien', number: 42, pointsPerGame: 10.2, email: 'patrick.o@fcabl.com', teamId: '2' },
  { id: 'p14', name: 'Sam Richards', number: 8, pointsPerGame: 9.5, email: 'sam.r@fcabl.com', teamId: '2' },
  { id: 'p15', name: 'Connor Walsh', number: 20, pointsPerGame: 7.9, email: 'connor.w@fcabl.com', teamId: '2' },
  { id: 'p16', name: 'Eric Foster', number: 35, pointsPerGame: 6.8, email: 'eric.f@fcabl.com', teamId: '2' },
];

const stormRoster: Player[] = [
  { id: 'p17', name: 'Jake Harrison', number: 11, pointsPerGame: 17.3, email: 'jake.h@fcabl.com', teamId: '3' },
  { id: 'p18', name: 'Noah Campbell', number: 22, pointsPerGame: 15.7, email: 'noah.c@fcabl.com', teamId: '3' },
  { id: 'p19', name: 'Ethan Parker', number: 4, pointsPerGame: 13.9, email: 'ethan.p@fcabl.com', teamId: '3' },
  { id: 'p20', name: 'Luke Sanders', number: 32, pointsPerGame: 12.1, email: 'luke.s@fcabl.com', teamId: '3' },
  { id: 'p21', name: 'Mason Cooper', number: 9, pointsPerGame: 10.8, email: 'mason.c@fcabl.com', teamId: '3' },
  { id: 'p22', name: 'Owen Bennett', number: 25, pointsPerGame: 9.2, email: 'owen.b@fcabl.com', teamId: '3' },
  { id: 'p23', name: 'Aiden Rivera', number: 13, pointsPerGame: 8.6, email: 'aiden.r@fcabl.com', teamId: '3' },
  { id: 'p24', name: 'Caleb Murphy', number: 30, pointsPerGame: 7.4, email: 'caleb.m@fcabl.com', teamId: '3' },
];

const hawksRoster: Player[] = [
  { id: 'p25', name: 'Justin Wright', number: 1, pointsPerGame: 16.8, email: 'justin.w@fcabl.com', teamId: '4' },
  { id: 'p26', name: 'Nathan Gray', number: 16, pointsPerGame: 14.9, email: 'nathan.g@fcabl.com', teamId: '4' },
  { id: 'p27', name: 'Aaron Kelly', number: 6, pointsPerGame: 13.2, email: 'aaron.k@fcabl.com', teamId: '4' },
  { id: 'p28', name: 'Jordan Hayes', number: 27, pointsPerGame: 11.5, email: 'jordan.h@fcabl.com', teamId: '4' },
  { id: 'p29', name: 'Cameron Price', number: 2, pointsPerGame: 10.4, email: 'cameron.p@fcabl.com', teamId: '4' },
  { id: 'p30', name: 'Dylan Moore', number: 18, pointsPerGame: 9.1, email: 'dylan.m@fcabl.com', teamId: '4' },
  { id: 'p31', name: 'Blake Stewart', number: 34, pointsPerGame: 8.2, email: 'blake.s@fcabl.com', teamId: '4' },
  { id: 'p32', name: 'Austin Ross', number: 44, pointsPerGame: 6.9, email: 'austin.r@fcabl.com', teamId: '4' },
];

const blazeRoster: Player[] = [
  { id: 'p33', name: 'Trevor Morgan', number: 19, pointsPerGame: 15.6, email: 'trevor.m@fcabl.com', teamId: '5' },
  { id: 'p34', name: 'Andrew Coleman', number: 26, pointsPerGame: 14.3, email: 'andrew.c@fcabl.com', teamId: '5' },
  { id: 'p35', name: 'Zachary Bell', number: 5, pointsPerGame: 12.7, email: 'zachary.b@fcabl.com', teamId: '5' },
  { id: 'p36', name: 'Sean Hughes', number: 17, pointsPerGame: 11.9, email: 'sean.h@fcabl.com', teamId: '5' },
  { id: 'p37', name: 'Kyle Barnes', number: 28, pointsPerGame: 10.1, email: 'kyle.b@fcabl.com', teamId: '5' },
  { id: 'p38', name: 'Brian Fisher', number: 41, pointsPerGame: 8.8, email: 'brian.f@fcabl.com', teamId: '5' },
  { id: 'p39', name: 'Adam Reed', number: 12, pointsPerGame: 7.5, email: 'adam.r@fcabl.com', teamId: '5' },
  { id: 'p40', name: 'Tyler Powell', number: 36, pointsPerGame: 6.4, email: 'tyler.p@fcabl.com', teamId: '5' },
];

const eaglesRoster: Player[] = [
  { id: 'p41', name: 'Ryan Peterson', number: 14, pointsPerGame: 14.2, email: 'ryan.p@fcabl.com', teamId: '6' },
  { id: 'p42', name: 'Matthew Long', number: 29, pointsPerGame: 13.1, email: 'matthew.l@fcabl.com', teamId: '6' },
  { id: 'p43', name: 'Jacob Ellis', number: 7, pointsPerGame: 11.8, email: 'jacob.e@fcabl.com', teamId: '6' },
  { id: 'p44', name: 'Nicholas Ross', number: 38, pointsPerGame: 10.6, email: 'nicholas.r@fcabl.com', teamId: '6' },
  { id: 'p45', name: 'Ian Scott', number: 3, pointsPerGame: 9.4, email: 'ian.s@fcabl.com', teamId: '6' },
  { id: 'p46', name: 'Colin Ward', number: 21, pointsPerGame: 8.3, email: 'colin.w@fcabl.com', teamId: '6' },
  { id: 'p47', name: 'Garrett Carter', number: 40, pointsPerGame: 7.1, email: 'garrett.c@fcabl.com', teamId: '6' },
  { id: 'p48', name: 'Bradley King', number: 45, pointsPerGame: 5.8, email: 'bradley.k@fcabl.com', teamId: '6' },
];

/**
 * Mock all games for the season (completed and scheduled)
 */
export const mockAllGames: Game[] = [
  // Week 1 - Completed
  { id: '1', homeTeam: 'Thunder', homeTeamId: '1', awayTeam: 'Lightning', awayTeamId: '2', homeScore: 95, awayScore: 88, date: '2025-12-01', time: '7:00 PM', status: 'completed' },
  { id: '2', homeTeam: 'Storm', homeTeamId: '3', awayTeam: 'Blaze', awayTeamId: '5', homeScore: 102, awayScore: 98, date: '2025-12-01', time: '8:30 PM', status: 'completed' },
  { id: '3', homeTeam: 'Hawks', homeTeamId: '4', awayTeam: 'Eagles', awayTeamId: '6', homeScore: 87, awayScore: 92, date: '2025-12-02', time: '7:00 PM', status: 'completed' },
  
  // Week 2 - Completed
  { id: '4', homeTeam: 'Lightning', homeTeamId: '2', awayTeam: 'Storm', awayTeamId: '3', homeScore: 91, awayScore: 85, date: '2025-12-03', time: '7:00 PM', status: 'completed' },
  { id: '5', homeTeam: 'Blaze', homeTeamId: '5', awayTeam: 'Thunder', awayTeamId: '1', homeScore: 78, awayScore: 94, date: '2025-12-03', time: '8:30 PM', status: 'completed' },
  { id: '6', homeTeam: 'Eagles', homeTeamId: '6', awayTeam: 'Hawks', awayTeamId: '4', homeScore: 88, awayScore: 90, date: '2025-12-04', time: '7:00 PM', status: 'completed' },
  
  // Week 3 - Completed
  { id: '7', homeTeam: 'Thunder', homeTeamId: '1', awayTeam: 'Storm', awayTeamId: '3', homeScore: 99, awayScore: 95, date: '2025-12-05', time: '7:00 PM', status: 'completed' },
  { id: '8', homeTeam: 'Hawks', homeTeamId: '4', awayTeam: 'Lightning', awayTeamId: '2', homeScore: 84, awayScore: 96, date: '2025-12-05', time: '8:30 PM', status: 'completed' },
  { id: '9', homeTeam: 'Eagles', homeTeamId: '6', awayTeam: 'Blaze', awayTeamId: '5', homeScore: 79, awayScore: 86, date: '2025-12-06', time: '7:00 PM', status: 'completed' },
  
  // Week 4 - Completed
  { id: '10', homeTeam: 'Storm', homeTeamId: '3', awayTeam: 'Eagles', awayTeamId: '6', homeScore: 105, awayScore: 89, date: '2025-12-07', time: '7:00 PM', status: 'completed' },
  { id: '11', homeTeam: 'Lightning', homeTeamId: '2', awayTeam: 'Blaze', awayTeamId: '5', homeScore: 93, awayScore: 82, date: '2025-12-07', time: '8:30 PM', status: 'completed' },
  { id: '12', homeTeam: 'Thunder', homeTeamId: '1', awayTeam: 'Hawks', awayTeamId: '4', homeScore: 97, awayScore: 89, date: '2025-12-08', time: '7:00 PM', status: 'completed' },
  
  // Week 5 - Completed
  { id: '13', homeTeam: 'Blaze', homeTeamId: '5', awayTeam: 'Hawks', awayTeamId: '4', homeScore: 91, awayScore: 94, date: '2025-12-09', time: '7:00 PM', status: 'completed' },
  { id: '14', homeTeam: 'Eagles', homeTeamId: '6', awayTeam: 'Thunder', awayTeamId: '1', homeScore: 81, awayScore: 98, date: '2025-12-09', time: '8:30 PM', status: 'completed' },
  { id: '15', homeTeam: 'Storm', homeTeamId: '3', awayTeam: 'Lightning', awayTeamId: '2', homeScore: 87, awayScore: 92, date: '2025-12-10', time: '7:00 PM', status: 'completed' },
  
  // Week 6 - Completed
  { id: '16', homeTeam: 'Hawks', homeTeamId: '4', awayTeam: 'Storm', awayTeamId: '3', homeScore: 88, awayScore: 85, date: '2025-12-11', time: '7:00 PM', status: 'completed' },
  { id: '17', homeTeam: 'Thunder', homeTeamId: '1', awayTeam: 'Blaze', awayTeamId: '5', homeScore: 101, awayScore: 87, date: '2025-12-11', time: '8:30 PM', status: 'completed' },
  { id: '18', homeTeam: 'Lightning', homeTeamId: '2', awayTeam: 'Eagles', awayTeamId: '6', homeScore: 95, awayScore: 83, date: '2025-12-12', time: '7:00 PM', status: 'completed' },
  
  // Week 7 - Completed
  { id: '19', homeTeam: 'Blaze', homeTeamId: '5', awayTeam: 'Storm', awayTeamId: '3', homeScore: 89, awayScore: 97, date: '2025-12-13', time: '7:00 PM', status: 'completed' },
  { id: '20', homeTeam: 'Eagles', homeTeamId: '6', awayTeam: 'Lightning', awayTeamId: '2', homeScore: 78, awayScore: 90, date: '2025-12-13', time: '8:30 PM', status: 'completed' },
  { id: '21', homeTeam: 'Hawks', homeTeamId: '4', awayTeam: 'Thunder', awayTeamId: '1', homeScore: 82, awayScore: 93, date: '2025-12-14', time: '7:00 PM', status: 'completed' },
  
  // Week 8 - Some completed
  { id: '22', homeTeam: 'Thunder', homeTeamId: '1', awayTeam: 'Lightning', awayTeamId: '2', homeScore: 96, awayScore: 91, date: '2025-12-15', time: '7:00 PM', status: 'completed' },
  { id: '23', homeTeam: 'Storm', homeTeamId: '3', awayTeam: 'Hawks', awayTeamId: '4', homeScore: 101, awayScore: 95, date: '2025-12-15', time: '8:30 PM', status: 'completed' },
  { id: '24', homeTeam: 'Blaze', homeTeamId: '5', awayTeam: 'Eagles', awayTeamId: '6', homeScore: 85, awayScore: 79, date: '2025-12-16', time: '7:00 PM', status: 'completed' },
  
  // Week 9 - Some completed
  { id: '25', homeTeam: 'Lightning', homeTeamId: '2', awayTeam: 'Thunder', awayTeamId: '1', homeScore: 88, awayScore: 102, date: '2025-12-17', time: '7:00 PM', status: 'completed' },
  { id: '26', homeTeam: 'Hawks', homeTeamId: '4', awayTeam: 'Blaze', awayTeamId: '5', homeScore: 90, awayScore: 85, date: '2025-12-17', time: '8:30 PM', status: 'completed' },
  { id: '27', homeTeam: 'Eagles', homeTeamId: '6', awayTeam: 'Storm', awayTeamId: '3', homeScore: 84, awayScore: 98, date: '2025-12-18', time: '7:00 PM', status: 'completed' },
  
  // Week 10 - Some completed
  { id: '28', homeTeam: 'Storm', homeTeamId: '3', awayTeam: 'Thunder', awayTeamId: '1', homeScore: 91, awayScore: 97, date: '2025-12-19', time: '7:00 PM', status: 'completed' },
  { id: '29', homeTeam: 'Blaze', homeTeamId: '5', awayTeam: 'Lightning', awayTeamId: '2', homeScore: 80, awayScore: 94, date: '2025-12-19', time: '8:30 PM', status: 'completed' },
  { id: '30', homeTeam: 'Eagles', homeTeamId: '6', awayTeam: 'Hawks', awayTeamId: '4', homeScore: 77, awayScore: 86, date: '2025-12-20', time: '7:00 PM', status: 'completed' },
  
  // Future games - Scheduled
  { id: '31', homeTeam: 'Thunder', homeTeamId: '1', awayTeam: 'Eagles', awayTeamId: '6', date: '2025-12-26', time: '7:00 PM', status: 'scheduled' },
  { id: '32', homeTeam: 'Lightning', homeTeamId: '2', awayTeam: 'Hawks', awayTeamId: '4', date: '2025-12-26', time: '8:30 PM', status: 'scheduled' },
  { id: '33', homeTeam: 'Storm', homeTeamId: '3', awayTeam: 'Blaze', awayTeamId: '5', date: '2025-12-27', time: '7:00 PM', status: 'scheduled' },
  
  { id: '34', homeTeam: 'Hawks', homeTeamId: '4', awayTeam: 'Thunder', awayTeamId: '1', date: '2026-01-02', time: '7:00 PM', status: 'scheduled' },
  { id: '35', homeTeam: 'Blaze', homeTeamId: '5', awayTeam: 'Storm', awayTeamId: '3', date: '2026-01-02', time: '8:30 PM', status: 'scheduled' },
  { id: '36', homeTeam: 'Eagles', homeTeamId: '6', awayTeam: 'Lightning', awayTeamId: '2', date: '2026-01-03', time: '7:00 PM', status: 'scheduled' },
  
  { id: '37', homeTeam: 'Thunder', homeTeamId: '1', awayTeam: 'Storm', awayTeamId: '3', date: '2026-01-09', time: '7:00 PM', status: 'scheduled' },
  { id: '38', homeTeam: 'Lightning', homeTeamId: '2', awayTeam: 'Blaze', awayTeamId: '5', date: '2026-01-09', time: '8:30 PM', status: 'scheduled' },
  { id: '39', homeTeam: 'Hawks', homeTeamId: '4', awayTeam: 'Eagles', awayTeamId: '6', date: '2026-01-10', time: '7:00 PM', status: 'scheduled' },
  
  { id: '40', homeTeam: 'Storm', homeTeamId: '3', awayTeam: 'Lightning', awayTeamId: '2', date: '2026-01-16', time: '7:00 PM', status: 'scheduled' },
  { id: '41', homeTeam: 'Eagles', homeTeamId: '6', awayTeam: 'Thunder', awayTeamId: '1', date: '2026-01-16', time: '8:30 PM', status: 'scheduled' },
  { id: '42', homeTeam: 'Blaze', homeTeamId: '5', awayTeam: 'Hawks', awayTeamId: '4', date: '2026-01-17', time: '7:00 PM', status: 'scheduled' },
];

/**
 * Mock team details with rosters and statistics
 */
export const mockTeamDetails: { [key: string]: TeamDetail } = {
  '1': {
    id: '1',
    name: 'Thunder',
    wins: 12,
    losses: 2,
    winPercentage: 0.857,
    coach: 'Mike Stevens',
    homeVenue: 'Fairfield Community Center',
    roster: thunderRoster,
    games: mockAllGames.filter(g => g.homeTeamId === '1' || g.awayTeamId === '1'),
    pointsFor: 1344,
    pointsAgainst: 1248,
    avgPointsFor: 96.0,
    avgPointsAgainst: 89.1,
  },
  '2': {
    id: '2',
    name: 'Lightning',
    wins: 11,
    losses: 3,
    winPercentage: 0.786,
    coach: 'Robert Chen',
    homeVenue: 'Darien YMCA',
    roster: lightningRoster,
    games: mockAllGames.filter(g => g.homeTeamId === '2' || g.awayTeamId === '2'),
    pointsFor: 1288,
    pointsAgainst: 1195,
    avgPointsFor: 92.0,
    avgPointsAgainst: 85.4,
  },
  '3': {
    id: '3',
    name: 'Storm',
    wins: 9,
    losses: 5,
    winPercentage: 0.643,
    coach: 'David Martinez',
    homeVenue: 'Westport High School',
    roster: stormRoster,
    games: mockAllGames.filter(g => g.homeTeamId === '3' || g.awayTeamId === '3'),
    pointsFor: 1330,
    pointsAgainst: 1274,
    avgPointsFor: 95.0,
    avgPointsAgainst: 91.0,
  },
  '4': {
    id: '4',
    name: 'Hawks',
    wins: 8,
    losses: 6,
    winPercentage: 0.571,
    coach: 'Tom Anderson',
    homeVenue: 'Norwalk Recreation Center',
    roster: hawksRoster,
    games: mockAllGames.filter(g => g.homeTeamId === '4' || g.awayTeamId === '4'),
    pointsFor: 1246,
    pointsAgainst: 1268,
    avgPointsFor: 89.0,
    avgPointsAgainst: 90.6,
  },
  '5': {
    id: '5',
    name: 'Blaze',
    wins: 6,
    losses: 8,
    winPercentage: 0.429,
    coach: 'Jason Wright',
    homeVenue: 'Stamford High School',
    roster: blazeRoster,
    games: mockAllGames.filter(g => g.homeTeamId === '5' || g.awayTeamId === '5'),
    pointsFor: 1190,
    pointsAgainst: 1274,
    avgPointsFor: 85.0,
    avgPointsAgainst: 91.0,
  },
  '6': {
    id: '6',
    name: 'Eagles',
    wins: 4,
    losses: 10,
    winPercentage: 0.286,
    coach: 'Chris Thompson',
    homeVenue: 'Greenwich Community Center',
    roster: eaglesRoster,
    games: mockAllGames.filter(g => g.homeTeamId === '6' || g.awayTeamId === '6'),
    pointsFor: 1162,
    pointsAgainst: 1301,
    avgPointsFor: 83.0,
    avgPointsAgainst: 92.9,
  },
};

/**
 * Mock league standings with all statistics
 */
export const mockStandings: Standing[] = [
  {
    rank: 1,
    team: { id: '1', name: 'Thunder', wins: 12, losses: 2, winPercentage: 0.857 },
    wins: 12,
    losses: 2,
    winPercentage: 0.857,
    pointsFor: 1344,
    pointsAgainst: 1248,
    pointDifferential: 96,
    streak: 'W5',
  },
  {
    rank: 2,
    team: { id: '2', name: 'Lightning', wins: 11, losses: 3, winPercentage: 0.786 },
    wins: 11,
    losses: 3,
    winPercentage: 0.786,
    pointsFor: 1288,
    pointsAgainst: 1195,
    pointDifferential: 93,
    streak: 'W3',
  },
  {
    rank: 3,
    team: { id: '3', name: 'Storm', wins: 9, losses: 5, winPercentage: 0.643 },
    wins: 9,
    losses: 5,
    winPercentage: 0.643,
    pointsFor: 1330,
    pointsAgainst: 1274,
    pointDifferential: 56,
    streak: 'W1',
  },
  {
    rank: 4,
    team: { id: '4', name: 'Hawks', wins: 8, losses: 6, winPercentage: 0.571 },
    wins: 8,
    losses: 6,
    winPercentage: 0.571,
    pointsFor: 1246,
    pointsAgainst: 1268,
    pointDifferential: -22,
    streak: 'W2',
  },
  {
    rank: 5,
    team: { id: '5', name: 'Blaze', wins: 6, losses: 8, winPercentage: 0.429 },
    wins: 6,
    losses: 8,
    winPercentage: 0.429,
    pointsFor: 1190,
    pointsAgainst: 1274,
    pointDifferential: -84,
    streak: 'L2',
  },
  {
    rank: 6,
    team: { id: '6', name: 'Eagles', wins: 4, losses: 10, winPercentage: 0.286 },
    wins: 4,
    losses: 10,
    winPercentage: 0.286,
    pointsFor: 1162,
    pointsAgainst: 1301,
    pointDifferential: -139,
    streak: 'L4',
  },
];

/**
 * Mock recent completed games (for homepage)
 */
export const mockRecentGames: Game[] = mockAllGames
  .filter(g => g.status === 'completed')
  .slice(-3);

/**
 * Mock upcoming scheduled games (for homepage)
 */
export const mockUpcomingGames: Game[] = mockAllGames
  .filter(g => g.status === 'scheduled')
  .slice(0, 5);

/**
 * Mock unassigned players (registered users not on any team)
 */
export const mockUnassignedPlayers: Player[] = [
  { id: 'p49', name: 'John Smith', number: 0, pointsPerGame: 0, email: 'john.smith@fcabl.com', teamId: null },
  { id: 'p50', name: 'David Johnson', number: 0, pointsPerGame: 0, email: 'david.johnson@fcabl.com', teamId: null },
  { id: 'p51', name: 'Mike Williams', number: 0, pointsPerGame: 0, email: 'mike.williams@fcabl.com', teamId: null },
  { id: 'p52', name: 'Chris Brown', number: 0, pointsPerGame: 0, email: 'chris.brown@fcabl.com', teamId: null },
  { id: 'p53', name: 'Steve Davis', number: 0, pointsPerGame: 0, email: 'steve.davis@fcabl.com', teamId: null },
  { id: 'p54', name: 'Tom Wilson', number: 0, pointsPerGame: 0, email: 'tom.wilson@fcabl.com', teamId: null },
  { id: 'p55', name: 'Alex Martinez', number: 0, pointsPerGame: 0, email: 'alex.martinez@fcabl.com', teamId: null },
];

/**
 * Helper function to get all players (assigned + unassigned)
 */
export const getAllPlayers = (): Player[] => {
  const assignedPlayers = Object.values(mockTeamDetails).flatMap(team => team.roster);
  return [...assignedPlayers, ...mockUnassignedPlayers];
};
