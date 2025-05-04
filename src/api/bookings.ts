import { Booking } from "@/types/Booking";
import { Customer } from "@/types/Customer";
import { Flight } from "@/types/Flight";
import { Employee } from "@/types/Employee";
import { getFlightById } from "./flights"; // Assuming we can reuse flight fetching logic

// Placeholder: Replace with actual API endpoint
const API_BASE_URL = "/api";

// Placeholder data (simulating API response)
const placeholderCustomers: Customer[] = [
  { CustomerID: 'U001', UserID: 'U001', FirstName: 'John', LastName: 'Doe', Email: 'john.doe@example.com', UserType: 'Customer', Phone: '+250788123456', PassportNumber: 'P12345678', LoyaltyPoints: 150 },
  { CustomerID: 'U002', UserID: 'U002', FirstName: 'Jane', LastName: 'Smith', Email: 'jane.smith@example.com', UserType: 'Customer', Phone: '+250788234567', PassportNumber: 'P23456789', LoyaltyPoints: 75 },
];

const placeholderEmployees: Employee[] = [
  { EmployeeID: 'EMP001', UserID: 'U006', FirstName: 'Sarah', LastName: 'Jones', Email: 'sarah.j@example.com', UserType: 'Employee', Position: 'Booking Agent', Department: 'Sales', HireDate: '2022-01-15' },
];

const placeholderBookings: Booking[] = [
  {
    BookingID: 'B001', CustomerID: 'U001', FlightID: 'WB101',
    BookingDate: '2025-05-20 10:30:00', Status: 'Confirmed', AgentID: 'EMP001',
    // Expanded data simulation (needs async fetch for flight)
  },
  {
    BookingID: 'B002', CustomerID: 'U002', FlightID: 'WB101',
    BookingDate: '2025-05-21 11:45:00', Status: 'Confirmed', AgentID: 'EMP001',
  },
  {
    BookingID: 'B006', CustomerID: 'U001', FlightID: 'WB104',
    BookingDate: '2025-05-25 13:10:00', Status: 'Pending', AgentID: null,
  },
];

/**
 * Helper to populate expanded booking details.
 */
const populateBookingDetails = async (booking: Booking): Promise<Booking> => {
  const customer = placeholderCustomers.find(c => c.CustomerID === booking.CustomerID);
  const agent = placeholderEmployees.find(e => e.EmployeeID === booking.AgentID);
  const flight = await getFlightById(booking.FlightID); // Reuse flight API
  return {
    ...booking,
    Customer: customer,
    Agent: agent,
    Flight: flight || undefined, // Handle case where flight might not be found
  };
};

/**
 * Placeholder function to fetch bookings for a customer.
 */
export const getBookingsByCustomerId = async (customerId: string): Promise<Booking[]> => {
  console.log(`API Call: getBookingsByCustomerId(${customerId}) (simulated)`);
  await new Promise(resolve => setTimeout(resolve, 600));
  const customerBookings = placeholderBookings.filter(b => b.CustomerID === customerId);
  // Simulate populating related data
  const populatedBookings = await Promise.all(customerBookings.map(populateBookingDetails));
  return populatedBookings;
};

/**
 * Placeholder function to create a new booking.
 */
export const createBooking = async (bookingData: Omit<Booking, 'BookingID' | 'BookingDate' | 'Customer' | 'Flight' | 'Agent'>): Promise<Booking> => {
  console.log(`API Call: createBooking (simulated)`, bookingData);
  await new Promise(resolve => setTimeout(resolve, 400));
  const newBooking: Booking = {
    ...bookingData,
    BookingID: `B${String(placeholderBookings.length + 1).padStart(3, '0')}`,
    BookingDate: new Date().toISOString().replace('T', ' ').substring(0, 19), // Simulate DB timestamp
    Status: 'Pending', // Default status
  };
  placeholderBookings.push(newBooking);
  // Return the newly created booking, potentially populated
  return await populateBookingDetails(newBooking);
};

/**
 * Placeholder function to cancel a booking.
 */
export const cancelBooking = async (bookingId: string): Promise<Booking | null> => {
  console.log(`API Call: cancelBooking(${bookingId}) (simulated)`);
  await new Promise(resolve => setTimeout(resolve, 300));
  const bookingIndex = placeholderBookings.findIndex(b => b.BookingID === bookingId);
  if (bookingIndex !== -1) {
    placeholderBookings[bookingIndex].Status = 'Cancelled';
    return await populateBookingDetails(placeholderBookings[bookingIndex]);
  }
  return null;
};

// Add other booking-related API functions as needed (e.g., getBookingById, updateBookingStatus)

