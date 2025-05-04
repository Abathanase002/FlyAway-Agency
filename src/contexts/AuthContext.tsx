
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Customer, Employee, customers, employees } from '/@mockData';
import { toast } from "@/components/ui/use-toast";

interface AuthContextType {
  currentUser: User | Customer | Employee | null;
  login: (email: string, password: string, userType: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<boolean>;
  isAuthenticated: boolean;
  isLoading: boolean;
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
  const [currentUser, setCurrentUser] = useState<User | Customer | Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('wanderlustUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('wanderlustUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, userType: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let user = null;
      if (userType === 'Customer') {
        user = customers.find(c => c.email === email);
      } else if (userType === 'Employee') {
        user = employees.find(e => e.email === email);
      }

      if (user) {
        // In a real app, we would validate the password here
        // For this mock, we'll just pretend it's correct if the email exists
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
    setCurrentUser(null);
    localStorage.removeItem('wanderlustUser');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if email is already in use
      const emailExists = [...customers, ...employees].some(u => u.email === userData.email);
      if (emailExists) {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: "Email is already in use. Please use a different email.",
        });
        return false;
      }

      // In a real app, we would add the user to the database here
      // For this mock, we'll just create a user object and pretend it was saved
      const newUser: User = {
        id: `USR${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        userType: userData.userType as 'Customer' | 'Employee',
      };

      // For demo purposes, we'll assume all registrations are for customers
      if (userData.userType === 'Customer') {
        const newCustomer: Customer = {
          ...newUser,
          loyaltyPoints: 0,
        };
        setCurrentUser(newCustomer);
        localStorage.setItem('wanderlustUser', JSON.stringify(newCustomer));
      } else {
        // This would normally go through admin approval
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

  const value = {
    currentUser,
    login,
    logout,
    register,
    isAuthenticated: !!currentUser,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
