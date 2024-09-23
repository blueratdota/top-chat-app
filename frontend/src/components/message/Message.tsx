import { useOutletContext } from "react-router-dom";

const Message = ({ message }: any) => {
  console.log(message);
  const context = useOutletContext();
  const { profile }: any = context;
  //   console.log(profile);

  const authorId: string = profile.userId;

  if (message.authorId == authorId) {
    return (
      <div className="bg-transparent text-white h-[200px] flex justify-end grow-0">
        <div className="bg-blue-700 p-2 max-w-fit max-h-fit">
          <div className="max-w-[320px]">
            {message.content} {message.dateSent}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="bg-transparent text-white h-[200px] ">
        <div className="bg-gray-700 p-2 max-w-fit max-h-fit">
          <div className="max-w-[320px]">
            {message.content} {message.dateSent}
          </div>
        </div>
      </div>
    );
  }
};
export default Message;
