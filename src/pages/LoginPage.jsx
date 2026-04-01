import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const demoCredentials = {
  email: "admin@inventory.com",
  password: "admin123"
};

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <form className="auth-card" onSubmit={onSubmit}>
        <h1>Welcome Back</h1>
        <p className="muted">Sign in to manage products, stock, and orders.</p>

        {error ? <p className="error-text">{error}</p> : null}

        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={onChange} />

        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={onChange} />

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>

        <button
          className="btn btn-outline"
          type="button"
          onClick={() => setForm(demoCredentials)}
        >
          Demo Login (Auto-fill)
        </button>

        <p className="small">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
