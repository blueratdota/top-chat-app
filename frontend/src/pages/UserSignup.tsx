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
  Button,
  FormErrorMessage,
  FormHelperText
} from "@chakra-ui/react";
import { useState } from "react";
import { Link } from "react-router-dom";

const UserSignup = () => {
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [isValidPassword, setIsValidPassword] = useState(false);

  const onEmailChange = (e: any) => {
    setEmail(e.target.value);
  };
  const onPasswordChange = (e: any) => {
    if (e.target.value.length >= 8) {
      setIsValidPassword(true);
    } else {
      setIsValidPassword(false);
    }
    setPassword(e.target.value);
  };
  const signupClick = () => {
    console.log(`email: ${email} -- password:${password}`);
    // DO THE VALIDATION HERE
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md border rounded-md bg-white py-10 px-7">
        <CardHeader className="mb-10">
          <Heading className="text-2xl font-bold text-center mb-2">
            Sign Up
          </Heading>
          <Text className="text-center text-sm">
            Enter your credentials to create account
          </Text>
        </CardHeader>
        <CardBody className="space-y-4 mb-10">
          <FormControl className="space-y-2">
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="you@email.com"
              required
              className="w-full border px-3 py-1 rounded-md"
              value={email}
              onChange={onEmailChange}
            />
          </FormControl>
          <FormControl
            className="space-y-2"
            isInvalid={!isValidPassword && password.length !== 0}
          >
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              required
              className="w-full border px-3 py-1 rounded-md"
              value={password}
              onChange={onPasswordChange}
            />
            {!isValidPassword && password.length !== 0 ? (
              <FormErrorMessage className="text-[12px] -mt-2 text-red-500">
                Invalid Password
              </FormErrorMessage>
            ) : (
              <FormHelperText
                className={`text-[12px] -mt-2 text-gray-400 ${
                  isValidPassword ? "text-green-500" : ""
                }`}
              >
                {password.length == 0
                  ? "Password must be at least 8 characters long"
                  : "Valid password"}
              </FormHelperText>
            )}
          </FormControl>
        </CardBody>
        <CardFooter className="flex flex-col items-center gap-3">
          <Button
            className="text-slate-200 bg-black w-1/2 py-2 rounded-md"
            onClick={signupClick}
          >
            Sign Up
          </Button>
          <div className="text-sm text-center text-gray-500">
            Already have an account?{" "}
            <Link
              to={"/login"}
              className="text-primary underline-offset-4 hover:underline"
            >
              Log in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
export default UserSignup;

// AFTER SIGNUP, LOAD A PAGE THAT SUGGESTS REDIRECT TO LOGIN PAGE
// IF EMAIL HAS BEEN USED BY A DIFFERENT USER, REDIRECT TO ERROR PAGE
