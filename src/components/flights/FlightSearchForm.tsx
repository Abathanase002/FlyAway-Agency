
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { locations } from '@/utils/mockData';

interface FlightSearchFormProps {
  onSearch: (searchParams: SearchParams) => void;
}

export interface SearchParams {
  from: string;
  to: string;
  departureDate: Date | undefined;
  returnDate?: Date;
  passengers: number;
  tripType: 'oneWay' | 'roundTrip';
}

const FlightSearchForm: React.FC<FlightSearchFormProps> = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    from: '',
    to: '',
    departureDate: undefined,
    returnDate: undefined,
    passengers: 1,
    tripType: 'oneWay',
  });

  const handleChange = (field: keyof SearchParams, value: string | number | Date | undefined) => {
    setSearchParams(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  const isDateDisabled = (date: Date) => {
    return date < new Date(new Date().setHours(0, 0, 0, 0));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-wrap lg:flex-nowrap gap-4">
        <div className="w-full lg:w-auto flex-1">
          <Label htmlFor="tripType">Trip Type</Label>
          <Select
            value={searchParams.tripType}
            onValueChange={(value) => handleChange('tripType', value)}
          >
            <SelectTrigger id="tripType">
              <SelectValue placeholder="Select trip type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="oneWay">One Way</SelectItem>
              <SelectItem value="roundTrip">Round Trip</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full lg:w-auto flex-1">
          <Label htmlFor="passengers">Passengers</Label>
          <Select
            value={searchParams.passengers.toString()}
            onValueChange={(value) => handleChange('passengers', parseInt(value, 10))}
          >
            <SelectTrigger id="passengers">
              <SelectValue placeholder="Select passengers" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? 'Passenger' : 'Passengers'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="from">From</Label>
          <Select
            value={searchParams.from}
            onValueChange={(value) => handleChange('from', value)}
          >
            <SelectTrigger id="from">
              <SelectValue placeholder="Select departure location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name} ({location.iataCode})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="to">To</Label>
          <Select
            value={searchParams.to}
            onValueChange={(value) => handleChange('to', value)}
          >
            <SelectTrigger id="to">
              <SelectValue placeholder="Select arrival location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name} ({location.iataCode})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="departureDate">Departure Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="departureDate"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !searchParams.departureDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {searchParams.departureDate ? (
                  format(searchParams.departureDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={searchParams.departureDate}
                onSelect={(date) => handleChange('departureDate', date)}
                disabled={isDateDisabled}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {searchParams.tripType === 'roundTrip' && (
          <div className="space-y-2">
            <Label htmlFor="returnDate">Return Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="returnDate"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !searchParams.returnDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {searchParams.returnDate ? (
                    format(searchParams.returnDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={searchParams.returnDate}
                  onSelect={(date) => handleChange('returnDate', date)}
                  disabled={(date) => 
                    isDateDisabled(date) || 
                    (searchParams.departureDate ? date < searchParams.departureDate : false)
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full bg-travel-600 hover:bg-travel-700"
      >
        Search Flights
      </Button>
    </form>
  );
};

export default FlightSearchForm;
