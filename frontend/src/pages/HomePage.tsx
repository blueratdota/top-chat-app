import { useMediaQuery } from "react-responsive";
import Sidebar from "../components/built/Sidebar";
import { Outlet } from "react-router-dom";

const HomePage = () => {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 640px)" });
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main>
        <Outlet />
      </main>
      {isTabletOrMobile ? null : <div>optional side</div>}
    </div>
  );
};
export default HomePage;
