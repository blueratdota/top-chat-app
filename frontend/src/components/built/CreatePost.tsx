import Icon from "@mdi/react";
import { mdiAccount, mdiImage } from "@mdi/js";
import { Button } from "@chakra-ui/react";
import ProfilePicture from "./ProfilePicture.tsx";
import { useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import ReactTextareaAutosize from "react-textarea-autosize";

const CreatePost = ({ displayPhotoId, mutateUserPosts }: any) => {
  const [image, setImage] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSelectFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    };
    if (event.target.files && event.target.files.length > 0) {
      try {
        const file = event.target.files[0];
        const compressedFile = await imageCompression(file, options);
        setImage(compressedFile);
        const url = URL.createObjectURL(compressedFile);
        setImgSrc(url);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onPostClick = async () => {
    try {
      if (image || caption.length > 0) {
        const formData = new FormData();
        if (image) {
          formData.append("file", image);
        }
        if (caption) {
          formData.append("textContent", caption);
        }
        await fetch(`${import.meta.env.VITE_SERVER}/api/posts/post`, {
          method: "POST",
          mode: "cors",
          credentials: "include",
          body: formData
        });
        console.log("POST IS POSTED");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
          setImage(null);
          setImgSrc("");
        }
        setCaption("");
        await mutateUserPosts();
        // ADD SOME CLEANUP FUNCTION HERE
        // ADD SOME POSTS MUTATE CALL HERE
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="rounded-md p-3 min-w-full">
      <div className="flex items-start border-b border-gray-100 border-opacity-50">
        <div className="size-[40px]">
          <ProfilePicture displayPhotoId={displayPhotoId} />
        </div>
        <ReactTextareaAutosize
          className="ml-3 min-h-[42px] w-full p-2 border border-gray-200 rounded-md"
          value={caption}
          placeholder="Post something..."
          onChange={(e) => {
            setCaption(e.target.value);
          }}
        />
      </div>
      {imgSrc ? (
        <div className="flex my-5 max-w-[690px]">
          <img src={imgSrc} className="flex-1 object-contain" />
        </div>
      ) : null}
      <div className="flex gap-3 justify-end items-center pt-3">
        <input
          type="file"
          accept="image/*"
          onChange={onSelectFile}
          className="hidden"
          ref={fileInputRef}
        />
        <Button
          className="flex gap-2 text-sm text-white bg-green-600 rounded-xl"
          onClick={triggerFileInput}
        >
          <div className="size-4">
            <Icon path={mdiImage}></Icon>
          </div>
          <p>Photo</p>
        </Button>
        <Button
          className="flex gap-2 text-sm text-white bg-black rounded-xl"
          onClick={onPostClick}
        >
          <div className="size-4">
            <Icon path={mdiAccount}></Icon>
          </div>
          <p>Post</p>
        </Button>
      </div>
    </div>
  );
};
export default CreatePost;
