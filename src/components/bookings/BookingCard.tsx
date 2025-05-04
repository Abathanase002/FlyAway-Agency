
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Booking } from '@/utils/mockData';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface BookingCardProps {
  booking: Booking;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  const navigate = useNavigate();
  
  const departureDate = booking.flight ? parseISO(booking.flight.departureTime) : new Date();
  const formattedDepartureDate = format(departureDate, 'EEE, MMM d, yyyy');
  const formattedDepartureTime = format(departureDate, 'h:mm a');
  
  const bookingDate = parseISO(booking.bookingDate);
  const formattedBookingDate = format(bookingDate, 'MMM d, yyyy');
  
  const viewBookingDetails = () => {
    navigate(`/bookings/${booking.id}`);
  };

  const getStatusColor = () => {
    switch (booking.status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return '';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow animate-enter">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <Badge variant="outline" className="text-travel-600 border-travel-200 bg-travel-50">
              {booking.id}
            </Badge>
            <span className="ml-2 text-sm text-gray-500">
              Booked on {formattedBookingDate}
            </span>
          </div>
          <Badge variant="outline" className={getStatusColor()}>
            {booking.status}
          </Badge>
        </div>

        {booking.flight && (
          <>
            <div className="border-b border-gray-100 pb-4 mb-4">
              <div className="flex items-center mb-2">
                <Calendar className="h-4 w-4 mr-2 text-travel-600" />
                <span className="font-medium">{formattedDepartureDate} • {formattedDepartureTime}</span>
              </div>
              
              <div className="flex items-center mb-2">
                <MapPin className="h-4 w-4 mr-2 text-travel-600" />
                <div>
                  <span className="font-medium">
                    {booking.flight.departureLocation?.iataCode} → {booking.flight.arrivalLocation?.iataCode}
                  </span>
                  <span className="text-sm text-gray-500 block">
                    {booking.flight.departureLocation?.name} to {booking.flight.arrivalLocation?.name}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Flight</p>
                <p className="font-medium">{booking.flight.id}</p>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-500">Total Price</p>
                <p className="font-bold text-travel-600">${booking.flight.price.toFixed(2)}</p>
              </div>
            </div>
          </>
        )}
      </CardContent>

      <CardFooter className="pt-2 border-t flex justify-end">
        <Button
          onClick={viewBookingDetails}
          variant="outline"
          className="border-travel-200 text-travel-700 hover:bg-travel-50"
        >
          View Details <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookingCard;
