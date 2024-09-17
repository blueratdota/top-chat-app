import Icon from "@mdi/react";
import { mdiCogOutline, mdiEmailPlusOutline } from "@mdi/js";
import { Outlet } from "react-router-dom";
import { Input } from "@chakra-ui/react";

const Messages = () => {
  return (
    <div className="flex">
      <div className="border-r">
        <div className="flex w-[380px] p-2 pr-5 gap-5 border-b">
          <h1 className="text-lg flex-1">Messages</h1>
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
          <div>message </div>
          <div>message </div>
          <div>message </div>
          <div>message </div>
          <div>message </div>
          <div>message </div>
          <div>message </div>
          <div>message </div>
          <div>message </div>
          <div>message </div>
        </div>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};
export default Messages;
