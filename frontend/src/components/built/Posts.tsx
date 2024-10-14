import Icon from "@mdi/react";
import { Button, Input } from "@chakra-ui/react";
import { mdiAccountCircle, mdiAccount } from "@mdi/js";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import ProfilePicture from "./ProfilePicture";

const Posts = ({ post }: any) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState<boolean>(false);
  useEffect(() => {
    const fetchImage = async () => {
      try {
        setIsLoadingImage(true);
        const response = await fetch(
          `${import.meta.env.VITE_SERVER}/api/messages/image/${
            post.imageContent
          }`
        );
        const imageBlob = await response.blob();
        const imageObjectURL = URL.createObjectURL(imageBlob);
        setImageSrc(imageObjectURL);
        setIsLoadingImage(false);
      } catch (error) {
        console.error("Error fetching the image:", error);
      }
    };
    if (post.imageContent) {
      fetchImage();
    }
  }, []);
  // FETCH POST AUTHOR BASIC DETAILS, NAME, PICTURE
  const { email, profile } = post.author;
  const fullName = (() => {
    if (profile.firstName) {
      return `${profile.firstName} ${
        profile.lastName ? profile.lastName : null
      }`;
    } else {
      return email;
    }
  })();

  return (
    <div className="rounded-xl p-3">
      <div className="flex items-center pb-2 ">
        <div className="size-[40px]">
          <ProfilePicture displayPhotoId={profile.displayPhoto} />
        </div>
        <div className="ml-3">
          <p className="text-lg font-bold">{fullName}</p>
          <p>{format(post.datePosted, "PPp")}</p>
        </div>
      </div>
      <div>
        <p>{post.textContent}</p>
      </div>
      <div className="max-w-[690px]">
        {imageSrc && !isLoadingImage ? (
          <img
            src={imageSrc}
            alt=""
            className="w-full object-contain rounded-xl"
          />
        ) : (
          <div className="w-full bg-gray-400"></div>
        )}
      </div>
      <div className="py-2 border-b border-gray-100 border-opacity-50">
        people who have reacted to the post
      </div>
      <div className="flex gap-3 justify-center items-center py-2 border-b border-gray-100 border-opacity-50">
        <Button className="flex gap-2 text-sm text-white bg-black rounded-xl">
          <div className="size-4">
            <Icon path={mdiAccount}></Icon>
          </div>
          <p>Like</p>
        </Button>
        <Button className="flex gap-2 text-sm text-white bg-black rounded-xl">
          <div className="size-4">
            <Icon path={mdiAccount}></Icon>
          </div>
          <p>Comment</p>
        </Button>
        <Button className="flex gap-2 text-sm text-white bg-black rounded-xl">
          <div className="size-4">
            <Icon path={mdiAccount}></Icon>
          </div>
          <p>Share</p>
        </Button>
      </div>
      <div className="flex items-center pt-3 ">
        <div>
          <Icon className="size-[40px]" path={mdiAccountCircle} />
        </div>
        <Input className="ml-3 rounded-3xl" />
      </div>
    </div>
  );
};
export default Posts;
