import { User } from "./User";

export interface Customer extends Omit<User, 'UserType'> { // Inherit from User, but UserType is always 'Customer'
  CustomerID: string;
  UserID: string; // Foreign Key to User
  Phone?: string | null; // Nullable in DB, CHECK constraint not directly representable in TS
  PassportNumber?: string | null;
  LoyaltyPoints: number; // Default 0 in DB
  UserType: 'Customer'; // Explicitly set UserType
}
