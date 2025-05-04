import { Booking } from "./Booking";

export interface PaymentTransaction {
  TransactionID: string;
  BookingID: string; // Foreign Key to Booking (UNIQUE in DB)
  PaymentMethod: 'Mobile Money' | 'Card' | 'Cash';
  Amount: number; // Represent DECIMAL as number in TS
  Status: 'Completed' | 'Pending' | 'Failed';
  TransactionDate: string; // Represent DATETIME as string in TS, default CURRENT_TIMESTAMP in DB

  // Optional expanded properties
  Booking?: Booking;
}
