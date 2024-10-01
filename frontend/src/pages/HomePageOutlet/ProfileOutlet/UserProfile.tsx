import { Button } from "@chakra-ui/react";
import { mdiAccountCircle } from "@mdi/js";
import Icon from "@mdi/react";
import useSWR from "swr";
import { useParams } from "react-router-dom";

const UserProfile = () => {
  const { id } = useParams();
  console.log(id);

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

    const fullName = (() => {
      if (pageProfile.firstName) {
        return `${pageProfile.firstName} ${pageProfile.lastName}`;
      } else {
        return pageProfile.user.email;
      }
    })();

    return (
      <div>
        {isLoadingUserProfile ? (
          <>
            <div>loading...</div>
          </>
        ) : (
          <>
            <header className="flex items-center">
              <div className="size-48 p-3">
                <Icon path={mdiAccountCircle} />
              </div>
              <div className="py-5 ml-10 bg-red-500 flex-1">
                <p className="text-3xl">{fullName}</p>
                <p className="text-3xl">{pageProfile.user.email}</p>
                <p># of friends</p>
              </div>
              <div>
                <Button>Friends?</Button>
                <Button>Message</Button>
                <Button>Dropdown button</Button>
              </div>
            </header>
            <main className="flex">
              <div className="basis-[30%]">
                {" "}
                this column for bio, details, pictures
              </div>
              <div className="flex-1 bg-violet-300">
                {" "}
                this column for posts, create post
              </div>
            </main>
          </>
        )}
      </div>
    );
  }
};
export default UserProfile;
