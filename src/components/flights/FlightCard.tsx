import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flight } from '@/types/Flight'; // Updated import path
import { ArrowRight, Clock, Calendar, Plane } from 'lucide-react';
import { formatDistanceToNow, format, parseISO } from 'date-fns';

interface FlightCardProps {
  flight: Flight;
}

const FlightCard: React.FC<FlightCardProps> = ({ flight }) => {
  const navigate = useNavigate();

  // Safely parse dates, providing fallbacks if needed
  const departureDate = flight.DepartureTime ? parseISO(flight.DepartureTime) : new Date();
  const arrivalDate = flight.ArrivalTime ? parseISO(flight.ArrivalTime) : new Date();

  const formattedDepartureTime = format(departureDate, 'h:mm a');
  const formattedArrivalTime = format(arrivalDate, 'h:mm a');
  const formattedDate = format(departureDate, 'MMM d, yyyy');

  // Calculate flight duration safely
  const durationMillis = arrivalDate.getTime() - departureDate.getTime();
  const hours = Math.floor(durationMillis / (1000 * 60 * 60));
  const minutes = Math.floor((durationMillis / (1000 * 60)) % 60);
  const formattedDuration = `${hours >= 0 ? hours : 0}h ${minutes >= 0 ? minutes : 0}m`;

  // Time until departure
  const timeUntilDeparture = formatDistanceToNow(departureDate, { addSuffix: true });

  const viewFlightDetails = () => {
    // Use optional chaining for flight ID as well for safety
    navigate(`/flights/${flight?.FlightID ?? 'unknown'}`); 
  };

  // Helper function to safely get truncated location name
  const getTruncatedLocationName = (name: string | undefined | null): string => {
    return name?.split(' ').slice(0, 2).join(' ') ?? 'N/A';
  };

  return (
    <Card className="hover:shadow-md transition-shadow animate-enter">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row justify-between">
          {/* Flight info */}
          <div className="flex-1">
            <div className="flex items-center mb-4 flex-wrap">
              <Badge variant="outline" className="text-travel-600 border-travel-200 bg-travel-50 mr-2 mb-1 md:mb-0">
                {flight.FlightID ?? 'N/A'} 
              </Badge>
              <span className="mr-2 mb-1 md:mb-0 text-sm text-gray-500">
                <Calendar className="h-3 w-3 inline mr-1" />
                {formattedDate}
              </span>
              <span className="text-sm text-gray-500">
                <Clock className="h-3 w-3 inline mr-1" />
                {formattedDuration}
              </span>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center mb-4">
              <div className="text-left mr-4">
                <p className="font-semibold text-lg">{formattedDepartureTime}</p>
                <p className="text-sm text-gray-500">{flight.DepartureLocationData?.IATA_Code ?? 'N/A'}</p>
                {/* Safely access and truncate name */}
                <p className="text-xs">{getTruncatedLocationName(flight.DepartureLocationData?.Name)}</p>
              </div>

              <div className="hidden md:flex flex-1 items-center px-4 my-2">
                <div className="h-0.5 flex-1 bg-gray-200"></div>
                <Plane className="mx-2 h-4 w-4 text-travel-600" />
                <div className="h-0.5 flex-1 bg-gray-200"></div>
              </div>

              <div className="text-left md:text-right">
                <p className="font-semibold text-lg">{formattedArrivalTime}</p>
                <p className="text-sm text-gray-500">{flight.ArrivalLocationData?.IATA_Code ?? 'N/A'}</p>
                {/* Safely access and truncate name */}
                <p className="text-xs">{getTruncatedLocationName(flight.ArrivalLocationData?.Name)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                {flight.Aircraft?.Manufacturer ?? ''} {flight.Aircraft?.Model ?? 'Unknown Aircraft'}
              </span>
              <span className="text-sm text-gray-600">
                {flight.AvailableSeats ?? 0} seats available
              </span>
            </div>
          </div>

          {/* Price section removed as 'price' is not in the schema */}
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex justify-end">
        <Button
          onClick={viewFlightDetails}
          className="bg-travel-600 hover:bg-travel-700"
        >
          View Details <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FlightCard;
