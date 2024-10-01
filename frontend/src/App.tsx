import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./components/built/Sidebar";

import { useAuth } from "./hooks/AuthContext";

function App() {
  const { pathname } = useLocation();
  const { profile } = useAuth();

  const soloPages = ["/login", "/signup", "/account-created"];
  const renderOwnPage = soloPages.includes(pathname);

  return (
    <>
      {renderOwnPage ? (
        <Outlet />
      ) : (
        <>
          <div className="flex h-screen bg-gray-100">
            <Sidebar pathName={pathname} profile={profile} />
            <main className="w-full">
              <Outlet context={{ profile: profile }} />
            </main>
          </div>
        </>
      )}
    </>
  );
}

export default App;
