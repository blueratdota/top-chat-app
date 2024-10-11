import { useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import { Button } from "@chakra-ui/react";
const ProfilePhoto = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    };
    if (event.target.files && event.target.files.length > 0) {
      try {
        const file = event.target.files[0];
        const compressedFile = await imageCompression(file, options);
        const imageUrl = URL.createObjectURL(compressedFile);
        setImageUrl(imageUrl);
        console.log(compressedFile);

        // setImage(compressedFile);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const btnClick = () => {
    console.log(imageUrl);
  };
  return (
    <div>
      <form method="post" encType="multipart/form-data">
        <input
          accept="image/*"
          required
          ref={inputRef}
          type="file"
          placeholder="filename.txt"
          className=" text-black border text-sm file:text-sm file:text-extWhite file:bg-extGreen file:border-0 file:p-2 file:mr-3 w-full"
          onChange={handleFileChange}
        />
      </form>

      <Button onClick={btnClick}>IMAGE</Button>
      {imageUrl ? <img src={imageUrl} alt="" /> : null}
    </div>
  );
};
export default ProfilePhoto;
