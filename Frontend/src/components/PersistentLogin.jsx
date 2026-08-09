import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";
import { Skeleton } from "./Skeleton";

function PersistLogin({ children }) {
  const { auth, setAuth, setLoggedIn } = useAuth();
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        if (!auth.accessToken) {
          const response = await axios.post("/auth/get-new-access-token");

          setAuth((prev) => ({
            ...prev,
            accessToken: response.data.accessToken,
            user: response.data.user,
          }));
          setLoggedIn({
            status: true,
            user: response.data.user,
          });
          console.log("logged in!");
          // console.log("auth", auth);
        }
      } catch {
        console.log("No valid session");
        setLoggedIn({
          status: false,
          user: {},
        });
        // setLoading(false);
      } finally {
        // setLoading(false);
      }
    };

    verifyRefreshToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // if (loading) {
  //   return (
  //     <div
  //       className="min-h-screen flex flex-col items-center justify-center gap-4"
  //       role="status"
  //       aria-live="polite"
  //       aria-label="Restoring session"
  //     >
  //       <h1 className="font-display text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
  //         GenZ
  //       </h1>
  //       <p className="text-[10px] tracking-[0.35em] text-gray-500 dark:text-gray-400 uppercase">
  //         Premium and Trendy
  //       </p>
  //       <Skeleton className="h-1.5 w-24 rounded-full mt-2" />
  //       <span className="sr-only">Loading…</span>
  //     </div>
  //   );
  // }

  return children;
}

export default PersistLogin;
