import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
// ROUTER
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// CSS
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
// AUTH
import { AuthProvider } from "./hooks/AuthContext.tsx";
// PAGES
import UserLogin from "./pages/UserLogin.tsx";
import HomePage from "./pages/HomePageOutlet/HomePage.tsx";
import Newsfeed from "./pages/HomePageOutlet/Newsfeed.tsx";
import Post from "./pages/HomePageOutlet/Post.tsx";
import Messages from "./pages/HomePageOutlet/Messages.tsx";
import ConversationId from "./pages/HomePageOutlet/MessagesOutlet/ConversationId.tsx";
import MessageDefault from "./pages/HomePageOutlet/MessagesOutlet/MessageDefault.tsx";
import UserSignup from "./pages/UserSignup.tsx";
// UTILS
import PrivateRoute from "./utils/PrivateRoute.tsx";
import UserProfile from "./pages/UserProfile.tsx";
import ProfileEdit from "./pages/HomePageOutlet/ProfileEdit.tsx";
import General from "./pages/HomePageOutlet/ProfileOutlet/General.tsx";
import Intro from "./pages/HomePageOutlet/ProfileOutlet/Intro.tsx";

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
      {
        path: "/:id",
        element: <UserProfile />
      },
      {
        path: "/:id/edit",
        element: (
          <PrivateRoute>
            <ProfileEdit />
          </PrivateRoute>
        ),
        children: [
          { path: "/:id/edit/general", element: <General /> },
          { path: "/:id/edit/intro", element: <Intro /> }
        ]
      },
      // {
      //   path: "/profile",
      //   element: (
      //     <PrivateRoute>
      //       <Profile />
      //     </PrivateRoute>
      //   )
      // },
      {
        path: "/messages",
        element: (
          <PrivateRoute>
            <Messages />
          </PrivateRoute>
        ),
        children: [
          { index: true, element: <MessageDefault /> },
          { path: "/messages/:id", element: <ConversationId /> }
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
      <ChakraProvider>
        <RouterProvider router={router} />
      </ChakraProvider>
    </AuthProvider>
  </React.StrictMode>
);
