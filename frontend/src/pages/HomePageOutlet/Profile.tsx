import { Outlet } from "react-router-dom";

const Profile = () => {
  return (
    <div>
      if profile is null, route to edit profile page
      <Outlet />
    </div>
  );
};

export default Profile;
