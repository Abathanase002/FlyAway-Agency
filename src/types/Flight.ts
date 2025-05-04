import { Aircraft } from "./Aircraft";
import { Location } from "./Location";

export interface Flight {
  FlightID: string;
  AircraftID: string; // Foreign Key to Aircraft
  DepartureLocation: string; // Foreign Key to Location
  ArrivalLocation: string; // Foreign Key to Location
  DepartureTime: string; // Represent DATETIME as string in TS
  ArrivalTime: string; // Represent DATETIME as string in TS
  Duration?: string | null; // Generated column, represent as optional string or null
  AvailableSeats: number;

  // Optional expanded properties if needed by frontend (can be populated by backend/API)
  Aircraft?: {
    Model: string;
    SeatCapacity: number;
    Manufacturer: string;
  };
  DepartureLocationData?: {
    Name: string;
    IATA_Code: string;
    Country: string;
  };
  ArrivalLocationData?: {
    Name: string;
    IATA_Code: string;
    Country: string;
  };
}

