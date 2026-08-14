import useAuth from "../hooks/useAuth";
import SellerDashboard from "./SellerDashboard";
import CustomerDashboard from "./CustomerDashboard";

export default function Profile() {
  const { loggedIn } = useAuth();

  if (!loggedIn.status) return null;

  const role = loggedIn.user?.role;

  if (role === "seller") return <SellerDashboard />;

  return <CustomerDashboard />;
}
