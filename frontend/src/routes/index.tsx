import {createBrowserRouter } from "react-router-dom";
import Home from "../pages/home/Home";

export const Router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    }
])