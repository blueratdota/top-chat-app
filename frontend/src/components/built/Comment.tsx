import { Link } from "react-router-dom";
import ProfilePicture from "./ProfilePicture";
import { format } from "date-fns";

const Comment = ({ comment }: any) => {
  const profile = comment.author.profile;
  const fullName = (() => {
    if (profile.firstName) {
      return `${profile.firstName} ${
        profile.lastName ? profile.lastName : null
      }`;
    } else {
      return comment.author.email;
    }
  })();
  return (
    <div
      className="flex items-start p-2"
      onClick={() => {
        console.log(comment);
      }}
    >
      <div className="size-10">
        <ProfilePicture displayPhotoId={profile.displayPhoto}></ProfilePicture>
      </div>
      <div className="w-full ml-2">
        <div className="flex items-center">
          <Link to={`/${profile.userId}`}>
            <p className="text-lg font-bold">{fullName}</p>
          </Link>
          <p className="mt-0.5 ml-5 text-gray-400 text-sm">
            {format(comment.datePosted, "PP @ p")}
          </p>
        </div>
        <p>{comment.textContent}</p>
      </div>
    </div>
  );
};
export default Comment;
