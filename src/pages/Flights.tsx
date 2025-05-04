
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query'; // Import useQuery
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FlightSearchForm, { SearchParams } from '@/components/flights/FlightSearchForm';
import FlightCard from '@/components/flights/FlightCard';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Flight } from '@/types/Flight'; // Import Flight type from types
import { getFlights } from '@/api/flights'; // Import API function
import { Search, Filter } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton for loading state

const Flights = () => {
  // Use react-query to fetch flights
  const { data: allFlights = [], isLoading, error } = useQuery<Flight[], Error>({
    queryKey: ['flights'],
    queryFn: getFlights,
  });

  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('departureTime');

  // Update filtered flights when allFlights data changes
  useEffect(() => {
    setFilteredFlights(allFlights);
  }, [allFlights]);

  // Filter flights based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredFlights(allFlights); // Reset to all fetched flights
      return;
    }

    const lowerCaseTerm = searchTerm.toLowerCase();
    const filtered = allFlights.filter(flight =>
      flight.FlightID.toLowerCase().includes(lowerCaseTerm) ||
      flight.DepartureLocationData?.Name.toLowerCase().includes(lowerCaseTerm) || // Use expanded data
      flight.DepartureLocationData?.IATA_Code?.toLowerCase().includes(lowerCaseTerm) ||
      flight.ArrivalLocationData?.Name.toLowerCase().includes(lowerCaseTerm) || // Use expanded data
      flight.ArrivalLocationData?.IATA_Code?.toLowerCase().includes(lowerCaseTerm) ||
      flight.Aircraft?.Model.toLowerCase().includes(lowerCaseTerm) // Use expanded data
    );

    setFilteredFlights(filtered);
  }, [searchTerm, allFlights]);

  // Sort flights
  useEffect(() => {
    // Create a mutable copy before sorting
    const sorted = [...filteredFlights];

    switch (sortBy) {
      case 'departureTime':
        sorted.sort((a, b) => new Date(a.DepartureTime).getTime() - new Date(b.DepartureTime).getTime());
        break;
      case 'arrivalTime':
        sorted.sort((a, b) => new Date(a.ArrivalTime).getTime() - new Date(b.ArrivalTime).getTime());
        break;
      case 'duration':
        sorted.sort((a, b) => {
          // Duration calculation might need adjustment based on actual API/DB duration field if available
          const durationA = new Date(a.ArrivalTime).getTime() - new Date(a.DepartureTime).getTime();
          const durationB = new Date(b.ArrivalTime).getTime() - new Date(b.DepartureTime).getTime();
          return durationA - durationB;
        });
        break;
      // Removed price sorting as it's not in the DB schema
      // case 'price':
      //   sorted.sort((a, b) => a.price - b.price);
      //   break;
      // case 'priceDesc':
      //   sorted.sort((a, b) => b.price - a.price);
      //   break;
      default:
        break;
    }

    // Only update state if the sorted array is different to prevent infinite loops
    if (JSON.stringify(sorted) !== JSON.stringify(filteredFlights)) {
        setFilteredFlights(sorted);
    }
  }, [sortBy, filteredFlights]); // Depend on filteredFlights as well

  const handleSearch = (searchParams: SearchParams) => {
    // This function now primarily filters the already fetched 'allFlights' data
    // A real app might refetch from the API with server-side filtering
    console.log("Client-side filtering with params:", searchParams);

    if (!searchParams.from && !searchParams.to && !searchParams.departureDate) {
      setFilteredFlights(allFlights); // Reset to all fetched flights
      setSearchTerm(''); // Also reset search term
      return;
    }

    const filtered = allFlights.filter(flight => {
      let matches = true;

      if (searchParams.from && flight.DepartureLocation !== searchParams.from) { // Use FK field
        matches = false;
      }

      if (searchParams.to && flight.ArrivalLocation !== searchParams.to) { // Use FK field
        matches = false;
      }

      if (searchParams.departureDate) {
        const flightDepartureDate = new Date(flight.DepartureTime);
        const searchDate = searchParams.departureDate;

        if (
          flightDepartureDate.getFullYear() !== searchDate.getFullYear() ||
          flightDepartureDate.getMonth() !== searchDate.getMonth() ||
          flightDepartureDate.getDate() !== searchDate.getDate()
        ) {
          matches = false;
        }
      }

      return matches;
    });

    setFilteredFlights(filtered);
    setSearchTerm(''); // Clear text search when form search is used
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        <section className="bg-travel-600 text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-4">Find Your Perfect Flight</h1>
            <Card className="bg-white text-gray-900">
              <CardContent className="p-6">
                <FlightSearchForm onSearch={handleSearch} />
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center w-full md:w-2/3">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search flights by ID, location, or aircraft..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="w-full md:w-1/3 md:ml-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="text-gray-400 h-4 w-4" />
                    <Label htmlFor="sort" className="text-sm font-medium">Sort by:</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger id="sort" className="flex-grow">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="departureTime">Departure Time</SelectItem>
                        <SelectItem value="arrivalTime">Arrival Time</SelectItem>
                        <SelectItem value="duration">Duration</SelectItem>
                        {/* Removed price sorting options */}
                        {/* <SelectItem value="price">Price: Low to High</SelectItem> */}
                        {/* <SelectItem value="priceDesc">Price: High to Low</SelectItem> */}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h2 className="text-xl font-semibold">
                {isLoading ? 'Loading flights...' : `${filteredFlights.length} ${filteredFlights.length === 1 ? 'Flight' : 'Flights'} Available`}
              </h2>
              {error && <p className="text-red-500">Error loading flights: {error.message}</p>}
            </div>

            <div className="space-y-6">
              {isLoading ? (
                // Show skeleton loaders while loading
                Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-grow space-y-3">
                          <Skeleton className="h-5 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-4 w-1/4" />
                        </div>
                        <div className="flex flex-col items-end justify-between w-full md:w-auto space-y-2 md:space-y-0">
                          <Skeleton className="h-6 w-24" />
                          <Skeleton className="h-8 w-32 mt-4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : filteredFlights.length > 0 ? (
                filteredFlights.map((flight) => (
                  <FlightCard key={flight.FlightID} flight={flight} /> // Use FlightID as key
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-600">No flights match your criteria</h3>
                  <p className="mt-2 text-gray-500">Try adjusting your search filters</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Flights;
