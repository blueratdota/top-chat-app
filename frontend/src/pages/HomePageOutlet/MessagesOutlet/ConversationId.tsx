import { useParams } from "react-router-dom";
import useSWR from "swr";
import Message from "../../../components/message/Message";

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

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-500 max-h-screen overflow-auto">
      {isLoadingConversation && <div>Loading conversation...</div>}
      {conversation ? (
        <div className="min-h-screen px-3">
          {conversation.data.messages.map((message: any) => {
            return <Message message={message} key={message.id} />;
          })}
        </div>
      ) : null}
    </div>
  );
};

// IF MESSAGE IS FROM USER, PUT ON RIGHT SIDE
// ELSE PUT ON LEFT SIDE
// EXPLORE INFINITE SCROLLING, UPWARDS SCROLLING
// PUT NAME ON PERSON IN CHAT WITH ON TOP, @ RIGHTMOST PUT DETAILS ICON
// @BOTTOM CHAT BOX, OPTION IN THE LEFT TO SEND EMOJI/PICTURE
// @MIDDLE IS THE INPUT CHATBOX, @RIGHTMOST SEND BUTTON
export default ConversationId;
