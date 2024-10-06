type ProfileHeaderButtonParams = {
  viewerIsUser: boolean;
  id: string | undefined;
  isAuth: boolean;
};
import { Button, useToast } from "@chakra-ui/react";
import Icon from "@mdi/react";
import { mdiPencil, mdiDotsHorizontal, mdiAccount, mdiChat } from "@mdi/js";
import { useNavigate } from "react-router-dom";

const ProfileHeaderButtons = ({
  viewerIsUser,
  id,
  isAuth
}: ProfileHeaderButtonParams) => {
  const navigate = useNavigate();
  const toast = useToast();
  const onMessageBtn = async () => {
    // CHECK(GET) IF CONVERSATION EXISTS BETWEEN TWO USERS
    // IF NO EXISTING CONVERSATION, CREATE NEW ONE, THEN REDIRECT TO CREATED CONVERSATION
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

  if (viewerIsUser) {
    return (
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
    );
  } else {
    return (
      <>
        {" "}
        <Button className="flex gap-2 text-sm text-white bg-black rounded-xl">
          <div className="size-4">
            <Icon path={mdiAccount}></Icon>
          </div>
          <p>Friends?</p>
        </Button>
        {isAuth ? (
          <Button
            className="flex gap-2 text-sm text-white bg-black rounded-xl"
            onClick={onMessageBtn}
          >
            <div className="size-4">
              <Icon path={mdiChat}></Icon>
            </div>
            <p>Message</p>
          </Button>
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
