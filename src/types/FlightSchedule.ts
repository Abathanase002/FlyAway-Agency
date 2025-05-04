import { Calendar } from "./Calendar";
import { Flight } from "./Flight";

export interface FlightSchedule {
  FlightID: string; // Foreign Key to Flight
  Date: string; // Foreign Key to Calendar, Represent DATE as string in TS

  // Optional expanded properties
  Flight?: Flight;
  CalendarDate?: Calendar; // Renamed to avoid conflict
}
