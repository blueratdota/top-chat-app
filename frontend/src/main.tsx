import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from "react-router-dom";
import "./index.css";
import UserLogin from "./pages/UserLogin.tsx";
import HomePage from "./pages/HomePage.tsx";
import Newsfeed from "./pages/HomePageOutlet/Newsfeed.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: "/login", element: <UserLogin /> },
      {
        path: "/home",
        element: <HomePage />,
        children: [
          {
            index: true,
            element: <Navigate to="/home/newsfeed" replace />
          },
          { path: "/home/newsfeed", element: <Newsfeed /> }
        ]
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
