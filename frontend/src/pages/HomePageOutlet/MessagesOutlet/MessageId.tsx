import { useParams } from "react-router-dom";

const MessageId = () => {
  const { id } = useParams();
  return <div>{`Message from given id- ${id}`}</div>;
};
export default MessageId;
