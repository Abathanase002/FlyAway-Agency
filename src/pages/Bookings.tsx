
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingCard from '@/components/bookings/BookingCard';
import { Booking, bookings } from '@mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Filter, AlertCircle } from 'lucide-react';

const Bookings = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // Filter bookings based on the current user
  useEffect(() => {
    if (!currentUser) return;
    
    let userSpecificBookings: Booking[];
    
    if (currentUser.userType === 'Customer') {
      // Customers see only their own bookings
      userSpecificBookings = bookings.filter(booking => booking.customerId === currentUser.id);
    } else {
      // Employees see all bookings
      userSpecificBookings = [...bookings];
    }
    
    setUserBookings(userSpecificBookings);
    setFilteredBookings(userSpecificBookings);
  }, [currentUser]);
  
  // Apply filters when search term or status filter changes
  useEffect(() => {
    let filtered = [...userBookings];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }
    
    // Apply search term
    if (searchTerm.trim()) {
      const lowerCaseTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(booking => 
        booking.id.toLowerCase().includes(lowerCaseTerm) ||
        booking.flight?.id.toLowerCase().includes(lowerCaseTerm) ||
        booking.customer?.firstName.toLowerCase().includes(lowerCaseTerm) ||
        booking.customer?.lastName.toLowerCase().includes(lowerCaseTerm)
      );
    }
    
    setFilteredBookings(filtered);
  }, [searchTerm, statusFilter, userBookings]);

  if (!isAuthenticated || !currentUser) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6">
            {currentUser.userType === 'Customer' ? 'My Bookings' : 'All Bookings'}
          </h1>
          
          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by booking ID, flight, or passenger..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="w-full md:w-48">
                  <div className="flex items-center space-x-2">
                    <Filter className="text-gray-400 h-4 w-4" />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Confirmed">Confirmed</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Bookings list */}
          {filteredBookings.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <AlertCircle className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Bookings Found</h3>
                <p className="text-gray-500 mb-6 max-w-md">
                  {searchTerm || statusFilter !== 'all' 
                    ? "No bookings match your current filters. Try adjusting your search criteria."
                    : currentUser.userType === 'Customer'
                      ? "You don't have any bookings yet. Start by booking a flight."
                      : "There are no bookings in the system yet."
                  }
                </p>
                <Button 
                  onClick={() => navigate('/flights')}
                  className="bg-travel-600 hover:bg-travel-700"
                >
                  Browse Flights
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Bookings;
