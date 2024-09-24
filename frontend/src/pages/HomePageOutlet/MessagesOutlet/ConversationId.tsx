import { useParams } from "react-router-dom";
import useSWR from "swr";
import Message from "../../../components/message/Message";
import { Button } from "@chakra-ui/react";

const ConversationId = () => {
  const { id } = useParams();
  // SWR FETCHER FUNCTION
  const fetcher = (url: string) =>
    fetch(url, { credentials: "include" }).then((res) => res.json());
  const {
    data: conversation,
    error: errorConversation,
    isLoading: isLoadingConversation,
    mutate: mutateConversation
  } = useSWR(
    `${import.meta.env.VITE_SERVER}/api/messages/conversation/${id}`,
    fetcher,
    {
      revalidateOnFocus: false
    }
  );

  if (isLoadingConversation) {
    return <div>Loading conversation...</div>;
  } else {
    const { members, messages, type } = conversation?.data;

    const fullName = (() => {
      let conversationName: string = "";
      if (type === "PRIVATE") {
        // RETURN CONVERSATIONNAME = FIRST NAME + LAST NAME
        if (members[0].profile) {
          conversationName = `${members[0].profile.firstName} ${members[0].profile.lastName}`;
          return conversationName;
        } else {
          conversationName = `${members[0].email}`;
          return conversationName;
        }
      }
      if (type === "GROUP") {
        // RETURN CONVERSATIONNAME = MEMBER[0].FIRSTNAME, MEMBER[1].FIRSTNAME,...
        // LOOP THROUGH FIRST TWO MEMBERS TO IN CASE USER HAS NO PROFILE
        conversationName = `${members[0].profile.firstName}, ${members[1].profile.firstName},... `;
        return conversationName;
      }
    })();

    return (
      <div>
        {conversation ? (
          <>
            <div className="flex items-center h-[48px] pl-5 border-b gap-3">
              <div className="size-8 bg-green-500"></div>
              <p className=" text-xl font-bold">{fullName}</p>
            </div>
            <div className="bg-gradient-to-br from-gray-100 to-gray-500 max-h-[calc(100vh-64px-48px)] overflow-auto">
              {isLoadingConversation && <div>Loading conversation...</div>}
              {conversation ? (
                <div className="min-h-[calc(100vh-64px-48px)] px-5 pt-5">
                  {messages.map((message: any) => {
                    return <Message message={message} key={message.id} />;
                  })}
                </div>
              ) : null}
            </div>
            <div className="h-[64px]">
              <input type="text" />
              <Button>Send</Button>
            </div>
          </>
        ) : null}
      </div>
    );
  }
};

// IF MESSAGE IS FROM USER, PUT ON RIGHT SIDE
// ELSE PUT ON LEFT SIDE
// EXPLORE INFINITE SCROLLING, UPWARDS SCROLLING
// PUT NAME ON PERSON IN CHAT WITH ON TOP, @ RIGHTMOST PUT DETAILS ICON
// @BOTTOM CHAT BOX, OPTION IN THE LEFT TO SEND EMOJI/PICTURE
// @MIDDLE IS THE INPUT CHATBOX, @RIGHTMOST SEND BUTTON
export default ConversationId;
