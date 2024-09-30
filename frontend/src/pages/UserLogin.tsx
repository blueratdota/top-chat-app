import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import { useState } from "react";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md rounded-md bg-white py-10 px-7">
        <CardHeader className="mb-5">
          <Heading className="text-2xl font-bold text-center mb-2">
            Login
          </Heading>
          <Text className="text-center text-sm">
            Enter your credentials to access your account
          </Text>
        </CardHeader>
        <CardBody className="space-y-4 mb-5">
          <FormControl className="space-y-2">
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="you@email.com"
              required
              className="w-full border px-3 py-1 rounded-md"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </FormControl>
          <FormControl className="space-y-2">
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              required
              className="w-full border px-3 py-1 rounded-md"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </FormControl>
        </CardBody>
        <CardFooter className="flex flex-col items-center gap-3">
          <Button
            className="text-slate-200 bg-black w-1/2 py-2 rounded-md"
            onClick={async () => {
              console.log(email, password);

              await login(email, password);
              window.location.href = "/";
            }}
          >
            Login
          </Button>
          <div className="text-sm text-center space-y-2">
            <Link
              to={"/reset-password"}
              className="text-primary hover:underline"
            >
              Forgot your password?
            </Link>
            <div>
              Don't have an account?{" "}
              <Link to={"/signup"} className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
export default UserLogin;

// ADD SOME VALIDATION - COPY FROM USERSIGNUP.TSX
// SIMPLE EMPTY VALIDATION, EMAIL FORMAT
