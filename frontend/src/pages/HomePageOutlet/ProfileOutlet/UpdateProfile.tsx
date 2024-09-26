import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text
} from "@chakra-ui/react";
import { useState } from "react";

const UpdateProfile = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <Card className="w-full max-w-md border rounded-md bg-white py-10 px-7">
        <CardHeader className="mb-10">
          <Heading className="text-2xl font-bold text-center mb-2">
            Update your profile
          </Heading>
          <Text className="text-center text-sm">Complete the form below</Text>
        </CardHeader>
        <CardBody className="space-y-4 mb-10">
          <FormControl>
            <FormLabel>First name</FormLabel>
            <Input
              type="text"
              className="w-full border px-3 py-1 rounded-md"
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel>Last name</FormLabel>
            <Input
              type="text"
              className="w-full border px-3 py-1 rounded-md"
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Input
              type="text"
              className="w-full border px-3 py-1 rounded-md"
              placeholder="(Optional)"
            />
          </FormControl>
        </CardBody>
        <CardFooter className="flex flex-col items-center gap-3">
          <Button className="text-slate-200 bg-black w-full sm:w-1/2 py-2 rounded-md">
            Update Profile
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
export default UpdateProfile;
