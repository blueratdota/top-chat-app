import { useOutletContext } from "react-router-dom";
import { format } from "date-fns";
import { useEffect, useState } from "react";

const Message = ({ message }: any) => {
  // console.log(message);
  const context = useOutletContext();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState<boolean>(false);
  const { userId }: any = context;
  // console.log(message);
  useEffect(() => {
    const fetchImage = async () => {
      try {
        setIsLoadingImage(true);
        const response = await fetch(
          `${import.meta.env.VITE_SERVER}/api/messages/image/${message.content}`
        );
        const imageBlob = await response.blob();
        const imageObjectURL = URL.createObjectURL(imageBlob);
        setImageSrc(imageObjectURL);
        setIsLoadingImage(false);
      } catch (error) {
        console.error("Error fetching the image:", error);
      }
    };
    if (message.isImage) {
      fetchImage();
    }
  }, []);

  const authorId: string = userId;
  const date: string = format(message.dateSent, "PPp");

  if (message.authorId == authorId) {
    return (
      <div className="bg-transparent text-white pb-5 flex flex-col items-end grow-0">
        {message.isImage ? (
          <div>
            {imageSrc && !isLoadingImage ? (
              <img
                src={imageSrc}
                alt={message.content}
                className="max-w-[520px] rounded-3xl"
              />
            ) : (
              <div className="max-w-[320px]">{message.content}</div>
            )}
          </div>
        ) : (
          <div className="bg-blue-700 px-4 py-2 rounded-lg max-w-fit max-h-fit">
            <div className="max-w-[320px]">{message.content}</div>
          </div>
        )}
        <p className="py-1 text-sm">{date}</p>
      </div>
    );
  } else {
    return (
      <div className="bg-transparent text-white pb-5">
        {message.isImage ? (
          <div>
            {imageSrc && !isLoadingImage ? (
              <img
                src={imageSrc}
                alt={message.content}
                className="max-w-[520px] rounded-3xl"
              />
            ) : (
              <div className="max-w-[320px]">{message.content}</div>
            )}
          </div>
        ) : (
          <div className="bg-gray-700 px-4 py-2 rounded-lg max-w-fit max-h-fit">
            <div className="max-w-[320px]">{message.content}</div>
          </div>
        )}
        <p className="py-1 text-sm">{date}</p>
      </div>
    );
  }
};
export default Message;
