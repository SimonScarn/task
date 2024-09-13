export type PeriodicElement = {
  position: number;
  name: string;
  weight: number;
  symbol: string;
  [key: string]: string | number; // Allows dynamic string keys with values of type string or number
};
