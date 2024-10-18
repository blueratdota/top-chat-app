import { useOutletContext } from "react-router-dom";
import AllFriendCard from "../../../components/built/AllFriendCard";
const FriendsAll = () => {
  const context = useOutletContext();
  const { allFriends, isLoadingAllFriends, mutateAllFriends }: any = context;
  console.log(allFriends);

  return (
    <>
      <div className="p-4 space-y-4">
        <h1 className="font-bold text-lg">All Friends</h1>
        {isLoadingAllFriends ? (
          <div>Loading...</div>
        ) : (
          <>
            {allFriends?.length > 0 ? (
              <div className="grid grid-cols-6 gap-4 p-4">
                {allFriends.map((person: any) => {
                  return (
                    <AllFriendCard
                      person={person}
                      key={person.id}
                      mutate={mutateAllFriends}
                    />
                  );
                })}
              </div>
            ) : (
              <p>You don't have any friends</p>
            )}
          </>
        )}
      </div>
    </>
  );
};
export default FriendsAll;
