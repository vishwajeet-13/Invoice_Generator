import { useNavigate } from "react-router-dom";
import { MdMail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../api/axios";
import { useUser } from "../context/UserContext";

const Login = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      toast.error("Please enter username and password.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axiosInstance.post(
        "http://localhost:8000/home/user/login/",
        { username, password }
      );

      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));

      toast.success("Login successful 🎉");
      navigate("/invoices");
    } catch (error) {
      const errMsg = error.response?.data?.error || "Unknown error";
      toast.error(`Login failed: ${errMsg}`);
      console.error("Login error:", error.response || error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 h-screen w-screen">
      <h1 className="text-black font-bold mb-7 text-xl">
        Login to My_Invoice_App
      </h1>

      <div className="h-[14rem] w-[22rem] bg-white flex flex-col p-10 rounded-lg shadow-lg">
        <div className="relative mb-3">
          <MdMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Username"
            className="bg-gray-100 rounded-md pl-10 pr-3 py-1 w-full text-sm outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            aria-label="Username"
          />
        </div>

        <div className="relative mb-3">
          <RiLockPasswordFill className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="password"
            placeholder="Password"
            className="bg-gray-100 rounded-md pl-10 pr-3 py-1 w-full text-sm outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            aria-label="Password"
          />
        </div>

        <p className="font-semibold text-xs self-end mb-3 cursor-pointer hover:underline">
          Forgot Password?
        </p>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="px-2 py-1 bg-black text-white rounded disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default Login;
