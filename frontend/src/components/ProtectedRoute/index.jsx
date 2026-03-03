import { Navigate } from "react-router-dom";
import { getCookie } from "../../utils/cookie";

const ProtectedRoute = ({ children }) => {
    const token = getCookie();
    if (!token) {
        return <Navigate to="/login" />;
    }
    return children;
}

export default ProtectedRoute;