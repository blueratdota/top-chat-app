import { Button } from "@chakra-ui/react";
import {
  mdiAccount,
  mdiAccountCircle,
  mdiChat,
  mdiDotsHorizontal,
  mdiPencil
} from "@mdi/js";
import Icon from "@mdi/react";
import useSWR from "swr";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../hooks/AuthContext";

const UserProfile = () => {
  const { id } = useParams();
  const { profile, isAuthenticated } = useAuth();
  // console.log(id);

  const fetcher = (url: string) =>
    fetch(url, { credentials: "include" }).then((res) => res.json());
  const {
    data: userProfile,
    error: errorUserProfile,
    isLoading: isLoadingUserProfile
  } = useSWR(`${import.meta.env.VITE_SERVER}/api/users/${id}`, fetcher, {
    revalidateOnFocus: true
  });

  if (errorUserProfile) {
    return <div>Error Profile/Does not exist</div>;
  }
  if (isLoadingUserProfile) {
    return <div>Loading Profile</div>;
  } else {
    const { profile: pageProfile } = userProfile.data;
    console.log(pageProfile, isAuthenticated);

    const fullName = (() => {
      if (pageProfile.firstName) {
        return `${pageProfile.firstName} ${pageProfile.lastName}`;
      } else {
        return pageProfile.user.email;
      }
    })();

    const viewerIsUser = (() => {
      if (id === profile.userId) return true;
      else return false;
    })();

    return (
      <div className={`flex justify-center bg-gray-100 min-h-screen`}>
        {isLoadingUserProfile ? (
          <>
            <div>loading...</div>
          </>
        ) : (
          <div
            className={`${
              isAuthenticated ? "" : "max-w-[70%]"
            } min-w-[60%] bg-orange-200 px-5`}
          >
            <header className="flex items-center">
              <div className="size-48 p-3">
                <Icon path={mdiAccountCircle} />
              </div>
              <div className="py-5 px-5  flex-1">
                <p className="text-3xl font-bold mb-2">{fullName}</p>
                {pageProfile.firstName ? (
                  <p className="text-3xl">{pageProfile.user.email}</p>
                ) : (
                  <p className="text-2xl italic">
                    This user has an incomplete profile
                  </p>
                )}
                <p># of friends</p>
              </div>
              <div className="flex gap-2">
                {viewerIsUser ? (
                  <>
                    <Button className="flex gap-2 text-sm text-white bg-black rounded-xl">
                      <div className="size-4">
                        <Icon path={mdiPencil}></Icon>
                      </div>
                      <p>Edit Profile</p>
                    </Button>
                    <Button className="flex gap-2 text-sm text-white bg-black rounded-xl">
                      <div className="size-5">
                        <Icon path={mdiDotsHorizontal}></Icon>
                      </div>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className="flex gap-2 text-sm text-white bg-black rounded-xl">
                      <div className="size-4">
                        <Icon path={mdiAccount}></Icon>
                      </div>
                      <p>Friends?</p>
                    </Button>
                    <Button className="flex gap-2 text-sm text-white bg-black rounded-xl">
                      <div className="size-4">
                        <Icon path={mdiChat}></Icon>
                      </div>
                      <p>Message</p>
                    </Button>
                    <Button className="flex gap-2 text-sm text-white bg-black rounded-xl">
                      <div className="size-5">
                        <Icon path={mdiDotsHorizontal}></Icon>
                      </div>
                    </Button>
                  </>
                )}
              </div>
            </header>
            <main className="flex gap-5">
              <div className="basis-[40%] flex flex-col gap-3 [&>div]:bg-pink-300">
                <div className="py-3 px-4 rounded-xl">
                  <h1 className="text-lg font-bold mb-1">Intro</h1>
                  <p className="text-center pb-2 border-b border-gray-100 border-opacity-50 ">
                    I am a person
                  </p>
                </div>
                <div> some uploaded pics 3x3 grid</div>
              </div>
              <div className="flex-1 bg-violet-300">
                {" "}
                this column for posts, create post
              </div>
            </main>
          </div>
        )}
      </div>
    );
  }
};
export default UserProfile;

// ADD EDIT PROFILE MODAL
// IN LINE EDIT BIO
