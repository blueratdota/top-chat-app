import {
  Button,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  Heading,
  Input,
  Text,
  useToast
} from "@chakra-ui/react";
import { useEffect } from "react";

import { useForm, SubmitHandler } from "react-hook-form";
import { useOutletContext } from "react-router-dom";

interface IFormInput {
  birthDate: string;
  birthPlace: string;
  residence: string;
  highschool: string;
  college: string;
  collegeDegree: string;
  workCompany: string;
  workPosition: string;
}

const Intro = () => {
  const { register, handleSubmit, setValue } = useForm<IFormInput>();
  const context = useOutletContext();
  const { generalInfo, isLoadingGeneralInfo, mutateGeneralInfo }: any = context;
  const toast = useToast();

  useEffect(() => {
    if (!isLoadingGeneralInfo && generalInfo) {
      setValue("birthDate", generalInfo.birthDate);
      setValue("birthPlace", generalInfo.birthPlace);
      setValue("college", generalInfo.college);
      setValue("collegeDegree", generalInfo.collegeDegree);
      setValue("highschool", generalInfo.highschool);
      setValue("residence", generalInfo.residence);
      setValue("workCompany", generalInfo.workCompany);
      setValue("workPosition", generalInfo.workPosition);
    }
  });
  // console.log(generalInfo);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      console.log(data);
      const body = data;
      const response = await fetch(
        `${import.meta.env.VITE_SERVER}/api/users/intro/${generalInfo.id}`,
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
        description: "Profile has been updated",
        status: "success",
        duration: 9000,
        isClosable: true
      });
      await mutateGeneralInfo();
    } catch (error) {
      console.log(error);
      toast({
        title: "Update Unuccessful",
        description: "Profile was not updated",
        status: "error",
        duration: 9000,
        isClosable: true
      });
    }
  };

  if (isLoadingGeneralInfo) {
    return <div>Loading...</div>;
  } else {
    return (
      <form className="flex flex-col gap-5 items-center min-h-screen max-h-screen overflow-auto py-10">
        <Card className="w-1/2">
          <CardHeader>
            <Heading className="text-3xl">Personal Info</Heading>
          </CardHeader>
          <CardBody className="space-y-3">
            <FormControl className="flex items-center gap-2">
              <Text className="text-lg font-bold w-40">Birthday</Text>
              <Input
                type="date"
                {...register("birthDate", { maxLength: 50 })}
                placeholder={generalInfo.birthDate}
              />
            </FormControl>
            <FormControl className="flex items-center gap-2">
              <Text className="text-lg font-bold w-40">Birthplace</Text>
              <Input
                type="text"
                {...register("birthPlace", { maxLength: 30 })}
              />
            </FormControl>
            <FormControl className="flex items-center gap-2">
              <Text className="text-lg font-bold w-40">Residence</Text>
              <Input
                type="text"
                {...register("residence", { maxLength: 50 })}
              />
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
              <Input
                type="text"
                {...register("highschool", { maxLength: 50 })}
              />
            </FormControl>
            <FormControl className="flex items-center gap-2">
              <Text className="text-lg font-bold w-40">College</Text>
              <Input type="text" {...register("college", { maxLength: 50 })} />
            </FormControl>
            <FormControl className="flex items-center gap-2">
              <Text className="text-lg font-bold w-40">Degree</Text>
              <Input
                type="text"
                {...register("collegeDegree", { maxLength: 50 })}
              />
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
              <Input
                type="text"
                {...register("workCompany", { maxLength: 50 })}
              />
            </FormControl>
            <FormControl className="flex items-center gap-2">
              <Text className="text-lg font-bold w-40">Position</Text>
              <Input
                type="text"
                {...register("workPosition", { maxLength: 50 })}
              />
            </FormControl>
          </CardBody>
        </Card>
        <Button
          className="text-slate-200 bg-black w-full sm:w-1/2 py-2 rounded-md"
          onClick={handleSubmit(onSubmit)}
        >
          Update Profile
        </Button>
      </form>
    );
  }
};
export default Intro;
