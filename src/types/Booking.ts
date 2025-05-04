import { Customer } from "./Customer";
import { Employee } from "./Employee";
import { Flight } from "./Flight";

export interface Booking {
  BookingID: string;
  CustomerID: string; // Foreign Key to Customer
  FlightID: string; // Foreign Key to Flight
  BookingDate: string; // Represent DATETIME as string in TS, default CURRENT_TIMESTAMP in DB
  Status: 'Confirmed' | 'Pending' | 'Cancelled';
  AgentID?: string | null; // Foreign Key to Employee, nullable

  // Optional expanded properties
  Customer?: Customer;
  Flight?: Flight;
  Agent?: Employee;
}
