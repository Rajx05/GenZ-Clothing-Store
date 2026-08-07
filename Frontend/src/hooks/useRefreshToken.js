import axios from "../api/axios";
import useAuth from "./useAuth";

export default function useRefreshToken() {
  const { setAuth } = useAuth();

  async function refresh() {
    const response = await axios.get("/auth/get-new-access-token");

    setAuth((prev) => ({
      ...prev,
      accessToken: response.data.accessToken,
    }));

    return response.data.accessToken;
  }

  return refresh;
}
