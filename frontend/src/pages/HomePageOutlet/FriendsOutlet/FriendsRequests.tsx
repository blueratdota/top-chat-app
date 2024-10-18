import { useOutletContext } from "react-router-dom";
import SentReqFriendCard from "../../../components/built/SentReqFriendCard";
import RecReqFriendCard from "../../../components/built/RecReqFriendCard";
const FriendsRequests = () => {
  const context = useOutletContext();
  const {
    requestedFriends,
    isLoadingRequestedFriends,
    mutateRequestedFriends
  }: any = context;
  // console.log(requestedFriends);
  return (
    <>
      <div className="p-4 space-y-4">
        <h1 className="font-bold text-lg">Sent Friend Requests</h1>
        {isLoadingRequestedFriends ? (
          <div>Loading...</div>
        ) : (
          <>
            {requestedFriends[0]?.length > 0 ? (
              <div className="grid grid-cols-6 gap-4 p-4">
                {requestedFriends[0].map((person: any) => {
                  return (
                    <SentReqFriendCard
                      person={person}
                      key={person.id}
                      mutate={mutateRequestedFriends}
                    />
                  );
                })}
              </div>
            ) : (
              <p>There are no hangging friend requests</p>
            )}
          </>
        )}
      </div>
      <div className="p-4 space-y-4">
        <h1 className="font-bold text-lg">Received Friend Requests</h1>
        {isLoadingRequestedFriends ? (
          <div>Loading...</div>
        ) : (
          <>
            {requestedFriends[1]?.length > 0 ? (
              <div className="grid grid-cols-6 gap-4 p-4">
                {requestedFriends[1].map((person: any) => {
                  return (
                    <RecReqFriendCard
                      person={person}
                      key={person.id}
                      mutate={mutateRequestedFriends}
                    />
                  );
                })}
              </div>
            ) : (
              <p>There are no friend requests for you</p>
            )}
          </>
        )}
      </div>
    </>
  );
};
export default FriendsRequests;
