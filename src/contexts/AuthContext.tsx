import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Customer, Employee, customers, employees } from '@/mockData'; // Ensure this path is correct
import { toast } from "@/components/ui/use-toast";

// DEBUG: Log mock data immediately after import
console.log('AuthContext: customers imported:', customers);

interface AuthContextType {
  currentUser: User | Customer | Employee | null;
  login: (email: string, password: string, userType: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<boolean>;
  isAuthenticated: boolean;
  isLoading: boolean;
  updateUser: (updates: Partial<User | Customer | Employee>) => void;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // DEBUG: Directly initialize with mock user for testing
  const initialUser = (import.meta.env.DEV && customers && customers.length > 0) ? customers[0] : null;
  console.log('AuthContext: Initializing currentUser state with:', initialUser);
  const [currentUser, setCurrentUser] = useState<User | Customer | Employee | null>(initialUser);
  const [isLoading, setIsLoading] = useState(true); // Set to true initially

  // Original useEffect logic (kept for reference, but initial state is now set above)
  useEffect(() => {
    console.log('AuthContext useEffect running...');
    const storedUser = localStorage.getItem('wanderlustUser');
    let userToSet = null;
    if (storedUser) {
      try {
        userToSet = JSON.parse(storedUser);
        console.log('Loaded user from localStorage:', userToSet);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('wanderlustUser');
        // Fallback to mock user if parsing fails in dev
        if (import.meta.env.DEV && customers && customers.length > 0) {
          userToSet = customers[0];
          localStorage.setItem('wanderlustUser', JSON.stringify(userToSet));
          console.log('Initialized with default mock user after parse error:', userToSet);
        }
      }
    } else {
      // Fallback to mock user if none found in localStorage in dev
      if (import.meta.env.DEV && customers && customers.length > 0) {
        userToSet = customers[0];
        localStorage.setItem('wanderlustUser', JSON.stringify(userToSet));
        console.log('Initialized with default mock user (no stored user):', userToSet);
      }
    }
    
    // Only set state if it differs from the initial direct assignment
    // This avoids unnecessary re-renders if the direct assignment already worked
    if (JSON.stringify(currentUser) !== JSON.stringify(userToSet)) {
        setCurrentUser(userToSet);
    }
    setIsLoading(false); // Set loading to false after attempting initialization

  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    console.log('currentUser state updated:', currentUser);
  }, [currentUser]);

  const login = async (email: string, password: string, userType: string): Promise<boolean> => {
    // ... (rest of login function remains the same)
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      let user = null;
      if (userType === 'Customer') {
        user = customers.find(c => c.email === email);
      } else if (userType === 'Employee') {
        user = employees.find(e => e.email === email);
      }

      if (user) {
        setCurrentUser(user);
        localStorage.setItem('wanderlustUser', JSON.stringify(user));
        toast({
          title: "Login Successful",
          description: `Welcome back, ${user.firstName}!`,
        });
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "An error occurred during login. Please try again.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // ... (rest of logout function remains the same)
    setCurrentUser(null);
    localStorage.removeItem('wanderlustUser');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    // ... (rest of register function remains the same)
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const emailExists = [...customers, ...employees].some(u => u.email === userData.email);
      if (emailExists) {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: "Email is already in use. Please use a different email.",
        });
        return false;
      }

      const newUser: User = {
        id: `USR${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        userType: userData.userType as 'Customer' | 'Employee',
      };

      if (userData.userType === 'Customer') {
        const newCustomer: Customer = {
          ...newUser,
          loyaltyPoints: 0,
        };
        setCurrentUser(newCustomer);
        localStorage.setItem('wanderlustUser', JSON.stringify(newCustomer));
      } else {
        setCurrentUser(newUser);
        localStorage.setItem('wanderlustUser', JSON.stringify(newUser));
      }

      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully.",
      });
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "An error occurred during registration. Please try again.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (updates: Partial<User | Customer | Employee>) => {
    // ... (rest of updateUser function remains the same)
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      setCurrentUser(updatedUser);
      localStorage.setItem('wanderlustUser', JSON.stringify(updatedUser));
      console.log('User updated:', updatedUser);
    }
  };

  const value = {
    currentUser,
    login,
    logout,
    register,
    isAuthenticated: !!currentUser,
    isLoading,
    updateUser,
  };

  // DEBUG: Log the value being provided by the context
  console.log('AuthContext providing value:', value);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

