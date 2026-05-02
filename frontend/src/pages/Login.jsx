import React, { useState } from "react";
import Input from "../components/Input";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { postRequest } from "../lib/axios";
import { useUser } from "../context/userContext";
import { toast } from "react-toastify";

const Login = () => {
  const { login } = useUser();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await postRequest("/auth/login", formData);
      if (res) {
        toast.success("Logged in successfully");
      }
      login(res);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
  }

  async function handleForget(formData) {
    if (!formData.email) return setError("Enter Your email");
    try {
      const res = await postRequest("/auth/forgetpassword", {
        email: formData.email,
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md mb-5">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-70 group"
        >
          <ArrowLeft className="text-gray-500 group-hover:-translate-x-1 transition-transform" />
          <p className="font-medium text-gray-700 text-xs md:text-sm">
            Back to home
          </p>
        </div>
      </div>

      {/* Form */}
      <form className="w-full max-w-md px-6 py-5 shadow-md rounded-lg bg-white">
        <h1 className="text-xl font-medium mb-2">Welcome Back</h1>
        <h3 className="text-sm text-gray-600 font-normal mb-3">
          Sign in to continue to your workspace
        </h3>

        <Input
          label="Email address"
          type="email"
          name="email"
          placeholder="you@example.com"
          onChange={handleChange}
          value={formData.email}
          icon={Mail}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          onChange={handleChange}
          value={formData.password}
          icon={Lock}
        />

        <button
          type="submit"
          onClick={handleLogin}
          disabled={loading}
          className={`w-full text-md px-4 py-2 rounded-md mt-2 flex items-center justify-center gap-2 
          ${
            loading ?
              "bg-blue-400 cursor-not-allowed text-white"
            : "bg-blue-500 hover:bg-blue-600 text-white"
          }
        `}
        >
          {loading ?
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Signing in...
            </>
          : "Sign In"}
        </button>

        <p
          onClick={() => handleForget(formData)}
          className="flex justify-end text-sm text-gray-600 underline cursor-pointer mt-2"
        >
          Forgot password
        </p>

        <p className="flex text-sm justify-center mt-5 text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="underline text-sm text-blue-500  cursor-pointer ml-1"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
