import { Navigate, Outlet } from "react-router-dom";
import useUserProfile from "../components/hooks/fetchProfile";

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, loading } = useUserProfile();
  console.log(user);

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/" replace />;

  if (adminOnly && ![2, 3].includes(user.role))
    return <Navigate to="/not-authorized" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
