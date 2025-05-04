import { Flight } from "@/types/Flight";
import { Location } from "@/types/Location";
import { Aircraft } from "@/types/Aircraft";

// Placeholder: Replace with actual API endpoint
const API_BASE_URL = "/api";

// Placeholder data (simulating API response)
const placeholderLocations: Location[] = [
  { LocationID: 'LOC001', LocationType: 'Airport', IATA_Code: 'KGL', Name: 'Kigali International Airport', Country: 'Rwanda' },
  { LocationID: 'LOC002', LocationType: 'Airport', IATA_Code: 'EBB', Name: 'Entebbe International Airport', Country: 'Uganda' },
  { LocationID: 'LOC003', LocationType: 'Airport', IATA_Code: 'JRO', Name: 'Kilimanjaro International Airport', Country: 'Tanzania' },
  { LocationID: 'LOC004', LocationType: 'Airport', IATA_Code: 'NBO', Name: 'Jomo Kenyatta International Airport', Country: 'Kenya' },
];

const placeholderAircraft: Aircraft[] = [
  { AircraftID: 'AC001', Model: 'Boeing 737-800', SeatCapacity: 189, Manufacturer: 'Boeing', LastMaintenance: '2023-05-01' },
  { AircraftID: 'AC002', Model: 'Airbus A320', SeatCapacity: 180, Manufacturer: 'Airbus', LastMaintenance: '2023-05-15' },
];

const placeholderFlights: Flight[] = [
  {
    FlightID: 'WB101', AircraftID: 'AC001', DepartureLocation: 'LOC001', ArrivalLocation: 'LOC002',
    DepartureTime: '2025-06-01 08:00:00', ArrivalTime: '2025-06-01 09:30:00', AvailableSeats: 12,
    // Expanded data simulation
    Aircraft: placeholderAircraft.find(a => a.AircraftID === 'AC001'),
    DepartureLocationData: placeholderLocations.find(l => l.LocationID === 'LOC001'),
    ArrivalLocationData: placeholderLocations.find(l => l.LocationID === 'LOC002'),
  },
  {
    FlightID: 'WB103', AircraftID: 'AC002', DepartureLocation: 'LOC001', ArrivalLocation: 'LOC004',
    DepartureTime: '2025-06-02 14:00:00', ArrivalTime: '2025-06-02 16:30:00', AvailableSeats: 45,
    Aircraft: placeholderAircraft.find(a => a.AircraftID === 'AC002'),
    DepartureLocationData: placeholderLocations.find(l => l.LocationID === 'LOC001'),
    ArrivalLocationData: placeholderLocations.find(l => l.LocationID === 'LOC004'),
  },
   {
    FlightID: 'WB104', AircraftID: 'AC001', DepartureLocation: 'LOC002', ArrivalLocation: 'LOC001',
    DepartureTime: '2025-06-02 17:00:00', ArrivalTime: '2025-06-02 18:30:00', AvailableSeats: 89,
    Aircraft: placeholderAircraft.find(a => a.AircraftID === 'AC001'),
    DepartureLocationData: placeholderLocations.find(l => l.LocationID === 'LOC002'),
    ArrivalLocationData: placeholderLocations.find(l => l.LocationID === 'LOC001'),
  },
];

/**
 * Placeholder function to fetch flights.
 * In a real application, this would make a network request.
 */
export const getFlights = async (): Promise<Flight[]> => {
  console.log("API Call: getFlights (simulated)");
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  // Simulate API call returning placeholder data
  // In real app: const response = await fetch(`${API_BASE_URL}/flights`); return await response.json();
  return placeholderFlights;
};

/**
 * Placeholder function to fetch a single flight by ID.
 */
export const getFlightById = async (flightId: string): Promise<Flight | null> => {
  console.log(`API Call: getFlightById(${flightId}) (simulated)`);
  await new Promise(resolve => setTimeout(resolve, 300));
  const flight = placeholderFlights.find(f => f.FlightID === flightId);
  return flight || null;
};

// Add other flight-related API functions as needed (e.g., searchFlights, createFlight, updateFlight)

