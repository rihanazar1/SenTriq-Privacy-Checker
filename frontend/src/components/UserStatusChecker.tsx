import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetProfileQuery } from '../store/api/authApi';

interface UserStatusCheckerProps {
  children: React.ReactNode;
}

const UserStatusChecker: React.FC<UserStatusCheckerProps> = ({ children }) => {
  const navigate = useNavigate();
  const { data: profileData, isLoading, error } = useGetProfileQuery();

  useEffect(() => {
    // If profile data is loaded and user is deactivated
    if (profileData?.data && profileData.data.isActive === false) {
      navigate('/account-deactivated', { replace: true });
    }
  }, [profileData, navigate]);

  // Show loading while checking user status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a191f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A3E635]"></div>
      </div>
    );
  }

  // If there's an error or user is deactivated, don't render children
  if (error || (profileData?.data && profileData.data.isActive === false)) {
    return null;
  }

  // If user is active, render children
  return <>{children}</>;
};

export default UserStatusChecker;