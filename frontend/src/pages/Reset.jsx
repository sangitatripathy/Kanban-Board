import React, { useState } from "react";
import { Lock, ArrowLeft } from "lucide-react";
import Input from "../components/Input";
import { useNavigate, Link } from "react-router-dom";
import { postRequest } from "../lib/axios";
import { useUser } from "../context/userContext";
import { useSearchParams } from "react-router-dom";

const Reset = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { login } = useUser();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success,setSuccess] = useState("")

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const navigate = useNavigate();

  const rules = {
    length: formData.password.length >= 6,
    uppercase: /[A-Z]/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password),
  };

  const isValidPassword = rules.length && rules.uppercase && rules.special;

  const handleReset = async (e) => {
    e.preventDefault();
    if (!isValidPassword) return setError("Enter a strong Password");
    if (formData.password !== formData.confirmPassword)
      return setError("Passwords do not match");
    try {
      await postRequest(`/auth/resetpassword?token=${token}`, {
        newPassword: formData.password,
      });

      setSuccess("Password reset successfull")

      navigate("/login");
    } catch (error) {
      console.error(error);
      setError("Invalid or expired link");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div
        onClick={() => navigate("/login")}
        className=" sm:w-115 flex justify-start mb-7 gap-2 cursor-pointer"
      >
        <ArrowLeft className="text-gray-500" />
        <p className="font-medium text-gray-700 text-sm">Back to Login</p>
      </div>
      <form action="" className="px-8 py-4 shadow-md rounded-lg bg-white">
        <h1 className="text-xl font-medium mb-2">Reset Password</h1>
        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Enter your password"
          onChange={handleChange}
          value={formData.password}
          icon={Lock}
        />
        {formData.password && (
          <div className="text-xs space-y-1 mb-3">
            <p className={rules.length ? "text-green-500" : "text-gray-400"}>
              ✔ At least 6 characters
            </p>
            <p className={rules.uppercase ? "text-green-500" : "text-gray-400"}>
              ✔ One uppercase letter
            </p>
            <p className={rules.special ? "text-green-500" : "text-gray-400"}>
              ✔ One special character
            </p>
          </div>
        )}
        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          onChange={handleChange}
          value={formData.confirmPassword}
          icon={Lock}
        />
        <button
          type="submit"
          onClick={handleReset}
          disabled={!isValidPassword}
          className={`flex justify-center sm:w-100 text-sm text-white px-4 py-2 rounded-md ${
            isValidPassword ?
              "bg-blue-500 hover:bg-blue-600"
            : "bg-blue-300 cursor-not-allowed"
          }`}
        >
          Reset
        </button>
      </form>
    </div>
  );
};

export default Reset;
