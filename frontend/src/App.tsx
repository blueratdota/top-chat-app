import { Navigate, Outlet, useLocation } from "react-router-dom";
import Sidebar from "./components/built/Sidebar";
import useSWR from "swr";
import LoadingPage from "./components/built/LoadingPage";

function App() {
  const { pathname } = useLocation();

  const soloPages = ["/login", "/signup"];
  const renderOwnPage = soloPages.includes(pathname);

  // const fetcher = (url: string) =>
  //   fetch(url, { credentials: "include" }).then((res) => res.json());

  // const {
  //   data: profile,
  //   error: errorProfile,
  //   isLoading: isLoadingProfile
  // } = useSWR(`${import.meta.env.VITE_SERVER}/api/users/profile`, fetcher, {
  //   revalidateOnFocus: false
  // });

  // if (isLoadingProfile) {
  //   return (
  //     <LoadingPage>
  //       <p>Loading App: Profile</p>
  //     </LoadingPage>
  //   );
  // }

  // if (errorProfile) {
  //   console.log("ERROR PROFILE");
  // }

  // if (profile.isSuccess) {
  // }

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
