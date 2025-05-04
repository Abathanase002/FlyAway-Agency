
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { bookings, flights, customers } from '@/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BarChart3, 
  Users, 
  Plane, 
  CreditCard, 
  CalendarRange, 
  Clock, 
  ArrowRight,
  LogOut
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  
  // Redirect if not authenticated or not an employee
  React.useEffect(() => {
    if (!isAuthenticated || currentUser?.userType !== 'Employee') {
      navigate('/login');
    }
  }, [isAuthenticated, currentUser, navigate]);

  if (!isAuthenticated || currentUser?.userType !== 'Employee') {
    return null;
  }
  
  // Calculate dashboard metrics
  const totalBookings = bookings.length;
  const totalFlights = flights.length;
  const totalCustomers = customers.length;
  const totalRevenue = bookings.reduce((sum, booking) => {
    const flight = flights.find(f => f.id === booking.flightId);
    return sum + (flight?.price || 0);
  }, 0);
  
  // Get status counts for charts
  const statusCounts = bookings.reduce((acc: Record<string, number>, booking) => {
    acc[booking.status] = (acc[booking.status] || 0) + 1;
    return acc;
  }, {});
  
  // Recent bookings for display
  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
    .slice(0, 5);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-gray-500">Welcome back, {currentUser.firstName}!</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button className="bg-travel-600 hover:bg-travel-700" onClick={() => navigate('/flights')}>
                View All Flights
              </Button>
            </div>
          </div>
          
          {/* Key metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Bookings</p>
                    <h3 className="text-2xl font-bold">{totalBookings}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Customers</p>
                    <h3 className="text-2xl font-bold">{totalCustomers}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mr-4">
                    <Plane className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Active Flights</p>
                    <h3 className="text-2xl font-bold">{totalFlights}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                    <CreditCard className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Revenue</p>
                    <h3 className="text-2xl font-bold">${totalRevenue.toFixed(2)}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Booking status chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Booking Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <div className="w-full flex items-end justify-around h-64">
                    {Object.entries(statusCounts).map(([status, count]) => {
                      const percentage = Math.round((count / totalBookings) * 100);
                      const barColor = 
                        status === 'Confirmed' ? 'bg-green-500' : 
                        status === 'Pending' ? 'bg-amber-500' : 'bg-red-500';
                        
                      return (
                        <div key={status} className="flex flex-col items-center">
                          <div className="text-sm font-medium mb-2">{percentage}%</div>
                          <div 
                            className={`w-16 ${barColor} rounded-t`}
                            style={{ height: `${Math.max(percentage, 10)}%` }}
                          ></div>
                          <div className="mt-2 text-sm">{status}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Quick links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full flex justify-between items-center bg-travel-50 text-travel-900 hover:bg-travel-100">
                  <span className="flex items-center">
                    <Plane className="h-4 w-4 mr-2" />
                    Add New Flight
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button className="w-full flex justify-between items-center bg-travel-50 text-travel-900 hover:bg-travel-100">
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Customers
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button className="w-full flex justify-between items-center bg-travel-50 text-travel-900 hover:bg-travel-100">
                  <span className="flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate Reports
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button className="w-full flex justify-between items-center bg-travel-50 text-travel-900 hover:bg-travel-100">
                  <span className="flex items-center">
                    <CalendarRange className="h-4 w-4 mr-2" />
                    Update Schedule
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Recent bookings */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-sm text-gray-500 border-b">
                      <th className="text-left py-3 px-4 font-medium">Booking ID</th>
                      <th className="text-left py-3 px-4 font-medium">Customer</th>
                      <th className="text-left py-3 px-4 font-medium">Flight</th>
                      <th className="text-left py-3 px-4 font-medium">Date</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => {
                      const customer = booking.customer;
                      const flight = booking.flight;
                      const bookingDate = parseISO(booking.bookingDate);
                      
                      return (
                        <tr key={booking.id} className="border-b">
                          <td className="py-3 px-4">
                            <span className="font-medium">{booking.id}</span>
                          </td>
                          <td className="py-3 px-4">
                            {customer?.firstName} {customer?.lastName}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium">{flight?.id}</div>
                            <div className="text-sm text-gray-500">
                              {flight?.departureLocation?.iataCode} → {flight?.arrivalLocation?.iataCode}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 text-gray-400 mr-1" />
                              <span>{format(bookingDate, 'MMM d, yyyy')}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge 
                              variant="outline" 
                              className={
                                booking.status === 'Confirmed' ? 'bg-green-100 text-green-700 border-green-200' :
                                booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                'bg-red-100 text-red-700 border-red-200'
                              }
                            >
                              {booking.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Button variant="ghost" size="sm" className="h-8">
                              View
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
