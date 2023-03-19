export function generateRandomNumber(n: number): number {
  const min = Math.pow(10, n - 1); // minimum value for n digits
  const max = Math.pow(10, n) - 1; // maximum value for n digits
  return Math.floor(Math.random() * (max - min + 1)) + min; // random number between min and max
}
