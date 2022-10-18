import React, { createContext, useContext } from "react";
import { SessionStore } from "../../services/storage";

const AuthContext = createContext<null | any>(null);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <AuthContext.Provider value={SessionStore}>{children}</AuthContext.Provider>
  );
};

export const useAuthMethods = () => useContext(AuthContext);
