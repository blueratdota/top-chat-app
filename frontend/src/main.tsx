import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
// ROUTER
import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from "react-router-dom";
// CSS
import "./index.css";
// AUTH
import { useAuth, AuthProvider } from "./hooks/AuthContext.tsx";
// PAGES
import UserLogin from "./pages/UserLogin.tsx";
import HomePage from "./pages/HomePageOutlet/HomePage.tsx";
import Newsfeed from "./pages/HomePageOutlet/Newsfeed.tsx";
import Post from "./pages/HomePageOutlet/Post.tsx";
import Profile from "./pages/HomePageOutlet/Profile.tsx";
import Messages from "./pages/HomePageOutlet/Messages.tsx";
import MessageId from "./pages/HomePageOutlet/MessagesOutlet/MessageId.tsx";
import MessageDefault from "./pages/HomePageOutlet/MessagesOutlet/MessageDefault.tsx";
import UserSignup from "./pages/UserSignup.tsx";

// PrivateRoute component to protect routes
const PrivateRoute = ({ children }: any) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>;
  }

  // If the user is not authenticated, redirect to login
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        )
      },
      { path: "/login", element: <UserLogin /> },
      { path: "/signup", element: <UserSignup /> },
      { path: "/profile", element: <Profile /> },
      {
        path: "/messages",
        element: (
          <PrivateRoute>
            <Messages />
          </PrivateRoute>
        ),
        children: [
          { index: true, element: <MessageDefault /> },
          { path: "/messages/:id", element: <MessageId /> }
        ]
      },
      {
        path: "/newsfeed",
        element: <Newsfeed />,
        children: [{ path: "/newsfeed/post", element: <Post /> }]
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
