import toast, { Toaster } from "react-hot-toast";

// Custom toast styles
const toastStyles = {
  base: {
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "500",
    padding: "16px 20px",
    maxWidth: "400px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
  },
  success: {
    background: "#10B981",
    color: "#FFFFFF",
  },
  error: {
    background: "#EF4444",
    color: "#FFFFFF",
  },
  warning: {
    background: "#F59E0B",
    color: "#FFFFFF",
  },
  info: {
    background: "#3B82F6",
    color: "#FFFFFF",
  },
  loading: {
    background: "#6B7280",
    color: "#FFFFFF",
  },
};

// Main toast utility class
class ToastService {
  // Success toast
  success(message: string) {
    return toast.success(message, {
      style: {
        ...toastStyles.base,
        ...toastStyles.success,
      },
      duration: 4000,
    });
  }

  // Error toast
  error(message: string) {
    return toast.error(message, {
      style: {
        ...toastStyles.base,
        ...toastStyles.error,
      },
      duration: 5000,
    });
  }

  // Warning toast (using custom as there's no built-in warning)
  warning(message: string) {
    return toast(message, {
      icon: "⚠️",
      style: {
        ...toastStyles.base,
        ...toastStyles.warning,
      },
      duration: 4500,
    });
  }

  // Info toast
  info(message: string) {
    return toast(message, {
      icon: "ℹ️",
      style: {
        ...toastStyles.base,
        ...toastStyles.info,
      },
      duration: 4000,
    });
  }

  // Loading toast
  loading(message: string) {
    return toast.loading(message, {
      style: {
        ...toastStyles.base,
        ...toastStyles.loading,
      },
    });
  }

  // Promise toast - handles loading, success, and error states
  promise<T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    }
  ) {
    return toast.promise(
      promise,
      {
        loading,
        success,
        error,
      },
      {
        style: toastStyles.base,
        success: {
          style: {
            ...toastStyles.base,
            ...toastStyles.success,
          },
        },
        error: {
          style: {
            ...toastStyles.base,
            ...toastStyles.error,
          },
        },
        loading: {
          style: {
            ...toastStyles.base,
            ...toastStyles.loading,
          },
        },
      }
    );
  }

  // Custom toast for specific use cases
  custom(
    message: string,
    options?: {
      type?: "success" | "error" | "warning" | "info";
    }
  ) {
    const { type = "info" } = options || {};

    switch (type) {
      case "success":
        return this.success(message);
      case "error":
        return this.error(message);
      case "warning":
        return this.warning(message);
      case "info":
        return this.info(message);
      default:
        return this.info(message);
    }
  }

  // Dismiss specific toast
  dismiss(toastId?: string) {
    return toast.dismiss(toastId);
  }

  // Dismiss all toasts
  dismissAll() {
    return toast.dismiss();
  }

  // Remove specific toast
  remove(toastId: string) {
    return toast.remove(toastId);
  }
}

// Create singleton instance
export const toastService = new ToastService();

// Default export for convenience
export default toastService;

// Export Toaster component for app setup
export { Toaster };

// Export types for TypeScript support
export type ToastType = "success" | "error" | "warning" | "info" | "loading";
export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";
