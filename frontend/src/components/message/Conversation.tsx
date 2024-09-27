import { Link } from "react-router-dom";

const Conversation = ({ data, userId }: any) => {
  // ADD CONDITIONAL STUFF HERE. IF MEMBERS>1, SINCE USER IS EXCLUDED
  // IF PROFILE == NULL, DISPLAY EMAIL AS NAME
  // ADD OPTION FOR GROUP CHATS TO HAVE NAME, ELSE DISPLAY NAME OF FIRST TWO MEMBERS
  const { members, messages, id, type } = data;

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

  const lastMessage = (() => {
    let message: string = "";
    type MemberType = {
      email: string;
      profile: { firstName: string | number; lastName: string | number } | null;
      id: string;
    };
    if (messages[0].isImage) {
      console.log(userId);

      if (messages[0].authorId == userId) {
        message = "You sent a photo";
      } else {
        const sender = members.find((member: MemberType) => {
          if (member.id === messages[0].authorId) {
            if (member.profile) {
              return member.profile.firstName;
            } else {
              return member.email;
            }
          }
        });
        message = `${sender} sent a photo`;
      }
    } else {
      message = messages[0].content;
    }
    return message;
  })();

  if (messages[0]) {
    console.log(members);
    console.log(messages[0]);
  }

  return (
    <div className="flex p-2 border-y">
      <Link to={`/messages/${id}`} className="flex items-center gap-5  w-full">
        <div className="size-16 bg-green-500">x</div>
        <div className="flex-1">
          <p className="text-lg font-bold">{fullName}</p>
          <p className="max-w-[80%] truncate text-gray-500">{lastMessage}</p>
        </div>
      </Link>
      <div className="px-5 max-h-fit bg-gray-400 hover:bg-gray-200">...</div>
    </div>
  );
};
export default Conversation;
