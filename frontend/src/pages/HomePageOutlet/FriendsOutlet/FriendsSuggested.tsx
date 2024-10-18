import { useOutletContext } from "react-router-dom";
import SuggestedFriendCard from "../../../components/built/SuggestedFriendCard";

const FriendsSuggested = () => {
  const context = useOutletContext();
  const {
    suggestedFriends,
    isLoadingSuggestedFriends,
    mutateSuggestedFriends
  }: any = context;

  return (
    <>
      <div className="p-4 space-y-4">
        <h1 className="font-bold text-lg">Suggested Friends</h1>
        {isLoadingSuggestedFriends ? (
          <div>Loading...</div>
        ) : (
          <>
            {suggestedFriends?.length > 0 ? (
              <div className="grid grid-cols-6 gap-4 p-4">
                {suggestedFriends.map((person: any) => {
                  return (
                    <SuggestedFriendCard
                      person={person}
                      key={person.id}
                      mutate={mutateSuggestedFriends}
                    />
                  );
                })}
              </div>
            ) : (
              <p>There are no suggested friends for you</p>
            )}
          </>
        )}
      </div>
    </>
  );
};
export default FriendsSuggested;
