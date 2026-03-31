import React, { useState } from "react";
import { UserRound, Mail, Lock, ArrowLeft, Upload, Trash } from "lucide-react";
import Input from "../components/Input";
import { useNavigate, Link } from "react-router-dom";
import { postRequest } from "../lib/axios";
import { useUser } from "../context/userContext";

const Signup = () => {
  const { login } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: null,
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const navigate = useNavigate();

  const createAccount = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      if (image) {
        data.append("image", image);
      }
      const res = await postRequest("/auth/register", data);
      login(res);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

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
        <h1 className="text-xl font-medium mb-2">Create your account</h1>
        <h3 className="text-sm text-gray-600 font-normal mb-3">
          Start organizing your work in minutes
        </h3>

        <div className="flex justify-center">
          <div className="relative w-24 h-24">
            {preview ?
              <img
                src={preview}
                className="h-24 w-24 rounded-full object-cover border"
              />
            : <div className="w-24 h-24 rounded-full bg-gray-200 flex justify-center items-center">
                <UserRound size={40} className="text-gray-500" />
              </div>
            }
            <label
              className={`absolute h-7 w-7 bottom-0 right-0 px-1 py-1 rounded-full ${preview ? "bg-red-500" : "bg-blue-500"}`}
            >
              {preview ?
                <Trash
                  size={20}
                  className="text-gray-200"
                  onClick={() => {
                    setImage(null);
                    setPreview(null);
                    setFormData({ ...formData, image: null });
                  }}
                />
              : <>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      console.log(e);
                      const file = e.target.files[0];
                      if (file) {
                        setImage(file);
                        setPreview(URL.createObjectURL(file));
                        setFormData({ ...formData, image: file });
                      }
                    }}
                  />
                  <Upload size={20} className="text-gray-200" />
                </>
              }
            </label>
          </div>
        </div>

        <Input
          label="Full Name"
          type="text"
          name="name"
          placeholder="John Doe"
          onChange={handleChange}
          value={formData.name}
          icon={UserRound}
        />
        <Input
          label="Email"
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
          onClick={createAccount}
          className="flex justify-center sm:w-100 bg-blue-500 text-sm text-white px-4 py-2 rounded-md"
        >
          Create Account
        </button>
        <p className="flex justify-center mt-5 text-gray-500 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="underline text-blue-500 text-sm cursor-pointer">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
