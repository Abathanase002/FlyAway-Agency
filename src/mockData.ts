import { Location } from "@/types/Location";
import { Flight } from "@/types/Flight";

export const locations: Location[] = [
  { id: "LOC1", name: "New York", country: "USA", airportCode: "JFK" },
  { id: "LOC2", name: "London", country: "UK", airportCode: "LHR" },
  { id: "LOC3", name: "Paris", country: "France", airportCode: "CDG" },
  { id: "LOC4", name: "Tokyo", country: "Japan", airportCode: "HND" },
  { id: "LOC5", name: "Sydney", country: "Australia", airportCode: "SYD" },
  { id: "LOC6", name: "Rome", country: "Italy", airportCode: "FCO" },
];

export const flights: Flight[] = [
  {
    id: "FL001",
    flightNumber: "FA101",
    departureLocationId: "LOC1",
    arrivalLocationId: "LOC2",
    departureTime: new Date("2025-06-15T09:00:00Z"),
    arrivalTime: new Date("2025-06-15T21:00:00Z"),
    aircraftId: "AC001",
    basePrice: 500,
    status: "Scheduled",
    departureLocation: locations[0],
    arrivalLocation: locations[1],
  },
  {
    id: "FL002",
    flightNumber: "FA202",
    departureLocationId: "LOC2",
    arrivalLocationId: "LOC3",
    departureTime: new Date("2025-06-16T11:00:00Z"),
    arrivalTime: new Date("2025-06-16T13:00:00Z"),
    aircraftId: "AC002",
    basePrice: 150,
    status: "Scheduled",
    departureLocation: locations[1],
    arrivalLocation: locations[2],
  },
  {
    id: "FL003",
    flightNumber: "FA303",
    departureLocationId: "LOC3",
    arrivalLocationId: "LOC4",
    departureTime: new Date("2025-06-17T14:00:00Z"),
    arrivalTime: new Date("2025-06-18T07:00:00Z"),
    aircraftId: "AC003",
    basePrice: 800,
    status: "Scheduled",
    departureLocation: locations[2],
    arrivalLocation: locations[3],
  },
  {
    id: "FL004",
    flightNumber: "FA404",
    departureLocationId: "LOC4",
    arrivalLocationId: "LOC5",
    departureTime: new Date("2025-06-19T10:00:00Z"),
    arrivalTime: new Date("2025-06-19T22:00:00Z"),
    aircraftId: "AC001",
    basePrice: 950,
    status: "Scheduled",
    departureLocation: locations[3],
    arrivalLocation: locations[4],
  },
];



import { Customer } from "@/types/Customer";
import { Employee } from "@/types/Employee";

export const customers: Customer[] = [
  {
    CustomerID: "CUST001",
    UserID: "U001",
    FirstName: "Alice",
    LastName: "Smith",
    Email: "alice.s@example.com",
    PasswordHash: "hashed_password_1", // Placeholder
    UserType: "Customer",
    Phone: "123-456-7890",
    PassportNumber: "AB123456",
    LoyaltyPoints: 1500,
  },
  {
    CustomerID: "CUST002",
    UserID: "U002",
    FirstName: "Bob",
    LastName: "Johnson",
    Email: "bob.j@example.com",
    PasswordHash: "hashed_password_2", // Placeholder
    UserType: "Customer",
    Phone: "987-654-3210",
    PassportNumber: "CD789012",
    LoyaltyPoints: 500,
  },
];

export const employees: Employee[] = [
  {
    EmployeeID: "EMP001",
    UserID: "U006",
    FirstName: "Sarah",
    LastName: "Jones",
    Email: "sarah.j@example.com",
    PasswordHash: "hashed_password_6", // Placeholder
    UserType: "Employee",
    Position: "Booking Agent",
    Department: "Sales",
    HireDate: "2022-01-15",
  },
  {
    EmployeeID: "EMP002",
    UserID: "U007",
    FirstName: "Admin",
    LastName: "User",
    Email: "admin@flyaway.com",
    PasswordHash: "hashed_password_admin", // Placeholder
    UserType: "Employee",
    Position: "System Admin",
    Department: "IT",
    HireDate: "2021-05-10",
  },
];



import { Booking } from "@/types/Booking";

export const bookings: Booking[] = [
  {
    BookingID: "B001",
    CustomerID: "CUST001", // Corresponds to Alice Smith
    FlightID: "FL001", // JFK to LHR
    BookingDate: "2025-05-20T10:30:00Z",
    Status: "Confirmed",
    AgentID: "EMP001", // Corresponds to Sarah Jones
    // Optional expanded properties could be added if needed for mock data
    // Customer: customers[0],
    // Flight: flights[0],
    // Agent: employees[0],
  },
  {
    BookingID: "B002",
    CustomerID: "CUST002", // Corresponds to Bob Johnson
    FlightID: "FL003", // CDG to HND
    BookingDate: "2025-05-22T15:00:00Z",
    Status: "Pending",
    AgentID: null,
    // Customer: customers[1],
    // Flight: flights[2],
  },
];

