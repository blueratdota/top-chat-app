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
  Text,
  useToast
} from "@chakra-ui/react";
import { useState } from "react";

const UpdateProfile = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const toast = useToast();

  const onUpdateProfile = async () => {
    try {
      if (firstName && lastName) {
        const body = { firstName: firstName, lastName: lastName, bio: bio };
        const response = await fetch(
          `${import.meta.env.VITE_SERVER}/api/users/profile`,
          {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
          }
        );
        const result = await response.json();
        if (!result.isSuccess) {
          throw new Error("Network response was not ok");
        }
        toast({
          title: "Update Successful",
          description: "Profile name has been updated",
          status: "success",
          duration: 9000,
          isClosable: true
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        throw new Error("Incomplete fields");
      }
    } catch (error) {
      toast({
        title: "Update Unuccessful",
        description: "Profile name was not updated",
        status: "error",
        duration: 9000,
        isClosable: true
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <Card className="w-full max-w-md rounded-md bg-white py-10 px-7">
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
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
              value={firstName}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Last name</FormLabel>
            <Input
              type="text"
              className="w-full border px-3 py-1 rounded-md"
              required
              onChange={(e) => {
                setLastName(e.target.value);
              }}
              value={lastName}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Input
              type="text"
              className="w-full border px-3 py-1 rounded-md"
              placeholder="(Optional)"
              onChange={(e) => {
                setBio(e.target.value);
              }}
              value={bio}
            />
          </FormControl>
        </CardBody>
        <CardFooter className="flex flex-col items-center gap-3">
          <Button
            className="text-slate-200 bg-black w-full sm:w-1/2 py-2 rounded-md"
            onClick={onUpdateProfile}
          >
            Update Profile
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
export default UpdateProfile;
