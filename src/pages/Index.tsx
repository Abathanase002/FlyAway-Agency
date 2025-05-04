
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import FlightSearchForm from '@/components/flights/FlightSearchForm';
import FlightCard from '@/components/flights/FlightCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { locations, flights } from '@/mockData';
import { SearchParams } from '@/components/flights/FlightSearchForm';
import { PlaneTakeoff, Map, ShieldCheck, Clock } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  
  const featuredFlights = flights.slice(0, 3);
  const featuredDestinations = locations.filter(loc => ['LOC3', 'LOC4', 'LOC6'].includes(loc.id));
  
  const handleSearch = (searchParams: SearchParams) => {
    navigate('/flights');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero section */}
        <section className="relative bg-travel-600 text-white py-24 overflow-hidden">
          <div className="absolute inset-0 opacity-20 hero-pattern"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="pr-4">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Discover the World with FlyAway Airline
                </h1>
                <p className="text-lg opacity-90 mb-8">
                  Book flights to your favorite destinations, manage your travel plans, and experience seamless journeys with our comprehensive travel management system.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button 
                    size="lg" 
                    className="bg-white text-travel-600 hover:bg-gray-100"
                    onClick={() => navigate('/flights')}
                  >
                    <PlaneTakeoff className="mr-2 h-5 w-5" />
                    Find Flights
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-white text-white hover:bg-white hover:text-travel-600"
                    onClick={() => navigate('/register')}
                  >
                    Create Account
                  </Button>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6 text-gray-900">
                <h2 className="text-2xl font-bold text-travel-600 mb-6">Find Your Flight</h2>
                <FlightSearchForm onSearch={handleSearch} />
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose FlyAway Airline</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-travel-100 text-travel-600 mb-4">
                    <PlaneTakeoff className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Wide Selection</h3>
                  <p className="text-gray-600">
                    Access to hundreds of airlines and thousands of destinations worldwide.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-travel-100 text-travel-600 mb-4">
                    <ShieldCheck className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Secure Booking</h3>
                  <p className="text-gray-600">
                    Encrypted transactions and secure payment processing for peace of mind.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-travel-100 text-travel-600 mb-4">
                    <Clock className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">24/7 Support</h3>
                  <p className="text-gray-600">
                    Round-the-clock customer service is available to help with any questions or issues.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center">
                  <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-travel-100 text-travel-600 mb-4">
                    <Map className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Loyalty Program</h3>
                  <p className="text-gray-600">
                    Earn points on every booking and redeem for discounts on future travels.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured flights */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Featured Flights</h2>
              <Button 
                variant="outline" 
                className="border-travel-200 text-travel-600 hover:bg-travel-50"
                onClick={() => navigate('/flights')}
              >
                View All Flights
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {featuredFlights.map((flight) => (
                <FlightCard key={flight.id} flight={flight} />
              ))}
            </div>
          </div>
        </section>

        {/* Popular destinations */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Popular Destinations</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredDestinations.map((destination) => (
                <div key={destination.id} className="group relative h-80 overflow-hidden rounded-lg shadow-md">
                  {/* Placeholder for destination image */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-travel-600 group-hover:scale-105 transition-transform duration-300"></div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  
                  <div className="absolute bottom-0 left-0 p-6">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {destination.name}
                    </h3>
                    <p className="text-white/80 mb-4">
                      {destination.country}
                    </p>
                    <Button variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20">
                      Explore
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-travel-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-xl text-travel-100 max-w-2xl mx-auto mb-8">
              Sign up today and get exclusive access to special offers, travel tips, and personalized recommendations.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-white text-travel-900 hover:bg-gray-100"
                onClick={() => navigate('/register')}
              >
                Sign Up for Free
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white hover:text-travel-900"
                onClick={() => navigate('/flights')}
              >
                Browse Flights
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
