import { Outlet } from "react-router-dom";

const Newsfeed = () => {
  return (
    <div>
      this is the newsfeed
      <Outlet />
    </div>
  );
};

export default Newsfeed;