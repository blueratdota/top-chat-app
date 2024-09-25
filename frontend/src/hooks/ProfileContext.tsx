// import {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   ReactNode
// } from "react";

// interface ProfileContextType {
//   updateProfile: (data: object) => void;
// }

// const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// interface ProfileUpdateProviderProps {
//   children: ReactNode;
// }

// export const ProfileUpdateProvider = ({
//   children
// }: ProfileUpdateProviderProps) => {
//   const updateProfile = async (data: object) => {};

//   const value: ProfileContextType = {
//     updateProfile
//   };

//   return (
//     <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
//   );
// };
