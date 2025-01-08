import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const rolePaths = {
  admin: "/admin-dashboard",
  seller: "/seller-dashboard",
  user: "/user-dashboard",
};

export default function ProtectedRoute({
  roleRequired,
}: {
  roleRequired?: string;
}) {
  const { userInfo, currentUserId } = useSelector(
    (state: RootState) => state.user
  );

  if (!userInfo || userInfo.length === 0) {
    return <Navigate to="/signin" />;
  }

  const currentUser = userInfo.find((user) => user._id === currentUserId);

  if (!currentUser) {
    return <Navigate to="/signin" />;
  }

  const { role } = currentUser;

  if (roleRequired && role !== roleRequired) {
    return <Navigate to={rolePaths[role as keyof typeof rolePaths]} />;
  }

  return <Outlet />;
}
