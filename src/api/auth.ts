import { User } from "@/types/User";
import { Customer } from "@/types/Customer";
import { Employee } from "@/types/Employee";

// Placeholder: Replace with actual API endpoint
const API_BASE_URL = "/api";

// Placeholder user data (simulating database)
const placeholderUsers: User[] = [
  { UserID: 'U001', FirstName: 'John', LastName: 'Doe', Email: 'john.doe@example.com', UserType: 'Customer' },
  { UserID: 'U002', FirstName: 'Jane', LastName: 'Smith', Email: 'jane.smith@example.com', UserType: 'Customer' },
  { UserID: 'U006', FirstName: 'Sarah', LastName: 'Jones', Email: 'sarah.j@example.com', UserType: 'Employee' },
];

const placeholderCustomers: Omit<Customer, keyof User>[] = [
  { CustomerID: 'U001', UserID: 'U001', Phone: '+250788123456', PassportNumber: 'P12345678', LoyaltyPoints: 150 },
  { CustomerID: 'U002', UserID: 'U002', Phone: '+250788234567', PassportNumber: 'P23456789', LoyaltyPoints: 75 },
];

const placeholderEmployees: Omit<Employee, keyof User>[] = [
  { EmployeeID: 'EMP001', UserID: 'U006', Position: 'Booking Agent', Department: 'Sales', HireDate: '2022-01-15' },
];

// Combine user data with customer/employee specifics
const getFullUser = (user: User): Customer | Employee | User => {
  if (user.UserType === 'Customer') {
    const customerDetails = placeholderCustomers.find(c => c.UserID === user.UserID);
    return { ...user, ...customerDetails, CustomerID: customerDetails?.CustomerID || user.UserID }; // Ensure CustomerID is present
  } else if (user.UserType === 'Employee') {
    const employeeDetails = placeholderEmployees.find(e => e.UserID === user.UserID);
    return { ...user, ...employeeDetails, EmployeeID: employeeDetails?.EmployeeID || `EMP-${user.UserID}` }; // Ensure EmployeeID is present
  }
  return user;
};

/**
 * Placeholder function for user login.
 */
export const loginUser = async (email: string, password: string): Promise<Customer | Employee | User | null> => {
  console.log(`API Call: loginUser(${email}) (simulated)`);
  // Simulate network delay and password check
  await new Promise(resolve => setTimeout(resolve, 700));

  // IMPORTANT: NEVER check passwords like this in a real app!
  // This is just a placeholder.
  const user = placeholderUsers.find(u => u.Email === email);

  if (user && password === "password123") { // Simulate successful login with a hardcoded password
    console.log("Login successful (simulated) for:", email);
    return getFullUser(user);
  }

  console.log("Login failed (simulated) for:", email);
  return null;
};

/**
 * Placeholder function for user registration.
 */
export const registerUser = async (userData: Omit<User, 'UserID'> & { password: string }): Promise<Customer | null> => {
  console.log(`API Call: registerUser(${userData.Email}) (simulated)`);
  // Simulate network delay and validation
  await new Promise(resolve => setTimeout(resolve, 800));

  // Check if email already exists
  if (placeholderUsers.some(u => u.Email === userData.Email)) {
    console.log("Registration failed: Email already exists (simulated)");
    throw new Error("Email already exists");
  }

  // Simulate creating new user and customer entries
  const newUserID = `U${String(placeholderUsers.length + 1).padStart(3, '0')}`;
  const newUser: User = {
    UserID: newUserID,
    FirstName: userData.FirstName,
    LastName: userData.LastName,
    Email: userData.Email,
    UserType: 'Customer', // Defaulting to Customer registration
  };
  placeholderUsers.push(newUser);

  const newCustomer: Omit<Customer, keyof User> = {
    CustomerID: newUserID, // Using UserID as CustomerID for simplicity here
    UserID: newUserID,
    Phone: null, // Add fields as needed from registration form
    PassportNumber: null,
    LoyaltyPoints: 0,
  };
  placeholderCustomers.push(newCustomer);

  console.log("Registration successful (simulated) for:", userData.Email);
  // Return the newly created full customer object
  return { ...newUser, ...newCustomer, UserType: 'Customer' };
};

/**
 * Placeholder function to get current user (e.g., from session/token).
 */
export const getCurrentUser = async (): Promise<Customer | Employee | User | null> => {
  console.log("API Call: getCurrentUser (simulated)");
  // Simulate checking session/token
  await new Promise(resolve => setTimeout(resolve, 200));

  // Simulate a logged-in user (e.g., the first customer)
  const loggedInUser = placeholderUsers.find(u => u.UserID === 'U001');
  if (loggedInUser) {
    return getFullUser(loggedInUser);
  }

  return null;
};

