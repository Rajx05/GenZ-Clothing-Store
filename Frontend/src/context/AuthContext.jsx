import { createContext, useState, useEffect } from "react";
import axios from "../api/axios";
import { setAuthState } from "../api/axiosPrivate";

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

  // Bridge auth state to the axiosPrivate singleton so its interceptors
  // always read the CURRENT token at request time (fixes stale closure in
  // Razorpay callbacks / async handlers that would otherwise send an expired
  // or missing token and get a 401).
  useEffect(() => {
    setAuthState(auth?.accessToken, setAuth);
  }, [auth?.accessToken, setAuth]);

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
