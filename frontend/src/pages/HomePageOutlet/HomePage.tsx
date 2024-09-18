import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const context: any = useOutletContext();
  // useEffect(() => {
  //   if (!context.profile.isSuccess) {
  //     navigate("/login");
  //   }
  // });
  return <div>Home page desu</div>;
};
export default HomePage;
