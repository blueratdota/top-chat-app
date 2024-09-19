import { Navigate, Outlet, useLocation } from "react-router-dom";
import Sidebar from "./components/built/Sidebar";
import useSWR from "swr";
import LoadingPage from "./components/built/LoadingPage";
import { useAuth } from "./hooks/AuthContext";

function App() {
  const { pathname } = useLocation();
  const { profile } = useAuth();

  const soloPages = ["/login", "/signup"];
  const renderOwnPage = soloPages.includes(pathname);

  return (
    <>
      {renderOwnPage ? (
        <Outlet />
      ) : (
        <>
          <div className="flex h-screen bg-gray-100">
            <Sidebar pathName={pathname} />
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
