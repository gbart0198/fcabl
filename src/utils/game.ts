/**
 * Game utility functions
 */

import type { GameResult } from '@/types/gameResult.types';

/**
 * Determine game status based on game time and result
 * @param gameTime - Scheduled game time (ISO 8601)
 * @param result - Optional game result
 * @returns Game status: 'scheduled', 'live', or 'completed'
 */
export function getGameStatus(gameTime: string, result?: GameResult): 'scheduled' | 'live' | 'completed' {
  // If there's a result, game is completed
  if (result) {
    return 'completed';
  }
  
  const gameDate = new Date(gameTime);
  const now = new Date();
  
  // If game time is in the past but no result, consider it live
  // (In production, you'd have more sophisticated logic)
  if (gameDate < now) {
    // Game started more than 2 hours ago without result = completed (probably)
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    if (gameDate < twoHoursAgo) {
      return 'completed';
    }
    return 'live';
  }
  
  return 'scheduled';
}

/**
 * Format game time for display
 * @param gameTime - ISO 8601 timestamp
 * @returns Formatted date and time (e.g., "Feb 10, 2024 at 4:00 PM")
 */
export function formatGameTime(gameTime: string): string {
  const date = new Date(gameTime);
  
  const dateOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };
  
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };
  
  const dateStr = date.toLocaleDateString('en-US', dateOptions);
  const timeStr = date.toLocaleTimeString('en-US', timeOptions);
  
  return `${dateStr} at ${timeStr}`;
}

/**
 * Format game date only
 * @param gameTime - ISO 8601 timestamp
 * @returns Formatted date (e.g., "Feb 10, 2024")
 */
export function formatGameDate(gameTime: string): string {
  const date = new Date(gameTime);
  
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };
  
  return date.toLocaleDateString('en-US', options);
}

/**
 * Format game time only
 * @param gameTime - ISO 8601 timestamp
 * @returns Formatted time (e.g., "4:00 PM")
 */
export function formatGameTimeOnly(gameTime: string): string {
  const date = new Date(gameTime);
  
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };
  
  return date.toLocaleTimeString('en-US', options);
}

/**
 * Split ISO 8601 timestamp into separate date and time strings for forms
 * @param gameTime - ISO 8601 timestamp
 * @returns Object with date (YYYY-MM-DD) and time (HH:MM) strings
 */
export function splitGameTime(gameTime: string): { date: string; time: string } {
  const dateObj = new Date(gameTime);
  
  // Format date as YYYY-MM-DD
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const date = `${year}-${month}-${day}`;
  
  // Format time as HH:MM (24-hour format)
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const time = `${hours}:${minutes}`;
  
  return { date, time };
}

/**
 * Combine separate date and time strings into ISO 8601 timestamp
 * @param date - Date string (YYYY-MM-DD)
 * @param time - Time string (HH:MM)
 * @returns ISO 8601 timestamp
 */
export function combineDateTime(date: string, time: string): string {
  return `${date}T${time}:00`;
}

/**
 * Get game winner
 * @param result - Game result
 * @returns 'home', 'away', or 'draw'
 */
export function getGameWinner(result: GameResult): 'home' | 'away' | 'draw' {
  if (result.homeScore > result.awayScore) return 'home';
  if (result.awayScore > result.homeScore) return 'away';
  return 'draw';
}

/**
 * Format game score
 * @param homeScore - Home team score
 * @param awayScore - Away team score
 * @returns Formatted score (e.g., "94-87")
 */
export function formatGameScore(homeScore: number, awayScore: number): string {
  return `${homeScore}-${awayScore}`;
}
