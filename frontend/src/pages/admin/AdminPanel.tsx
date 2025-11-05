import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useGetAllUsersQuery,
  useToggleUserStatusMutation,
  useRestoreUserMutation,
  usePermanentDeleteUserMutation,
  useGetProfileQuery,
  type User
} from '../../store/api/authApi';
import { toastService } from '../../utils/toast';



interface ApiError {
  data?: {
    error?: string;
  };
  message?: string;
}

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [includeDeleted, setIncludeDeleted] = useState(false);

  const { data: profileData } = useGetProfileQuery();

  const { data: usersData, isLoading, refetch } = useGetAllUsersQuery({
    page,
    limit: 10,
    includeDeleted
  });

  const [toggleUserStatus] = useToggleUserStatusMutation();
  const [restoreUser] = useRestoreUserMutation();
  const [permanentDeleteUser] = usePermanentDeleteUserMutation();

  // Check if current user is admin
  const isAdmin = profileData?.data?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0a191f] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-gray-400 mb-4">You don't have admin privileges</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 cursor-pointer bg-[#A3E635] text-black rounded-lg hover:bg-[#8BC34A] transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleToggleStatus = async (userId: string) => {
    try {
      const result = await toggleUserStatus(userId).unwrap();
      if (result.success) {
        toastService.success(result.message);
        refetch();
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toastService.error(apiError?.data?.error || 'Failed to toggle user status');
    }
  };

  const handleRestoreUser = async (userId: string) => {
    try {
      const result = await restoreUser(userId).unwrap();
      if (result.success) {
        toastService.success(result.message);
        refetch();
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toastService.error(apiError?.data?.error || 'Failed to restore user');
    }
  };

  const handlePermanentDelete = async (userId: string) => {
    if (window.confirm('Are you sure? This action cannot be undone!')) {
      try {
        const result = await permanentDeleteUser(userId).unwrap();
        if (result.success) {
          toastService.success(result.message);
          refetch();
        }
      } catch (error: unknown) {
        const apiError = error as ApiError;
        toastService.error(apiError?.data?.error || 'Failed to delete user');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a191f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A3E635]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a191f] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex cursor-pointer items-center text-[#A3E635] hover:text-[#8BC34A] transition-colors mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
          <p className="text-gray-400 mt-2">Manage users and system settings</p>
        </div>

        {/* Controls */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeDeleted}
                  onChange={(e) => setIncludeDeleted(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-white">Include Deleted Users</span>
              </label>
            </div>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-[#A3E635] text-black rounded-lg hover:bg-[#8BC34A] transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Users Management</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {usersData?.data?.users?.map((user: User) => (
                  <tr key={user.id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">{user.name}</div>
                        <div className="text-sm text-gray-400">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                        }`}>
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.isDeleted !== 0
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {user.isDeleted !== 0 ? 'Not Deleted' : 'Deleted'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      {user.id !== profileData?.data?.id && (
                        <>
                          <button
                            onClick={() => handleToggleStatus(user.id)}
                            className={`px-3 py-1 cursor-pointer rounded text-xs font-medium ${user.isActive
                              ? 'bg-red-600 text-white hover:bg-red-700'
                              : 'bg-green-600 text-white hover:bg-green-700'
                              }`}
                          >
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </button>

                          {user.isDeleted === 0 && (
                            <button
                              onClick={() => handleRestoreUser(user.id)}
                              className="px-3 cursor-pointer py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700"
                            >
                              Restore
                            </button>
                          )}

                          <button
                            onClick={() => handlePermanentDelete(user.id)}
                            className="px-3 cursor-pointer py-1 bg-red-800 text-white rounded text-xs font-medium hover:bg-red-900"
                          >
                            Delete Forever
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {usersData?.data?.pagination && (
            <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Showing {usersData.data.users.length} of {usersData.data.pagination.totalUsers} users
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={!usersData.data.pagination.hasPrev}
                  className="px-3 py-1 bg-gray-600 text-white rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-white text-sm">
                  Page {usersData.data.pagination.currentPage} of {usersData.data.pagination.totalPages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={!usersData.data.pagination.hasNext}
                  className="px-3 py-1 bg-gray-600 text-white rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;