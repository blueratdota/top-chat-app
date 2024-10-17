import { Link } from "react-router-dom";
import ProfilePicture from "./ProfilePicture";

const ProfileFriends = ({
  receivedFriendRequests,
  sentFriendRequests
}: any) => {
  const friends = receivedFriendRequests.concat(sentFriendRequests);
  //   console.log(friends);

  return (
    <>
      <div className="mb-2">{`${friends.length} friend${
        friends.length > 1 ? "s" : ""
      }`}</div>
      <div className="grid grid-cols-3 gap-3">
        {friends.slice(0, 9).map((friend: any) => {
          const friendDetails = friend.acceptingUser || friend.requestingUser;
          const fullName = (() => {
            if (friendDetails.profile.firstName) {
              return `${friendDetails.profile.firstName} ${
                friendDetails.profile.lastName
                  ? friendDetails.profile.lastName
                  : null
              }`;
            } else {
              return friendDetails.email;
            }
          })();

          return (
            <div key={friend.id}>
              <Link to={`/${friendDetails.profile.userId}`}>
                <ProfilePicture
                  displayPhotoId={friendDetails.profile.displayPhoto}
                />
                <p className="text-bold text-sm font-bold mt-1 ">{fullName}</p>
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
};
export default ProfileFriends;
