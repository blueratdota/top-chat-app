import { useOutletContext } from "react-router-dom";
import UpdateProfile from "./ProfileOutlet/UpdateProfile.tsx";
import UserProfile from "./ProfileOutlet/UserProfile.tsx";
type ContextType = {
  profile: object;
};

const Profile = () => {
  const context = useOutletContext<ContextType>();
  const { profile } = context;
  console.log(`profile from useAuth() =`, profile);

  return <>{profile ? <UserProfile profile={profile} /> : <UpdateProfile />}</>;
};

export default Profile;
