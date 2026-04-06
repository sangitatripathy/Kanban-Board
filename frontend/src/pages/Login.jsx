import React, { useState } from "react";
import Input from "../components/Input";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { postRequest } from "../lib/axios";
import { useUser } from "../context/userContext";

const Login = () => {
  const { login } = useUser();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await postRequest("/auth/login", formData);
      login(res);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div
        onClick={() => navigate("/")}
        className=" sm:w-115 flex justify-start mb-7 gap-2 cursor-pointer"
      >
        <ArrowLeft className="text-gray-500" />
        <p className="font-medium text-gray-700 text-sm">Back to home</p>
      </div>
      <form action="" className="px-8 py-4 shadow-md rounded-lg bg-white">
        <h1 className="text-xl font-medium mb-2">Welcome Back</h1>
        <h3 className="text-sm text-gray-600 font-normal">
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
          className="flex justify-center text-md sm:w-100 bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Sign In
        </button>
        <p className="flex justify-end text-sm text-gray-600 underline cursor-pointer">Forgot password</p>
        <p className="flex text-sm justify-center mt-5 text-gray-500">
          Don't have an account?{" "}
          <Link to="/signup" className="underline text-sm text-blue-500 cursor-pointer">
            Sign up
          </Link>{" "}
        </p>
      </form>
    </div>
  );
};

export default Login;
