import {createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import Home from "../pages/home/Home";
import Dashboard from "../pages/dashboard/Dashboard";
import Login from "../pages/auth/login"
import Register from "../pages/auth/register";
import EmailBreachCheacker from "../pages/emailBreachCheacker/EmailBreachCheacker";
import DataVault from "../pages/vault/DataVault";
import FakeDataGenerator from "../pages/fakeDataGenerator/FakeDataGenerator";
import AppsTracker from "../pages/appsTracker/AppsTracker";

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
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
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
    element: <ProtectedRoute />, // yahan Outlet render hoga agar user authenticated hai
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/email-checker", element: <EmailBreachCheacker /> },
      { path: "/data-vault", element: <DataVault /> },
      { path: "/fake-data-generator", element: <FakeDataGenerator /> },
      { path: "/apps-tracker", element: <AppsTracker /> },
    ],
  },
])