export interface Location {
  LocationID: string;
  LocationType: 'Airport' | 'City';
  IATA_Code?: string | null; // Nullable in DB
  Name: string;
  Country: string;
}
