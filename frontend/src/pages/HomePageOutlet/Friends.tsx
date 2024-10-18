import useSWR from "swr";
import { Link, Outlet, useLocation, useOutletContext } from "react-router-dom";
import Icon from "@mdi/react";
import {
  mdiAccountArrowLeft,
  mdiAccountDetails,
  mdiAccountPlus,
  mdiAccountSupervisor,
  mdiCog
} from "@mdi/js";
const Friends = () => {
  const { pathname } = useLocation();
  const context = useOutletContext();
  const { profile }: any = context;
  const mainPath = pathname.split("/")[2];

  const fetcher = (url: string) =>
    fetch(url, { credentials: "include" }).then((res) => res.json());
  // ALL FRIENDS
  const {
    data: allFriends,
    isLoading: isLoadingAllFriends,
    mutate: mutateAllFriends
  } = useSWR(`${import.meta.env.VITE_SERVER}/api/users/friends`, fetcher, {
    revalidateOnFocus: false
  });
  // FRIEND REQUESTS
  const {
    data: requestedFriends,
    isLoading: isLoadingRequestedFriends,
    mutate: mutateRequestedFriends
  } = useSWR(
    `${import.meta.env.VITE_SERVER}/api/users/requested-friends`,
    fetcher,
    {
      revalidateOnFocus: false
    }
  );
  // SUGGESTED FRIENDS
  const {
    data: suggestedFriends,
    isLoading: isLoadingSuggestedFriends,
    mutate: mutateSuggestedFriends
  } = useSWR(
    `${import.meta.env.VITE_SERVER}/api/users/suggested-friends`,
    fetcher,
    {
      revalidateOnFocus: false
    }
  );

  return (
    <div className="flex">
      <div className="border-r min-h-screen">
        <div className="flex w-[430px] py-5 px-3 pr-5 gap-5 ">
          <h1 className="text-lg font-bold flex-1">Friends</h1>
          <div className="size-7">
            <Icon path={mdiCog} />
          </div>
        </div>
        <div className=" mx-2 space-y-2">
          <Link
            to={"/friends"}
            className={`flex items-center rounded-xl space-x-3 p-2 ${
              mainPath == undefined ? "bg-black" : ""
            }`}
          >
            <div
              className={`size-10 p-2 rounded-[50%] ${
                mainPath == undefined ? "bg-blue-500" : "bg-gray-400"
              }`}
            >
              <Icon className="text-white" path={mdiAccountSupervisor} />
            </div>
            <div>
              <p
                className={`${
                  mainPath == undefined ? "text-white" : "text-black"
                }`}
              >
                Home
              </p>
            </div>
          </Link>
          <Link
            to={"/friends/requests"}
            className={`flex items-center rounded-xl space-x-3 p-2 ${
              mainPath == "requests" ? "bg-black" : ""
            }`}
          >
            <div
              className={`size-10 p-2 rounded-[50%] ${
                mainPath == "requests" ? "bg-blue-500" : "bg-gray-400"
              }`}
            >
              <Icon className="text-white" path={mdiAccountArrowLeft} />
            </div>
            <div>
              <p
                className={`${
                  mainPath == "requests" ? "text-white" : "text-black"
                }`}
              >
                Friend Requests
              </p>
            </div>
          </Link>
          <Link
            to={"/friends/suggestions"}
            className={`flex items-center rounded-xl space-x-3 p-2 ${
              mainPath == "suggestions" ? "bg-black" : ""
            }`}
          >
            <div
              className={`size-10 p-2 rounded-[50%] ${
                mainPath == "suggestions" ? "bg-blue-500" : "bg-gray-400"
              }`}
            >
              <Icon className="text-white" path={mdiAccountPlus} />
            </div>
            <div>
              <p
                className={`${
                  mainPath == "suggestions" ? "text-white" : "text-black"
                }`}
              >
                Suggestions
              </p>
            </div>
          </Link>
          <Link
            to={"/friends/all"}
            className={`flex items-center rounded-xl space-x-3 p-2 ${
              mainPath == "all" ? "bg-black" : ""
            }`}
          >
            <div
              className={`size-10 p-2 rounded-[50%] ${
                mainPath == "all" ? "bg-blue-500" : "bg-gray-400"
              }`}
            >
              <Icon className="text-white" path={mdiAccountDetails} />
            </div>
            <div>
              <p
                className={`${mainPath == "all" ? "text-white" : "text-black"}`}
              >
                All Friends
              </p>
            </div>
          </Link>
        </div>
      </div>
      <div className="w-full min-h-screen bg-gray-100">
        <Outlet
          context={{
            profile: profile,
            pathname: pathname,
            suggestedFriends: suggestedFriends?.data,
            isLoadingSuggestedFriends: isLoadingSuggestedFriends,
            mutateSuggestedFriends: mutateSuggestedFriends,
            requestedFriends: requestedFriends?.data,
            isLoadingRequestedFriends: isLoadingRequestedFriends,
            mutateRequestedFriends: mutateRequestedFriends,
            allFriends: allFriends?.data,
            isLoadingAllFriends: isLoadingAllFriends,
            mutateAllFriends: mutateAllFriends
          }}
        />
      </div>
    </div>
  );
};
export default Friends;
