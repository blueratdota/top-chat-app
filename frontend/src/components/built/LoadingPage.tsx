import { Spinner } from "@chakra-ui/react";
const LoadingPage = ({ children }: any) => {
  return (
    <div className="bg-extGray flex flex-col justify-center items-center content-center h-screen mx-auto">
      <Spinner className="size-20 mx-auto text-white" thickness="20px" />
      <div className="text-extWhite">{children}</div>
    </div>
  );
};
export default LoadingPage;
