import {
  Outlet,
  useLocation,
  useOutletContext,
  Link,
  useParams
} from "react-router-dom";
import Icon from "@mdi/react";
import {
  mdiAccount,
  mdiCamera,
  mdiImageMultiple,
  mdiIncognito,
  mdiInformation,
  mdiPlusBox
} from "@mdi/js";
import useSWR from "swr";

const ProfileEdit = () => {
  const { pathname } = useLocation();
  const context = useOutletContext();
  const { id } = useParams();
  const { profile }: any = context;
  const mainPath = pathname.split("/")[3];
  console.log(mainPath);

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
        <div className="mx-2 space-y-2">
          <Link
            to={`/${id}/edit`}
            className={`flex items-center rounded-xl space-x-3 p-2 ${
              mainPath == undefined ? "bg-black" : "hover:bg-gray-200"
            }`}
          >
            <div
              className={`size-10 p-2 rounded-[50%] ${
                mainPath == undefined ? "bg-blue-500" : "bg-gray-400"
              }`}
            >
              <Icon className="text-white" path={mdiInformation} />
            </div>
            <div>
              <p
                className={`${
                  mainPath == undefined ? "text-white" : "text-black"
                }`}
              >
                General Info
              </p>
            </div>
          </Link>
          <Link
            to={`/${id}/edit/intro`}
            className={`flex items-center rounded-xl space-x-3 p-2 ${
              mainPath == "intro" ? "bg-black" : "hover:bg-gray-200"
            }`}
          >
            <div
              className={`size-10 p-2 rounded-[50%] ${
                mainPath == "intro" ? "bg-blue-500" : "bg-gray-400"
              }`}
            >
              <Icon className="text-white" path={mdiPlusBox} />
            </div>
            <div>
              <p
                className={`${
                  mainPath == "intro" ? "text-white" : "text-black"
                }`}
              >
                Additional Info
              </p>
            </div>
          </Link>
          <Link
            to={`/${profile.userId}/edit/photo`}
            className={`flex items-center rounded-xl space-x-3 p-2 ${
              mainPath == "photo" ? "bg-black" : "hover:bg-gray-200"
            }`}
          >
            <div
              className={`size-10 p-2 rounded-[50%] ${
                mainPath == "photo" ? "bg-blue-500" : "bg-gray-400"
              }`}
            >
              <Icon className="text-white" path={mdiCamera} />
            </div>
            <div>
              <p
                className={`${
                  mainPath == "photo" ? "text-white" : "text-black"
                }`}
              >
                Profile Photo
              </p>
            </div>
          </Link>
          <Link
            to={`/${profile.userId}/edit/featured-photo`}
            className={`flex items-center rounded-xl space-x-3 p-2 ${
              mainPath == "featured-photo" ? "bg-black" : "hover:bg-gray-200"
            }`}
          >
            <div
              className={`size-10 p-2 rounded-[50%] ${
                mainPath == "featured-photo" ? "bg-blue-500" : "bg-gray-400"
              }`}
            >
              <Icon className="text-white" path={mdiImageMultiple} />
            </div>
            <div>
              <p
                className={`${
                  mainPath == "featured-photo" ? "text-white" : "text-black"
                }`}
              >
                Featured Photos
              </p>
            </div>
          </Link>
          <Link
            to={`/${profile.userId}/edit/privacy`}
            className={`flex items-center rounded-xl space-x-3 p-2 ${
              mainPath == "privacy" ? "bg-black" : "hover:bg-gray-200"
            }`}
          >
            <div
              className={`size-10 p-2 rounded-[50%] ${
                mainPath == "privacy" ? "bg-blue-500" : "bg-gray-400"
              }`}
            >
              <Icon className="text-white" path={mdiIncognito} />
            </div>
            <div>
              <p
                className={`${
                  mainPath == "privacy" ? "text-white" : "text-black"
                }`}
              >
                Privacy
              </p>
            </div>
          </Link>
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
