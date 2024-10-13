import { useState, useEffect } from "react";
import Icon from "@mdi/react";
import { mdiAccountCircle } from "@mdi/js";

const ProfilePicture = ({ displayPhotoId }: any) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState<boolean>(false);
  useEffect(() => {
    const fetchImage = async () => {
      try {
        setIsLoadingImage(true);
        const response = await fetch(
          `${import.meta.env.VITE_SERVER}/api/messages/image/${displayPhotoId}`
        );
        const imageBlob = await response.blob();
        const imageObjectURL = URL.createObjectURL(imageBlob);
        setImageSrc(imageObjectURL);
        setIsLoadingImage(false);
      } catch (error) {
        console.error("Error fetching the image:", error);
      }
    };
    fetchImage();
  }, []);
  return (
    <>
      {imageSrc && !isLoadingImage ? (
        <img src={imageSrc} alt={displayPhotoId} className="object-contain" />
      ) : (
        <Icon path={mdiAccountCircle} />
      )}
    </>
  );
};
export default ProfilePicture;
