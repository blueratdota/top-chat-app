import FriendsAll from "./FriendsAll";
import FriendsRequests from "./FriendsRequests";
import FriendsSuggested from "./FriendsSuggested";

const FriendsHome = () => {
  return (
    <div className="min-h-screen max-h-screen overflow-auto pb-10">
      <FriendsSuggested />
      <FriendsAll />
      <FriendsRequests />
    </div>
  );
};
export default FriendsHome;
