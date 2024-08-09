import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const useRequireAuth = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const checkAuth = (redirectPath) => {
    if (!isAuthenticated) {
      navigate("/customer-login", { state: { from: redirectPath } });
      return false;
    }
    return true;
  };

  return checkAuth;
};

export default useRequireAuth;
