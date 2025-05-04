
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

  // Use the correct field names from the updated Flight type
  const departureDate = parseISO(flight.DepartureTime);
  const arrivalDate = parseISO(flight.ArrivalTime);

  const formattedDepartureTime = format(departureDate, 'h:mm a');
  const formattedArrivalTime = format(arrivalDate, 'h:mm a');
  const formattedDate = format(departureDate, 'MMM d, yyyy');

  // Calculate flight duration
  const durationMillis = arrivalDate.getTime() - departureDate.getTime();
  const hours = Math.floor(durationMillis / (1000 * 60 * 60));
  const minutes = Math.floor((durationMillis / (1000 * 60)) % 60);
  const formattedDuration = `${hours}h ${minutes}m`;

  // Time until departure
  const timeUntilDeparture = formatDistanceToNow(departureDate, { addSuffix: true });

  const viewFlightDetails = () => {
    navigate(`/flights/${flight.FlightID}`); // Use FlightID
  };

  return (
    <Card className="hover:shadow-md transition-shadow animate-enter">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row justify-between">
          {/* Flight info */}
          <div className="flex-1">
            <div className="flex items-center mb-4">
              <Badge variant="outline" className="text-travel-600 border-travel-200 bg-travel-50">
                {flight.FlightID} {/* Use FlightID */}
              </Badge>
              <span className="ml-2 text-sm text-gray-500">
                <Calendar className="h-3 w-3 inline mr-1" />
                {formattedDate}
              </span>
              <span className="ml-2 text-sm text-gray-500">
                <Clock className="h-3 w-3 inline mr-1" />
                {formattedDuration}
              </span>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center mb-4">
              <div className="text-left mr-4">
                <p className="font-semibold text-lg">{formattedDepartureTime}</p>
                {/* Use expanded data fields with correct names */}
                <p className="text-sm text-gray-500">{flight.DepartureLocationData?.IATA_Code}</p>
                <p className="text-xs">{flight.DepartureLocationData?.Name.split(' ').slice(0, 2).join(' ')}</p>
              </div>

              <div className="hidden md:flex flex-1 items-center px-4 my-2">
                <div className="h-0.5 flex-1 bg-gray-200"></div>
                <Plane className="mx-2 h-4 w-4 text-travel-600" />
                <div className="h-0.5 flex-1 bg-gray-200"></div>
              </div>

              <div className="text-left md:text-right">
                <p className="font-semibold text-lg">{formattedArrivalTime}</p>
                {/* Use expanded data fields with correct names */}
                <p className="text-sm text-gray-500">{flight.ArrivalLocationData?.IATA_Code}</p>
                <p className="text-xs">{flight.ArrivalLocationData?.Name.split(' ').slice(0, 2).join(' ')}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                {/* Use expanded data fields with correct names */}
                {flight.Aircraft?.Manufacturer} {flight.Aircraft?.Model}
              </span>
              <span className="text-sm text-gray-600">
                {flight.AvailableSeats} seats available {/* Use AvailableSeats */}
              </span>
            </div>
          </div>

          {/* Price section removed as 'price' is not in the schema */}
          {/* <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-end justify-between">
            <div className="text-right">
              <p className="text-xs text-gray-500">Price per person</p>
              <p className="text-2xl font-bold text-travel-600">${flight.price.toFixed(2)}</p>
              <p className="text-xs text-gray-500">{timeUntilDeparture}</p>
            </div>
          </div> */}
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
