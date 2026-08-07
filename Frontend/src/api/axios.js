import axios from "axios";

export default axios.create({
  // In production set VITE_API_BASE_URL to the deployed backend, e.g.
  // https://<your-backend>.onrender.com/api
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  withCredentials: true, // sends refresh cookie
});
