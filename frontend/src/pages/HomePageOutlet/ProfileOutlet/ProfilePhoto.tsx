import { useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop
} from "react-image-crop";
import { Button } from "@chakra-ui/react";
import { useDebounceEffect } from "../../../hooks/UseDebounceEffect";
import CanvasPreview from "../../../components/built/CanvasPreview";
import "react-image-crop/dist/ReactCrop.css";

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

const ProfilePhoto = () => {
  const [imgSrc, setImgSrc] = useState("");
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const blobUrlRef = useRef("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");

  const aspect = 1;

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result?.toString() || "")
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        CanvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
      }
    },
    100,
    [completedCrop]
  );

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const onSaveClick = async () => {
    try {
      const image = imgRef.current;
      const previewCanvas = previewCanvasRef.current;
      if (!image || !previewCanvas || !completedCrop) {
        throw new Error("Crop canvas does not exist");
      }
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      const offscreen = new OffscreenCanvas(
        completedCrop.width * scaleX,
        completedCrop.height * scaleY
      );
      const ctx = offscreen.getContext("2d");
      if (!ctx) {
        throw new Error("No 2d context");
      }

      ctx.drawImage(
        previewCanvas,
        0,
        0,
        previewCanvas.width,
        previewCanvas.height,
        0,
        0,
        offscreen.width,
        offscreen.height
      );
      // You might want { type: "image/jpeg", quality: <0 to 1> } to
      // reduce image size
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      };
      const blob = await offscreen.convertToBlob({
        type: "image/png"
      });
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
      blobUrlRef.current = URL.createObjectURL(blob);
      const file = new File([blob], fileName, {
        type: "image/png", // File MIME type
        lastModified: new Date().getTime() // Optional last modified timestamp
      });
      const compressedFile = await imageCompression(file, options);
      const formData = new FormData();
      formData.append("file", compressedFile);
      await fetch(`${import.meta.env.VITE_SERVER}/api/users/display-photo`, {
        method: "PUT",
        mode: "cors",
        credentials: "include",
        body: formData
      });
      console.log("DP WILL BE UPDATED");
      // console.log(compressedFile);
      // console.log(file);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="pt-4 px-4 min-h-screen max-h-screen overflow-auto">
      <h1 className="text-lg font-bold mb-5">Profile Picture</h1>
      <div className="flex gap-10 mb-5">
        {!!completedCrop ? (
          <div className="w-[300px]">
            <canvas
              className="w-full border"
              ref={previewCanvasRef}
              style={{
                objectFit: "contain"
              }}
            />
          </div>
        ) : (
          <div className="size-[300px] bg-gray-200"></div>
        )}

        <div className="w-[300px]">
          <input
            type="file"
            accept="image/*"
            onChange={onSelectFile}
            className="hidden"
            ref={fileInputRef}
          />
          <Button
            className="text-slate-200 bg-black w-1/2 py-2 rounded-md"
            onClick={triggerFileInput}
          >
            Upload Photo
          </Button>
          <p className="text-gray-400 text-sm mt-2">
            Upload a file from your device. Image should be square, at least
            184px x 184px.
          </p>
        </div>
      </div>
      {!!imgSrc ? (
        <div className="">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
            // minWidth={400}
            minHeight={100}
            // circularCrop
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={imgSrc}
              onLoad={onImageLoad}
              className="max-h-[500px]"
            />
          </ReactCrop>
          <div className="flex">
            <Button
              onClick={() => {
                window.location.reload();
              }}
            >
              Cancel
            </Button>
            <Button onClick={onSaveClick}>Save</Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
export default ProfilePhoto;

// display a default photo or last used photo
// add toasts
