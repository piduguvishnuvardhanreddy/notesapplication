import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Spinner = () => (
    <svg
        className="btn-spinner"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        style={{ animation: "spin 0.75s linear infinite", verticalAlign: "middle" }}
    >
        <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
        <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
);

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password });
            localStorage.setItem("token", response.data.token);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.error || "Login Failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-logo">📝</div>
                <h2>Welcome back</h2>
                <p className="login-subtitle">Sign in to your notes</p>

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            className="form-input"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            className="form-input"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    {error && (
                        <p style={{ color: "var(--danger)", fontSize: "13px", marginBottom: "12px" }}>
                            {error}
                        </p>
                    )}

                    <button className="btn-primary btn-primary--spinner" type="submit" disabled={loading}>
                        {loading ? <><Spinner /> Signing in…</> : "Sign In"}
                    </button>
                </form>

                <p className="login-footer">
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;