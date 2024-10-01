import Icon from "@mdi/react";
import {
  mdiAccountCircle,
  mdiHome,
  mdiMagnify,
  mdiBellOutline,
  mdiEmailOutline,
  mdiAccountGroup,
  mdiLogout
} from "@mdi/js";
import { Link } from "react-router-dom";
import { useToast } from "@chakra-ui/react";

//

type SidebarParam = {
  pathName: string;
  profile: { firstName: string; lastName: string; userId: string };
};

const Sidebar = ({ pathName, profile }: SidebarParam) => {
  const toast = useToast();
  const mainPath = pathName.split("/")[1];

  const onLogout = async () => {
    try {
      await fetch("http://localhost:3000/api/users/logout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      toast({
        title: "Logout Error",
        description: "Unable to logout user",
        status: "error",
        duration: 9000,
        isClosable: true
      });
    }
    window.location.reload();
  };

  return (
    <div className="w-64 bg-white border-r [&>div]:hover:cursor-pointer py-5">
      <Link to={`/${profile.userId}`}>
        <div
          className={`flex items-center gap-3 pl-5 py-2 hover:bg-gray-100 ${
            mainPath == "profile" ? "bg-gray-100 font-bold" : ""
          }`}
        >
          <div className="w-10">
            <Icon path={mdiAccountCircle} />
            {/* CHANGE THIS LATER TO A PROFILE PICTURE */}
          </div>
          <p className=" text-lg">Profile</p>
        </div>
      </Link>
      <Link to={"/"}>
        <div
          className={`flex items-center gap-3 pl-5 py-2 hover:bg-gray-100 ${
            mainPath == "" ? "bg-gray-100 font-bold" : ""
          }`}
        >
          <div className="w-10">
            <Icon path={mdiHome} />
          </div>
          <p className=" text-lg">Home</p>
        </div>
      </Link>
      <div
        className={`flex items-center gap-3 pl-5 py-2 hover:bg-gray-100 ${
          mainPath == "explore" ? "bg-gray-100 font-bold" : ""
        }`}
      >
        <div className="w-10">
          <Icon path={mdiMagnify} />
        </div>
        <p className=" text-lg">Explore</p>
      </div>
      <div
        className={`flex items-center gap-3 pl-5 py-2 hover:bg-gray-100 ${
          mainPath == "notifications" ? "bg-gray-100 font-bold" : ""
        }`}
      >
        <div className="w-10">
          <Icon path={mdiBellOutline} />
        </div>
        <p className=" text-lg">Notifications</p>
      </div>
      <Link to={"/messages"}>
        <div
          className={`flex items-center gap-3 pl-5 py-2 hover:bg-gray-100 ${
            mainPath == "messages" ? "bg-gray-100 font-bold" : ""
          }`}
        >
          <div className="w-10">
            <Icon path={mdiEmailOutline} />
          </div>
          <p className=" text-lg">Messages</p>
        </div>
      </Link>
      <div
        className={`flex items-center gap-3 pl-5 py-2 hover:bg-gray-100 ${
          mainPath == "friends" ? "bg-gray-100 font-bold" : ""
        }`}
      >
        <div className="w-10">
          <Icon path={mdiAccountGroup} />
        </div>
        <p className=" text-lg">Friends</p>
      </div>
      <div
        className={`flex items-center gap-3 pl-5 py-2 hover:bg-gray-100 ${
          mainPath == "friends" ? "bg-gray-100 font-bold" : ""
        }`}
        onClick={onLogout}
      >
        <div className="w-10">
          <Icon path={mdiLogout} />
        </div>
        <p className=" text-lg">Log Out</p>
      </div>
    </div>
  );
};
export default Sidebar;

// THINGS TO DO HERE
// MAKE IT RESPONSIVE, ICONS ONLY ON MOBILE
// PUT ICONS ON THE BOTTOM IF APPLICABLE
