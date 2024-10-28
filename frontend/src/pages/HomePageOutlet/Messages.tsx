import Icon from "@mdi/react";
import { mdiCogOutline, mdiEmailPlusOutline } from "@mdi/js";
import { Outlet, useLocation, useOutletContext } from "react-router-dom";
import { Input } from "@chakra-ui/react";
import useSWR from "swr";
import Conversation from "../../components/message/Conversation";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";

const Messages = () => {
  // SWR FETCHER FUNCTION
  const fetcher = (url: string) =>
    fetch(url, { credentials: "include" }).then((res) => res.json());
  const {
    data: conversations,
    isLoading: isLoadingConversations,
    mutate: mutateConversations
  } = useSWR(
    `${import.meta.env.VITE_SERVER}/api/users/conversations`,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 60000
    }
  );
  const { pathname } = useLocation();
  const context = useOutletContext();
  const { profile }: any = context;
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 720px)" });
  console.log("isTABLET", isTabletOrMobile);
  const currentPath = pathname.split("/")[2];

  return (
    <div className="flex">
      <div
        className={`border-r min-h-screen w-full ${
          currentPath == undefined ? "" : "hidden xl:block"
        }`}
      >
        <div className="flex w-full md:w-[430px] py-5 px-3 pr-5 gap-5 ">
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
            className="w-full border p-3 rounded-lg bg-white"
          />
        </div>
        <div className="w-full md:w-[430px]">
          {isLoadingConversations && <div>Loading conversations...</div>}
          {conversations ? (
            <>
              {conversations.data.conversations.map((conversation: any) => {
                return (
                  <Conversation
                    key={conversation.id}
                    data={conversation}
                    userId={conversations?.userId}
                  />
                );
              })}
            </>
          ) : null}
        </div>
      </div>
      <div
        className={`w-full min-h-screen ${
          currentPath == undefined ? "hidden xl:block" : ""
        }`}
      >
        <Outlet
          context={{
            profile: profile,
            pathname: pathname,
            userId: conversations?.userId,
            mutateConversations: mutateConversations
          }}
        />
      </div>
    </div>
  );
};
export default Messages;
