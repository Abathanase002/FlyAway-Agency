import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Flight } from '@/types/Flight';
import { Booking } from '@/types/Booking';
import { Customer } from '@/types/Customer';
import { getFlightById, getBookingsByCustomerId, createBooking } from '@/api';
import { useAuth } from '@/contexts/AuthContext';
import {
  Calendar,
  Clock,
  Map,
  Plane,
  Info,
  ArrowLeft,
  User,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const FlightDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Fetch flight details
  const { data: flight, isLoading: isLoadingFlight, error: flightError } = useQuery<Flight | null, Error>({
    queryKey: ['flight', id],
    queryFn: () => getFlightById(id || ''),
    enabled: !!id,
  })

  // Fetch user's bookings
  const customerId = currentUser?.UserType === 'Customer' ? (currentUser as Customer).CustomerID : undefined;
  const { data: userBookings = [], isLoading: isLoadingBookings } = useQuery<Booking[], Error>({
    queryKey: ['bookings', customerId],
    queryFn: () => getBookingsByCustomerId(customerId || ''),
    enabled: !!customerId && isAuthenticated,
  });

  const isAlreadyBooked = userBookings.some(
    booking => booking.FlightID === flight?.FlightID && booking.Status !== 'Cancelled'
  );

  // Mutation for creating a booking
  const bookingMutation = useMutation<Booking, Error, Omit<Booking, 'BookingID' | 'BookingDate' | 'Customer' | 'Flight' | 'Agent'>>({
    mutationFn: createBooking,
    onSuccess: (newBooking) => {
      setIsBookingConfirmed(true);
      setBookingError(null);
      queryClient.invalidateQueries({ queryKey: ['flights'] });
      queryClient.invalidateQueries({ queryKey: ['flight', id] });
      queryClient.invalidateQueries({ queryKey: ['bookings', customerId] });
      toast({
        title: "Booking Successful!",
        description: `Your booking (ID: ${newBooking.BookingID}) has been confirmed.`,
      });
    },
    onError: (error) => {
      setBookingError(`Booking failed: ${error.message}. Please try again.`);
      toast({
        title: "Booking Failed",
        description: error.message || "Could not complete booking.",
        variant: "destructive",
      });
    }
  });

  useEffect(() => {
    if (!isBookingDialogOpen) {
      setTimeout(() => {
        setIsBookingConfirmed(false);
        setBookingError(null);
      }, 300);
    }
  }, [isBookingDialogOpen]);

  if (isLoadingFlight || isLoadingBookings) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-1/4 mb-4" />
          <Skeleton className="h-8 w-1/2 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="col-span-2 space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
            <div>
              <Skeleton className="h-72 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (flightError) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center text-center">
          <div>
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Error Loading Flight</h2>
            <p className="mb-6 text-red-600">{flightError.message}</p>
            <Button
              onClick={() => navigate('/flights')}
              className="bg-travel-600 hover:bg-travel-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Flights
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center text-center">
          <div>
            <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Flight Not Found</h2>
            <p className="mb-6">The flight ID '{id}' does not correspond to an existing flight.</p>
            <Button
              onClick={() => navigate('/flights')}
              className="bg-travel-600 hover:bg-travel-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Flights
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const departureDate = parseISO(flight.DepartureTime);
  const arrivalDate = parseISO(flight.ArrivalTime);

  const formattedDepartureDate = format(departureDate, 'EEE, MMM d, yyyy');
  const formattedDepartureTime = format(departureDate, 'h:mm a');
  const formattedArrivalDate = format(arrivalDate, 'EEE, MMM d, yyyy');
  const formattedArrivalTime = format(arrivalDate, 'h:mm a');

  const durationMillis = arrivalDate.getTime() - departureDate.getTime();
  const hours = Math.floor(durationMillis / (1000 * 60 * 60));
  const minutes = Math.floor((durationMillis / (1000 * 60)) % 60);
  const formattedDuration = `${hours}h ${minutes}m`;

  const handleBookFlight = () => {
    if (!isAuthenticated || !customerId) {
      navigate('/login', { state: { from: `/flights/${flight.FlightID}` } });
      return;
    }
    setIsBookingDialogOpen(true);
  };

  const confirmBookingAction = () => {
    if (!customerId || !flight.FlightID) return;

    const bookingData: Omit<Booking, 'BookingID' | 'BookingDate' | 'Customer' | 'Flight' | 'Agent'> = {
      CustomerID: customerId,
      FlightID: flight.FlightID,
      Status: 'Pending',
      AgentID: null,
    };
    bookingMutation.mutate(bookingData);
  };

  const goToBookings = () => {
    setIsBookingDialogOpen(false);
    navigate('/bookings');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        <section className="bg-travel-600 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-travel-500 -ml-3 mr-1"
                    onClick={() => navigate('/flights')}
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                  <Badge variant="outline" className="border-white/30 text-white bg-white/10">
                    {flight.FlightID}
                  </Badge>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-1">
                  {flight.DepartureLocationData?.IATA_Code} to {flight.ArrivalLocationData?.IATA_Code}
                </h1>
                <p className="text-travel-100">
                  {flight.DepartureLocationData?.Name} to {flight.ArrivalLocationData?.Name}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Flight Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-8">
                      <div className="flex items-start">
                        <div className="flex flex-col items-center mr-4">
                          <div className="w-6 h-6 rounded-full border-2 border-travel-600 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-travel-600"></div>
                          </div>
                          <div className="h-16 w-0.5 bg-travel-200 my-1"></div>
                          <div className="w-6 h-6 rounded-full border-2 border-travel-600 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-travel-600"></div>
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="mb-6">
                            <div className="flex items-baseline">
                              <h3 className="text-lg font-semibold">{formattedDepartureTime}</h3>
                              <span className="ml-2 text-sm text-gray-500">{formattedDepartureDate}</span>
                            </div>
                            <div className="text-gray-600">{flight.DepartureLocationData?.Name}</div>
                            <div className="text-sm text-gray-500">{flight.DepartureLocationData?.Country}</div>
                          </div>

                          <div>
                            <div className="flex items-baseline">
                              <h3 className="text-lg font-semibold">{formattedArrivalTime}</h3>
                              <span className="ml-2 text-sm text-gray-500">{formattedArrivalDate}</span>
                            </div>
                            <div className="text-gray-600">{flight.ArrivalLocationData?.Name}</div>
                            <div className="text-sm text-gray-500">{flight.ArrivalLocationData?.Country}</div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center justify-end mb-4">
                            <Clock className="h-4 w-4 text-gray-500 mr-1" />
                            <span className="text-sm text-gray-500">{formattedDuration}</span>
                          </div>
                          <div className="flex items-center justify-end">
                            <Map className="h-4 w-4 text-gray-500 mr-1" />
                            <span className="text-sm text-gray-500">Non-stop</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="mb-6">
                      <h3 className="font-semibold mb-2 flex items-center">
                        <Plane className="h-4 w-4 mr-2" />
                        Aircraft Information
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">Model</div>
                          <div>{flight.Aircraft?.Model}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Manufacturer</div>
                          <div>{flight.Aircraft?.Manufacturer}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Total Capacity</div>
                          <div>{flight.Aircraft?.SeatCapacity} seats</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Available Seats</div>
                          <div>{flight.AvailableSeats} seats</div>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div>
                      <h3 className="font-semibold mb-2 flex items-center">
                        <Info className="h-4 w-4 mr-2" />
                        Additional Information
                      </h3>

                      <div className="text-sm text-gray-600 space-y-2">
                        <p>• Check-in opens 3 hours before departure</p>
                        <p>• Boarding gate closes 20 minutes before departure</p>
                        <p>• Standard baggage allowance applies (Check airline policy)</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle>Book This Flight</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="text-center text-gray-700 font-medium">
                        Price available upon booking confirmation.
                      </div>

                      <Button
                        className="w-full bg-travel-600 hover:bg-travel-700"
                        onClick={handleBookFlight}
                        disabled={isAlreadyBooked || bookingMutation.isPending}
                      >
                        {bookingMutation.isPending ? (
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                        ) : isAlreadyBooked ? (
                          'Already Booked'
                        ) : (
                          'Book Now'
                        )}
                      </Button>

                      <div className="text-center text-sm text-gray-500">
                        {!isAuthenticated && "You'll need to login to complete your booking"}
                      </div>

                      <div className="flex items-center justify-center text-sm text-gray-500">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        <span>Cancellation policy applies</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isBookingConfirmed ? 'Booking Confirmed!' : 'Complete Your Booking'}</DialogTitle>
          </DialogHeader>

          {isBookingConfirmed ? (
            <div className="py-6">
              <div className="flex flex-col items-center justify-center text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Thank you for your booking!</h3>
                <p className="text-gray-600 mb-4">
                  Your flight booking is pending confirmation. You can view its status in your bookings.
                </p>
                {bookingMutation.data?.BookingID && (
                    <div className="bg-gray-50 rounded-lg p-4 w-full mb-4">
                        <div className="text-sm text-gray-500 mb-1">Booking Reference</div>
                        <div className="font-semibold text-lg">{bookingMutation.data.BookingID}</div>
                    </div>
                )}
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={goToBookings}
                  className="bg-travel-600 hover:bg-travel-700"
                >
                  View My Bookings
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-1 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Passenger Information
                  </h3>
                  <div className="bg-gray-50 rounded p-3">
                    <div>{currentUser?.FirstName} {currentUser?.LastName}</div>
                    <div className="text-sm text-gray-500">{currentUser?.Email}</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-1 flex items-center">
                    <Plane className="h-4 w-4 mr-2" />
                    Flight Summary
                  </h3>
                  <div className="bg-gray-50 rounded p-3 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-gray-500">Flight</div>
                        <div>{flight.FlightID}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Date</div>
                        <div>{formattedDepartureDate}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">From</div>
                        <div>{flight.DepartureLocationData?.IATA_Code}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">To</div>
                        <div>{flight.ArrivalLocationData?.IATA_Code}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-1 flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Payment Information
                  </h3>
                  <div className="bg-gray-50 rounded p-3 text-sm text-gray-500">
                    Payment processing will be handled upon confirmation.
                  </div>
                </div>

                {bookingError && (
                  <div className="text-red-600 text-sm flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                    {bookingError}
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setIsBookingDialogOpen(false)} disabled={bookingMutation.isPending}>
                  Cancel
                </Button>
                <Button
                  onClick={confirmBookingAction}
                  className="bg-travel-600 hover:bg-travel-700"
                  disabled={bookingMutation.isPending}
                >
                  {bookingMutation.isPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Confirming...</>
                  ) : (
                    'Confirm Booking'
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FlightDetails;
