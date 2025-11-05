import { toastService } from './toast';

export const handleApiError = (error: unknown, navigate?: (path: string) => void) => {
  const apiError = error as { 
    data?: { 
      error?: string; 
      accountDeactivated?: boolean;
    };
    status?: number;
  };

  // Check if account is deactivated
  if (apiError?.data?.accountDeactivated) {
    if (navigate) {
      navigate('/account-deactivated');
    } else {
      window.location.href = '/account-deactivated';
    }
    return;
  }

  // Handle other API errors
  const errorMessage = apiError?.data?.error || 'An error occurred';
  toastService.error(errorMessage);
};

export default handleApiError;