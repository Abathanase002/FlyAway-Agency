import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Assuming Card components exist
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // Assuming Avatar components exist

const Profile: React.FC = () => {
  const { currentUser, isLoading, isAuthenticated } = useAuth();

  console.log('Rendering Profile component. isLoading:', isLoading, 'isAuthenticated:', isAuthenticated, 'currentUser:', currentUser);

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading profile...</div>;
  }

  if (!isAuthenticated || !currentUser) {
    console.log('User not authenticated or currentUser is null, redirecting to login.');
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Helper to get initials
  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Your Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              {/* Add AvatarImage if user has a profile picture URL */}
              {/* <AvatarImage src={currentUser.profileImageUrl} alt={`${currentUser.firstName} ${currentUser.lastName}`} /> */}
              <AvatarFallback className="text-3xl">
                {getInitials(currentUser.firstName, currentUser.lastName)}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold">{currentUser.firstName} {currentUser.lastName}</h2>
          </div>
          <div className="space-y-2">
            <div>
              <span className="font-medium text-gray-600">Email:</span>
              <p className="text-gray-800">{currentUser.email}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">User Type:</span>
              <p className="text-gray-800">{currentUser.userType}</p>
            </div>
            {/* Display loyalty points if the user is a Customer */}
            {currentUser.userType === 'Customer' && 'loyaltyPoints' in currentUser && (
              <div>
                <span className="font-medium text-gray-600">Loyalty Points:</span>
                <p className="text-gray-800">{(currentUser as any).loyaltyPoints}</p> {/* Use 'any' or type assertion */} 
              </div>
            )}
            {/* Add more profile details as needed */}
          </div>
          {/* Add Edit Profile button or functionality here if required */}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
