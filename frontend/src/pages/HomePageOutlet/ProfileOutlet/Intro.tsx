import {
  Button,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  Heading,
  Input,
  Text
} from "@chakra-ui/react";

const Intro = () => {
  return (
    <div className="flex flex-col gap-5 items-center justify-center min-h-screen">
      <Card className="w-1/2">
        <CardHeader>
          <Heading className="text-3xl">Personal Info</Heading>
        </CardHeader>
        <CardBody className="space-y-3">
          <FormControl className="flex items-center gap-2">
            <Text className="text-lg font-bold w-40">Birthday</Text>
            <Input type="date" />
          </FormControl>
          <FormControl className="flex items-center gap-2">
            <Text className="text-lg font-bold w-40">Birthplace</Text>
            <Input type="text" />
          </FormControl>
          <FormControl className="flex items-center gap-2">
            <Text className="text-lg font-bold w-40">Residence</Text>
            <Input type="text" />
          </FormControl>
        </CardBody>
      </Card>
      <Card className="w-1/2">
        <CardHeader>
          <Heading className="text-3xl">Education</Heading>
        </CardHeader>
        <CardBody className="space-y-3">
          <FormControl className="flex items-center gap-2">
            <Text className="text-lg font-bold w-40">Highschool</Text>
            <Input type="text" />
          </FormControl>
          <FormControl className="flex items-center gap-2">
            <Text className="text-lg font-bold w-40">College</Text>
            <Input type="text" />
          </FormControl>
          <FormControl className="flex items-center gap-2">
            <Text className="text-lg font-bold w-40">Degree</Text>
            <Input type="text" />
          </FormControl>
        </CardBody>
      </Card>
      <Card className="w-1/2">
        <CardHeader>
          <Heading className="text-3xl">Work</Heading>
        </CardHeader>
        <CardBody className="space-y-3">
          <FormControl className="flex items-center gap-2">
            <Text className="text-lg font-bold w-40">Company</Text>
            <Input type="text" />
          </FormControl>
          <FormControl className="flex items-center gap-2">
            <Text className="text-lg font-bold w-40">Position</Text>
            <Input type="text" />
          </FormControl>
        </CardBody>
      </Card>
      <Button className="text-slate-200 bg-black w-full sm:w-1/2 py-2 rounded-md">
        Update Profile
      </Button>
    </div>
  );
};
export default Intro;
