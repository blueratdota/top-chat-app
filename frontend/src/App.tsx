import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./components/built/Sidebar";

function App() {
  const { pathname } = useLocation();
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
            <main>
              <Outlet />
            </main>
          </div>
        </>
      )}
    </>
  );
}

export default App;
