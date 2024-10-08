type ProfileHeaderButtonParams = {
  viewerIsUser: boolean;
  id: string | undefined;
  isAuth: boolean;
};
import { Button, useToast } from "@chakra-ui/react";
import Icon from "@mdi/react";
import { mdiPencil, mdiDotsHorizontal, mdiAccount, mdiChat } from "@mdi/js";
import { Link, useNavigate } from "react-router-dom";
import useSWR from "swr";

const ProfileHeaderButtons = ({
  viewerIsUser,
  id,
  isAuth
}: ProfileHeaderButtonParams) => {
  const navigate = useNavigate();
  const toast = useToast();

  const fetcher = (url: string) =>
    fetch(url, { credentials: "include" }).then((res) => res.json());
  const {
    data: friendshipStatus,
    isLoading: loadingFriendship,
    mutate: mutateFriendship
  } = useSWR(
    `${import.meta.env.VITE_SERVER}/api/users/friend-status/${id}`,
    fetcher,
    {
      revalidateOnFocus: false
    }
  );
  const onMessageBtn = async () => {
    // CHECK(GET) IF CONVERSATION EXISTS BETWEEN TWO USERS
    // IF NO EXISTING CONVERSATION, CREATE NEW ONE...
    // THEN REDIRECT TO CREATED CONVERSATION
    // IF SUCCESS, REDIRECT TO EXISTING CONVERSATION
    // IF FAIL, USE TOASTS
    try {
      const existingConversation = await fetch(
        `${
          import.meta.env.VITE_SERVER
        }/api/messages/establish-conversation/${id}`,
        { credentials: "include" }
      );
      const conversation = await existingConversation.json();
      console.log(conversation);
      if (conversation.data) {
        console.log("has existing conversation");
        navigate(`/messages/${conversation.data.id}`);
      } else {
        console.log("no existing conversation");
        const body = { recipientId: id };
        const establishConversation = await fetch(
          `${import.meta.env.VITE_SERVER}/api/messages/establish-conversation`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
          }
        );
        const response = await establishConversation.json();
        if (response.isSuccess) {
          navigate(`/messages/${response.data.id}`);
        } else {
          throw new Error("Unable to establish conversation");
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to successfuly establish conversation",
        status: "error",
        duration: 9000,
        isClosable: true
      });
    }
  };
  const onFriendBtn = async () => {
    console.log(friendshipStatus.btnAction);
    try {
      if (friendshipStatus.btnAction === "Add friend") {
        const body = { friendId: id };
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
          mutateFriendship();
        } else {
          throw new Error("Unable to send friend request");
        }
      }
      if (friendshipStatus.btnAction === "Cancel request") {
        const body = { friendRequestId: friendshipStatus.friendshipId };
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
          mutateFriendship();
        } else {
          throw new Error("Unable to delete friend request");
        }
      }
      if (friendshipStatus.btnAction === "Confirm request") {
        const body = { friendRequestId: friendshipStatus.friendshipId };
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
          mutateFriendship();
        } else {
          throw new Error("Unable to accept friend request");
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: `${error.message}`,
        status: "error",
        duration: 9000,
        isClosable: true
      });
    }
  };

  if (viewerIsUser) {
    return (
      <>
        <Link to={`/${id}/edit`}>
          <Button className="flex gap-2 text-sm text-white bg-black rounded-xl">
            <div className="size-4">
              <Icon path={mdiPencil}></Icon>
            </div>
            <p>Edit Profile</p>
          </Button>
        </Link>

        <Button className="flex gap-2 text-sm text-white bg-black rounded-xl">
          <div className="size-5">
            <Icon path={mdiDotsHorizontal}></Icon>
          </div>
        </Button>
      </>
    );
  } else {
    return (
      <>
        {isAuth ? (
          <>
            {loadingFriendship ? (
              <Button className="flex gap-2 text-sm text-white bg-black rounded-xl">
                Loading...
              </Button>
            ) : (
              <Button
                className="flex gap-2 text-sm text-white bg-black rounded-xl"
                onClick={onFriendBtn}
              >
                <div className="size-4">
                  <Icon path={mdiAccount}></Icon>
                </div>
                <p>{friendshipStatus.btnAction}</p>
              </Button>
            )}
            <Button
              className="flex gap-2 text-sm text-white bg-black rounded-xl"
              onClick={onMessageBtn}
            >
              <div className="size-4">
                <Icon path={mdiChat}></Icon>
              </div>
              <p>Message</p>
            </Button>
          </>
        ) : null}
        <Button className="flex gap-2 text-sm text-white bg-black rounded-xl">
          <div className="size-5">
            <Icon path={mdiDotsHorizontal}></Icon>
          </div>
        </Button>
      </>
    );
  }
};
export default ProfileHeaderButtons;

// FOR CONFIRMING FRIEND REQUEST
// CREATE A MODAL WITH 3 BTNS "ACCEPT", "REJECT", "CANCEL"
