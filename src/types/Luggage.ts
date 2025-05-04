import { Ticket } from "./Ticket";

export interface Luggage {
  LuggageID: string;
  TicketID: string; // Foreign Key to Ticket
  Weight: number; // Represent DECIMAL as number in TS
  Fee: number; // Generated column, represent DECIMAL as number in TS
  Status: 'Checked' | 'Loaded' | 'Delivered';

  // Optional expanded properties
  Ticket?: Ticket;
}
