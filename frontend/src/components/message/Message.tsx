import { useOutletContext } from "react-router-dom";
import { format } from "date-fns";

const Message = ({ message }: any) => {
  // console.log(message);
  const context = useOutletContext();
  const { userId }: any = context;
  // console.log(userId);

  // MOVE THIS TO CONVERSATION ID COMPONENT
  // if (!profile) {
  //   return <Navigate to={"/profile"} />;
  // }

  const authorId: string = userId;
  const date: string = format(message.dateSent, "PPp");

  if (message.authorId == authorId) {
    return (
      <div className="bg-transparent text-white pb-5 flex flex-col items-end grow-0">
        <div className="bg-blue-700 px-4 py-2 rounded-lg max-w-fit max-h-fit">
          <div className="max-w-[320px]">{message.content}</div>
        </div>
        <p>{date}</p>
      </div>
    );
  } else {
    return (
      <div className="bg-transparent text-white pb-5  ">
        <div className="bg-gray-700 px-4 py-2 rounded-lg max-w-fit max-h-fit">
          <div className="max-w-[320px]">{message.content}</div>
        </div>
        <p>{date}</p>
      </div>
    );
  }
};
export default Message;
