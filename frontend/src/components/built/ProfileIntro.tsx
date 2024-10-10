import Icon from "@mdi/react";
import {
  mdiSchool,
  mdiHomeVariant,
  mdiMapMarker,
  mdiBriefcase,
  mdiCakeVariant
} from "@mdi/js";
import { format } from "date-fns";

interface GeneralInfoType {
  generalInfo: {
    birthDate: string;
    birthPlace: string;
    residence: string;
    highschool: string;
    college: string;
    collegeDegree: string;
    workCompany: string;
    workPosition: string;
  };
  bio: string;
}

const ProfileIntro = ({ generalInfo, bio }: GeneralInfoType) => {
  return (
    <div className="pt-3 pb-4 px-4 rounded-xl">
      <h1 className="text-xl font-bold mb-1">Intro</h1>
      {bio.length > 0 ? (
        <p className="text-center pb-2 border-b border-gray-100 border-opacity-50 ">
          {bio}
        </p>
      ) : null}
      <div className="flex flex-col gap-2 pt-4">
        {generalInfo.workCompany?.length > 0 ||
        generalInfo.workPosition?.length > 0 ? (
          <div className="flex gap-3">
            <Icon className="size-5 shrink-0" path={mdiBriefcase} />{" "}
            <p>
              Works{" "}
              {generalInfo.workCompany ? (
                <span>at {generalInfo.workCompany} </span>
              ) : null}
              {generalInfo.workPosition ? (
                <span>as {generalInfo.workPosition}</span>
              ) : null}
            </p>
          </div>
        ) : null}
        {generalInfo.college?.length > 0 ||
        generalInfo.collegeDegree?.length > 0 ? (
          <div className="flex gap-3">
            <Icon className="size-5 shrink-0" path={mdiSchool} />{" "}
            <p>
              Studied{" "}
              {generalInfo.collegeDegree ? (
                <span>{generalInfo.collegeDegree} </span>
              ) : null}
              {generalInfo.college ? (
                <span>at {generalInfo.college} </span>
              ) : null}
            </p>
          </div>
        ) : null}
        {generalInfo.highschool?.length > 0 ? (
          <div className="flex gap-3">
            <Icon className="size-5 shrink-0" path={mdiSchool} />{" "}
            <p>{`Studied at ${generalInfo.highschool}`}</p>
          </div>
        ) : null}
        {generalInfo.residence?.length > 0 ? (
          <div className="flex gap-3">
            <Icon className="size-5 shrink-0" path={mdiHomeVariant} />{" "}
            <p>{`Lives in ${generalInfo.residence}`}</p>
          </div>
        ) : null}
        {generalInfo.birthPlace?.length > 0 ? (
          <div className="flex gap-3">
            <Icon className="size-5 shrink-0" path={mdiMapMarker} />{" "}
            <p>{`From ${generalInfo.birthPlace}`}</p>
          </div>
        ) : null}
        {generalInfo.birthDate?.length > 0 ? (
          <div className="flex gap-3">
            <Icon className="size-5 shrink-0" path={mdiCakeVariant} />{" "}
            <p>{format(generalInfo.birthDate, "PPP")}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};
export default ProfileIntro;
