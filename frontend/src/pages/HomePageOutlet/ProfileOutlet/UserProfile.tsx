import { Button } from "@chakra-ui/react";
import { mdiAccountCircle } from "@mdi/js";
import Icon from "@mdi/react";

const UserProfile = ({ profile }: any) => {
  const fullName = `${profile.firstName} ${profile.lastName}`;

  return (
    <div>
      <header className="flex items-center">
        <div className="size-48 p-3">
          <Icon path={mdiAccountCircle} />
        </div>
        <div className="py-5 ml-10 bg-red-500 flex-1">
          <p className="text-3xl">{fullName}</p>
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
    </div>
  );
};
export default UserProfile;
