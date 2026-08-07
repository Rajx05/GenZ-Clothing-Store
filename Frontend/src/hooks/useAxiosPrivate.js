import { useEffect } from "react";
import axios from "../api/axios";
import useAuth from "./useAuth";
import useRefreshToken from "./useRefreshToken";

export default function useAxiosPrivate() {
  const { auth } = useAuth();

  const refresh = useRefreshToken();

  useEffect(() => {
    // Request interceptor
    const requestIntercept = axios.interceptors.request.use((config) => {
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${auth.accessToken}`;
      }

      return config;
    });

    // Response interceptor
    const responseIntercept = axios.interceptors.response.use(
      (response) => response,

      async (error) => {
        const prevRequest = error.config;

        if (error.response.status === 401 && !prevRequest.sent) {
          prevRequest.sent = true;

          const newAccessToken = await refresh();

          prevRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return axios(prevRequest);
        }

        return Promise.reject(error);
      },
    );

    return () => {
      axios.interceptors.request.eject(requestIntercept);

      axios.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return axios;
}
