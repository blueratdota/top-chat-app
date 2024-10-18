import { Button } from "@chakra-ui/react";
import ProfilePicture from "./ProfilePicture";
import { Link } from "react-router-dom";

const RecReqFriendCard = ({ person, mutate }: any) => {
  const fullName = (() => {
    if (person.profile.firstName) {
      return `${person.profile.firstName} ${
        person.profile.lastName ? person.profile.lastName : null
      }`;
    } else {
      return person.email;
    }
  })();

  const onClickCancelReq = async () => {
    const body = { friendRequestId: person.friendshipId };
    const friendRequest = await fetch(
      `${import.meta.env.VITE_SERVER}/api/users/friendship`,
      {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      }
    );
    const response = await friendRequest.json();
    if (response.isSuccess) {
      await mutate();
    } else {
      throw new Error("Unable to delete friendRequest");
    }
  };

  const onClickAcceptReq = async () => {
    const body = { friendRequestId: person.friendshipId };
    const friendRequest = await fetch(
      `${import.meta.env.VITE_SERVER}/api/users/accept-friend`,
      {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      }
    );
    const response = await friendRequest.json();
    if (response.isSuccess) {
      await mutate();
    } else {
      throw new Error("Unable to accept friend request");
    }
  };

  return (
    <div className="shadow-sm rounded-lg  bg-white">
      <Link to={`/${person.id}`}>
        <div className="w-full">
          <ProfilePicture
            displayPhotoId={person.profile.displayPhoto}
            styling={"rounded-t-lg"}
          />
        </div>
      </Link>
      <div className="p-2 mt-1 space-y-2">
        <p className="ml-2 font-bold truncate">{fullName}</p>
        <Button
          className="w-full bg-green-500 bg-opacity-20 text-green-500"
          onClick={onClickAcceptReq}
        >
          Accept
        </Button>
        <Button
          className="w-full bg-red-500 bg-opacity-20 text-red-500"
          onClick={onClickCancelReq}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};
export default RecReqFriendCard;
