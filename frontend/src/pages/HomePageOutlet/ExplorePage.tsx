import useSWR from "swr";
import { useAuth } from "../../hooks/AuthContext";
import Posts from "../../components/built/Posts";
import CreatePost from "../../components/built/CreatePost";

const ExplorePage = () => {
  const { profile } = useAuth();
  const fetcher = (url: string) =>
    fetch(url, { credentials: "include" }).then((res) => res.json());
  const {
    data: allPosts,
    isLoading: isLoadingAllPosts,
    mutate: mutateAllPosts
  } = useSWR(`${import.meta.env.VITE_SERVER}/api/posts/others-posts`, fetcher, {
    revalidateOnFocus: false
  });

  return (
    <div className="w-full min-h-screen max-h-screen overflow-auto flex justify-center py-5">
      <div className="flex-1 flex flex-col gap-3 [&>div]:bg-white [&>div]:shadow-sm max-w-[40%]">
        <CreatePost
          displayPhotoId={profile.displayPhoto}
          mutateUserPosts={mutateAllPosts}
        />
        {isLoadingAllPosts ? (
          <div>Loading...</div>
        ) : (
          <>
            {allPosts.map((post: any) => {
              return (
                <Posts
                  post={post}
                  key={post.id}
                  viewerProfile={profile}
                  mutate={mutateAllPosts}
                />
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};
export default ExplorePage;
