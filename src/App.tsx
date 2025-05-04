import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext"; // Import AuthProvider
import { Toaster } from "@/components/ui/toaster"; // Import Toaster for notifications
import Navbar from "./components/Navbar"; // Import the restored Navbar
import Index from "./pages/Index";
import Profile from "./pages/Profile"; // Import Profile page
import Login from "./pages/Login"; // Import Login page (assuming it exists or will be created)
import Register from "./pages/Register"; // Import Register page (assuming it exists or will be created)
import Bookings from "./pages/Bookings"; // Import Bookings page (assuming it exists or will be created)
import Flights from "./pages/Flights"; // Import Flights page (assuming it exists or will be created)
import FlightDetails from "./pages/FlightDetails"; // Import FlightDetails page
import Footer from "./components/Footer"; // Import Footer
import ErrorBoundary from './components/ErrorBoundary'; // Import ErrorBoundary

const App = () => {
  console.log("Rendering App with AuthProvider, Navbar, Routes...");
  return (
    <BrowserRouter>
      <AuthProvider> {/* Wrap everything in AuthProvider */}
        <ErrorBoundary> {/* Wrap in ErrorBoundary */} 
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/flights" element={<Flights />} />
                <Route path="/flights/:flightId" element={<FlightDetails />} />
                {/* Add a more informative fallback route */}
                <Route path="*" element={
                  <div className="container mx-auto px-4 py-8 text-center">
                    <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>
                    <p>Sorry, the page you are looking for does not exist.</p>
                  </div>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster /> {/* Add Toaster for notifications */} 
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
};
export default App;
