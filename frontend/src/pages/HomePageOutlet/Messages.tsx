import Icon from "@mdi/react";
import { mdiCogOutline, mdiEmailPlusOutline } from "@mdi/js";
import { Outlet, useLocation, useOutletContext } from "react-router-dom";
import { Input } from "@chakra-ui/react";
import useSWR from "swr";
import Conversation from "../../components/message/Conversation";

const Messages = () => {
  // SWR FETCHER FUNCTION
  const fetcher = (url: string) =>
    fetch(url, { credentials: "include" }).then((res) => res.json());
  const { data: conversations, isLoading: isLoadingConversations } = useSWR(
    `${import.meta.env.VITE_SERVER}/api/users/conversations`,
    fetcher,
    {
      revalidateOnFocus: false
    }
  );
  const { pathname } = useLocation();
  const context = useOutletContext();
  const { profile }: any = context;

  return (
    <div className="flex">
      <div className="border-r min-h-screen">
        <div className="flex w-[430px] p-2 pr-5 gap-5 ">
          <h1 className="text-lg font-bold flex-1">Messages</h1>
          <div className="w-7 ">
            <Icon path={mdiCogOutline} />{" "}
          </div>
          <div className="w-7">
            <Icon path={mdiEmailPlusOutline} />{" "}
          </div>
        </div>
        <div className="py-4 px-2">
          <Input
            type="search"
            placeholder="Search Direct Messages"
            required
            className="w-full border p-3 rounded-md"
          />
        </div>
        <div>
          {isLoadingConversations && <div>Loading conversations...</div>}
          {conversations ? (
            <>
              {conversations.data.conversations.map((conversation: any) => {
                return (
                  <Conversation key={conversation.id} data={conversation} />
                );
              })}
            </>
          ) : null}
        </div>
      </div>
      <div className="w-full min-h-screen">
        <Outlet
          context={{
            profile: profile,
            pathname: pathname,
            userId: conversations?.userId
          }}
        />
      </div>
    </div>
  );
};
export default Messages;
