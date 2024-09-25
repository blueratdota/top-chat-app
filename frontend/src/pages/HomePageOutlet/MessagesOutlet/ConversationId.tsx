import { useOutletContext, useParams } from "react-router-dom";
import useSWR from "swr";
import Message from "../../../components/message/Message";
import { Button } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

const ConversationId = () => {
  const [messageContent, setMessageContent] = useState("");
  const emptyDiv = useRef<HTMLDivElement>(null);
  const [isHidden, setIsHidden] = useState<boolean>(true);
  const { id } = useParams();
  const context = useOutletContext();
  const { pathname, userId }: any = context;

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
      revalidateOnFocus: true,
      refreshInterval: 5000
    }
  );
  // SCROLL DOWN ON RENDER
  useEffect(() => {
    if (emptyDiv.current) {
      console.log("scroll down");
      emptyDiv.current.scrollIntoView({ block: "end", behavior: "smooth" });
    }
  }, [pathname, isLoadingConversation]);

  // DATA POST FUNCTION
  const onSendButton = async (e: any) => {
    e.preventDefault();
    try {
      setIsHidden(false);
      const body = { conversationId: id, content: messageContent };
      await fetch(`${import.meta.env.VITE_SERVER}/api/messages/send`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      setIsHidden(true);
      await mutateConversation();
      setMessageContent("");
      emptyDiv.current?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.log(error);
    }
  };

  // WHILE DATA FETCH IS NOT YET DONE, DISPLAY A LOADING SCREEN
  if (errorConversation) {
    return <div>Error conversation</div>;
  }
  if (isLoadingConversation) {
    return <div>Loading conversation...</div>;
  } else {
    try {
      const { members, messages, type } = conversation?.data;
      // SET CONVERSATION NAME
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
              <div className="bg-gradient-to-r from-gray-600 to-gray-500 max-h-[calc(100vh-64px-48px)] overflow-auto">
                {isLoadingConversation && <div>Loading conversation...</div>}
                {conversation ? (
                  <>
                    <div className="min-h-[calc(100vh-64px-48px)] px-5 pt-5 flex flex-col">
                      {messages.map((message: any) => {
                        return <Message message={message} key={message.id} />;
                      })}
                      <div
                        className={`${
                          isHidden ? "hidden" : ""
                        } flex justify-end`}
                      >
                        <p>loading</p>
                        <Message
                          message={{
                            authorId: userId,
                            content: messageContent,
                            dateSent: new Date()
                          }}
                        />
                        {/* ADD SOME LOADING SPINNER HERE */}
                      </div>
                    </div>
                    <div ref={emptyDiv}></div>
                  </>
                ) : null}
              </div>
              <form className="h-[64px]">
                <input
                  type="text"
                  value={messageContent}
                  onChange={(e) => {
                    setMessageContent(e.target.value);
                  }}
                />
                <Button onClick={onSendButton} type="submit">
                  Send
                </Button>
              </form>
            </>
          ) : null}
        </div>
      );
    } catch (error) {
      // CREATE AN ERROR PAGE FOR THIS
      return <div>Error conversation</div>;
    }
  }
};

// IF MESSAGE IS FROM USER, PUT ON RIGHT SIDE
// ELSE PUT ON LEFT SIDE
// EXPLORE INFINITE SCROLLING, UPWARDS SCROLLING
// PUT NAME ON PERSON IN CHAT WITH ON TOP, @ RIGHTMOST PUT DETAILS ICON
// @BOTTOM CHAT BOX, OPTION IN THE LEFT TO SEND EMOJI/PICTURE
// @MIDDLE IS THE INPUT CHATBOX, @RIGHTMOST SEND BUTTON
export default ConversationId;
