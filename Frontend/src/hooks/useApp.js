import { useContext } from "react";
import AppContext from "../context/AppContext";

export default function useApp() {
  return useContext(AppContext);
}
