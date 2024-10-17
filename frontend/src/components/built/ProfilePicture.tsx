import Icon from "@mdi/react";
import { mdiAccountCircle } from "@mdi/js";
import { Image } from "@chakra-ui/react";

const ProfilePicture = ({ displayPhotoId, styling }: any) => {
  if (displayPhotoId) {
    return (
      <Image
        src={`${
          import.meta.env.VITE_SERVER
        }/api/messages/image/${displayPhotoId}`}
        alt={displayPhotoId}
        className={`object-contain ${styling}`}
      />
    );
  } else {
    return <Icon path={mdiAccountCircle} />;
  }
};
export default ProfilePicture;
