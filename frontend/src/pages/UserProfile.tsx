import { Button, Input } from "@chakra-ui/react";
import { mdiAccount, mdiAccountCircle } from "@mdi/js";
import Icon from "@mdi/react";
import useSWR from "swr";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import ProfileHeaderButtons from "../components/built/ProfileHeaderButtons";
import ProfileIntro from "../components/built/ProfileIntro";
import ProfilePicture from "../components/built/ProfilePicture";
import CreatePost from "../components/built/CreatePost";
import Posts from "../components/built/Posts";

const UserProfile = () => {
  const { id } = useParams();
  const { profile, isAuthenticated } = useAuth();

  const fetcher = (url: string) =>
    fetch(url, { credentials: "include" }).then((res) => res.json());
  const {
    data: userProfile,
    error: errorUserProfile,
    isLoading: isLoadingUserProfile
  } = useSWR(`${import.meta.env.VITE_SERVER}/api/users/${id}`, fetcher, {
    revalidateOnFocus: true
  });

  const {
    data: userPosts,
    error: errorUserPosts,
    isLoading: isLoadingUserPosts,
    mutate: mutateUserPosts
  } = useSWR(`${import.meta.env.VITE_SERVER}/api/users/posts/${id}`, fetcher, {
    revalidateOnFocus: true
  });

  if (errorUserProfile) {
    return <div>Error Profile/Does not exist</div>;
  }
  if (isLoadingUserProfile) {
    return <div>Loading Profile</div>;
  } else {
    const { profile: pageProfile } = userProfile.data;
    // console.log(pageProfile, isAuthenticated);

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
      <div
        className={`flex justify-center bg-gray-100 min-h-screen max-h-screen overflow-auto`}
      >
        {isLoadingUserProfile ? (
          <>
            <div>loading...</div>
          </>
        ) : (
          <div className={`min-w-[70%] px-5`}>
            <header className="flex items-center">
              <div className="size-48 p-3">
                {pageProfile.displayPhoto?.length > 0 ? (
                  <ProfilePicture displayPhotoId={pageProfile.displayPhoto} />
                ) : (
                  <Icon path={mdiAccountCircle} />
                )}
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
                <ProfileHeaderButtons
                  id={id}
                  viewerIsUser={viewerIsUser}
                  isAuth={isAuthenticated}
                />
              </div>
            </header>
            <main className="flex gap-5">
              <div className="basis-[40%] flex flex-col gap-3 [&>div]:bg-white [&>div]:shadow-sm">
                <ProfileIntro
                  generalInfo={pageProfile.generalInfo}
                  bio={pageProfile.bio}
                />
                <div className="py-3 px-4 rounded-xl">
                  <h1 className="text-lg font-bold mb-1">Photos</h1>
                  <div className="grid grid-cols-2 grid-rows-2 gap-3">
                    <div className="bg-red-500 aspect-square">x</div>
                    <div className="bg-red-500 aspect-square">x</div>
                    <div className="bg-red-500 aspect-square">x</div>
                    <div className="bg-red-500 aspect-square">x</div>
                  </div>
                </div>
                <div className="py-3 px-4 rounded-xl">
                  <h1 className="text-lg font-bold mb-1">Friends</h1>
                  <div className="grid grid-cols-2 grid-rows-3 gap-3">
                    <div className="bg-red-500 aspect-square">x</div>
                    <div className="bg-red-500 aspect-square">x</div>
                    <div className="bg-red-500 aspect-square">x</div>
                    <div className="bg-red-500 aspect-square">x</div>
                    <div className="bg-red-500 aspect-square">x</div>
                    <div className="bg-red-500 aspect-square">x</div>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-3 [&>div]:bg-white [&>div]:shadow-sm">
                {viewerIsUser && (
                  <CreatePost displayPhotoId={pageProfile.displayPhoto} />
                )}
                {isLoadingUserPosts ? (
                  <div>Loading...</div>
                ) : (
                  <>
                    {userPosts.data.posts.map((post: any) => {
                      return <Posts post={post} key={post.id} />;
                    })}
                  </>
                )}
                <div className="rounded-xl p-3">
                  <div className="flex items-center pb-5 ">
                    <div>
                      <Icon className="size-[40px]" path={mdiAccountCircle} />
                    </div>
                    <div className="ml-3">
                      <p className="text-lg font-bold">{fullName}</p>
                      <p>date posted</p>
                    </div>
                  </div>
                  <div className="bg-green-500 w-full h-[400px] rounded-xl"></div>
                  <div className="py-2 border-b border-gray-100 border-opacity-50">
                    people who have reacted to the post
                  </div>
                  <div className="flex gap-3 justify-center items-center py-2 border-b border-gray-100 border-opacity-50">
                    <Button className="flex gap-2 text-sm text-white bg-black rounded-xl">
                      <div className="size-4">
                        <Icon path={mdiAccount}></Icon>
                      </div>
                      <p>Like</p>
                    </Button>
                    <Button className="flex gap-2 text-sm text-white bg-black rounded-xl">
                      <div className="size-4">
                        <Icon path={mdiAccount}></Icon>
                      </div>
                      <p>Comment</p>
                    </Button>
                    <Button className="flex gap-2 text-sm text-white bg-black rounded-xl">
                      <div className="size-4">
                        <Icon path={mdiAccount}></Icon>
                      </div>
                      <p>Share</p>
                    </Button>
                  </div>
                  <div className="flex items-center pt-3 ">
                    <div>
                      <Icon className="size-[40px]" path={mdiAccountCircle} />
                    </div>
                    <Input className="ml-3 rounded-3xl" />
                  </div>
                </div>
                <div className="rounded-xl p-3">
                  <div className="flex items-center pb-5 ">
                    <div>
                      <Icon className="size-[40px]" path={mdiAccountCircle} />
                    </div>
                    <div className="ml-3">
                      <p className="text-lg font-bold">{fullName}</p>
                      <p>date posted</p>
                    </div>
                  </div>
                  <div className="bg-green-500 w-full h-[400px] rounded-xl"></div>
                  <div className="py-2 border-b border-gray-100 border-opacity-50">
                    people who have reacted to the post
                  </div>
                  <div className="flex gap-3 justify-center items-center py-2 border-b border-gray-100 border-opacity-50">
                    <Button className="flex gap-2 text-sm text-white bg-black rounded-xl">
                      <div className="size-4">
                        <Icon path={mdiAccount}></Icon>
                      </div>
                      <p>Like</p>
                    </Button>
                    <Button className="flex gap-2 text-sm text-white bg-black rounded-xl">
                      <div className="size-4">
                        <Icon path={mdiAccount}></Icon>
                      </div>
                      <p>Comment</p>
                    </Button>
                    <Button className="flex gap-2 text-sm text-white bg-black rounded-xl">
                      <div className="size-4">
                        <Icon path={mdiAccount}></Icon>
                      </div>
                      <p>Share</p>
                    </Button>
                  </div>
                  <div className="flex items-center pt-3 ">
                    <div>
                      <Icon className="size-[40px]" path={mdiAccountCircle} />
                    </div>
                    <Input className="ml-3 rounded-3xl" />
                  </div>
                </div>
                <div className="rounded-xl p-3">
                  <div className="flex items-center pb-5 ">
                    <div>
                      <Icon className="size-[40px]" path={mdiAccountCircle} />
                    </div>
                    <div className="ml-3">
                      <p className="text-lg font-bold">{fullName}</p>
                      <p>date posted</p>
                    </div>
                  </div>
                  <div className="bg-green-500 w-full h-[400px] rounded-xl"></div>
                  <div className="py-2 border-b border-gray-100 border-opacity-50">
                    people who have reacted to the post
                  </div>
                  <div className="flex gap-3 justify-center items-center py-2 border-b border-gray-100 border-opacity-50">
                    <Button className="flex gap-2 text-sm text-white bg-black rounded-xl">
                      <div className="size-4">
                        <Icon path={mdiAccount}></Icon>
                      </div>
                      <p>Like</p>
                    </Button>
                    <Button className="flex gap-2 text-sm text-white bg-black rounded-xl">
                      <div className="size-4">
                        <Icon path={mdiAccount}></Icon>
                      </div>
                      <p>Comment</p>
                    </Button>
                    <Button className="flex gap-2 text-sm text-white bg-black rounded-xl">
                      <div className="size-4">
                        <Icon path={mdiAccount}></Icon>
                      </div>
                      <p>Share</p>
                    </Button>
                  </div>
                  <div className="flex items-center pt-3 ">
                    <div>
                      <Icon className="size-[40px]" path={mdiAccountCircle} />
                    </div>
                    <Input className="ml-3 rounded-3xl" />
                  </div>
                </div>
                <div className="rounded-xl p-3">
                  <div className="flex items-center pb-5 ">
                    <div>
                      <Icon className="size-[40px]" path={mdiAccountCircle} />
                    </div>
                    <div className="ml-3">
                      <p className="text-lg font-bold">{fullName}</p>
                      <p>date posted</p>
                    </div>
                  </div>
                  <div className="bg-green-500 w-full h-[400px] rounded-xl"></div>
                  <div className="py-2 border-b border-gray-100 border-opacity-50">
                    people who have reacted to the post
                  </div>
                  <div className="flex gap-3 justify-center items-center py-2 border-b border-gray-100 border-opacity-50">
                    <Button className="flex gap-2 text-sm text-white bg-black rounded-xl">
                      <div className="size-4">
                        <Icon path={mdiAccount}></Icon>
                      </div>
                      <p>Like</p>
                    </Button>
                    <Button className="flex gap-2 text-sm text-white bg-black rounded-xl">
                      <div className="size-4">
                        <Icon path={mdiAccount}></Icon>
                      </div>
                      <p>Comment</p>
                    </Button>
                    <Button className="flex gap-2 text-sm text-white bg-black rounded-xl">
                      <div className="size-4">
                        <Icon path={mdiAccount}></Icon>
                      </div>
                      <p>Share</p>
                    </Button>
                  </div>
                  <div className="flex items-center pt-3 ">
                    <div>
                      <Icon className="size-[40px]" path={mdiAccountCircle} />
                    </div>
                    <Input className="ml-3 rounded-3xl" />
                  </div>
                </div>
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
// CONVERT TO COMPONENT PROFILE INTRO
// CONVERT TO COMPONENT FRIENDS
// CONVERT TO COMPONENT FIRST 4 PICTURES
// CONVERT TO COMPONENT POSTS
