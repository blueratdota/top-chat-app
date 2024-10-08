import { Outlet, useLocation, useOutletContext, Link } from "react-router-dom";
import { Input } from "@chakra-ui/react";
import Icon from "@mdi/react";
import { mdiAccount } from "@mdi/js";
const ProfileEdit = () => {
  const { pathname } = useLocation();
  const context = useOutletContext();
  const { profile }: any = context;

  return (
    <div className="flex">
      <div className="border-r min-h-screen">
        <div className="flex w-[430px] py-5 px-3 pr-5 gap-5 ">
          <h1 className="text-lg font-bold flex-1">Edit Profile</h1>
          <div className="w-7 ">
            <Icon path={mdiAccount} />{" "}
          </div>
        </div>
        <div className="[&>div]:hover:cursor-pointer py-5">
          <Link to={`/${profile.userId}/edit/general`}>
            <div>General Info</div>
          </Link>
          <Link to={`/${profile.userId}/edit/intro`}>
            <div>Additional Info</div>
          </Link>
          <div>Profile Photo</div>
          <div>Featured Photos</div>
          <div>Privacy</div>
        </div>
      </div>
      <div className="w-full min-h-screen">
        <Outlet
          context={{
            profile: profile,
            pathname: pathname
          }}
        />
      </div>
    </div>
  );
};
export default ProfileEdit;
