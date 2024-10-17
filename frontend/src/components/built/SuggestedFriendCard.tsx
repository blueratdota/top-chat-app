import { Button } from "@chakra-ui/react";
import ProfilePicture from "./ProfilePicture";

const SuggestedFriendCard = ({ person, mutate }: any) => {
  const fullName = (() => {
    if (person.profile.firstName) {
      return `${person.profile.firstName} ${
        person.profile.lastName ? person.profile.lastName : null
      }`;
    } else {
      return person.email;
    }
  })();

  const onClickAddFriend = async () => {
    const body = { friendId: person.id };
    const friendRequest = await fetch(
      `${import.meta.env.VITE_SERVER}/api/users/add-friend`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      }
    );
    const response = await friendRequest.json();
    if (response.isSuccess) {
      await mutate();
    } else {
      throw new Error("Unable to send friend request");
    }
  };

  return (
    <div className="shadow-sm rounded-lg  bg-white">
      <div className="w-full">
        <ProfilePicture
          displayPhotoId={person.profile.displayPhoto}
          styling={"rounded-t-lg"}
        />
      </div>
      <div className="p-2 mt-1 space-y-2">
        <p className="ml-2 font-bold truncate">{fullName}</p>
        <Button
          className="w-full bg-blue-500 bg-opacity-20 text-blue-500"
          onClick={onClickAddFriend}
        >
          Add Friend
        </Button>
      </div>
    </div>
  );
};
export default SuggestedFriendCard;
