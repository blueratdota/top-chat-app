const Conversation = ({ data }: any) => {
  // ADD CONDITIONAL STUFF HERE. IF MEMBERS>1, SINCE USER IS EXCLUDED
  // IF PROFILE == NULL, DISPLAY EMAIL AS NAME
  // ADD OPTION FOR GROUP CHATS TO HAVE NAME, ELSE DISPLAY NAME OF FIRST TWO MEMBERS
  const { members, messages, id, dateUpdated, type } = data;
  const fullName = (() => {
    let conversationName: string = "";
    if (type === "PRIVATE") {
      // RETURN CONVERSATIONNAME = FIRST NAME + LAST NAME
      if (members[0].profile) {
        conversationName = `${members[0].profile.firstName} ${members[0].profile.lastName}`;
        return conversationName;
      } else {
        conversationName = `${members[0].profile.email}`;
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
    <div className="flex items-center gap-5 p-2 border-y">
      <div className="size-16 bg-green-500">x</div>
      <div className="flex-1">
        <p className="text-lg font-bold">{fullName}</p>
        <p className="max-w-[80%] truncate text-gray-500">
          {messages[0].content}
        </p>
      </div>
      <div>optn</div>
    </div>
  );
};
export default Conversation;
