import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import UserLogin from "./pages/UserLogin.tsx";
import HomePage from "./pages/HomePageOutlet/HomePage.tsx";
import Newsfeed from "./pages/HomePageOutlet/Newsfeed.tsx";
import Post from "./pages/HomePageOutlet/Post.tsx";
import Profile from "./pages/HomePageOutlet/Profile.tsx";
import Messages from "./pages/HomePageOutlet/Messages.tsx";
import MessageId from "./pages/HomePageOutlet/MessagesOutlet/MessageId.tsx";
import MessageDefault from "./pages/HomePageOutlet/MessagesOutlet/MessageDefault.tsx";
import UserSignup from "./pages/UserSignup.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/login", element: <UserLogin /> },
      { path: "/signup", element: <UserSignup /> },
      { path: "/profile", element: <Profile /> },
      {
        path: "/messages",
        element: <Messages />,
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
    <RouterProvider router={router} />
  </React.StrictMode>
);
