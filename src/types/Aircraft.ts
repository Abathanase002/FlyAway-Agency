export interface Aircraft {
  AircraftID: string;
  Model: string;
  SeatCapacity: number;
  Manufacturer: string;
  LastMaintenance?: string | null; // Represent DATE as string in TS, nullable
}
