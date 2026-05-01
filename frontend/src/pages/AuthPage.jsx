import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

const defaultForm = {
  role: "user",
  mode: "login",
  name: "",
  email: "",
  password: "",
  address: "",
  otp: "",
  adminSignupKey: "",
};

const AuthPage = () => {
  const [form, setForm] = useState(defaultForm);
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  const title = useMemo(() => `${form.mode === "login" ? "Login" : "Signup"} as ${form.role}`, [form]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRequestOtp = async () => {
    if (form.mode === "login") {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const payload = {
        email: form.email,
        role: form.role,
      };

      if (form.role === "admin" && form.mode === "signup") {
        payload.adminSignupKey = form.adminSignupKey;
      }

      const { data } = await api.post("/auth/request-otp", payload);
      setOtpSent(true);
      setMessage(data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to request OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (form.mode === "signup") {
        const { data } = await api.post("/auth/signup", {
          name: form.name,
          email: form.email,
          password: form.password,
          address: form.address,
          role: form.role,
          otp: form.otp,
          adminSignupKey: form.adminSignupKey,
        });

        loginWithToken(data.token, data.user);
      } else {
        const { data } = await api.post("/auth/login", {
          email: form.email,
          password: form.password,
          role: form.role,
        });

        loginWithToken(data.token, data.user);
      }

      if (form.role === "user") navigate("/user");
      if (form.role === "bookseller") navigate("/seller");
      if (form.role === "admin") navigate("/admin");
    } catch (error) {
      setMessage(error.response?.data?.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container page-section">
      <div className="auth-wrap card">
        <div className="tabs">
          <button
            className={`tab ${form.mode === "login" ? "active" : ""}`}
            onClick={() => {
              setForm((prev) => ({ ...prev, mode: "login", otp: "" }));
              setOtpSent(false);
            }}
          >
            Login
          </button>
          <button
            className={`tab ${form.mode === "signup" ? "active" : ""}`}
            onClick={() => {
              setForm((prev) => ({ ...prev, mode: "signup", otp: "" }));
              setOtpSent(false);
            }}
          >
            Signup
          </button>
        </div>

        <h2>{title}</h2>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Role
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="user">User</option>
              <option value="bookseller">Bookseller</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          {form.mode === "signup" && (
            <label>
              Name
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
          )}

          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          {form.mode === "signup" && (
            <label>
              Address
              <input name="address" value={form.address} onChange={handleChange} required />
            </label>
          )}

          {form.role === "admin" && form.mode === "signup" && (
            <label>
              Admin Signup Key
              <input
                name="adminSignupKey"
                value={form.adminSignupKey}
                onChange={handleChange}
                required
              />
            </label>
          )}

          {form.mode === "signup" && (
            <>
              <div className="actions-row">
                <button className="btn" type="button" onClick={handleRequestOtp} disabled={loading}>
                  {otpSent ? "Resend OTP" : "Send OTP"}
                </button>
              </div>

              <label>
                OTP
                <input name="otp" value={form.otp} onChange={handleChange} required />
              </label>

              <button className="btn" type="submit" disabled={loading || !otpSent}>
                {loading ? "Please wait..." : "Create account"}
              </button>
            </>
          )}

          {form.mode === "login" && (
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Please wait..." : "Login"}
            </button>
          )}
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </section>
  );
};

export default AuthPage;
