import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetProfileQuery, useUpdateProfileMutation, useChangePasswordMutation, useDeleteAccountMutation } from '../../store/api/authApi';
import { toast } from 'react-hot-toast';

interface ProfileData {
  id: string;
  name: string;
  email: string;
  role?: string;
  createdAt: string;
  updatedAt: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { data: profileResponse, isLoading, error, refetch } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [profileData, setProfileData] = useState<ProfileData>({
    id: '',
    name: '',
    email: '',
    role: '',
    createdAt: '',
    updatedAt: ''
  });

  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (profileResponse?.success && profileResponse.data) {
      setProfileData({
        ...profileResponse.data,
        createdAt: profileResponse.data.createdAt || '',
        updatedAt: profileResponse.data.updatedAt || ''
      });
    }
  }, [profileResponse]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profileData.name.trim() || !profileData.email.trim()) {
      toast.error('Name and email are required');
      return;
    }

    try {
      const result = await updateProfile({
        name: profileData.name,
        email: profileData.email
      }).unwrap();

      if (result.success) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
        refetch();
      }
    } catch (error: any) {
      toast.error(error?.data?.error || 'Failed to update profile');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      const result = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }).unwrap();

      if (result.success) {
        toast.success('Password changed successfully');
        setShowPasswordForm(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error: any) {
      toast.error(error?.data?.error || 'Failed to change password');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const result = await deleteAccount().unwrap();
      
      if (result.success) {
        toast.success('Account deleted successfully');
        localStorage.removeItem('token');
        navigate('/auth/login');
      }
    } catch (error: any) {
      toast.error(error?.data?.error || 'Failed to delete account');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a191f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A3E635]"></div>
      </div>
    );
  }

  if (error || !profileResponse?.success) {
    return (
      <div className="min-h-screen bg-[#0a191f] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Profile</h2>
          <p className="text-gray-400 mb-4">Please try again later</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-[#A3E635] text-black rounded-lg hover:bg-[#8BC34A] transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a191f] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-[#A3E635] hover:text-[#8BC34A] transition-colors mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
          <p className="text-gray-400 mt-2">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Profile Information</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-[#A3E635] text-black rounded-lg hover:bg-[#8BC34A] transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#A3E635]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#A3E635]"
                      required
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="px-4 py-2 bg-[#A3E635] text-black rounded-lg hover:bg-[#8BC34A] transition-colors disabled:opacity-50"
                    >
                      {isUpdating ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        if (profileResponse?.data) {
                          setProfileData({
                            ...profileResponse.data,
                            createdAt: profileResponse.data.createdAt || '',
                            updatedAt: profileResponse.data.updatedAt || ''
                          });
                        }
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Full Name
                    </label>
                    <p className="text-white text-lg">{profileData.name}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Email Address
                    </label>
                    <p className="text-white text-lg">{profileData.email}</p>
                  </div>

                  {profileData.role && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Role
                      </label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        profileData.role === 'admin' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1)}
                      </span>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Member Since
                    </label>
                    <p className="text-white">
                      {new Date(profileData.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Password Change Section */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Change Password</h2>
                {!showPasswordForm && (
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Change Password
                  </button>
                )}
              </div>

              {showPasswordForm && (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#A3E635]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#A3E635]"
                      required
                      minLength={6}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#A3E635]"
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={isChangingPassword}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isChangingPassword ? 'Changing...' : 'Change Password'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        });
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Account Actions */}
          <div className="space-y-6">
            {/* Account Stats */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Account Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Account Status</span>
                  <span className="text-green-400 font-medium">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Updated</span>
                  <span className="text-white">
                    {new Date(profileData.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
              <p className="text-gray-300 text-sm mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Account
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-red-400 text-sm font-medium">
                    Are you absolutely sure? This action cannot be undone.
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;