import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Menu, X, PlaneTakeoff, User, Upload, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const Navbar: React.FC = () => {
  const { currentUser, isAuthenticated, logout, updateUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    try {
      await logout();
      closeMenu();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const photoURL = event.target?.result as string;
        updateUser({ photoURL });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and brand - Reverted to original icon + text */}
          <Link to="/" className="flex items-center space-x-2">
            <PlaneTakeoff className="h-6 w-6 text-travel-600" />
            <span className="text-xl font-bold text-travel-900">FlyAway Airline</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-travel-600 transition-colors">
              Home
            </Link>
            <Link to="/flights" className="text-gray-700 hover:text-travel-600 transition-colors">
              Flights
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/bookings" className="text-gray-700 hover:text-travel-600 transition-colors">
                  My Bookings
                </Link>
                {currentUser?.userType === 'Employee' && (
                  <Link to="/dashboard" className="text-gray-700 hover:text-travel-600 transition-colors">
                    Dashboard
                  </Link>
                )}
              </>
            )}
          </div>

          {/* User menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage 
                        src={currentUser?.photoURL} 
                        alt={`${currentUser?.firstName}'s profile`}
                      />
                      <AvatarFallback className="bg-travel-100 text-travel-800">
                        {currentUser?.firstName?.charAt(0)}{currentUser?.lastName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {currentUser?.firstName} {currentUser?.lastName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {currentUser?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="w-full cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Change Photo
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleProfilePictureChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button className="bg-travel-600 hover:bg-travel-700" asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          "md:hidden fixed inset-y-0 right-0 z-50 w-full bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 transform transition-transform duration-300 ease-in-out",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}>
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
              <PlaneTakeoff className="h-6 w-6 text-travel-600" />
              <span className="text-xl font-bold text-travel-900">FlyAway Airline</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={closeMenu}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Link 
                  to="/"
                  className="block px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 rounded-lg"
                  onClick={closeMenu}
                >
                  Home
                </Link>
                <Link 
                  to="/flights"
                  className="block px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 rounded-lg"
                  onClick={closeMenu}
                >
                  Flights
                </Link>
                {isAuthenticated && (
                  <>
                    <Link 
                      to="/bookings"
                      className="block px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 rounded-lg"
                      onClick={closeMenu}
                    >
                      My Bookings
                    </Link>
                    {currentUser?.userType === 'Employee' && (
                      <Link 
                        to="/dashboard"
                        className="block px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 rounded-lg"
                        onClick={closeMenu}
                      >
                        Dashboard
                      </Link>
                    )}
                  </>
                )}
              </div>
              
              <div className="py-6">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center px-3 mb-4">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage 
                          src={currentUser?.photoURL} 
                          alt={`${currentUser?.firstName}'s profile`}
                        />
                        <AvatarFallback className="bg-travel-100 text-travel-800">
                          {currentUser?.firstName?.charAt(0)}{currentUser?.lastName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {currentUser?.firstName} {currentUser?.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{currentUser?.email}</p>
                      </div>
                    </div>
                    
                    <Link 
                      to="/profile"
                      className="block px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 rounded-lg"
                      onClick={closeMenu}
                    >
                      My Profile
                    </Link>
                    
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="block w-full text-left px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 rounded-lg"
                    >
                      Change Profile Picture
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleProfilePictureChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </button>
                    
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 text-base font-semibold leading-7 text-red-600 hover:bg-gray-50 rounded-lg"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="space-y-3 px-3">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={closeMenu}
                      asChild
                    >
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button 
                      className="w-full bg-travel-600 hover:bg-travel-700"
                      onClick={closeMenu}
                      asChild
                    >
                      <Link to="/register">Register</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
