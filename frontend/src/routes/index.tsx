import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import Home from "../pages/home/Home";
import Dashboard from "../pages/dashboard/Dashboard";
import Login from "../pages/auth/login"
import Register from "../pages/auth/register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import EmailBreachCheacker from "../pages/emailBreachCheacker/EmailBreachCheacker";
import DataVault from "../pages/vault/DataVault";
import FakeDataGenerator from "../pages/fakeDataGenerator/FakeDataGenerator";
import AppTrackerPage from "../pages/appsTracker/AppTrackerPage";
import Profile from "../pages/profile/Profile";
import AdminPanel from "../pages/admin/AdminPanel";
import AccountDeactivated from "../pages/auth/AccountDeactivated";
import UserStatusChecker from "../components/UserStatusChecker";

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp * 1000;
    return Date.now() > exp;
  } catch {
    return true;
  }
}

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("token");
    return false;
  }
  return true;
};

export const ProtectedRoute = () => {
  return isAuthenticated() ? (
    <UserStatusChecker>
      <Outlet />
    </UserStatusChecker>
  ) : (
    <Navigate to="/login" replace />
  );
};


export const Router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />
  },
  {
    path: "/account-deactivated",
    element: <AccountDeactivated />
  },
  {
    element: <ProtectedRoute />, // yahan Outlet render hoga agar user authenticated hai
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/email-checker", element: <EmailBreachCheacker /> },
      { path: "/data-vault", element: <DataVault /> },
      { path: "/fake-data-generator", element: <FakeDataGenerator /> },
      { path: "/apps-tracker", element: <AppTrackerPage /> },
      { path: "/profile", element: <Profile /> },
      { path: "/admin", element: <AdminPanel /> },
    ],
  },
])