import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Admin"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      await signup(form);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <form className="auth-card" onSubmit={onSubmit}>
        <h1>Create Account</h1>
        <p className="muted">Create your admin or manager profile.</p>

        {error ? <p className="error-text">{error}</p> : null}

        <label>Name</label>
        <input name="name" value={form.name} onChange={onChange} />

        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={onChange} />

        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={onChange} />

        <label>Role</label>
        <select name="role" value={form.role} onChange={onChange}>
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
        </select>

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Signup"}
        </button>

        <p className="small">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
