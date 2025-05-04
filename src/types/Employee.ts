import { User } from "./User";

export interface Employee extends Omit<User, 'UserType'> { // Inherit from User, but UserType is always 'Employee'
  EmployeeID: string;
  UserID: string; // Foreign Key to User
  Position?: string | null;
  Department?: string | null;
  HireDate?: string | null; // Represent DATE as string in TS
  UserType: 'Employee'; // Explicitly set UserType
}
