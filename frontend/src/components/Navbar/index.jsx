import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <div className="navbar-icon">📝</div>
                <h3>My <span>Notes</span></h3>
            </div>
            <button className="btn-logout" onClick={handleLogout}>
                ⬡ Logout
            </button>
        </nav>
    );
};

export default Navbar;