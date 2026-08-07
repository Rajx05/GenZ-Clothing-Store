import { createContext, useState } from "react";
import axios from "../api/axios";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    accessToken: null,
  });
  // Auth state
  const [loggedIn, setLoggedIn] = useState({
    status: false,
    user: {},
  });

  //------------------------------- functions -------------------------------//

  const logout = async () => {
    try {
      await axios.post("/auth/logout");
      setLoggedIn({
        status: false,
        user: {},
      });
      setAuth("");
    } catch (error) {
      console.log("error logging out ", error);
    }
  };
  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        loggedIn,
        setLoggedIn,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
