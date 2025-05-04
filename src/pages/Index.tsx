import React from 'react';
import { flights as mockFlights, locations as mockLocations } from '@/mockData'; // Import mock flights and locations
import FlightCard from '@/components/flights/FlightCard'; // Import FlightCard
import { Flight } from '@/types/Flight'; // Import Flight type for mapping
import { Location } from '@/types/Location'; // Import Location type
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

// Helper function to map mock data to the Flight type expected by FlightCard
const mapMockFlightToCardProps = (mockFlight: any): Flight => {
  // Find matching location data from mockLocations
  const departureLocation = mockLocations.find(loc => loc.id === mockFlight.departureLocationId);
  const arrivalLocation = mockLocations.find(loc => loc.id === mockFlight.arrivalLocationId);

  return {
    FlightID: mockFlight.id,
    FlightNumber: mockFlight.flightNumber,
    DepartureTime: mockFlight.departureTime?.toISOString(),
    ArrivalTime: mockFlight.arrivalTime?.toISOString(),
    DepartureLocationData: {
        LocationID: departureLocation?.id ?? '',
        Name: departureLocation?.name ?? 'Unknown Airport',
        City: departureLocation?.name?.split(',')[0] ?? 'Unknown City',
        Country: departureLocation?.country ?? 'Unknown Country',
        IATA_Code: departureLocation?.airportCode ?? 'N/A',
        ICAO_Code: '',
        Latitude: 0,
        Longitude: 0,
    },
    ArrivalLocationData: {
        LocationID: arrivalLocation?.id ?? '',
        Name: arrivalLocation?.name ?? 'Unknown Airport',
        City: arrivalLocation?.name?.split(',')[0] ?? 'Unknown City',
        Country: arrivalLocation?.country ?? 'Unknown Country',
        IATA_Code: arrivalLocation?.airportCode ?? 'N/A',
        ICAO_Code: '',
        Latitude: 0,
        Longitude: 0,
    },
    Aircraft: {
        AircraftID: mockFlight.aircraftId ?? 'N/A',
        Model: 'Unknown Model',
        Manufacturer: 'Unknown Manufacturer',
        Capacity: 0,
        Status: 'Active',
    },
    AvailableSeats: mockFlight.availableSeats ?? 100,
    CurrentPrice: mockFlight.basePrice ?? 0,
    Status: mockFlight.status ?? 'Scheduled',
  };
};

// Define popular destinations with image paths
const popularDestinations = [
  { ...mockLocations[0], image: '/images/destinations/jfk_new_york_aerial_correct.jpeg' }, // New York (USA)
  { ...mockLocations[1], image: '/images/destinations/lhr_london_aerial.jpeg' }, // London (UK)
  { ...mockLocations[2], image: '/images/destinations/cdg_paris_aerial.png' }, // Paris (France)
  { ...mockLocations[3], image: '/images/destinations/hnd_tokyo_aerial.png' }, // Tokyo (Japan)
  { ...mockLocations[4], image: '/images/destinations/syd_sydney_aerial.jpeg' }, // Sydney (Australia)
  { ...mockLocations[5], image: '/images/destinations/fco_rome_aerial.png' }, // Rome (Italy)
];

// Function to handle the explore button click
const handleExploreClick = (country: string) => {
  const searchQuery = `airports in ${country}`;
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
  // Open the search results in a new tab
  window.open(searchUrl, '_blank', 'noopener,noreferrer');
};

const Index = () => {
  console.log("Rendering Index with Flight Cards and Popular Destinations...");

  // Map the mock data for flights
  const displayFlights = mockFlights.map(mapMockFlightToCardProps);

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      {/* Available Flights Section */}
      <h1 className="text-3xl font-bold mb-6 text-center">Available Flights</h1>
      {displayFlights.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {displayFlights.map((flight) => (
            <FlightCard key={flight.FlightID} flight={flight} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mb-12">No flights available at the moment.</p>
      )}

      {/* Popular Destinations Section */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Popular Destinations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularDestinations.map((dest) => (
            <Card key={dest.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <img 
                src={dest.image} 
                alt={`Aerial view of ${dest.name} airport`} 
                className="w-full h-48 object-cover" 
              />
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-1">{dest.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{dest.country}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleExploreClick(dest.country)} // Implement onClick handler
                >
                  Explore <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Index;
