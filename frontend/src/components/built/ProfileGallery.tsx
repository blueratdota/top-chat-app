import { Image } from "@chakra-ui/react";

const ProfileGallery = ({ posts }: any) => {
  const postWithImage = (() => {
    return posts.filter((post: any) => {
      return post.imageContent;
    });
  })();

  if (postWithImage.length > 0) {
    return (
      <div className="grid grid-cols-2 gap-3 w-full">
        {postWithImage.slice(0, 4).map((post: any) => {
          if (post.imageContent) {
            return (
              <div className="aspect-square" key={post.id}>
                <Image
                  src={`${import.meta.env.VITE_SERVER}/api/messages/image/${
                    post.imageContent
                  }`}
                  alt={post.imageContent}
                  className="object-cover w-full h-full"
                />
              </div>
            );
          }
        })}
      </div>
    );
  } else {
    return (
      <div>
        <p className="text-sm text-gray-400">
          This user has not posted any photos yet
        </p>
      </div>
    );
  }
};
export default ProfileGallery;
