import {
  Outlet,
  useLocation,
  useOutletContext,
  Link,
  useParams
} from "react-router-dom";
import Icon from "@mdi/react";
import { mdiAccount } from "@mdi/js";
import useSWR from "swr";

const ProfileEdit = () => {
  const { pathname } = useLocation();
  const context = useOutletContext();
  const { id } = useParams();
  const { profile }: any = context;

  // console.log(profile);

  const fetcher = (url: string) =>
    fetch(url, { credentials: "include" }).then((res) => res.json());
  const {
    data: generalInfo,
    isLoading: isLoadingGeneralInfo,
    mutate: mutateGeneralInfo
  } = useSWR(`${import.meta.env.VITE_SERVER}/api/users/${id}`, fetcher, {
    revalidateOnFocus: false
  });

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
          <Link to={`/${profile.userId}/edit/photo`}>
            <div>Profile Photo</div>
          </Link>
          <div>Featured Photos</div>
          <div>Privacy</div>
        </div>
      </div>
      <div className="w-full min-h-screen">
        <Outlet
          context={{
            profile: profile,
            pathname: pathname,
            generalInfo: generalInfo?.data.profile.generalInfo,
            isLoadingGeneralInfo: isLoadingGeneralInfo,
            mutateGeneralInfo: mutateGeneralInfo
          }}
        />
      </div>
    </div>
  );
};
export default ProfileEdit;
