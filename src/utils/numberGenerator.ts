import { MIN_NUMBER, MAX_NUMBER } from '../constants/game';

export function generateUniqueNumber(existingNumbers: (number | null)[]): number {
  const usedNumbers = new Set(existingNumbers.filter((n): n is number => n !== null));
  let newNumber: number;
  
  do {
    newNumber = Math.floor(Math.random() * (MAX_NUMBER - MIN_NUMBER + 1)) + MIN_NUMBER;
  } while (usedNumbers.has(newNumber));
  
  return newNumber;
}