import { useOutletContext } from "react-router-dom";
import SuggestedFriendCard from "../../../components/built/SuggestedFriendCard";

const FriendsSuggested = () => {
  const context = useOutletContext();
  const {
    suggestedFriends,
    isLoadingSuggestedFriends,
    mutateSuggestedFriends
  }: any = context;
  console.log(suggestedFriends);

  return (
    <>
      {isLoadingSuggestedFriends ? (
        <div>Loading...</div>
      ) : (
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
      )}
    </>
  );
};
export default FriendsSuggested;
