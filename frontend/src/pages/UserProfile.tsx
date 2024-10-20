import { mdiAccountCircle } from "@mdi/js";
import Icon from "@mdi/react";
import useSWR from "swr";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import ProfileHeaderButtons from "../components/built/ProfileHeaderButtons";
import ProfileIntro from "../components/built/ProfileIntro";
import ProfilePicture from "../components/built/ProfilePicture";
import CreatePost from "../components/built/CreatePost";
import Posts from "../components/built/Posts";
import ProfileGallery from "../components/built/ProfileGallery";
import ProfileFriends from "../components/built/ProfileFriends";

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
    revalidateOnFocus: false
  });

  const {
    data: userPosts,
    isLoading: isLoadingUserPosts,
    mutate: mutateUserPosts
  } = useSWR(
    `${import.meta.env.VITE_SERVER}/api/posts/user-posts/${id}`,
    fetcher,
    {
      revalidateOnFocus: true
    }
  );

  if (errorUserProfile) {
    return <div>Error Profile/Does not exist</div>;
  }
  if (isLoadingUserProfile) {
    return <div>Loading Profile</div>;
  } else {
    const { profile: pageProfile } = userProfile.data;

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

    const numFriends: number = (() => {
      return (
        pageProfile.user.receivedFriendRequests.length +
        pageProfile.user.sentFriendRequests.length
      );
    })();

    console.log(pageProfile);

    return (
      <div
        className={`flex justify-center bg-gray-100 min-h-screen max-h-screen overflow-auto`}
      >
        {isLoadingUserProfile ? (
          <>
            <div>loading...</div>
          </>
        ) : (
          <div className={`min-w-[70%] max-w-[70%] px-5`}>
            <header className="flex items-center">
              <div className="size-48 p-3">
                {pageProfile.displayPhoto?.length > 0 ? (
                  <ProfilePicture
                    displayPhotoId={pageProfile.displayPhoto}
                    key={id}
                  />
                ) : (
                  <Icon path={mdiAccountCircle} />
                )}
              </div>
              <div className="py-5 px-5  flex-1">
                <p className="text-3xl font-bold mb-1">{fullName}</p>
                {pageProfile.firstName ? (
                  <p className="">{pageProfile.user.email}</p>
                ) : (
                  <p className="">This user has an incomplete profile</p>
                )}
                <p>{`${numFriends} friends`}</p>
              </div>
              <div className="flex gap-2">
                <ProfileHeaderButtons
                  id={id}
                  viewerIsUser={viewerIsUser}
                  isAuth={isAuthenticated}
                />
              </div>
            </header>
            <main className="flex gap-5 pb-10">
              <div className="basis-[40%] flex flex-col gap-3 [&>div]:bg-white [&>div]:shadow-sm">
                <ProfileIntro
                  generalInfo={pageProfile.generalInfo}
                  bio={pageProfile.bio}
                />
                <div className="py-3 px-4 rounded-xl">
                  <h1 className="text-lg font-bold mb-1">Photos</h1>
                  {isLoadingUserPosts ? (
                    <div>Loading...</div>
                  ) : (
                    <ProfileGallery posts={userPosts.data.posts} />
                  )}
                </div>
                <div className="py-3 px-4 rounded-xl">
                  <h1 className="text-lg font-bold mb-1">Friends</h1>
                  <ProfileFriends
                    receivedFriendRequests={
                      pageProfile.user.receivedFriendRequests
                    }
                    sentFriendRequests={pageProfile.user.sentFriendRequests}
                  />
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-3 [&>div]:bg-white [&>div]:shadow-sm">
                {viewerIsUser && (
                  <CreatePost
                    displayPhotoId={pageProfile.displayPhoto}
                    mutateUserPosts={mutateUserPosts}
                  />
                )}
                {isLoadingUserPosts ? (
                  <div>Loading...</div>
                ) : (
                  <>
                    {userPosts.data.posts.map((post: any) => {
                      return (
                        <Posts
                          post={post}
                          key={post.id}
                          viewerProfile={profile}
                          mutate={mutateUserPosts}
                        />
                      );
                    })}
                  </>
                )}
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
