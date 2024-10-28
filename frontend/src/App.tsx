import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./components/built/Sidebar";

import { useAuth } from "./hooks/AuthContext";

function App() {
  const { pathname } = useLocation();
  const { profile, isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated ? (
        <>
          <div className="flex flex-col-reverse md:flex md:flex-row h-screen bg-gray-100">
            <Sidebar pathName={pathname} profile={profile} />
            <main className="w-full md:min-h-screen md:max-h-screen overflow-auto">
              <Outlet context={{ profile: profile }} />
            </main>
          </div>
        </>
      ) : (
        <Outlet />
      )}
    </>
  );
}

export default App;
