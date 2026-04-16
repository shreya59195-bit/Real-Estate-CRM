import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
34
export default function Register() {
const { register, loading } = useAuth();
const navigate = useNavigate();
const [form, setForm] = useState({
name: "",
email: "",
password: "",
role: "agent"
});
const [error, setError] = useState("");
const handleChange = (e) => {
setForm({ ...form, [e.target.name]: e.target.value });
};
const handleSubmit = async (e) => {
e.preventDefault();
setError("");
try {
await register(form);
navigate("/");
} catch (err) {
setError(err.response?.data?.message || "Registration failed");
}
};
return (
<div className="min-h-screen bg-slate-100 flex items-center justifycenter
p-4">
<div className="w-full max-w-md bg-white rounded-[28px] shadow-2xl
p-8">
<h2 className="text-3xl font-bold">Create account</h2>
<p className="text-slate-500 mt-2">Register a new CRM user</p>
{error ? <div className="mt-4 bg-rose-50 text-rose-600 px-4 py-3
rounded-xl">{error}</div> : null}
<form onSubmit={handleSubmit} className="mt-6 space-y-4">
<input name="name" value={form.name} onChange={handleChange}
placeholder="Full name" className="w-full border rounded-2xl px-4 py-3" />
<input name="email" value={form.email} onChange={handleChange}
type="email" placeholder="Email" className="w-full border rounded-2xl px-4
py-3" />
<input name="password" value={form.password}
onChange={handleChange} type="password" placeholder="Password" className="wfull
border rounded-2xl px-4 py-3" />
<select name="role" value={form.role} onChange={handleChange}
className="w-full border rounded-2xl px-4 py-3">
<option value="agent">Agent</option>
<option value="manager">Manager</option>
<option value="admin">Admin</option>
</select>
<button disabled={loading}
className="w-full bg-blue-600 text-white rounded-2xl py-3 font-semibold">
{loading ? "Creating..." : "Register"}
</button>
</form>
<p className="text-sm text-slate-500 mt-5">
Already have an account? <Link to="/login"
className="text-blue-600 font-semibold">Login</Link>
</p>
</div>
</div>
);
}