import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import useSWR from "swr";
import Message from "../../../components/message/Message";
import { Button } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import Icon from "@mdi/react";
import {
  mdiEmoticonHappyOutline,
  mdiFormTextbox,
  mdiImage,
  mdiSend
} from "@mdi/js";
import imageCompression from "browser-image-compression";
import ReactTextareaAutosize from "react-textarea-autosize";

const ConversationId = () => {
  const [messageContent, setMessageContent] = useState("");
  const [isOpenEmoji, setIsOpenEmoji] = useState<boolean>(false);
  const [image, setImage] = useState<File | null>(null);
  const [isHidden, setIsHidden] = useState<boolean>(true);
  const [isTextMessage, setIsTextMessage] = useState(true);
  const emptyDiv = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const context = useOutletContext();
  const { pathname, userId, mutateConversations }: any = context;

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
      emptyDiv.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [pathname, isLoadingConversation]);
  // DATA POST FUNCTION
  const onSendText = async (e: any) => {
    e.preventDefault();
    if (messageContent.length > 0) {
      try {
        setIsHidden(false);
        const body = { conversationId: id, content: messageContent };
        await fetch(`${import.meta.env.VITE_SERVER}/api/messages/send-txt`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        setIsHidden(true);
        setIsOpenEmoji(false);
        await mutateConversation();
        await mutateConversations();
        setMessageContent("");
        emptyDiv.current?.scrollIntoView({ behavior: "smooth" });
      } catch (error) {
        console.log(error);
      }
    }
  };
  const onSendImage = async (e: any) => {
    e.preventDefault();
    if (image && image.type.split("/")[0] == "image" && id) {
      try {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("conversationId", id);
        await fetch(`${import.meta.env.VITE_SERVER}/api/messages/send-img`, {
          method: "PUT",
          mode: "cors",
          credentials: "include",
          body: formData
        });
        console.log("IMAGE WILL BE SENT");

        await mutateConversation();
        if (inputRef.current) {
          inputRef.current.value = "";
        }
        setImage(null);
        emptyDiv.current?.scrollIntoView({ behavior: "smooth" });
      } catch (error) {
        console.log(error);
      }
    }
  };
  // HANDLE CHANGE FILE INPUT
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    };
    if (event.target.files && event.target.files.length > 0) {
      try {
        const file = event.target.files[0];
        console.log(file);

        const compressedFile = await imageCompression(file, options);
        console.log(compressedFile);

        setImage(compressedFile);
      } catch (error) {
        console.log(error);
      }
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
          if (members[0].profile.firstName) {
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
                <p
                  className=" text-xl font-bold hover:cursor-pointer"
                  onClick={() => {
                    // console.log(conversation);
                    if (type == "PRIVATE") {
                      const profileId = members[0].profile.userId;
                      navigate(`/${profileId}`);
                    }
                  }}
                >
                  {fullName}
                </p>
              </div>
              <div className="bg-gradient-to-r from-orange-600 to-orange-500 max-h-[calc(100vh-64px-48px)] overflow-auto">
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
                      <div ref={emptyDiv}></div>
                    </div>
                  </>
                ) : null}
              </div>
              <div className="h-[64px] flex">
                <div className="flex items-center px-5 gap-3  relative [&>button]:size-[52px] [&>button]:bg-gray-200 [&>button]:rounded-lg ">
                  <Button
                    onClick={() => {
                      setIsTextMessage(true);
                    }}
                    className="  p-3"
                  >
                    <Icon path={mdiFormTextbox} />
                  </Button>
                  <Button
                    onClick={() => {
                      setMessageContent("");
                      setIsTextMessage(false);
                      setIsOpenEmoji(false);
                    }}
                    className="  p-3"
                  >
                    <Icon path={mdiImage} />
                  </Button>
                  {isTextMessage ? (
                    <Button
                      onClick={() => {
                        setIsOpenEmoji(!isOpenEmoji);
                      }}
                      className="  p-3"
                    >
                      <Icon path={mdiEmoticonHappyOutline} />
                    </Button>
                  ) : null}
                  <div className="absolute z-10 mt-2 -translate-y-[60%]">
                    <EmojiPicker
                      open={isOpenEmoji}
                      onEmojiClick={(e) => {
                        setMessageContent((prev) => prev + e.emoji);
                      }}
                    />
                  </div>
                </div>
                {isTextMessage ? (
                  <form className="flex flex-1 items-center gap-3 pr-4">
                    <ReactTextareaAutosize
                      value={messageContent}
                      onChange={(e) => {
                        setMessageContent(e.target.value);
                      }}
                      className="min-h-[42px] max-h-[42px] w-full p-2 border border-gray-200 rounded-md"
                    ></ReactTextareaAutosize>
                    <Button
                      onClick={onSendText}
                      type="submit"
                      className="size-[52px] p-3 bg-gray-200 "
                    >
                      <Icon path={mdiSend} />
                    </Button>
                  </form>
                ) : (
                  <form
                    method="post"
                    encType="multipart/form-data"
                    className="flex flex-1 items-center gap-3 pr-4"
                  >
                    <input
                      required
                      ref={inputRef}
                      type="file"
                      placeholder="filename.txt"
                      className=" text-black border text-sm file:text-sm file:text-extWhite file:bg-extGreen file:border-0 file:p-2 file:mr-3 w-full"
                      onChange={handleFileChange}
                    />
                    <Button
                      onClick={onSendImage}
                      type="submit"
                      className="size-[52px] p-3 bg-gray-200 "
                    >
                      <Icon path={mdiSend} />
                    </Button>
                  </form>
                )}
              </div>
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

// EXPLORE INFINITE SCROLLING, UPWARDS SCROLLING
// PUT NAME ON PERSON IN CHAT WITH ON TOP, @ RIGHTMOST PUT DETAILS ICON
// @BOTTOM CHAT BOX, OPTION IN THE LEFT TO SEND EMOJI/PICTURE
// @MIDDLE IS THE INPUT CHATBOX, @RIGHTMOST SEND BUTTON

export default ConversationId;
