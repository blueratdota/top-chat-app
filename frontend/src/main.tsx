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
import Messages from "./pages/HomePageOutlet/Messages.tsx";
import ConversationId from "./pages/HomePageOutlet/MessagesOutlet/ConversationId.tsx";
import MessageDefault from "./pages/HomePageOutlet/MessagesOutlet/MessageDefault.tsx";
import UserSignup from "./pages/UserSignup.tsx";
import UserProfile from "./pages/UserProfile.tsx";
import ProfileEdit from "./pages/HomePageOutlet/ProfileEdit.tsx";
import General from "./pages/HomePageOutlet/ProfileOutlet/General.tsx";
import Intro from "./pages/HomePageOutlet/ProfileOutlet/Intro.tsx";
import ProfilePhoto from "./pages/HomePageOutlet/ProfileOutlet/ProfilePhoto.tsx";
import Friends from "./pages/HomePageOutlet/Friends.tsx";
import FriendsHome from "./pages/HomePageOutlet/FriendsOutlet/FriendsHome.tsx";
import FriendsRequests from "./pages/HomePageOutlet/FriendsOutlet/FriendsRequests.tsx";
import FriendsAll from "./pages/HomePageOutlet/FriendsOutlet/FriendsAll.tsx";
// UTILS
import PrivateRoute from "./utils/PrivateRoute.tsx";
import FriendsSuggested from "./pages/HomePageOutlet/FriendsOutlet/FriendsSuggested.tsx";
import ExplorePage from "./pages/HomePageOutlet/ExplorePage.tsx";
import FeaturedPhotos from "./pages/HomePageOutlet/ProfileOutlet/FeaturedPhotos.tsx";
import Privacy from "./pages/HomePageOutlet/ProfileOutlet/Privacy.tsx";

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
          { index: true, element: <General /> },
          { path: "/:id/edit/intro", element: <Intro /> },
          { path: "/:id/edit/photo", element: <ProfilePhoto /> },
          { path: "/:id/edit/featured-photo", element: <FeaturedPhotos /> },
          { path: "/:id/edit/privacy", element: <Privacy /> }
        ]
      },
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
        path: "/explore",
        element: <ExplorePage />
      },
      {
        path: "/friends",
        element: (
          <PrivateRoute>
            <Friends />
          </PrivateRoute>
        ),
        children: [
          {
            index: true,
            element: <FriendsHome />
          },
          { path: "/friends/requests", element: <FriendsRequests /> },
          { path: "/friends/suggestions", element: <FriendsSuggested /> },
          { path: "/friends/all", element: <FriendsAll /> }
        ]
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
